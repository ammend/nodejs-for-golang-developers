import React, { useEffect, useRef, useState } from "react";

const tips = [
{
  "id": "ts-oop",
  "title": [
    "TypeScript 面向对象",
    "TypeScript object-oriented programming"
  ],
  "intro": [
    "TS 给 JS 的类增加类型契约和访问约束。interface 描述能力，abstract class 可以共享实现，implements 检查契约，extends 继承实现。",
    "TS adds type contracts and access constraints to JS classes. interface describes capabilities; abstract class can share implementation; implements checks a contract; extends inherits implementation."
  ],
  "code": "interface Speaker { speak(): string; }\nabstract class Animal implements Speaker {\n  constructor(protected readonly name: string) {}\n  abstract speak(): string;\n  describe(): string { return this.name + \": \" + this.speak(); }\n}\nclass Dog extends Animal {\n  override speak(): string { return \"woof\"; }\n}\nconsole.log(new Dog(\"Ada\").describe()); // Ada: woof\n\n// Structural typing: no implements required here\nconst speaker: Speaker = { speak: () => \"hello\" };\nconsole.log(speaker.speak());",
  "go": [
    "Go 接口按方法集隐式实现；TS 通常按结构匹配，implements 是显式检查，不会自动生成方法。Go 没有类继承；不要把 Go 嵌入当作 extends。课程 main.ts 默认运行 payment.ts；把导入改为 main.js 可比较原 JS 实现。",
    "Go interfaces are satisfied implicitly by method sets; TS usually matches structures. implements checks explicitly but does not generate methods. Go has no class inheritance; embedding is not extends. The lesson main.ts runs payment.ts by default; change its import to main.js to compare the JS implementation."
  ],
  "trap": [
    "public 对外可见，protected 供类及子类使用，private 限制在类内；这些 TS 修饰符主要在类型检查时生效。# 字段才有 JS 运行时私有性。readonly 禁止通过该声明重新赋值，不会深度冻结对象。abstract 不能直接实例化是 TS 检查规则；接口与类型会被擦除。override 标明覆写，配合 noImplicitOverride 更易发现错误。抽象类只在确实共享实现时使用，其余优先接口与组合。本网页仅转译，类型错误须用 tsc 检查。",
    "public is externally accessible, protected is for the class and subclasses, and private is class-only; these TS modifiers mainly apply during type checking. # provides JS runtime privacy. readonly prevents reassignment through the declaration, not deep mutation. Preventing direct instantiation of abstract classes is a TS check; interfaces and types are erased. override marks an override, with noImplicitOverride improving checks. Use abstract classes for actual shared implementation; otherwise prefer interfaces and composition. This runner only transpiles; use tsc for type errors."
  ],
  "url": "https://www.typescriptlang.org/docs/handbook/2/classes.html"
},
{
  "id": "oop",
  "title": [
    "面向对象：封装、抽象与组合",
    "Objects: encapsulation and composition"
  ],
  "intro": [
    "把状态和行为放在一起是封装；让调用方只依赖需要的行为是抽象。多态允许不同实现响应同一种操作，不一定需要继承。",
    "Encapsulation groups state and behavior; abstraction exposes only the behavior callers need. Polymorphism lets different implementations respond to the same operation without requiring inheritance."
  ],
  "code": "// TypeScript: compile-time contract / 编译期契约\ninterface Payment {\n  pay(amount: number): string;\n}\nclass Checkout {\n  constructor(private payment: Payment) {}\n  buy(amount: number): string {\n    return this.payment.pay(amount);\n  }\n}\n// Structural typing: no shared base class required\n// 结构化类型：不要求共同父类\nconst card: Payment = { pay: amount => `paid ${amount}` };\nconsole.log(new Checkout(card).buy(30));",
  "go": [
    "Go 的方法集决定是否满足接口，无需 implements。修改结构体状态通常使用指针接收者。JS class 方法通过 this 访问实例；# 字段是运行时私有，Go 小写字段则是包级不可导出。TS interface 在编译后被擦除，不能验证外部 JSON。",
    "Go method sets determine interface satisfaction without implements; mutable state usually uses pointer receivers. JS class methods access instances via this. # fields are runtime-private; Go lowercase fields are package-unexported. TS interfaces are erased and cannot validate external JSON."
  ],
  "trap": [
    "JS class 建立在原型机制之上；extends/super 支持继承，但 Go 没有类继承，结构体嵌入也不等于子类。优先按需要组合对象，避免为了 OOP 制造父类层级。JS 方法单独取出调用可能丢失 this；TS private 通常只做类型检查，区别于 JS #。本例 GiftCard 是教学替身，并非真实支付或资金校验实现。",
    "JS classes use prototypes; extends/super support inheritance, while Go has no class inheritance and embedding is not subclassing. Compose objects as needed rather than inventing class hierarchies. Extracted JS methods can lose this; TS private is usually a type-checking restriction, unlike JS #. GiftCard is a teaching stand-in, not a real payment or funds-validation implementation."
  ],
  "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes"
},
{
  "id": "packages",
  "title": [
    "npm、依赖与锁文件",
    "Packages: npm and lockfiles"
  ],
  "intro": [
    "包管理器安装和复现依赖；模块系统负责导入代码。先用 npm 理解这两个不同职责。",
    "Package managers install and reproduce dependencies; the module system imports code. Start with npm to understand these separate responsibilities."
  ],
  "code": "# Run in a local project terminal, not in the JS editor\n# 在本地项目终端执行，不是 JS 编辑器\nnpm install lodash       # add runtime dependency\nnpm install -D typescript # add development tooling\nnpm uninstall lodash\nnpm run start            # run scripts.start\nnpm ci                   # install from an existing consistent lockfile\nnpm ls                   # inspect installed dependency tree\n\n# Go commands with different responsibilities / 职责不同\ngo get example.com/module@v1.2.3 # illustrative module path\ngo mod tidy\ngo mod download\ngo run .",
  "go": [
    "go.mod 指定模块及依赖，go.sum 校验下载内容，模块通常在共享缓存。npm 的 package.json 定义 dependencies（运行依赖）、devDependencies（构建测试工具）和 scripts；常见安装目录是 node_modules。不要把 go.sum 当作 package-lock.json 的直接对应物。",
    "go.mod declares modules/dependencies, go.sum checks downloaded contents, and modules normally live in a shared cache. npm package.json defines dependencies for runtime, devDependencies for build/test tools and scripts; node_modules is the common installation directory. go.sum is not equivalent to package-lock.json."
  ],
  "trap": [
    "版本范围：1.2.3 是精确版本，~1.2.3 允许到小于 1.3.0，^1.2.3 允许到小于 2.0.0；0.x 的 ^ 更严格。锁文件记录具体解析结果。npm install 可添加依赖并更新锁文件；npm ci 要求清单与锁文件一致，会移除现有 node_modules，且不改写清单/锁文件。提交 package.json 与锁文件，不提交 node_modules。pnpm、Yarn 是其他包管理器，使用各自锁文件，按团队选择统一。本例无外部依赖，展示包自引用和真实空依赖锁文件；网页不会执行 npm 安装，也不会自动执行 scripts。",
    "Versions: 1.2.3 is exact, ~1.2.3 permits versions below 1.3.0, ^1.2.3 below 2.0.0; ^ is stricter for 0.x. Lockfiles record resolved versions. npm install can add dependencies and update the lock; npm ci requires a matching manifest/lock, removes existing node_modules and does not rewrite either file. Commit manifest and lock, not node_modules. pnpm and Yarn are alternatives with their own locks; use the team’s chosen manager consistently. This dependency-free example shows package self-reference and a real empty-dependency lockfile. The web runner does not install packages or automatically run scripts."
  ],
  "url": "https://docs.npmjs.com/cli/commands/npm-ci/"
},
{
  "id": "typescript",
  "title": [
    "TypeScript 与 JavaScript",
    "TypeScript and JavaScript"
  ],
  "intro": [
    "TypeScript 在 JavaScript 基础上增加类型系统，主要在运行前发现问题、辅助补全和重构。运行行为仍以 JavaScript 为基础。",
    "TypeScript adds a type system to JavaScript, mainly to find mistakes before execution and improve completion and refactoring. Runtime behavior remains based on JavaScript."
  ],
  "code": "// TypeScript: types describe the expected shape\ntype User = { name: string; age?: number };\nfunction greet(user: User): string {\n  return `hello ${user.name}`;\n}\nconsole.log(greet({ name: \"Ada\" }));\n// greet({ name: 123 }); // type checker reports an error\n\n// Equivalent JavaScript after removing types:\n// function greet(user) { return `hello ${user.name}`; }\n\n// Generics preserve relationships between types:\nfunction first<T>(items: T[]): T | undefined {\n  return items[0];\n}\nconst value = first([1, 2]); // number | undefined\nif (value !== undefined) console.log(value.toFixed(1));",
  "go": [
    "像 Go 一样提前检查类型，但 TS 大量使用类型推断和结构化类型：形状符合即可。与 Go 不同，interface/type 等类型信息通常会在生成 JS 时被擦除，不是运行时的数据约束。",
    "Like Go, TS checks types ahead of time, but relies heavily on inference and structural typing: matching shapes are compatible. Unlike Go, interface/type information is typically erased when producing JS; it is not a runtime data constraint."
  ],
  "trap": [
    "主要能力：类型推断、参数和返回值检查、对象形状（type/interface）、联合类型与控制流收窄、泛型、空值检查（strictNullChecks）。any 会绕开许多检查，unknown 要先收窄；as 只是类型断言，不会转换数据。API/JSON 输入仍需运行时校验。本项目用 esbuild 转译 TS，不做类型检查：能运行不代表类型正确。完整项目通常另用 tsc --noEmit 检查。TS 不会自动加速 JS，也不会让 async 自动多线程。",
    "Main features: inference, parameter/return checks, object shapes (type/interface), unions and control-flow narrowing, generics, and null checks (strictNullChecks). any bypasses many checks; unknown needs narrowing. as asserts a type without converting data. API/JSON input still needs runtime validation. This project transpiles TS with esbuild without type checking: successful execution does not prove type correctness. Full projects typically also run tsc --noEmit. TS does not automatically speed up JS or make async multithreaded."
  ],
  "url": "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html"
},
{
  "id": "json",
  "title": [
    "JSON：解析与序列化",
    "JSON: parse and stringify"
  ],
  "intro": [
    "JSON 是数据的文本格式。JSON.parse 把文本解析成 JS 值；JSON.stringify 把可表示的数据编码成文本。",
    "JSON is a text format for data. JSON.parse turns text into a JS value; JSON.stringify encodes representable data as text."
  ],
  "code": "const text = '{\"name\":\"Ada\",\"age\":20}';\nconst user = JSON.parse(text);\nconsole.log(user.name); // Ada\n\nconsole.log(JSON.stringify(user));\nconsole.log(JSON.stringify(user, null, 2)); // indent: 2 spaces\nconsole.log(JSON.stringify(user, [\"name\"])); // {\"name\":\"Ada\"}\n\n// replacer: transform / omit fields while encoding\nconst safe = JSON.stringify({name: \"Ada\", secret: \"x\"},\n  (key, value) => key === \"secret\" ? undefined : value);\nconsole.log(safe);\n\n// reviver: transform fields while decoding\nconst result = JSON.parse('{\"age\":\"20\"}',\n  (key, value) => key === \"age\" ? Number(value) : value);\nconsole.log(typeof result.age); // number\n\ntry { JSON.parse(\"not JSON\"); }\ncatch (error) { console.log(error.name); } // SyntaxError",
  "go": [
    "对应 Go encoding/json 的 Marshal / Unmarshal。Go 可解码到结构体并检查类型；JS parse 只保证 JSON 语法正确，不保证业务字段和类型正确，仍需校验。JS 解析大整数可能丢精度；Go 解码到 any 时默认数字为 float64，可用 Decoder.UseNumber。",
    "Compare Go encoding/json Marshal / Unmarshal. Go can decode into typed structs; JS parse checks JSON syntax, not application fields or types, so validation is still needed. Large integers can lose precision in JS; Go decoding into any defaults to float64, with Decoder.UseNumber available."
  ],
  "trap": [
    "JSON 键和字符串必须用双引号，不支持注释或尾逗号。对象属性中的 undefined/函数会被忽略，在数组里通常变成 null；NaN/Infinity 编码为 null。Date 通常经 toJSON 变成字符串，parse 不会自动还原日期。默认 stringify 遇到 BigInt 或循环引用会抛错，顶层 undefined 则返回 undefined。reviver 返回 undefined 会删除对应属性。JSON 往返不是通用深复制，也不能代替输入校验。",
    "JSON keys and strings require double quotes; comments and trailing commas are invalid. Undefined/functions in object properties are omitted, while in arrays they generally become null; NaN/Infinity encode as null. Date typically uses toJSON to become a string; parse does not restore dates automatically. By default stringify throws on BigInt or cycles, while top-level undefined returns undefined. Returning undefined from a reviver deletes that property. A JSON round trip is neither a general deep clone nor input validation."
  ],
  "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON"
},
{
  "id": "runtime",
  "title": [
    "V8、Node、libuv 与 Go GMP",
    "Runtime: V8, Node, libuv and Go GMP"
  ],
  "intro": [
    "Node 是完整运行时：V8 执行 JS，Node API 与原生绑定连接底层能力，libuv 提供事件循环及部分异步 I/O 支持。它们不是三条依次执行所有代码的流水线。",
    "Node is the runtime: V8 executes JS, Node APIs and native bindings connect native capabilities, and libuv provides the event loop and parts of async I/O. These are not three sequential stages for every instruction."
  ],
  "code": "Node: JS executed by V8\n       │ Node API / native bindings\n       ├─ network → OS readiness notifications\n       └─ many file operations → libuv worker pool\n       completion → event loop → JS callback / Promise continuation\n\nGo:   G (goroutine) ── scheduled onto ── M (OS thread) + P\n      network wait → park G → netpoll readiness → runnable G\n      scheduler → resume G on an available M with P",
  "go": [
    "G 是 goroutine，M 是操作系统线程，P 是执行 Go 代码所需的调度资源，数量由 GOMAXPROCS 控制；P 不是物理 CPU。多个 G 可以分配到多个 M/P 并行执行。网络等待常由 netpoll 挂起和唤醒 G；阻塞系统调用可能占住 M，运行时可以把 P 交给其他 M。",
    "G is a goroutine, M an OS thread, and P the scheduler resources needed to execute Go code, with the count controlled by GOMAXPROCS. P is not a physical CPU. Gs can run in parallel on multiple M/P pairs. Network waits typically park Gs for netpoll; blocking syscalls may occupy an M while its P is handed to another M."
  ],
  "trap": [
    "默认一个 Node JS 执行线程逐个运行回调，但进程不止一个线程。libuv 线程池不是 JS goroutine 池；worker_threads 才能运行另一份 JS 执行环境。V8 管理 Promise 微任务，Node 管理 nextTick 并协调检查点，它们不是 libuv 的事件循环阶段。await 暂停函数后续，不会自动分配线程。Go 调度器可抢占 goroutine，而长时间同步 JS 会堵住该事件循环。",
    "A default Node JS thread runs callbacks serially, but the process has other threads. The libuv pool is not a pool of JS goroutines; worker_threads provide additional JS environments. V8 manages Promise microtasks; Node manages nextTick and coordinates checkpoints. Neither is a libuv loop phase. await pauses a continuation without allocating a thread. Go can preempt goroutines; long synchronous JS blocks its event loop."
  ],
  "url": "https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop",
  "sources": [
    [
      "Go runtime: G / M / P",
      "https://github.com/golang/go/blob/master/src/runtime/HACKING.md"
    ],
    [
      "libuv design",
      "https://docs.libuv.org/en/v1.x/design.html"
    ]
  ]
},
{
  "id": "errors",
  "title": [
    "Error 与 try / catch / finally",
    "Error and try / catch / finally"
  ],
  "intro": [
    "Error 描述失败，throw 抛出失败，catch 处理失败，finally 执行收尾。",
    "Error describes failure, throw raises it, catch handles it, and finally performs cleanup."
  ],
  "code": "async function run(n) {\n  try {\n    if (n === 0) throw new Error(\"division by zero\");\n    console.log(12 / n);\n  } catch (error) {\n    if (!(error instanceof Error)) throw error;\n    console.log(error.name); // Error\n    console.log(error.message); // division by zero\n  } finally {\n    console.log(\"cleanup\");\n  }\n}\nawait run(3);\nawait run(0);",
  "go": [
    "Go 通常返回 (value, error)，检查错误后继续或返回。defer 在所在函数返回时收尾；JS finally 在离开对应 try/catch 时收尾，时机不完全相同。",
    "Go normally returns (value, error), then checks the error. defer runs when its containing function returns; JS finally runs when leaving the associated try/catch, so their scope differs."
  ],
  "trap": [
    "new Error 只是创建对象，不会自动抛出。name 是类型名称，message 是说明，stack 常用于调试堆栈，格式依运行时。可用 cause 保存原始错误。JS 能抛任意值，不能总是假定 error.message 存在。finally 在正常控制流中成功失败都执行，即使 try/catch return；不要在 finally return/throw 覆盖原结果。try/catch 可捕获 await 的拒绝，但捕获不到稍后定时器回调里的抛错。",
    "new Error creates an object; it does not throw by itself. name identifies its type, message describes it, and stack provides runtime-dependent debug details. cause can preserve an underlying error. JS can throw any value, so error.message is not guaranteed. In normal control flow, finally runs on success or failure, including return; returning or throwing there overrides the prior outcome. try/catch can catch an awaited rejection, but not an exception thrown later in a timer callback."
  ],
  "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch"
},
{
  "id": "array-methods",
  "title": [
    "数组方法：filter / map / reduce",
    "Array methods: filter / map / reduce"
  ],
  "intro": [
    "filter 留下符合条件的元素，map 把每项变成新值，reduce 把多项汇总成一个结果。",
    "filter selects items, map transforms each item, and reduce combines items into a result."
  ],
  "code": "const numbers = [1, 2, 3, 4];\nconst even = numbers.filter(n => n % 2 === 0); // [2, 4]\nconst doubled = even.map(n => n * 2); // [4, 8]\nconst total = doubled.reduce((sum, n) => sum + n, 0); // 12\nconsole.log(total);\n// Equivalent chain:\nconsole.log(numbers.filter(n => n % 2 === 0)\n  .map(n => n * 2).reduce((sum, n) => sum + n, 0));",
  "go": [
    "Go 常用 for range + append 完成筛选和映射，用累加变量完成归约。JS 的 map 方法不是 Go 的 map 字典类型。",
    "Go typically uses for range and append for filtering and mapping, and an accumulator for reduction. JS array map is not Go’s map dictionary type."
  ],
  "trap": [
    "reduce 的 0 是初始累加值；空数组不传初始值会报错。find 找第一项，some 判断是否至少一项满足，every 判断是否全部满足，forEach 做副作用且返回 undefined。filter/map 不直接修改原数组，但回调仍能修改共享对象；forEach 不会等待 async 回调。",
    "The 0 is the initial accumulator; reducing an empty array without an initial value throws. find returns the first match, some tests any match, every tests all, and forEach performs side effects and returns undefined. filter/map do not directly mutate the source, but callbacks can mutate shared objects; forEach does not await async callbacks."
  ],
  "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"
},
{
  "id": "iteration",
  "title": [
    "Go range 与 JS 遍历",
    "Iteration: Go range and JS loops"
  ],
  "intro": [
    "先区分要遍历的是索引、值，还是对象的键。",
    "First decide whether you need indexes, values or object keys."
  ],
  "code": "// Go slice:\n// for i, value := range items { fmt.Println(i, value) }\n\nconst items = [\"Ada\", \"Lin\"];\nfor (const value of items) console.log(value);\nfor (const [i, value] of items.entries()) console.log(i, value);\n\nconst user = { name: \"Ada\", age: 20 };\nfor (const [key, value] of Object.entries(user)) {\n  console.log(key, value);\n}",
  "go": [
    "Go 遍历 slice 得到索引和值，遍历 map 得到键和值，map 顺序不保证。JS for…of 读取可迭代对象的值；普通对象要用 Object.entries 等转换。",
    "Go range yields index/value for slices and key/value for maps; map order is unspecified. JS for…of reads iterable values; plain objects need conversion such as Object.entries."
  ],
  "trap": [
    "for…in 遍历可枚举字符串属性名，还可能包含继承属性，不适合当数组值遍历。Object.entries 只取自身可枚举字符串键。Go range 字符串给出字节索引和 rune；JS for…of 按 Unicode 码点遍历，均不保证一个元素就是一个视觉字符。",
    "for…in enumerates string property names, possibly inherited ones; it is not array-value iteration. Object.entries includes only own enumerable string keys. Go string range yields byte indexes and runes; JS for…of iterates Unicode code points. Neither guarantees one visual character per item."
  ],
  "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration"
},
  { id: 'variables', title: ['变量声明与作用域', 'Declarations and scope'],
    intro: ['优先用 const；需要重新赋值时用 let。两者都有块级作用域。', 'Use const by default and let when reassignment is needed. Both are block-scoped.'],
    code: 'const user = { name: "Ada" };\nuser.name = "Lin"; // allowed: mutate object\n// user = {};     // error: reassign const\n\nlet count = 0;\ncount += 1;\nif (true) {\n  let inside = 1;\n  var outside = 2;\n}\nconsole.log(outside); // 2\n// console.log(inside); // ReferenceError',
    go: ['Go 的 := 和 var 也声明变量，但 Go const 是常量；JS const 约束的是变量绑定，不保证对象内容不变。', 'Go also declares variables with := and var, but Go const declares constants; JS const prevents rebinding, not object mutation.'],
    trap: ['var 没有块级作用域，通常属于所在函数作用域；它允许重复声明，声明前读取可能得到 undefined。let/const 在初始化前不可访问（暂时性死区）。顶层规则还取决于脚本或模块环境。', 'var is not block-scoped and usually belongs to its enclosing function. It permits redeclaration and can read as undefined before its declaration. let/const cannot be accessed before initialization (the temporal dead zone). Top-level rules also depend on script or module context.'],
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types' },
  { id: 'references', title: ['值与对象引用', 'Values and object references'],
    intro: ['赋值和传参都传递值；对于对象，这个值让两个变量指向同一个对象。', 'Assignment and arguments pass values. For objects, that value lets two variables refer to the same object.'],
    code: 'let a = 1;\nlet b = a;\nb = 2;\nconsole.log(a); // 1\n\nconst first = { score: 1 };\nconst second = first;\nsecond.score = 2;\nconsole.log(first.score); // 2\nconsole.log(first === second); // true',
    go: ['Go 结构体赋值复制结构体；JS 对象赋值不会复制对象内容。Go map、slice 也可能共享底层数据，不能概括成 Go 全复制、JS 全引用。', 'Go struct assignment copies the struct; JS object assignment does not copy object contents. Go maps and slices can also share underlying data.'],
    trap: ['对象参数的属性修改能被调用方看到，但给参数重新赋值不会重绑调用方变量。两个内容相同的新对象，=== 也为 false。', 'Mutating a parameter object is visible to the caller, but reassigning the parameter does not rebind the caller’s variable. Two separate objects with identical contents are still unequal with ===.'],
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects' },
  { id: 'copying', title: ['浅复制与深复制', 'Shallow and deep copies'],
    intro: ['展开运算符只复制第一层；嵌套对象仍然共享。', 'Object spread copies only the first level; nested objects remain shared.'],
    code: 'const original = { profile: { name: "Ada" } };\nconst shallow = { ...original };\nshallow.profile.name = "Lin";\nconsole.log(original.profile.name); // Lin\n\nconst deep = structuredClone(original);\ndeep.profile.name = "Grace";\nconsole.log(original.profile.name); // Lin',
    go: ['Go 结构体里的指针、slice、map 字段也可能继续共享数据；复制外层不意味着所有层都独立。', 'Pointers, slices and maps inside copied Go structs may still share data. Copying the outer container does not make every level independent.'],
    trap: ['structuredClone 适合支持克隆的数据，不是任意对象都能复制，例如函数不能克隆。JSON 序列化往返也不是通用深复制，会丢失或改变某些值。', 'structuredClone works for cloneable data, not arbitrary objects: functions cannot be cloned. A JSON round trip is not a universal deep copy and can lose or change values.'],
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone' },
  { id: 'functions', title: ['箭头函数与函数声明', 'Arrow functions and declarations'],
    intro: ['同一个问候函数可以有两种写法，但两种函数的语义不完全相同。', 'A greeting function can use either syntax, but the two forms have different semantics.'],
    code: 'const greet = (name) => `hello ${name}`;\n\n/* Alternative — replace the line above:\nfunction greet(name) {\n  return `hello ${name}`;\n}\n*/',
    go: ['Go 也能把函数赋给变量；JS 箭头函数的 this 则沿用外层作用域。', 'Go also supports function values; a JS arrow function inherits this from its surrounding scope.'],
    trap: ['函数声明可在声明前调用。const 箭头函数须先初始化；箭头函数没有自己的 this，不能用 new 构造。', 'Function declarations can be called before their declaration. A const arrow must be initialized first; arrows have no own this and cannot be constructors.'],
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions' },
  { id: 'promise', title: ['Promise / resolve / then', 'Promise / resolve / then'],
    intro: ['Promise 像取餐单：记录等待、成功或失败。它不是工作线程。', 'A Promise is like an order ticket: pending, fulfilled or rejected. It is not a worker thread.'],
    code: 'console.log("A");\nconst ready = Promise.resolve();\nconst work = ready.then(() => console.log("B"));\nconsole.log("C");\nawait work;\n// A → C → B',
    go: ['不像 go func()，创建 Promise 不会自动启动并行计算。', 'Unlike launching a goroutine, creating a Promise does not automatically start parallel computation.'],
    trap: ['resolve() 取得已成功的 Promise；then 登记后续处理并返回新 Promise。这里的回调稍后作为微任务执行。', 'resolve() gives an already fulfilled Promise; then registers a continuation and returns a new Promise. This callback runs later as a microtask.'],
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise' },
  { id: 'await', title: ['async / await', 'async / await'],
    intro: ['等待奶茶时，暂停这段点单流程，店员可以接待其他人。', 'While tea is being prepared, pause this order flow and let the clerk serve someone else.'],
    code: 'import { setTimeout as delay } from "node:timers/promises";\nasync function order() {\n  console.log("order");\n  await delay(100);\n  console.log("ready");\n}\norder();\nconsole.log("next customer");\n// order → next customer → ready',
    go: ['await 暂停当前 async 函数的后续执行，让 JS 线程处理其他工作；不是把函数搬到另一个线程。', 'await pauses the continuation of this async function, allowing other JS work. It does not move the function to another thread.'],
    trap: ['async 函数返回 Promise，遇到第一个 await 前仍同步执行。耗时循环即使放进 async，也会阻塞。', 'An async function returns a Promise and runs synchronously until its first await. A heavy loop still blocks even inside async.'],
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await' },
  { id: 'queues', title: ['微任务、nextTick 与定时器', 'Microtasks, nextTick and timers'],
    intro: ['同一个 JS 执行位置，多个等待区。队列不会打断正在执行的同步代码。', 'One JS execution thread, several waiting areas. Queued work cannot interrupt running synchronous code.'],
    code: 'console.log("A");\nsetTimeout(() => console.log("timer"), 0);\nPromise.resolve().then(() => console.log("promise"));\nqueueMicrotask(() => console.log("microtask"));\nprocess.nextTick(() => console.log("nextTick"));\nconsole.log("B");',
    go: ['这些队列不是多个 goroutine；回调最终仍在同一个 JS 线程逐个执行。', 'These queues are not separate goroutines; their callbacks execute one at a time on the same JS thread.'],
    trap: ['Promise 与 queueMicrotask 共用微任务队列，nextTick 是独立队列。定时器属于事件循环阶段，还有 poll、check 等阶段，不能简化成固定三个队列或永久优先级。', 'Promise and queueMicrotask share a microtask queue; nextTick has a separate queue. Timers belong to event-loop phases, alongside poll, check and others. There are not simply three queues or one universal priority order.'],
    url: 'https://nodejs.org/api/process.html#when-to-use-queuemicrotask-vs-processnexttick' },
  { id: 'modules', title: ['ESM / CommonJS', 'ESM / CommonJS'],
    intro: ['都是 JavaScript，采用不同规则连接文件。项目使用 ESM。', 'Both are JavaScript, with different rules for connecting files. This project uses ESM.'],
    code: '// ESM: greet.mjs\nexport const greet = () => "hello";\n// main.mjs\nimport { greet } from "./greet.mjs";\n\n// CommonJS: greet.cjs\nmodule.exports = { greet: () => "hello" };\n// main.cjs\nconst { greet } = require("./greet.cjs");',
    go: ['类似 Go 的包导入，都在组织代码；JS 这里有两套模块机制。以上是不同文件的片段，不要合并执行。', 'Like Go package imports, modules organize code. JS has two module systems. These are separate file excerpts, not one executable file.'],
    trap: ['.mjs 明确使用 ESM，.cjs 明确使用 CommonJS。本项目 .js 配合 type: module 也是 ESM。两者都能写异步代码；ESM 支持顶层 await。', '.mjs explicitly selects ESM; .cjs selects CommonJS. Here .js with type: module is also ESM. Both support async code; ESM supports top-level await.'],
    url: 'https://nodejs.org/api/packages.html#determining-module-system' }
];
const related = {
  '26-oop': ['oop', 'ts-oop', 'typescript', 'references'],
  '25-packages': ['packages', 'modules'],
  '07-json': ['json', 'references', 'copying'],
  '03-values': ['variables', 'references', 'copying'],
  '04-modules': ['functions', 'modules'], '05-execution': ['runtime', 'promise', 'await', 'queues'],
  '24-control-flow': ['variables', 'iteration'],
  '06-collections': ['array-methods', 'iteration', 'functions'], '08-errors': ['errors', 'promise', 'await'],
  '09-typescript': ['typescript', 'functions', 'modules'], '14-files': ['await'],
  '17-react': ['functions', 'modules'], '18-api-contract': ['await', 'promise']
};
function QueueDemo({ en }) {
  const [mode, setMode] = useState('ESM');
  const [step, setStep] = useState(0);
  const order = mode === 'ESM' ? ['A', 'B', 'promise', 'microtask', 'nextTick', 'timer'] : ['A', 'B', 'nextTick', 'promise', 'microtask', 'timer'];
  return <section className="queue-demo"><h3>{en ? 'Step through this example' : '逐步看这段代码'}</h3>
    <select aria-label={en ? 'Module mode' : '模块模式'} value={mode} onChange={e => {setMode(e.target.value); setStep(0);}}><option>ESM</option><option>CommonJS</option></select>
    <p>{en ? 'Illustration of the code above at module top level, not a live Node runtime. ESM top level already runs within microtask processing.' : '这是上方代码在模块顶层执行的教学演示，并非浏览器运行 Node。ESM 顶层本身就在微任务处理过程中。'}</p>
    <div className="queue-cells">{order.map((item, i) => <span key={item} className={i < step ? 'executed' : ''}>{i < step ? '✓ ' : ''}{item}</span>)}</div>
    <pre aria-live="polite">{order.slice(0, step).join(' → ') || (en ? 'No output yet' : '尚无输出')}</pre>
    <button onClick={() => setStep(s => s === order.length ? 0 : s + 1)}>{step === order.length ? (en ? 'Replay' : '重新演示') : (en ? 'Next step' : '下一步')}</button>
  </section>;
}
export default function Tips({ lesson, locale }) {
  const en = locale === 'en';
  const readHash = () => {const id = location.hash.slice(1).replace(/^tip=/, ''); return id === 'all' || tips.some(t => t.id === id) ? id : null;};
  const [selected, setSelected] = useState(readHash);
  const dialog = useRef(null);
  useEffect(() => {const changed = () => setSelected(readHash()); window.addEventListener('hashchange', changed); return () => window.removeEventListener('hashchange', changed);}, []);
  useEffect(() => {if (selected && !dialog.current.open) dialog.current.showModal(); if (!selected && dialog.current.open) dialog.current.close();}, [selected]);
  function open(id) {history.replaceState(null, '', `${location.pathname}${location.search}#tip=${id}`); setSelected(id);}
  function close() {history.replaceState(null, '', `${location.pathname}${location.search}`); setSelected(null);}
  const tip = tips.find(t => t.id === selected);
  const text = a => a[en ? 1 : 0];
  return <><div className="tips-bar"><button onClick={() => open('all')}>Tips</button>{(related[lesson.id] || []).map(id => {const t = tips.find(t => t.id === id);return <button key={id} onClick={() => open(id)}>{text(t.title)}</button>;})}</div>
    <dialog ref={dialog} className="tips-drawer" aria-label={en ? 'Knowledge tips' : '知识 Tips'} onCancel={close}>
      <button className="tips-close" onClick={close}>{en ? 'Close' : '关闭'} ×</button>
      {selected === 'all' && <><h2>{en ? 'All Tips' : '全部 Tips'}</h2><p>{en ? 'English title · A–Z' : '按英文标题 A–Z 排序'}</p><nav className="tips-index" aria-label={en ? 'Tips index' : 'Tips 目录'}>{[...tips].sort((a,b) => a.title[1].localeCompare(b.title[1], 'en')).map(t => <button key={t.id} onClick={() => open(t.id)}><strong>{t.title[1]}</strong>{!en && t.title[0] !== t.title[1] && <span>{t.title[0]}</span>}</button>)}</nav></>}
      {tip && <><p className="eyebrow"><button onClick={() => open('all')}>TIPS</button> / {tips.indexOf(tip) + 1}</p><h2>{text(tip.title)}</h2><p>{text(tip.intro)}</p><pre>{tip.code}</pre>{tip.id === 'queues' && <QueueDemo en={en} />}<h3>{en ? 'Connect to Go' : '对照 Go'}</h3><p>{text(tip.go)}</p><h3>{en ? 'Watch out' : '容易误解的地方'}</h3><p>{text(tip.trap)}</p>{tip.sources && <ul>{tip.sources.map(([label,url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>)}</ul>}<p><a href={tip.url} target="_blank" rel="noreferrer">{en ? 'Official reference' : '官方参考'}</a> · <a href={`#tip=${tip.id}`}>{en ? 'Link to this tip' : '本条链接'}</a></p></>}
    </dialog></>;
}
