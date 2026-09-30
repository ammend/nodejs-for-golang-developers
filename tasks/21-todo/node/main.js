import { demo } from "./demo.js";
let items = [];
await demo(
  async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.method === "POST") {
      let text = "";
      for await (const chunk of req) {
        text += chunk;
        if (Buffer.byteLength(text) > 1024) {
          res.writeHead(413);
          res.end("{}");
          return;
        }
      }
      let input;
      try {
        input = JSON.parse(text);
      } catch {
        res.writeHead(400);
        res.end('{"error":"title required"}');
        return;
      }
      if (typeof input.title !== "string" || !input.title) {
        res.writeHead(400);
        res.end('{"error":"title required"}');
        return;
      }
      items.push(input.title);
      res.writeHead(201);
    } else if (req.method === "DELETE") items = [];
    else if (req.method !== "GET") {
      res.writeHead(405);
      res.end();
      return;
    }
    res.end(JSON.stringify(items));
  },
  [
    ["POST", "/todos", '{"title":"learn Node"}'],
    ["GET", "/todos"],
    ["DELETE", "/todos"],
    ["GET", "/todos"],
  ],
);
