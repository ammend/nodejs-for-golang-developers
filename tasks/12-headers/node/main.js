import { demo } from "./demo.js";
await demo(
  (req, res) => {
    const found = req.url === "/item";
    res.writeHead(found ? 200 : 404, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    });
    res.end(JSON.stringify(found ? { id: 1 } : { error: "not found" }));
  },
  [
    ["GET", "/item"],
    ["GET", "/missing"],
  ],
);
