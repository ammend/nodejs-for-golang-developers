export const stages = [
  { id: "model", title: "心智模型", summary: "类型、执行方式与模块" },
  { id: "language", title: "JS / TS", summary: "对象、函数、异步与类型" },
  {
    id: "backend",
    title: "Node 后端",
    summary: "HTTP、路由与服务",
    planned: ["查询参数", "请求体与 JSON", "状态码与响应头"],
  },
  { id: "frontend", title: "前端", summary: "浏览器、样式与 React" },
  { id: "fullstack", title: "全栈整合", summary: "让页面与 API 连起来" },
  { id: "practice", title: "实战", summary: "完成一个小应用" },
];
export const lessons = [
  {
    id: "01-http-server",
    stage: "backend",
    title: "最小 HTTP 服务",
    number: "01A",
    description: "同一个请求，两种写法。先看熟悉的 Go，再修改右侧的 Node。",
    observe:
      "两侧都会启动真实服务，请求 /hello，打印状态码和 JSON，最后关闭服务。",
    differences: [
      "Go 的 handler 接收 ResponseWriter 和 Request；Node 接收 request 和 response。",
      "Go 写入字节；Node 用 response.end 结束响应。",
      "demo 文件封装请求与关闭流程；运行整个项目，不只运行当前标签。",
    ],
    exercise: "把 hello 改成自己的名字，分别运行，观察响应的变化。",
  },
  {
    id: "02-routing",
    stage: "backend",
    title: "路径与路由",
    number: "01B",
    description: "一个服务处理多个路径：问候、用户参数，以及找不到的页面。",
    observe: "观察 /hello 和 /users/42 返回 200，/missing 返回 404。",
    differences: [
      "Go ServeMux 声明路径模式；这个 Node 示例显式判断方法和路径。",
      "Go 用 PathValue 取参数；Node 从 URL 路径中提取参数。",
      "这里只对照 GET 场景；框架路由、中间件与其他 HTTP 方法留待后续。",
    ],
    exercise: "把演示请求里的 /users/42 改成 /users/7，观察两边 id 是否变化。",
  },
];
const sources = import.meta.glob("../tasks/**/*", {
  query: "?raw",
  import: "default",
  eager: true,
});
export function lessonFiles(id, language) {
  const prefix = `../tasks/${id}/${language}/`;
  return Object.fromEntries(
    Object.entries(sources)
      .filter(([path]) => path.startsWith(prefix))
      .map(([path, code]) => [`/${path.slice(prefix.length)}`, { code }]),
  );
}
