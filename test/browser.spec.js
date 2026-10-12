import { test, expect } from "@playwright/test";
import { lessons } from "../curriculum.js";
const one = String(Math.round(100 / lessons.length));
const two = String(Math.round(200 / lessons.length));
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (window !== window.top) return;
    if (!localStorage.getItem("nodejs-for-golang-developers:last"))
      localStorage.setItem("nodejs-for-golang-developers:last", JSON.stringify("01-http-server"));
  });
});

test("edit, run, switch files and topics, persist learning progress without external requests", async ({
  page,
}) => {
  const errors = [],
    external = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", (route) => {
    if (!route.request().url().startsWith("http://127.0.0.1:4317")) {
      external.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });
  await page.goto("/");
  const node = page.getByRole("region", { name: "Node.js 编辑与运行" });
  await expect(node.locator(".cm-content")).toContainText("function handler");
  await expect(
    page.getByRole("button", { name: "Run", exact: true }),
  ).toHaveCount(0);
  await node.getByRole("button", { name: "运行 Node.js" }).click();
  await expect(node.locator(".output")).toContainText(
    'GET /hello → 200 {"message":"hello"}',
  );
  await expect(page.getByLabel("已开放子项进度")).toHaveAttribute("value", one);
  await expect(
    page.locator(".stage.active").getByLabel("阶段进度", { exact: true }),
  ).toHaveText("1 / 7 · 14%");
  await node.getByRole("button", { name: "demo.js", exact: true }).click();
  await expect(node.locator(".cm-content")).toContainText("createServer");
  await node.getByRole("button", { name: "main.js", exact: true }).click();
  await node.locator(".cm-content").fill('console.log("changed example")');
  await node.getByRole("button", { name: "运行 Node.js" }).click();
  await expect(node.locator(".output")).toContainText("changed example");
  await page.reload();
  await expect(node.locator(".cm-content")).toContainText("changed example");
  await page.getByRole("button", { name: /路径与路由|Paths and routing/ }).click();
  await page.getByRole("button", { name: "运行 Go", exact: true }).click();
  await expect(page.locator(".go .output")).toContainText(
    "GET /missing → 404",
    { timeout: 15_000 },
  );
  await expect(page.getByLabel("已开放子项进度")).toHaveAttribute("value", two);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "路径与路由",
  );
  await expect(page.getByLabel("已开放子项进度")).toHaveAttribute("value", two);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
test("malformed local cache cannot crash the editor or progress", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("nodejs-for-golang-developers:done", "{}");
    localStorage.setItem("nodejs-for-golang-developers:last", '"01-http-server"');
    localStorage.setItem(
      "nodejs-for-golang-developers:files:01-http-server:node",
      '{"/main.js":{"code":42}}',
    );
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "最小 HTTP 服务",
  );
  await expect(page.locator(".node .cm-content")).toContainText(
    "function handler",
  );
  await expect(page.getByLabel("已开放子项进度")).toHaveAttribute("value", "0");
});
test("running broken code still records learning; mobile layout stays inside the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".node .cm-content").fill("invalid code {{{");
  await page.getByRole("button", { name: "运行 Node.js" }).click();
  await expect(page.locator(".node .output")).toContainText("SyntaxError");
  await expect(page.getByLabel("已开放子项进度")).toHaveAttribute("value", one);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("language switch translates content and persists without resetting code, output or progress", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".node .cm-content").fill('console.log("你好 / hello")');
  await page.getByRole("button", { name: "运行 Node.js" }).click();
  await expect(page.locator(".node .output")).toContainText("你好 / hello");
  await page.getByLabel("语言 / Language").selectOption("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "A minimal HTTP server",
  );
  await expect(page.locator(".planned-item")).toHaveCount(0);
  await expect(page.locator(".breadcrumb")).toContainText("Node backend");
  await expect(page.getByRole("button", { name: "Run Node.js" })).toBeVisible();
  await expect(
    page.getByText("What to observe", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".node .cm-content")).toContainText("你好 / hello");
  await expect(page.locator(".node .output")).toContainText("你好 / hello");
  await expect(page.getByLabel("Available items")).toHaveAttribute(
    "value",
    one,
  );
  await page.reload();
  await expect(page.getByLabel("语言 / Language")).toHaveValue("en");
  await expect(page.locator(".node .cm-content")).toContainText("你好 / hello");
  await page.getByRole("button", { name: /路径与路由|Paths and routing/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Paths and routing",
  );
  await page.getByLabel("语言 / Language").selectOption("zh");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "路径与路由",
  );
});

test("English service errors and remote token controls are translated, mobile layout fits", async ({
  page,
}) => {
  await page.route("**/api/config", (route) =>
    route.fulfill({ json: { needsToken: true } }),
  );
  await page.route("**/api/run", (route) =>
    route.fulfill({ status: 401, json: { error: "访问令牌无效，请重新输入" } }),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByLabel("语言 / Language").selectOption("en");
  await page
    .getByPlaceholder("Enter the token used to start the server")
    .fill("wrong-token");
  await page.getByRole("button", { name: "Run Node.js" }).click();
  await expect(page.locator(".node .output")).toContainText(
    "Invalid access token. Please enter it again.",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByLabel("语言 / Language").selectOption("zh");
  await expect(page.locator(".node .output")).toContainText(
    "访问令牌无效，请重新输入",
  );
});

test("unavailable storage is disclosed and editing still works", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage disabled", "QuotaExceededError");
    };
  });
  await page.goto("/");
  await page.locator(".node .cm-content").fill('console.log("memory-only")');
  await page.getByRole("button", { name: "运行 Node.js" }).click();
  await expect(page.locator(".node .output")).toContainText("memory-only");
  await expect(page.locator(".node .cm-content")).toContainText("memory-only");
  await expect(page.getByRole("status")).toContainText("无法保存");
  await page.getByLabel("语言 / Language").selectOption("en");
  await expect(page.getByRole("status")).toContainText("Cannot save");
});

test("pending settings cannot send an unauthenticated run or record progress", async ({
  page,
}) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await page.route("**/api/config", async (route) => {
    await gate;
    await route.fulfill({ json: { needsToken: true } });
  });
  await page.goto("/");
  try {
    await expect(
      page.getByRole("button", { name: "运行 Node.js" }),
    ).toBeDisabled();
    await expect(page.getByLabel("已开放子项进度")).toHaveAttribute(
      "value",
      "0",
    );
  } finally {
    release();
  }
  await page.getByPlaceholder("输入启动服务时设置的令牌").fill("test-token");
  await expect(
    page.getByRole("button", { name: "运行 Node.js" }),
  ).toBeEnabled();
});

test("invalid package JSON remains editable after reload", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "nodejs-for-golang-developers:files:01-http-server:node",
      JSON.stringify({ "/package.json": { code: "{broken" } }),
    ),
  );
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "运行 Node.js" }),
  ).toBeVisible();
  await page
    .locator(".node")
    .getByRole("button", { name: "package.json", exact: true })
    .click();
  await expect(page.locator(".node .cm-content")).toContainText("{broken");
});

test("frontend React preview is interactive, isolated and works without external services", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/*", (route) =>
    route.request().url().startsWith("http://127.0.0.1:4317")
      ? route.continue()
      : route.abort(),
  );
  await page.goto("/");
  await page.locator(".stage-title").filter({ hasText: "前端" }).click();
  await page.getByRole("button", { name: /React 与 JSX/ }).click();
  await page.getByRole("button", { name: "运行 浏览器", exact: true }).click();
  const frame = page.frameLocator("iframe");
  await expect(frame.locator("output")).toHaveText("0", { timeout: 15000 });
  await frame.getByRole("button", { name: "Add / 加一" }).click();
  await expect(frame.locator("output")).toHaveText("1");
  await expect(page.locator("iframe")).toHaveAttribute(
    "sandbox",
    "allow-scripts",
  );
  await page.getByLabel("语言 / Language").selectOption("en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "React and JSX",
  );
  await expect(frame.locator("output")).toHaveText("1");
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test("full-stack preview renders an actual server response and TS runs", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".stage-title").filter({ hasText: "全栈整合" }).click();
  await page.getByRole("button", { name: /服务端渲染/ }).click();
  await page.getByRole("button", { name: "运行 Node.js" }).click();
  await expect(page.locator(".node .output")).toContainText("GET / → 200");
  await expect(page.frameLocator(".node iframe").locator("p")).toHaveText(
    "Ada",
  );
  await page.locator(".stage-title").filter({ hasText: "JS / TS" }).click();
  await page.getByRole("button", { name: /TypeScript 类型与运行时/ }).click();
  await expect(page.locator(".node .cm-content")).toContainText("type User");
  await page.getByRole("button", { name: "运行 Node.js" }).click();
  await expect(page.locator(".node .output")).toContainText("hello Ada");
});

test("start over restores current code and progress without changing other lessons", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("nodejs-for-golang-developers:done", JSON.stringify(["01-http-server", "02-routing"]));
    localStorage.setItem("nodejs-for-golang-developers:files:02-routing:node", JSON.stringify({"/main.js": {code: "// keep me"}}));
  });
  await page.reload();
  const node = page.getByRole("region", {name: "Node.js 编辑与运行"});
  await node.locator(".cm-content").fill('console.log("modified")');
  await node.getByRole("button", {name: "运行 Node.js"}).click();
  await expect(node.locator(".output")).toContainText("modified");
  await page.getByRole("button", {name: "重来", exact: true}).click();
  await expect(node.locator(".cm-content")).toContainText("function handler");
  await expect(node.locator(".output")).not.toContainText("modified");
  await expect(page.getByLabel("已开放子项进度")).toHaveAttribute("value", one);
  await page.reload();
  await expect(node.locator(".cm-content")).toContainText("function handler");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("nodejs-for-golang-developers:done")))).toEqual(["02-routing"]);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("nodejs-for-golang-developers:files:02-routing:node"))["/main.js"].code)).toBe("// keep me");
  await page.getByLabel("语言 / Language").selectOption("en");
  await expect(page.getByRole("button", {name: "Start over", exact: true})).toBeVisible();
});

test('tips preserve edits, support deep links and show module-specific queue order', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('nodejs-for-golang-developers:last', JSON.stringify('05-execution')));
  await page.reload();
  const editor = page.locator('.node .cm-content');
  await editor.fill('console.log("keep edit")');
  await page.getByRole('button', {name:'async / await', exact:true}).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', {name:'TIPS',exact:true}).click();
  await dialog.getByRole('button', {name:/Microtasks, nextTick and timers/}).click();
  for(let i=0;i<6;i++) await dialog.getByRole('button',{name:'下一步',exact:true}).click();
  await expect(dialog.locator('[aria-live]')).toHaveText('A → B → promise → microtask → nextTick → timer');
  await dialog.getByLabel('模块模式').selectOption('CommonJS');
  for(let i=0;i<6;i++) await dialog.getByRole('button',{name:'下一步',exact:true}).click();
  await expect(dialog.locator('[aria-live]')).toHaveText('A → B → nextTick → promise → microtask → timer');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(editor).toContainText('keep edit');
  await expect(page.getByLabel('已开放子项进度')).toHaveAttribute('value','0');
  await page.getByLabel('语言 / Language').selectOption('en');
  await page.goto('/#tip=modules');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading',{name:'ESM / CommonJS',exact:true})).toBeVisible();
  await page.setViewportSize({width:390,height:844});
  expect(await dialog.evaluate(el => el.getBoundingClientRect().width)).toBeLessThanOrEqual(390);
  await dialog.getByRole('button',{name:'Close ×'}).click();
  await expect(editor).toContainText('keep edit');
});

test('Tips breadcrumb opens an alphabetical drawer index and returns to details', async ({page}) => {
  await page.goto('/#tip=modules');
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button',{name:'TIPS',exact:true}).click();
  await expect(dialog.getByRole('heading',{name:'全部 Tips',exact:true})).toBeVisible();
  const index = dialog.getByRole('navigation',{name:'Tips 目录'});
  await expect(index.locator('strong')).toHaveText(['Array methods: filter / map / reduce','Arrow functions and declarations','async / await','Declarations and scope','Error and try / catch / finally','ESM / CommonJS','Iteration: Go range and JS loops','JSON: parse and stringify','Microtasks, nextTick and timers','Objects: encapsulation and composition','Packages: npm and lockfiles','Promise / resolve / then','Runtime: V8, Node, libuv and Go GMP','Shallow and deep copies','TypeScript and JavaScript','TypeScript object-oriented programming','Values and object references']);
  await index.getByRole('button',{name:'Promise / resolve / then',exact:true}).click();
  await expect(dialog.getByRole('heading',{name:'Promise / resolve / then',exact:true})).toBeVisible();
  await dialog.getByRole('button',{name:'TIPS',exact:true}).click();
  await page.reload();
  await expect(dialog.getByRole('heading',{name:'全部 Tips',exact:true})).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByLabel('语言 / Language').selectOption('en');
  await page.goto('/#tip=all');
  await expect(dialog.getByRole('heading',{name:'All Tips',exact:true})).toBeVisible();
});

test('values lesson links only relevant concepts', async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('nodejs-for-golang-developers:last', JSON.stringify('03-values')));
  await page.reload();
  const bar=page.locator('.tips-bar');
  await expect(bar.getByRole('button')).toHaveText(['Tips','变量声明与作用域','值与对象引用','浅复制与深复制']);
  await bar.getByRole('button',{name:'变量声明与作用域'}).click();
  await expect(page.getByRole('dialog')).toContainText('暂时性死区');
});

test('collections and control flow expose focused tips and matching execution', async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('nodejs-for-golang-developers:last', JSON.stringify('06-collections')));
  await page.reload();
  await page.locator('.tips-bar').getByRole('button', {name:'数组方法：filter / map / reduce'}).click();
  await expect(page.getByRole('dialog')).toContainText('初始累加值');
  await page.keyboard.press('Escape');
  await page.evaluate(() => localStorage.setItem('nodejs-for-golang-developers:last', JSON.stringify('24-control-flow')));
  await page.reload();
  await expect(page.getByRole('heading',{level:1})).toHaveText('判断与循环');
  await page.getByRole('button',{name:'运行 Node.js',exact:true}).click();
  await expect(page.locator('.node .output')).toContainText('first Ada');
  await page.getByRole('button',{name:'运行 Go',exact:true}).click();
  await expect(page.locator('.go .output')).toContainText('first Ada');
  await page.locator('.tips-bar').getByRole('button',{name:'Go range 与 JS 遍历'}).click();
  await expect(page.getByRole('dialog')).toContainText('继承属性');
});

test('JSON lesson links to bilingual serialization tips', async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('nodejs-for-golang-developers:last', JSON.stringify('07-json')));
  await page.reload();
  await page.locator('.tips-bar').getByRole('button',{name:'JSON：解析与序列化'}).click();
  await expect(page.getByRole('dialog')).toContainText('JSON.parse');
  await expect(page.getByRole('dialog')).toContainText('仍需校验');
  await page.keyboard.press('Escape');
  await page.getByLabel('语言 / Language').selectOption('en');
  await page.locator('.tips-bar').getByRole('button',{name:'JSON: parse and stringify'}).click();
  await expect(page.getByRole('dialog')).toContainText('validation is still needed');
});

test('TypeScript lesson explains type checking versus runtime in both languages', async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('nodejs-for-golang-developers:last', JSON.stringify('09-typescript')));
  await page.reload();
  await page.locator('.tips-bar').getByRole('button',{name:'TypeScript 与 JavaScript'}).click();
  await expect(page.getByRole('dialog')).toContainText('不做类型检查');
  await page.keyboard.press('Escape');
  await page.getByLabel('语言 / Language').selectOption('en');
  await page.locator('.tips-bar').getByRole('button',{name:'TypeScript and JavaScript'}).click();
  await expect(page.getByRole('dialog')).toContainText('runtime validation');
});

test('package lesson runs self-reference and links installation guidance', async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('nodejs-for-golang-developers:last', JSON.stringify('25-packages')));
  await page.reload();
  await expect(page.getByRole('heading',{level:1})).toHaveText('包与依赖管理');
  await page.getByRole('button',{name:'运行 Node.js',exact:true}).click();
  await expect(page.locator('.node .output')).toContainText('external dependencies 0');
  await page.locator('.tips-bar').getByRole('button',{name:'npm、依赖与锁文件'}).click();
  await expect(page.getByRole('dialog')).toContainText('npm ci');
  await expect(page.getByRole('dialog')).toContainText('go.sum');
});

test('OOP lesson shows shared behavior and links abstraction tips', async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('nodejs-for-golang-developers:last', JSON.stringify('26-oop')));
  await page.reload();
  await expect(page.getByRole('heading',{level:1})).toHaveText('面向对象与抽象');
  for (const [name, cls] of [['Node.js','node'],['Go','go']]) {
    await page.getByRole('button',{name:`运行 ${name}`,exact:true}).click();
    await expect(page.locator(`.${cls} .output`)).toContainText('wallet balance 70');
    await expect(page.locator(`.${cls} .output`)).toContainText('gift paid 30');
    await expect(page.locator(`.${cls} .output`)).toContainText('declined');
  }
  await page.locator('.tips-bar').getByRole('button',{name:'面向对象：封装、抽象与组合'}).click();
  await expect(page.getByRole('dialog')).toContainText('interface Payment');
  await page.keyboard.press('Escape');
  await page.getByLabel('语言 / Language').selectOption('en');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Objects and abstraction');
});

test('new frontend build prompts for refresh without discarding editor state', async ({page}) => {
  const response = await page.goto('/');
  expect(response.headers()['cache-control']).toBe('no-store');
  await page.locator('.node .cm-content').fill('console.log("saved draft")');
  await page.route('**/', route => {
    if (route.request().resourceType() === 'fetch') return route.fulfill({contentType:'text/html',body:'<script type="module" src="/assets/new-version.js"></script>'});
    return route.continue();
  });
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.getByRole('button',{name:'更新页面',exact:true})).toBeVisible();
  await expect(page.locator('.node .cm-content')).toContainText('saved draft');
  await page.unroute('**/');
  await page.getByRole('button',{name:'更新页面',exact:true}).click();
  await expect(page.locator('.node .cm-content')).toContainText('saved draft');
});
