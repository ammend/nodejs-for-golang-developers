import { writeFile, readFile } from "node:fs/promises";
await writeFile("notes.json", JSON.stringify(["learn", "build"]));
console.log(await readFile("notes.json", "utf8"));
