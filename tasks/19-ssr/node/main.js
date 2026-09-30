import { demo } from "./demo.js";
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
await demo(
  (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(`<h1>Hello / 你好</h1><p>${escape("Ada")}</p>`);
  },
  [["GET", "/"]],
);
