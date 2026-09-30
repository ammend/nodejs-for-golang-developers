import { lessonEnglish } from "../curriculum.js";
// Keep Chinese source text as keys; no runtime dependency or duplicated lesson data.
const en = {
  ...lessonEnglish,
  页面预览: "Page preview",
  浏览器: "Browser",
  "先运行，再与页面交互。": "Run first, then interact with the page.",
  关键概念: "Key concepts",
  "六阶段，循序渐进。": "Six stages, one step at a time.",
  "预览文件超过 1 MB": "Preview exceeds 1 MB",
  代码与学习位置保存在此浏览器: "Code and progress stay in this browser",
  当前仅在本页保留代码与进度: "Code and progress stay in this page only",
  服务正在关闭: "The server is shutting down",
  "无法保存到此浏览器，当前编辑仅保留在本页，刷新后可能丢失。":
    "Cannot save in this browser. Edits stay in this page only and may be lost on refresh.",
  "当前仅在本页保留代码与进度 · 示例仅使用标准库":
    "Code and progress stay in this page only · Standard-library examples",
  查询参数: "Query parameters",
  "请求体与 JSON": "Request bodies and JSON",
  状态码与响应头: "Status codes and headers",
  阶段进度: "Stage progress",
  "从熟悉，到会用。": "From familiar to fluent.",
  已开放子项进度: "Available items",
  "已运行 {done} / {total} 个子项": "{done} / {total} items run",
  学习阶段: "Learning stages",
  待开放: "Coming soon",
  已学: "Studied",
  未学: "Not studied",
  "点运行即计入进度。": "Run a topic to record progress.",
  "完整路线逐步开放。": "More stages are on the way.",
  学习手册: "Learning guide",
  "本地练习 · 01": "Local practice · 01",
  观察什么: "What to observe",
  远程访问令牌: "Remote access token",
  输入启动服务时设置的令牌: "Enter the token used to start the server",
  仅保存在当前页面内存中: "Kept only in this page’s memory",
  把两种写法连起来: "Connect the two approaches",
  动手改一处: "Make one change",
  "无需提交答案，运行后直接看结果。":
    "No answer to submit. Run it and see what changes.",
  "代码与学习位置保存在此浏览器 · 示例仅使用标准库":
    "Code and progress stay in this browser · Standard-library examples",
  "对照学习灵感 ↗": "Inspired by ↗",
  "net/http · 标准库": "net/http · Standard library",
  "{name} 编辑与运行": "Edit and run {name}",
  "运行 {name}": "Run {name}",
  "运行中…": "Running…",
  终端输出: "Output",
  "运行中 · 最长 10 秒": "Running · 10-second limit",
  完成: "Done",
  出错: "Error",
  等待运行: "Ready",
  "正在执行当前项目…": "Running the current project…",
  "程序已结束，没有输出。": "The program finished without output.",
  "点击运行，观察这段代码会发生什么。": "Click Run to see what this code does.",
  "服务连接失败，请刷新重试": "Cannot reach the server. Refresh to retry.",
  "请求失败，请检查连接后重试":
    "Request failed. Check your connection and retry.",
  "需要 JSON 请求": "A JSON request is required",
  "代码最多 128 KB": "Code must be at most 128 KB",
  "无效 JSON": "Invalid JSON",
  未知主题或语言: "Unknown topic or language",
  请提交该示例的完整文件集合: "Submit all files for this example",
  "执行超过 10 秒，已停止": "Stopped after exceeding the 10-second limit",
  "输出超过 128 KB，已停止": "Stopped after output exceeded 128 KB",
  不允许的主机: "Host not allowed",
  不允许跨站访问: "Cross-site requests are not allowed",
  "请使用 POST": "Use POST",
  "访问令牌无效，请重新输入": "Invalid access token. Please enter it again.",
  "已有两个示例在运行，请稍后重试":
    "Two examples are already running. Try again shortly.",
  不支持的请求: "Unsupported request",
  页面不存在: "Page not found",
  "请先执行 npm run build": "Run npm run build first",
  "服务出错，请检查终端日志": "Server error. Check the server logs.",
  心智模型: "Mental models",
  "类型、执行方式与模块": "Types, execution and modules",
  "对象、函数、异步与类型": "Objects, functions, async and types",
  "Node 后端": "Node backend",
  "HTTP、路由与服务": "HTTP, routing and services",
  前端: "Frontend",
  "浏览器、样式与 React": "The browser, styles and React",
  全栈整合: "Full-stack integration",
  "让页面与 API 连起来": "Connect pages to APIs",
  实战: "Build a project",
  完成一个小应用: "Build a small application",
  "最小 HTTP 服务": "A minimal HTTP server",
  "同一个请求，两种写法。先看熟悉的 Go，再修改右侧的 Node。":
    "One request, two approaches. Start with familiar Go, then edit Node on the right.",
  "两侧都会启动真实服务，请求 /hello，打印状态码和 JSON，最后关闭服务。":
    "Each side starts a real server, requests /hello, prints the status and JSON, then shuts down.",
  "Go 的 handler 接收 ResponseWriter 和 Request；Node 接收 request 和 response。":
    "Go handlers receive a ResponseWriter and Request; Node handlers receive request and response.",
  "Go 写入字节；Node 用 response.end 结束响应。":
    "Go writes bytes; Node finishes the response with response.end.",
  "demo 文件封装请求与关闭流程；运行整个项目，不只运行当前标签。":
    "The demo file handles requests and shutdown. Run executes the whole project, not just the active tab.",
  "把 hello 改成自己的名字，分别运行，观察响应的变化。":
    "Replace hello with your name, run each side, and observe the response.",
  路径与路由: "Paths and routing",
  "一个服务处理多个路径：问候、用户参数，以及找不到的页面。":
    "Handle multiple paths: a greeting, a user parameter, and a missing page.",
  "观察 /hello 和 /users/42 返回 200，/missing 返回 404。":
    "Observe /hello and /users/42 returning 200, and /missing returning 404.",
  "Go ServeMux 声明路径模式；这个 Node 示例显式判断方法和路径。":
    "Go ServeMux declares route patterns; this Node example explicitly checks the method and path.",
  "Go 用 PathValue 取参数；Node 从 URL 路径中提取参数。":
    "Go reads parameters with PathValue; Node extracts them from the URL path.",
  "这里只对照 GET 场景；框架路由、中间件与其他 HTTP 方法留待后续。":
    "This example compares GET requests only. Framework routing, middleware and other methods come later.",
  "把演示请求里的 /users/42 改成 /users/7，观察两边 id 是否变化。":
    "Change /users/42 to /users/7 in the demo requests and check the id on both sides.",
};
export function translator(locale) {
  return (text, values = {}) =>
    (locale === "en" ? (en[text] ?? text) : text).replace(
      /\{(\w+)\}/g,
      (match, key) => values[key] ?? match,
    );
}
