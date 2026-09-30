import { demo } from "./demo.js";
const logRequest = (next) => async (req, res) => {
  console.log("before");
  await next(req, res);
  console.log("after");
};
await demo(
  logRequest((req, res) => res.end("ok")),
  [["GET", "/"]],
);
