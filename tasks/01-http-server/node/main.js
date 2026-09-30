import { demonstrate } from "./demo.js";

function handler(request, response) {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ message: "hello" }));
}

await demonstrate(handler, ["/hello"]);
