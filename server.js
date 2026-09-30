import http from "node:http";
import { readFile, readdir, mkdtemp, writeFile, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { timingSafeEqual } from "node:crypto";

const root = path.dirname(fileURLToPath(import.meta.url));
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 3000);
const token = process.env.ACCESS_TOKEN || "";
const local = ["127.0.0.1", "localhost", "::1"].includes(host);
if (!Number.isInteger(port) || port < 0 || port > 65535)
  throw Error("PORT must be 0–65535");
if (!local && token.length < 24)
  throw Error("Remote mode requires ACCESS_TOKEN (at least 24 characters)");
const active = new Set();
let closing = false;
const limit = 128 * 1024;
const fail = (status, message) => Object.assign(new Error(message), { status });
function send(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
}
function authorized(req) {
  if (!token) return true;
  const value = Buffer.from(req.headers.authorization || "");
  const expected = Buffer.from(`Bearer ${token}`);
  return value.length === expected.length && timingSafeEqual(value, expected);
}
async function body(req) {
  if (!req.headers["content-type"]?.startsWith("application/json"))
    throw fail(415, "需要 JSON 请求");
  let text = "";
  req.setEncoding("utf8");
  for await (const chunk of req) {
    text += chunk;
    if (Buffer.byteLength(text) > limit) throw fail(413, "代码最多 128 KB");
  }
  try {
    return JSON.parse(text);
  } catch {
    throw fail(400, "无效 JSON");
  }
}
async function validate(data) {
  if (
    !data ||
    !["01-http-server", "02-routing"].includes(data.lesson) ||
    !["go", "node"].includes(data.language)
  ) {
    throw fail(400, "未知主题或语言");
  }
  const allowed = await readdir(
    path.join(root, "tasks", data.lesson, data.language),
  );
  if (
    !data.files ||
    typeof data.files !== "object" ||
    Array.isArray(data.files) ||
    Object.keys(data.files).length !== allowed.length ||
    !allowed.every((name) => typeof data.files[`/${name}`] === "string") ||
    Object.keys(data.files).some(
      (name) => !allowed.includes(name.slice(1)) || !name.startsWith("/"),
    )
  ) {
    throw fail(400, "请提交该示例的完整文件集合");
  }
  return data;
}
function killGroup(child) {
  if (!child.pid) return;
  try {
    process.kill(-child.pid, "SIGKILL");
  } catch (error) {
    if (error.code !== "ESRCH") throw error;
  }
}
async function execute(data, res) {
  const dir = await mkdtemp(path.join(tmpdir(), "go2node-"));
  try {
    await Promise.all(
      Object.entries(data.files).map(([name, code]) =>
        writeFile(path.join(dir, name.slice(1)), code),
      ),
    );
    if (res.destroyed || closing) return null;
    const env = Object.fromEntries(
      ["PATH", "HOME", "TMPDIR", "GOCACHE", "GOROOT", "GOPATH", "LANG"]
        .filter((key) => process.env[key])
        .map((key) => [key, process.env[key]]),
    );
    Object.assign(env, { GOTOOLCHAIN: "local", GOWORK: "off" });
    const started = Date.now();
    return await new Promise((resolve) => {
      const child =
        data.language === "go"
          ? spawn("go", ["run", "."], { cwd: dir, env, detached: true })
          : spawn(process.execPath, ["main.js"], {
              cwd: dir,
              env,
              detached: true,
            });
      let stdout = "",
        stderr = "",
        bytes = 0,
        reason = "";
      const stop = () => killGroup(child);
      active.add(stop);
      res.on("close", stop);
      const timer = setTimeout(() => {
        reason = "执行超过 10 秒，已停止";
        stop();
      }, 10_000);
      const collect = (stream) => (chunk) => {
        bytes += Buffer.byteLength(chunk);
        if (bytes > limit) {
          reason = "输出超过 128 KB，已停止";
          stop();
          return;
        }
        if (stream === "out") stdout += chunk.toString();
        else stderr += chunk.toString();
      };
      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");
      child.stdout.on("data", collect("out"));
      child.stderr.on("data", collect("err"));
      child.on("error", (error) => {
        stderr += error.message;
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        stop();
        active.delete(stop);
        res.off("close", stop);
        resolve({
          stdout,
          stderr,
          code,
          reason,
          duration: Date.now() - started,
        });
      });
    });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
};
let running = 0;
const server = http.createServer(async (req, res) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (local && !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname))
      throw fail(403, "不允许的主机");
    if (req.headers.origin && req.headers.origin !== url.origin)
      throw fail(403, "不允许跨站访问");
    if (req.headers["sec-fetch-site"] === "cross-site")
      throw fail(403, "不允许跨站访问");
    if (req.method === "GET" && url.pathname === "/api/config")
      return send(res, 200, { needsToken: Boolean(token) });
    if (url.pathname === "/api/run") {
      if (req.method !== "POST") throw fail(405, "请使用 POST");
      if (!authorized(req)) throw fail(401, "访问令牌无效，请重新输入");
      const data = await validate(await body(req));
      if (closing) throw fail(503, "服务正在关闭");
      if (running >= 2) throw fail(429, "已有两个示例在运行，请稍后重试");
      running++;
      try {
        const result = await execute(data, res);
        if (result && !res.destroyed) send(res, 200, result);
      } finally {
        running--;
      }
      return;
    }
    if (req.method !== "GET") throw fail(405, "不支持的请求");
    const pathname = decodeURIComponent(url.pathname);
    if (pathname !== "/" && !/^\/assets\/[\w.-]+$/.test(pathname))
      throw fail(404, "页面不存在");
    const file = pathname === "/" ? "index.html" : pathname.slice(1);
    const content = await readFile(path.join(root, "dist", file));
    res.writeHead(200, {
      "Content-Type": `${mime[path.extname(file)] || "application/octet-stream"}; charset=utf-8`,
    });
    res.end(content);
  } catch (error) {
    if (!res.destroyed)
      send(res, error.status || (error.code === "ENOENT" ? 404 : 500), {
        error: error.status
          ? error.message
          : error.code === "ENOENT"
            ? "请先执行 npm run build"
            : "服务出错，请检查终端日志",
      });
    if (!error.status && error.code !== "ENOENT") console.error(error);
  }
});
server.requestTimeout = 15_000;
server.headersTimeout = 10_000;
server.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});
server.listen(port, host, () =>
  console.log(
    `go2node listening at http://${host.includes(":") ? `[${host}]` : host}:${server.address().port}`,
  ),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    closing = true;
    for (const stop of active) stop();
    server.close();
    server.closeAllConnections();
  });
