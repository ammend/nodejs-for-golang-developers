# Node.js for Golang Developers

[English](README.md) | **简体中文**

> Talk is cheap. Show me the code.

面向 Go 开发者的 Node.js 对照学习工具：改代码、点运行、看结果。支持双语、两级目录、双栏编辑、页面预览和自动进度。

## 启动

需要 **Node.js ≥ 22.12**、**Go ≥ 1.22**，以及 Linux/macOS（Windows 使用 WSL）。

```bash
npm ci
npm run build
npm start
```

打开 **http://127.0.0.1:3000**，用 `Ctrl+C` 停止。

远程机器可设置自己的随机长令牌后启动：

```bash
HOST=0.0.0.0 PORT=3000 ACCESS_TOKEN='your-random-token-at-least-25-characters' npm start
```

访问 `http://服务器IP:3000` 并输入令牌。限可信网络使用，或通过 SSH 加密转发：`ssh -L 3000:127.0.0.1:3000 user@server`。代码使用服务账户的系统权限执行，**不是多用户安全沙箱**。

## 学习内容

六阶段共 **25 个子项**，每项都有可编辑代码、中英文说明和一个小练习。

| 阶段 | 子项 |
| --- | --- |
| 心智模型 · 2 | 值与引用、同步异步与事件循环 |
| JS / TS · 7 | 判断与循环、函数与模块、包与依赖管理、集合变换、JSON、错误处理、TypeScript |
| Node 后端 · 7 | HTTP 服务、路由、查询参数、请求体、响应头、中间件、文件 |
| 前端 · 3 | HTML/CSS、DOM 事件、React/JSX |
| 全栈整合 · 3 | API 消费、服务端渲染、表单校验 |
| 实战 · 3 | 待办 API、配置管理、行为测试 |

点击**运行**即计为已学，报错也计入。代码、语言和进度保存在当前浏览器。前端章节可与预览交互；全栈章节展示真实 HTTP 请求的页面结果快照。每次运行都会创建新的临时环境。

## 实现与边界

- 复用 [Sandpack](https://github.com/codesandbox/sandpack) 编辑器，本地运行 Go/Node，esbuild 处理 TS 和浏览器示例；无需外部预览服务或 CDN。
- 服务端执行限时 **10 秒**，最多两个并发任务，限制输入与输出大小。浏览器预览在隔离 iframe 中执行，服务端超时不能终止浏览器死循环。
- TypeScript 只转译、不做类型检查。这些是小型学习示例，不是生产应用或完整语言百科。
- 内容位于 [`curriculum.js`](curriculum.js) 与 [`tasks/`](tasks/)；启动 skill 为 [`nodejs-for-golang-developers-start`](skills/nodejs-for-golang-developers-start/SKILL.md)。

## 测试

```bash
npm test
npx playwright install chromium
npm run test:browser
```

修改页面后先重新构建。Go 冷编译可能超时，缓存预热后可重试。初版实现审查见 [REVIEW.md](REVIEW.md)。

灵感来自 [Golang for Node.js Developers](https://github.com/miguelmota/golang-for-nodejs-developers)。[MIT 协议](LICENSE)。
