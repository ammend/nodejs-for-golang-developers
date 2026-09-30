import { demo } from "./demo.js";
await demo(
  async (req, res) => {
    try {
      let text = "";
      for await (const chunk of req) {
        text += chunk;
        if (Buffer.byteLength(text) > 1024) throw Error("too large");
      }
      const input = JSON.parse(text);
      res.writeHead(201);
      res.end(JSON.stringify(input));
    } catch {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "invalid JSON" }));
    }
  },
  [
    ["POST", "/users", '{"name":"Ada"}'],
    ["POST", "/users", "broken"],
  ],
);
