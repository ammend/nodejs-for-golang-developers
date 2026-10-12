import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { once } from "node:events";

const secret = "test-only-token-with-at-least-24-characters";
let server, url;
before(async () => {
  server = spawn(process.execPath, ["server.js"], {
    env: { ...process.env, HOST: "0.0.0.0", PORT: "0", ACCESS_TOKEN: secret },
    stdio: ["ignore", "pipe", "pipe"],
  });
  url = await new Promise((resolve, reject) => {
    let output = "";
    server.stdout.on("data", (chunk) => {
      output += chunk;
      const port = output.match(/:(\d+)\n/);
      if (port) resolve(`http://127.0.0.1:${port[1]}`);
    });
    server.on("error", reject);
    server.on("exit", (code) => reject(Error(`server exited: ${code}`)));
  });
});
after(async () => {
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await once(server, "exit");
  }
});
async function files(lesson, language) {
  const dir = `tasks/${lesson}/${language}`;
  return Object.fromEntries(
    await Promise.all(
      (await readdir(dir)).map(async (name) => [
        `/${name}`,
        await readFile(`${dir}/${name}`, "utf8"),
      ]),
    ),
  );
}
function run(data, headers = {}) {
  return fetch(`${url}/api/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
      ...headers,
    },
    body: JSON.stringify(data),
  });
}
test("remote access rejects missing token and cross-origin execution", async () => {
  assert.equal((await run({}, { Authorization: "" })).status, 401);
  assert.equal(
    (await run({}, { Origin: "https://untrusted.example" })).status,
    403,
  );
});
test("rejects path traversal and unknown language", async () => {
  const data = {
    lesson: "01-http-server",
    language: "node",
    files: await files("01-http-server", "node"),
  };
  data.files["/../escape.js"] = "";
  assert.equal((await run(data)).status, 400);
  assert.equal((await run({ ...data, language: "shell" })).status, 400);
});
test("both HTTP lessons execute Go and Node with matching responses", async () => {
  for (const lesson of ["01-http-server", "02-routing"]) {
    const results = [];
    for (const language of ["go", "node"]) {
      const response = await run({
        lesson,
        language,
        files: await files(lesson, language),
      });
      assert.equal(response.status, 200);
      const result = await response.json();
      assert.equal(result.code, 0, JSON.stringify(result));
      assert.match(result.stdout, /GET \/hello → 200/);
      results.push(result.stdout);
    }
    assert.equal(results[0], results[1]);
    if (lesson === "02-routing")
      assert.match(results[0], /GET \/missing → 404/);
  }
});
test("syntax errors are visible; next execution still works", async () => {
  const data = {
    lesson: "01-http-server",
    language: "node",
    files: await files("01-http-server", "node"),
  };
  data.files["/main.js"] = "invalid syntax {{{";
  const result = await (await run(data)).json();
  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /SyntaxError/);
  data.files["/main.js"] = 'console.log("recovered")';
  assert.match((await (await run(data)).json()).stdout, /recovered/);
});
test("output limit stops a flooding process", async () => {
  const data = {
    lesson: "01-http-server",
    language: "node",
    files: await files("01-http-server", "node"),
  };
  data.files["/main.js"] = 'while(true) console.log("x".repeat(65536))';
  const result = await (await run(data)).json();
  assert.match(result.reason, /128 KB/);
  assert.ok(result.stdout.length <= 128 * 1024);
});
test("timeout kills child processes too", async () => {
  const data = {
    lesson: "01-http-server",
    language: "node",
    files: await files("01-http-server", "node"),
  };
  data.files["/main.js"] =
    `import {spawn} from 'node:child_process'; const child = spawn(process.execPath, ['-e', 'setInterval(()=>{},1000)']); console.log(child.pid); while(true){}`;
  const result = await (await run(data)).json();
  assert.match(result.reason, /10 秒/);
  const pid = Number(result.stdout.trim());
  assert.ok(pid > 0);
  try {
    const stat = await readFile(`/proc/${pid}/stat`, "utf8");
    assert.match(stat, /\) Z /, "descendant must not still be running");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
});
test("UTF-8 characters split across stdout chunks remain intact", async () => {
  const data = {
    lesson: "01-http-server",
    language: "node",
    files: await files("01-http-server", "node"),
  };
  data.files["/main.js"] =
    `const b = Buffer.from('你好'); process.stdout.write(b.subarray(0, 1)); setTimeout(() => process.stdout.write(b.subarray(1)), 40);`;
  const result = await (await run(data)).json();
  assert.equal(result.stdout, "你好");
});

test("malformed and oversized requests return JSON errors instead of dropping the connection", async () => {
  for (const [body, type, status] of [
    ["{broken", "application/json", 400],
    ["{}", "text/plain", 415],
    [JSON.stringify({ code: "x".repeat(140 * 1024) }), "application/json", 413],
  ]) {
    const response = await fetch(`${url}/api/run`, {
      method: "POST",
      headers: { "Content-Type": type, Authorization: `Bearer ${secret}` },
      body,
    });
    assert.equal(response.status, status);
    assert.equal(typeof (await response.json()).error, "string");
  }
});

test("missing project files are rejected and completed workspaces are removed", async () => {
  const data = {
    lesson: "01-http-server",
    language: "node",
    files: await files("01-http-server", "node"),
  };
  delete data.files["/demo.js"];
  assert.equal((await run(data)).status, 400);
  data.files = await files("01-http-server", "node");
  data.files["/main.js"] = "console.log(process.cwd())";
  const result = await (await run(data)).json();
  assert.equal(result.code, 0);
  await assert.rejects(readdir(result.stdout.trim()), { code: "ENOENT" });
});

test("two concurrent jobs enforce capacity; disconnect cancels jobs and releases slots", async () => {
  const { mkdtemp, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const dir = await mkdtemp(`${tmpdir()}/nodejs-for-golang-developers-test-`);
  const controllers = [new AbortController(), new AbortController()];
  const pending = [];
  async function until(check) {
    for (let i = 0; i < 100; i++) {
      if (await check()) return;
      await new Promise((r) => setTimeout(r, 30));
    }
    assert.fail("Condition was not met within 3 seconds");
  }
  try {
    for (let i = 0; i < 2; i++) {
      const data = {
        lesson: "01-http-server",
        language: "node",
        files: await files("01-http-server", "node"),
      };
      data.files["/main.js"] =
        `import {writeFileSync} from 'node:fs'; writeFileSync(${JSON.stringify(`${dir}/${i}`)}, String(process.pid)); setInterval(()=>{},1000);`;
      pending.push(
        fetch(`${url}/api/run`, {
          method: "POST",
          signal: controllers[i].signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${secret}`,
          },
          body: JSON.stringify(data),
        }).catch(() => null),
      );
    }
    await until(async () => (await readdir(dir)).length === 2);
    const data = {
      lesson: "01-http-server",
      language: "node",
      files: await files("01-http-server", "node"),
    };
    assert.equal((await run(data)).status, 429);
    controllers.forEach((controller) => controller.abort());
    await Promise.all(pending);
    await until(async () => {
      for (const name of ["0", "1"]) {
        const pid = Number(await readFile(`${dir}/${name}`, "utf8"));
        try {
          process.kill(pid, 0);
          return false;
        } catch (e) {
          if (e.code !== "ESRCH") throw e;
        }
      }
      return true;
    });
    // Process exit precedes asynchronous workspace cleanup and slot release.
    let recovered;
    await until(async () => {
      const response = await run(data);
      if (response.status === 429) return false;
      assert.equal(response.status, 200);
      recovered = await response.json();
      return true;
    });
    assert.equal(recovered.code, 0);
  } finally {
    controllers.forEach((c) => c.abort());
    await Promise.all(pending);
    await rm(dir, { recursive: true, force: true });
  }
});

test("remote binding refuses startup without an access token", async () => {
  const child = spawn(process.execPath, ["server.js"], {
    env: { ...process.env, HOST: "0.0.0.0", PORT: "0", ACCESS_TOKEN: "" },
    stdio: ["ignore", "ignore", "pipe"],
  });
  let errors = "";
  child.stderr.on("data", (chunk) => {
    errors += chunk;
  });
  const [code] = await once(child, "exit");
  assert.notEqual(code, 0);
  assert.match(errors, /ACCESS_TOKEN/);
});

test("every curriculum item has a working implementation and translated content", async () => {
  const { lessons, stages, lessonEnglish } = await import("../curriculum.js");
  assert.equal(lessons.length, 26);
  assert.equal(new Set(lessons.map((item) => item.id)).size, lessons.length);
  for (const stage of stages)
    assert.ok(lessons.some((item) => item.stage === stage.id));
  for (const lesson of lessons) {
    if (!["01-http-server", "02-routing"].includes(lesson.id)) {
      for (const text of [
        lesson.title,
        lesson.description,
        lesson.observe,
        lesson.exercise,
        ...lesson.differences,
      ])
        assert.ok(lessonEnglish[text], `Missing translation: ${text}`);
    }
    for (const language of lesson.mode === "browser"
      ? ["browser"]
      : ["go", "node"]) {
      const response = await run({
        lesson: lesson.id,
        language,
        files: await files(lesson.id, language),
      });
      assert.equal(response.status, 200, `${lesson.id}/${language}`);
      const result = await response.json();
      assert.equal(
        result.code,
        0,
        `${lesson.id}/${language}: ${JSON.stringify(result)}`,
      );
      assert.ok(result.stdout.trim(), `${lesson.id}/${language} has no output`);
      if (lesson.preview || lesson.mode === "browser")
        assert.ok(
          result.preview?.includes("<"),
          `${lesson.id}/${language} has no preview`,
        );
    }
  }
});
