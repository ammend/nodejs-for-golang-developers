export const stages = [
  {
    "id": "model",
    "title": "心智模型",
    "summary": "值的语义与运行机制"
  },
  {
    "id": "language",
    "title": "JS / TS",
    "summary": "对象、函数、异步与类型"
  },
  {
    "id": "backend",
    "title": "Node 后端",
    "summary": "HTTP、路由与服务"
  },
  {
    "id": "frontend",
    "title": "前端",
    "summary": "浏览器、样式与 React"
  },
  {
    "id": "fullstack",
    "title": "全栈整合",
    "summary": "让页面与 API 连起来"
  },
  {
    "id": "practice",
    "title": "实战",
    "summary": "完成一个小应用"
  }
];
export const lessons = [
  {
    "id": "03-values",
    "stage": "model",
    "title": "值、引用与复制",
    "number": "01.01",
    "description": "先判断修改副本会不会影响原值。",
    "observe": "观察值复制与共享引用得到不同结果。",
    "differences": [
      "Go 结构体赋值复制字段；JS 对象赋值共享引用。",
      "展开运算符只做浅复制，嵌套对象仍可能共享。"
    ],
    "exercise": "给对象加入嵌套字段，观察浅复制的边界。"
  },
  {
    "id": "05-execution",
    "stage": "model",
    "title": "同步、异步与事件循环",
    "number": "01.02",
    "description": "对照同步代码、异步任务与等待。",
    "observe": "都输出 start → work → end，但等待机制不同。",
    "differences": [
      "Go goroutine 可并发执行，用 channel 同步完成。",
      "JS await 等待 Promise；Promise 不是线程，也不是 channel。"
    ],
    "exercise": "将 end 的打印移到等待之前，再比较顺序。"
  },
  {
    "id": "24-control-flow",
    "stage": "language",
    "title": "判断与循环",
    "number": "02.01",
    "description": "对照分支、计数循环、条件循环与遍历。",
    "observe": "两侧以相同顺序输出判断结果、索引和值。",
    "differences": [
      "Go 的 if 条件必须是 bool；JS 还会把值转换为真或假，建议写清楚比较条件。",
      "Go 用 for 表达计数循环与条件循环；JS 分别支持 for、while 和 do…while。",
      "Go switch 默认不贯穿分支；JS switch 通常需要 break。两侧都有 break 和 continue。"
    ],
    "exercise": "把循环上限从 3 改为 5，再跳过值为 2 的那次循环。"
  },
  {
    "id": "04-modules",
    "stage": "language",
    "title": "函数与模块",
    "number": "02.02",
    "description": "把业务函数放进另一个文件。",
    "observe": "修改函数实现，主文件调用结果随之变化。",
    "differences": [
      "Go 同包文件共享包作用域；JS 通过 export/import 显式连接模块。",
      "Node 示例使用 ESM，package.json 中声明 type: module。",
      "函数声明可在声明前调用；const 箭头函数须在初始化后调用。箭头函数没有自己的 this，也不能用作构造函数。"
    ],
    "exercise": "给 greet 增加一个问候语参数。"
  },
  {
    "id": "25-packages",
    "stage": "language",
    "title": "包与依赖管理",
    "number": "02.03",
    "description": "从项目清单理解包名、入口、脚本与外部依赖。",
    "observe": "两侧无需安装第三方依赖。Node 按包名自引用 exports，Go 调用同包函数。",
    "differences": [
      "package.json 声明元数据、依赖和脚本；go.mod 声明模块路径与依赖。",
      "package-lock.json 锁定依赖树；go.sum 记录校验信息，不是同一种锁文件。"
    ],
    "exercise": "在本地运行 npm start，对照网页输出；修改 greet 实现再次运行。命令说明见 Tips。"
  },
  {
    "id": "06-collections",
    "stage": "language",
    "title": "数组与集合变换",
    "number": "02.04",
    "description": "筛选、映射，然后求和。",
    "observe": "偶数翻倍后为 [4,8]，总和为 12。",
    "differences": [
      "Go 常用循环构造新切片；JS 提供 filter/map/reduce。",
      "两侧都避免在迭代过程中改变原数组。"
    ],
    "exercise": "改成筛选奇数，检查结果。"
  },
  {
    "id": "07-json",
    "stage": "language",
    "title": "JSON 与边界数据",
    "number": "02.05",
    "description": "把字符串解析为数据，再进行字段校验。",
    "observe": "正确数据输出 Ada；缺少 name 时明确报错。",
    "differences": [
      "JSON 解析成功不等于数据符合业务要求。",
      "Go 结构体约束字段类型；JS 需要显式检查类型。"
    ],
    "exercise": "把 name 改成数字，比较两边报错的位置。"
  },
  {
    "id": "08-errors",
    "stage": "language",
    "title": "错误处理与恢复",
    "number": "02.06",
    "description": "让调用方决定如何处理失败。",
    "observe": "除零报错后，后续计算仍会继续。",
    "differences": [
      "Go 返回 error；JS 用 throw 抛出异常。",
      "try/catch 也可以捕获 await 等待的 Promise rejection。",
      "JS finally 在离开 try/catch 时收尾；Go defer 在所在函数返回时执行。"
    ],
    "exercise": "增加一个非法输入，看后续计算是否受影响。"
  },
  {
    "id": "09-typescript",
    "stage": "language",
    "title": "TypeScript 类型与运行时",
    "number": "02.07",
    "description": "用类型表达数据结构，仍然校验外部输入。",
    "observe": "类型在运行前移除；校验函数决定是否接受输入。",
    "differences": [
      "Go 类型参与编译；TS 类型不会自动验证 JSON。",
      "这里用 esbuild 转译执行，不提供 tsc 静态类型检查。"
    ],
    "exercise": "修改输入的 name 类型，观察运行时校验。",
    "nodeEntry": "main.ts"
  },
  {
    "id": "26-oop",
    "stage": "language",
    "title": "面向对象与抽象",
    "number": "02.08",
    "description": "封装状态，以行为抽象连接不同实现，使用组合构建结账流程。",
    "observe": "钱包与礼品卡使用同一结账流程；钱包扣款后，余额不足的支付被拒绝。",
    "differences": [
      "Go 用结构体、方法与接口；JS 用 class、方法和鸭子类型表达相同的行为抽象。",
      "Go 小写字段在包外不可访问；JS # 私有字段在类外不可访问，封装边界不同。",
      "Checkout 组合支付对象，不依赖共同父类。Go 接口隐式实现；JS 错误的对象形状会在运行时暴露。"
    ],
    "exercise": "增加一个同样提供支付方法的实现，不修改 Checkout，再比较两侧输出。"
  },
  {
    "id": "01-http-server",
    "stage": "backend",
    "title": "最小 HTTP 服务",
    "number": "03.01",
    "description": "同一个请求，两种写法。先看熟悉的 Go，再修改右侧的 Node。",
    "observe": "两侧都会启动真实服务，请求 /hello，打印状态码和 JSON，最后关闭服务。",
    "differences": [
      "Go 的 handler 接收 ResponseWriter 和 Request；Node 接收 request 和 response。",
      "Go 写入字节；Node 用 response.end 结束响应。",
      "demo 文件封装请求与关闭流程；运行整个项目，不只运行当前标签。"
    ],
    "exercise": "把 hello 改成自己的名字，分别运行，观察响应的变化。"
  },
  {
    "id": "02-routing",
    "stage": "backend",
    "title": "路径与路由",
    "number": "03.02",
    "description": "一个服务处理多个路径：问候、用户参数，以及找不到的页面。",
    "observe": "观察 /hello 和 /users/42 返回 200，/missing 返回 404。",
    "differences": [
      "Go ServeMux 声明路径模式；这个 Node 示例显式判断方法和路径。",
      "Go 用 PathValue 取参数；Node 从 URL 路径中提取参数。",
      "这里只对照 GET 场景；框架路由、中间件与其他 HTTP 方法留待后续。"
    ],
    "exercise": "把演示请求里的 /users/42 改成 /users/7，观察两边 id 是否变化。"
  },
  {
    "id": "10-query",
    "stage": "backend",
    "title": "查询参数",
    "number": "03.03",
    "description": "从 URL 读取可选参数并设置默认值。",
    "observe": "分别观察默认问候与指定名字。",
    "differences": [
      "Go 使用 r.URL.Query；Node 使用 URLSearchParams。",
      "查询参数都是字符串，数字需要转换并校验。"
    ],
    "exercise": "加入重复的 name 参数，观察两边取值。"
  },
  {
    "id": "11-body",
    "stage": "backend",
    "title": "请求体与 JSON",
    "number": "03.04",
    "description": "处理 POST 请求，拒绝格式错误的数据。",
    "observe": "有效 JSON 返回 201，损坏的 JSON 返回 400。",
    "differences": [
      "Go 用 Decoder 读取请求流；Node 用异步迭代收集请求体。",
      "业务接口需要限制请求体大小，不能无限读取。"
    ],
    "exercise": "把请求体改为缺少 name 的对象，补上字段校验。"
  },
  {
    "id": "12-headers",
    "stage": "backend",
    "title": "状态码与响应头",
    "number": "03.05",
    "description": "响应状态、类型和缓存策略要一起设计。",
    "observe": "成功响应是 JSON；未找到时返回 404。",
    "differences": [
      "响应头必须在正文发送前设置。",
      "HTTP 状态表示请求结果，不能只在正文里写一个 error。"
    ],
    "exercise": "把成功响应改为 201，并增加一个自定义响应头。"
  },
  {
    "id": "13-middleware",
    "stage": "backend",
    "title": "中间件与组合",
    "number": "03.06",
    "description": "用一个函数包装另一个 handler。",
    "observe": "日志依次输出 before、after，再输出请求结果。",
    "differences": [
      "Go Handler 返回 Handler；Node 可以用高阶函数包装 handler。",
      "中间件顺序影响行为；异步 handler 需要等待完成。"
    ],
    "exercise": "再加一层中间件，判断进入与退出顺序。"
  },
  {
    "id": "14-files",
    "stage": "backend",
    "title": "文件与持久化",
    "number": "03.07",
    "description": "把数据序列化写入文件，再读取回来。",
    "observe": "同一次运行中写入和读回的数据一致。",
    "differences": [
      "Node fs/promises 提供异步文件 API；Go os 提供直接的文件操作。",
      "练习目录每次运行后清理，这里不会保留跨次运行的数据。"
    ],
    "exercise": "增加一条记录，确认序列化后的数组变化。"
  },
  {
    "id": "15-html-css",
    "stage": "frontend",
    "title": "HTML 与 CSS",
    "number": "04.01",
    "description": "用语义结构与样式组织一个信息卡片。",
    "observe": "修改标题或 CSS，运行后右侧预览更新。",
    "differences": [
      "HTML 描述结构，CSS 描述布局和外观。",
      "这个阶段使用浏览器编辑与预览，不再强行保留 Go 对照。"
    ],
    "exercise": "修改卡片宽度与背景色。",
    "mode": "browser",
    "entry": "main.js"
  },
  {
    "id": "16-dom-events",
    "stage": "frontend",
    "title": "DOM、事件与状态",
    "number": "04.02",
    "description": "响应点击并更新页面中的计数。",
    "observe": "每点击一次按钮，页面计数加一。",
    "differences": [
      "Node 没有浏览器 DOM；document 属于浏览器环境。",
      "事件处理器修改状态，然后显式更新 DOM。"
    ],
    "exercise": "增加一个减一按钮和归零按钮。",
    "mode": "browser",
    "entry": "main.js"
  },
  {
    "id": "17-react",
    "stage": "frontend",
    "title": "React 与 JSX",
    "number": "04.03",
    "description": "用组件和状态声明界面。",
    "observe": "点击按钮，React 根据新状态重新渲染。",
    "differences": [
      "useState 保存组件状态，setter 触发重新渲染。",
      "JSX 需要构建；这里使用本地 esbuild 与项目内 React，无外部 CDN。"
    ],
    "exercise": "让按钮每次增加 2，并显示当前计数是否为偶数。",
    "mode": "browser",
    "entry": "main.jsx"
  },
  {
    "id": "18-api-contract",
    "stage": "fullstack",
    "title": "API 契约与数据消费",
    "number": "05.01",
    "description": "先请求 JSON API，再把响应转换为页面。",
    "observe": "终端显示真实 HTTP 响应，预览显示消费结果。",
    "differences": [
      "API 与页面使用同一份契约，客户端仍需解析数据。",
      "预览是本次请求的结果快照；不是持续运行的后端服务。"
    ],
    "exercise": "在 API 中增加 role 字段，并在页面显示。",
    "preview": true
  },
  {
    "id": "19-ssr",
    "stage": "fullstack",
    "title": "服务端渲染",
    "number": "05.02",
    "description": "后端把业务数据渲染为 HTML。",
    "observe": "HTTP 返回完整 HTML，预览显示结果。",
    "differences": [
      "Go html/template 自动处理插值转义。",
      "JS 字符串模板不会自动转义 HTML，必须处理不可信数据。"
    ],
    "exercise": "把名字改为 <b>Ada</b>，确认它作为文字显示。",
    "preview": true
  },
  {
    "id": "20-validation",
    "stage": "fullstack",
    "title": "表单与服务端校验",
    "number": "05.03",
    "description": "模拟提交表单，服务端决定接受或拒绝。",
    "observe": "空名字得到 422，有效名字得到成功页面。",
    "differences": [
      "前端校验改善体验，服务端校验维护数据边界。",
      "这里的提交由 demo 文件模拟；修改请求后重新运行。"
    ],
    "exercise": "加入名字长度上限，并构造一个失败请求。",
    "preview": true
  },
  {
    "id": "21-todo",
    "stage": "practice",
    "title": "实战：待办 API",
    "number": "06.01",
    "description": "串起创建、查询与删除的完整请求流程。",
    "observe": "POST 创建 → GET 查询 → DELETE 删除 → GET 空列表。",
    "differences": [
      "数据保存在单次示例服务内存中；重新运行会重置。",
      "真实项目还需要持久化、鉴权和更完整的输入校验。"
    ],
    "exercise": "增加完成状态与更新接口。"
  },
  {
    "id": "22-config",
    "stage": "practice",
    "title": "实战：配置与启动参数",
    "number": "06.02",
    "description": "集中解析配置，并在启动前拒绝非法值。",
    "observe": "有效端口输出 3000，非法端口得到错误。",
    "differences": [
      "环境变量是字符串，需要明确转换和校验。",
      "示例在自己的进程内设置变量，不影响学习工具服务。"
    ],
    "exercise": "增加一个 HOST 配置和默认值。"
  },
  {
    "id": "23-tests",
    "stage": "practice",
    "title": "实战：行为测试",
    "number": "06.03",
    "description": "把重要行为写成可以运行的断言。",
    "observe": "正常实现打印 3 checks passed；修改实现后断言失败。",
    "differences": [
      "测试应该检查可观察行为，而不是重复实现代码。",
      "这里用最小断言展示测试思想，学习进度仍只按点击运行记录。"
    ],
    "exercise": "故意把负数处理改错，观察失败信息。"
  }
];
export const lessonEnglish = {
  "JS finally 在离开 try/catch 时收尾；Go defer 在所在函数返回时执行。": "JS finally runs when leaving try/catch; Go defer runs when its containing function returns.",
  "判断与循环": "Conditions and loops",
  "对照分支、计数循环、条件循环与遍历。": "Compare branches, counted loops, condition loops and iteration.",
  "两侧以相同顺序输出判断结果、索引和值。": "Both sides print the same decisions, indexes and values in the same order.",
  "Go 的 if 条件必须是 bool；JS 还会把值转换为真或假，建议写清楚比较条件。": "Go if requires a bool; JS also coerces values to true or false. Prefer explicit comparisons.",
  "Go 用 for 表达计数循环与条件循环；JS 分别支持 for、while 和 do…while。": "Go uses for for counted and condition loops; JS provides for, while and do…while.",
  "Go switch 默认不贯穿分支；JS switch 通常需要 break。两侧都有 break 和 continue。": "Go switch does not fall through by default; JS switch usually needs break. Both have break and continue.",
  "把循环上限从 3 改为 5，再跳过值为 2 的那次循环。": "Change the loop bound from 3 to 5, then skip the iteration whose value is 2.",
  "值、引用与复制": "Values, references and copies",
  "先判断修改副本会不会影响原值。": "Predict whether changing a copy affects the original.",
  "观察值复制与共享引用得到不同结果。": "Compare a value copy with a shared reference.",
  "给对象加入嵌套字段，观察浅复制的边界。": "Add a nested field and observe the limits of shallow copying.",
  "Go 结构体赋值复制字段；JS 对象赋值共享引用。": "Go struct assignment copies fields; JS object assignment shares a reference.",
  "展开运算符只做浅复制，嵌套对象仍可能共享。": "Object spread makes a shallow copy; nested objects may still be shared.",
  "函数声明可在声明前调用；const 箭头函数须在初始化后调用。箭头函数没有自己的 this，也不能用作构造函数。": "Function declarations can be called before their declaration; const arrow functions must be initialized first. Arrow functions have no own this and cannot be constructors.",
  "函数与模块": "Functions and modules",
  "把业务函数放进另一个文件。": "Move a business function into another file.",
  "修改函数实现，主文件调用结果随之变化。": "Change the helper and see the main program use it.",
  "给 greet 增加一个问候语参数。": "Add a greeting parameter to greet.",
  "Go 同包文件共享包作用域；JS 通过 export/import 显式连接模块。": "Go files in one package share package scope; JS connects modules explicitly through export/import.",
  "Node 示例使用 ESM，package.json 中声明 type: module。": "The Node example uses ESM, declared with type: module in package.json.",
  "执行顺序与异步": "Execution order and async",
  "对照同步代码、异步任务与等待。": "Compare synchronous code, async work and waiting.",
  "都输出 start → work → end，但等待机制不同。": "Both print start → work → end, through different waiting mechanisms.",
  "将 end 的打印移到等待之前，再比较顺序。": "Move the end log before the wait and compare the order.",
  "Go goroutine 可并发执行，用 channel 同步完成。": "Go goroutines execute concurrently and can synchronize with channels.",
  "JS await 等待 Promise；Promise 不是线程，也不是 channel。": "JS await waits for a Promise; a Promise is neither a thread nor a channel.",
  "数组与集合变换": "Arrays and collection transforms",
  "筛选、映射，然后求和。": "Filter, map, then sum.",
  "偶数翻倍后为 [4,8]，总和为 12。": "Doubling even numbers produces [4,8], with a sum of 12.",
  "改成筛选奇数，检查结果。": "Filter odd numbers instead and inspect the result.",
  "Go 常用循环构造新切片；JS 提供 filter/map/reduce。": "Go commonly builds slices with loops; JS provides filter/map/reduce.",
  "两侧都避免在迭代过程中改变原数组。": "Both examples avoid mutating the source during iteration.",
  "JSON 与边界数据": "JSON and boundary data",
  "把字符串解析为数据，再进行字段校验。": "Parse a string into data, then validate its fields.",
  "正确数据输出 Ada；缺少 name 时明确报错。": "Valid input prints Ada; missing name is rejected.",
  "把 name 改成数字，比较两边报错的位置。": "Change name to a number and compare where validation fails.",
  "JSON 解析成功不等于数据符合业务要求。": "Successful JSON parsing does not guarantee valid business data.",
  "Go 结构体约束字段类型；JS 需要显式检查类型。": "Go structs constrain field types; JS needs explicit type checks.",
  "错误处理与恢复": "Errors and recovery",
  "让调用方决定如何处理失败。": "Let the caller decide how to handle failures.",
  "除零报错后，后续计算仍会继续。": "After division by zero, later calculations still run.",
  "增加一个非法输入，看后续计算是否受影响。": "Add an invalid input and check that later calculations continue.",
  "Go 返回 error；JS 用 throw 抛出异常。": "Go returns an error; JS throws exceptions.",
  "try/catch 也可以捕获 await 等待的 Promise rejection。": "try/catch also handles rejection from an awaited Promise.",
  "TypeScript 类型与运行时": "TypeScript types and runtime",
  "用类型表达数据结构，仍然校验外部输入。": "Describe data with types, while still validating external input.",
  "类型在运行前移除；校验函数决定是否接受输入。": "Types are removed before execution; validation decides whether input is accepted.",
  "修改输入的 name 类型，观察运行时校验。": "Change the input name type and observe runtime validation.",
  "Go 类型参与编译；TS 类型不会自动验证 JSON。": "Go types are checked during compilation; TS types do not automatically validate JSON.",
  "这里用 esbuild 转译执行，不提供 tsc 静态类型检查。": "This runner transpiles with esbuild; it does not run tsc type checking.",
  "查询参数": "Query parameters",
  "从 URL 读取可选参数并设置默认值。": "Read optional URL parameters with defaults.",
  "分别观察默认问候与指定名字。": "Compare a default greeting with a named greeting.",
  "加入重复的 name 参数，观察两边取值。": "Repeat the name parameter and compare the selected values.",
  "Go 使用 r.URL.Query；Node 使用 URLSearchParams。": "Go uses r.URL.Query; Node uses URLSearchParams.",
  "查询参数都是字符串，数字需要转换并校验。": "Query parameters are strings; numbers need conversion and validation.",
  "请求体与 JSON": "Request bodies and JSON",
  "处理 POST 请求，拒绝格式错误的数据。": "Handle POST requests and reject malformed data.",
  "有效 JSON 返回 201，损坏的 JSON 返回 400。": "Valid JSON returns 201; malformed JSON returns 400.",
  "把请求体改为缺少 name 的对象，补上字段校验。": "Send an object without name and add field validation.",
  "Go 用 Decoder 读取请求流；Node 用异步迭代收集请求体。": "Go decodes a request stream; Node collects it with async iteration.",
  "业务接口需要限制请求体大小，不能无限读取。": "Request bodies need size limits instead of unbounded reads.",
  "状态码与响应头": "Status codes and headers",
  "响应状态、类型和缓存策略要一起设计。": "Design status, content type and caching together.",
  "成功响应是 JSON；未找到时返回 404。": "Successful responses are JSON; missing resources return 404.",
  "把成功响应改为 201，并增加一个自定义响应头。": "Change the success status to 201 and add a custom header.",
  "响应头必须在正文发送前设置。": "Set headers before sending the body.",
  "HTTP 状态表示请求结果，不能只在正文里写一个 error。": "Use HTTP status to express the result, not just an error field in the body.",
  "中间件与组合": "Middleware and composition",
  "用一个函数包装另一个 handler。": "Wrap one handler in another function.",
  "日志依次输出 before、after，再输出请求结果。": "Logs show before and after, followed by the response.",
  "再加一层中间件，判断进入与退出顺序。": "Add another middleware layer and predict entry and exit order.",
  "Go Handler 返回 Handler；Node 可以用高阶函数包装 handler。": "A Go Handler wraps another Handler; Node can use higher-order functions.",
  "中间件顺序影响行为；异步 handler 需要等待完成。": "Middleware order matters; async handlers must be awaited.",
  "文件与持久化": "Files and persistence",
  "把数据序列化写入文件，再读取回来。": "Serialize data to a file and read it back.",
  "同一次运行中写入和读回的数据一致。": "Data written and read within one run matches.",
  "增加一条记录，确认序列化后的数组变化。": "Add a record and inspect the serialized array.",
  "Node fs/promises 提供异步文件 API；Go os 提供直接的文件操作。": "Node fs/promises provides async file APIs; Go os provides direct file operations.",
  "练习目录每次运行后清理，这里不会保留跨次运行的数据。": "Workspaces are cleaned after each run; data does not persist between runs.",
  "HTML 与 CSS": "HTML and CSS",
  "用语义结构与样式组织一个信息卡片。": "Build an information card with semantic markup and styles.",
  "修改标题或 CSS，运行后右侧预览更新。": "Edit the heading or CSS and run to update the preview.",
  "修改卡片宽度与背景色。": "Change the card width and background color.",
  "HTML 描述结构，CSS 描述布局和外观。": "HTML describes structure; CSS describes layout and appearance.",
  "这个阶段使用浏览器编辑与预览，不再强行保留 Go 对照。": "This stage uses a browser editor and preview instead of a forced Go comparison.",
  "DOM、事件与状态": "DOM, events and state",
  "响应点击并更新页面中的计数。": "Respond to clicks and update a counter.",
  "每点击一次按钮，页面计数加一。": "Each click increments the visible count.",
  "增加一个减一按钮和归零按钮。": "Add decrement and reset buttons.",
  "Node 没有浏览器 DOM；document 属于浏览器环境。": "Node has no browser DOM; document belongs to the browser environment.",
  "事件处理器修改状态，然后显式更新 DOM。": "Event handlers update state and then explicitly update the DOM.",
  "React 与 JSX": "React and JSX",
  "用组件和状态声明界面。": "Describe a UI using components and state.",
  "点击按钮，React 根据新状态重新渲染。": "Click to let React render the updated state.",
  "让按钮每次增加 2，并显示当前计数是否为偶数。": "Increment by 2 and show whether the count is even.",
  "useState 保存组件状态，setter 触发重新渲染。": "useState holds component state; its setter schedules another render.",
  "JSX 需要构建；这里使用本地 esbuild 与项目内 React，无外部 CDN。": "JSX needs a build step; this uses local esbuild and React, without a CDN.",
  "API 契约与数据消费": "API contracts and data consumption",
  "先请求 JSON API，再把响应转换为页面。": "Request a JSON API, then turn its response into a page.",
  "终端显示真实 HTTP 响应，预览显示消费结果。": "The output shows a real HTTP response; the preview shows its consumed data.",
  "在 API 中增加 role 字段，并在页面显示。": "Add a role field to the API and display it in the page.",
  "API 与页面使用同一份契约，客户端仍需解析数据。": "The API and page share a contract, but the client must still parse the response.",
  "预览是本次请求的结果快照；不是持续运行的后端服务。": "The preview is a snapshot of this request, not a persistent backend server.",
  "服务端渲染": "Server-side rendering",
  "后端把业务数据渲染为 HTML。": "Render business data to HTML on the server.",
  "HTTP 返回完整 HTML，预览显示结果。": "HTTP returns complete HTML, shown in the preview.",
  "把名字改为 <b>Ada</b>，确认它作为文字显示。": "Change the name to <b>Ada</b> and confirm it renders as text.",
  "Go html/template 自动处理插值转义。": "Go html/template escapes interpolated values.",
  "JS 字符串模板不会自动转义 HTML，必须处理不可信数据。": "JS template strings do not escape HTML automatically; handle untrusted data explicitly.",
  "表单与服务端校验": "Forms and server validation",
  "模拟提交表单，服务端决定接受或拒绝。": "Simulate form submissions and let the server accept or reject them.",
  "空名字得到 422，有效名字得到成功页面。": "An empty name receives 422; a valid name produces a success page.",
  "加入名字长度上限，并构造一个失败请求。": "Add a maximum name length and construct a failing request.",
  "前端校验改善体验，服务端校验维护数据边界。": "Client validation helps usability; server validation protects data boundaries.",
  "这里的提交由 demo 文件模拟；修改请求后重新运行。": "The demo file simulates submission here; edit its requests and run again.",
  "实战：待办 API": "Project: a todo API",
  "串起创建、查询与删除的完整请求流程。": "Connect creation, listing and deletion in one request flow.",
  "POST 创建 → GET 查询 → DELETE 删除 → GET 空列表。": "POST creates, GET lists, DELETE removes, and GET returns an empty list.",
  "增加完成状态与更新接口。": "Add a completion flag and an update endpoint.",
  "数据保存在单次示例服务内存中；重新运行会重置。": "Data lives in one demo server’s memory; rerunning resets it.",
  "真实项目还需要持久化、鉴权和更完整的输入校验。": "A real project also needs persistence, authorization and more input validation.",
  "实战：配置与启动参数": "Project: configuration and startup",
  "集中解析配置，并在启动前拒绝非法值。": "Parse configuration centrally and reject invalid values before startup.",
  "有效端口输出 3000，非法端口得到错误。": "A valid port prints 3000; an invalid port produces an error.",
  "增加一个 HOST 配置和默认值。": "Add a HOST setting with a default.",
  "环境变量是字符串，需要明确转换和校验。": "Environment variables are strings and need conversion and validation.",
  "示例在自己的进程内设置变量，不影响学习工具服务。": "The example sets variables in its own process, not in the learning server.",
  "实战：行为测试": "Project: behavior tests",
  "把重要行为写成可以运行的断言。": "Express important behavior as runnable assertions.",
  "正常实现打印 3 checks passed；修改实现后断言失败。": "The correct implementation prints 3 checks passed; breaking it fails an assertion.",
  "故意把负数处理改错，观察失败信息。": "Break negative-number handling and inspect the failure.",
  "测试应该检查可观察行为，而不是重复实现代码。": "Tests should check observable behavior, not duplicate implementation details.",
  "这里用最小断言展示测试思想，学习进度仍只按点击运行记录。": "Minimal assertions illustrate testing; progress still records only a click on Run.",
  "同步、异步与事件循环": "Sync, async and the event loop",
  "值的语义与运行机制": "Value semantics and runtime behavior",
  "包与依赖管理": "Packages and dependencies",
  "从项目清单理解包名、入口、脚本与外部依赖。": "Read the manifest to understand package names, entry points, scripts and dependencies.",
  "两侧无需安装第三方依赖。Node 按包名自引用 exports，Go 调用同包函数。": "Neither side needs third-party dependencies. Node self-references its exports by package name; Go calls a same-package function.",
  "package.json 声明元数据、依赖和脚本；go.mod 声明模块路径与依赖。": "package.json declares metadata, dependencies and scripts; go.mod declares the module path and dependencies.",
  "package-lock.json 锁定依赖树；go.sum 记录校验信息，不是同一种锁文件。": "package-lock.json locks the dependency tree; go.sum records checksums and is not the same kind of lockfile.",
  "在本地运行 npm start，对照网页输出；修改 greet 实现再次运行。命令说明见 Tips。": "Run npm start locally and compare the web output; edit greet and rerun. See Tips for commands.",
  "面向对象与抽象": "Objects and abstraction",
  "封装状态，以行为抽象连接不同实现，使用组合构建结账流程。": "Encapsulate state, connect implementations through behavior, and compose a checkout flow.",
  "钱包与礼品卡使用同一结账流程；钱包扣款后，余额不足的支付被拒绝。": "Wallet and gift card share a checkout flow; after spending, the wallet rejects an unaffordable payment.",
  "Go 用结构体、方法与接口；JS 用 class、方法和鸭子类型表达相同的行为抽象。": "Go uses structs, methods and interfaces; JS uses classes, methods and duck typing for the same behavioral abstraction.",
  "Go 小写字段在包外不可访问；JS # 私有字段在类外不可访问，封装边界不同。": "Go lowercase fields are inaccessible outside the package; JS # private fields are inaccessible outside the class. The encapsulation boundaries differ.",
  "Checkout 组合支付对象，不依赖共同父类。Go 接口隐式实现；JS 错误的对象形状会在运行时暴露。": "Checkout composes a payment object without a shared superclass. Go interfaces are satisfied implicitly; invalid JS object shapes fail at runtime.",
  "增加一个同样提供支付方法的实现，不修改 Checkout，再比较两侧输出。": "Add another payment implementation without changing Checkout, then compare both outputs."
};
