// Demo harness: real local HTTP requests, then automatic shutdown.
import { createServer } from "node:http";
import { once } from "node:events";
import { writeFile } from "node:fs/promises";
export async function demo(handler, requests) {
  const server = createServer((req, res) =>
    Promise.resolve(handler(req, res)).catch((error) => {
      res.writeHead(500);
      res.end(error.message);
    }),
  );
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const results = [];
  try {
    for (const [method, path, body] of requests) {
      const response = await fetch(
        `http://127.0.0.1:${server.address().port}${path}`,
        {
          method,
          ...(body
            ? { body, headers: { "Content-Type": "application/json" } }
            : {}),
        },
      );
      const text = await response.text();
      results.push(text);
      console.log(`${method} ${path} → ${response.status} ${text.trim()}`);
      if (
        response.ok &&
        response.headers.get("content-type")?.startsWith("text/html")
      )
        await writeFile("preview.html", text);
    }
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
  return results;
}
