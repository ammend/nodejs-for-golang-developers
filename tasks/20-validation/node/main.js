import { demo } from "./demo.js";
await demo(
  async (req, res) => {
    let text = "";
    for await (const chunk of req) {
      text += chunk;
      if (Buffer.byteLength(text) > 1024) {
        res.writeHead(413);
        res.end("too large");
        return;
      }
    }
    let input;
    try {
      input = JSON.parse(text);
    } catch {
      res.writeHead(400);
      res.end("invalid JSON");
      return;
    }
    if (typeof input.name !== "string" || !input.name.trim()) {
      res.writeHead(422);
      res.end("name is required");
      return;
    }
    const name = input.name.replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(`<h1>Saved / 已保存</h1><p>${name}</p>`);
  },
  [
    ["POST", "/signup", '{"name":""}'],
    ["POST", "/signup", '{"name":"Ada"}'],
  ],
);
