import { demo } from "./demo.js";
import { writeFile } from "node:fs/promises";
const [text] = await demo(
  (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ name: "Ada" }));
  },
  [["GET", "/api/profile"]],
);
const user = JSON.parse(text);
const escaped = String(user.name).replace(
  /[&<>"']/g,
  (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
      c
    ],
);
await writeFile("preview.html", `<h1>Profile / 用户</h1><p>${escaped}</p>`);
