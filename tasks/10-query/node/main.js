import { demo } from "./demo.js";
await demo(
  (req, res) => {
    const name =
      new URL(req.url, "http://localhost").searchParams.get("name") || "world";
    res.end(JSON.stringify({ hello: name }));
  },
  [
    ["GET", "/hello"],
    ["GET", "/hello?name=Ada"],
  ],
);
