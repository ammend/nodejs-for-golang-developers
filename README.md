# go2node

给 Go 开发者的可运行 Node 对照手册：选主题、改代码、点运行、看结果。

目录采用「阶段 → 子项」。第一版在「Node 后端」下开放「最小 HTTP 服务」和「路径与路由」两个子项。左 Go、右 Node.js，每侧使用 Sandpack 现成多文件编辑器，下方展示真实执行的 stdout / stderr。任意一侧点击运行即将当前子项记为已学，报错也计入，重复运行不重复计数。

## 启动

环境：Linux / macOS，Node.js >= 22.12，Go >= 1.22。Windows 请使用 WSL（运行器用 POSIX 进程组清理子进程）。

```bash
npm ci
npm run build
npm start
```

打开 http://127.0.0.1:3000 。用 Ctrl+C 停止。第一次安装依赖需要联网；当前两个示例仅使用标准库，构建后的编辑页面不依赖 CDN 或在线沙箱。

远程机器启动（端口可改）：

```bash
export ACCESS_TOKEN="$(node -e 'console.log(require("node:crypto").randomBytes(24).toString("hex"))')"
HOST=0.0.0.0 PORT=3000 npm start
```

浏览器访问 `http://远程机器IP:3000`，在页面输入 `ACCESS_TOKEN` 的值。令牌不出现在启动日志，不写入浏览器持久存储；可在自己的终端通过 `printenv ACCESS_TOKEN` 查看。机器的防火墙/安全组需要允许该端口。`0.0.0.0` 是监听地址，不是浏览器访问地址。页面使用相对路径调用 API，适用于本机或远程访问。

远程模式必须设置至少 24 字符的令牌。HTTP 不加密令牌，仅用于可信网络；不可信网络可使用 SSH 转发到默认 localhost 服务：`ssh -L 3000:127.0.0.1:3000 user@server`。访问浏览器本地的 http://127.0.0.1:3000 即可。

**这是个人代码运行器，不是多租户沙箱。** 示例以服务进程的系统用户权限执行；只执行自己的可信代码。10 秒超时、进程组清理、输出大小限制和鉴权不构成系统隔离。

## 怎么学

页面右上角可切换「中文 / English」，默认中文并记住选择。界面、阶段目录、课程说明和服务提示均支持双语；切换不会重置代码、当前主题或进度。代码、程序输出和编译器错误保留原文。翻译集中在 `src/i18n.js`，没有额外国际化依赖。

- 文件标签切换 `main`、`demo`、项目配置；点运行执行这一侧整个项目。
- `main` 是学习代码，`demo` 启动真实 HTTP 服务、发送请求、打印结果并关闭服务。Go 使用 `httptest.NewServer` 的本地 TCP 服务，Node 使用系统分配的临时端口。
- 对照 HTTP 状态和响应内容；没有自动评分、解锁机制或 verify 脚本。
- 代码、已学主题、最后阅读位置保存在当前浏览器 localStorage。不同设备、浏览器、域名或端口之间不共享；清理站点数据会重置。输出不持久保存。浏览器无法保存时会显示提示，并在当前页面内保留编辑与进度；刷新可能丢失未保存内容。
- 六阶段：心智模型 → JS/TS → Node 后端 → 前端 → 全栈整合 → 实战。未开放阶段仅作路线提示。
- 当前百分比称为「已开放子项进度」，分母为当前两个子项。阶段进度按该阶段已开放子项的运行记录汇总。待开放的查询参数、请求体与 JSON、状态码与响应头不计入分母。100% 不代表完成六阶段或掌握技能。旧版主题 ID 保持不变，已有代码与进度自动沿用。

## 项目结构

```text
src/                 页面、目录与学习说明
tasks/              成对 Go / Node 示例（内容源）
server.js            静态页面 + /api/run
skills/go2node-start/ 启动技能
test/               执行器与浏览器回归测试
```

编辑器复用 [Sandpack](https://github.com/codesandbox/sandpack)（CodeMirror）组件；这版只使用编辑功能，执行交给 `server.js`。后端固定运行 `go run .` 或 `node main.js`，只接受当前主题的文件集合，不执行用户提交的 shell 命令，也不自动安装示例里的 npm 依赖。

编辑 package.json 出错后仍可重新打开并纠正，不会导致整页白屏。

增加示例需更新 `tasks/`、`src/catalog.js` 和后端主题白名单。尚未实现：TypeScript 运行、React/JSX 预览、Express 课、全栈常驻服务。先保持两个真实可用的示例，不为未来课程搭框架。

## 验证与故障

```bash
npm run build
npm test
npx playwright install chromium
npm run test:browser
```

测试不参与学习进度和判分。接口测试会自行启动随机端口服务，浏览器测试使用 4317，结束会关闭各自服务。

- 端口占用：设置其他 `PORT`，不要结束未知进程。
- 找不到 Go：安装 Go 并确认启动服务的 PATH 内可见。
- 初次 Go 编译超时：10 秒包含编译；冷缓存或慢机器可能需要重试。日志会明确显示超时。
- 提示先构建：运行 `npm run build`。
- 修改源码后需重新 build；修改 `server.js` 后需重启服务。
- 构建有 Sandpack 包体积和 `use client` 提示：当前纯客户端应用可运行，无需为消除提示另加框架。

## 参考

内容组织借鉴 [Golang for Node.js Developers](https://github.com/miguelmota/golang-for-nodejs-developers)。本项目按 Go → Node 的学习方向编写示例和中文说明。
