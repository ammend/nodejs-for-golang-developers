// Self-reference via package name + exports; no download needed.
// 通过包名和 exports 引用自身，不需要下载。
import { greet } from "learning-packages";
import { readFileSync } from "node:fs";
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
console.log(greet('Ada'));
console.log(`package ${pkg.name}`);
console.log(`external dependencies ${Object.keys(pkg.dependencies).length}`);
// Locally: npm start runs scripts.start. The web runner uses node main.js.
// 本地 npm start 执行 scripts.start；网页运行器直接执行 node main.js。
