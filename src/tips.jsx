import React, { useEffect, useRef, useState } from "react";

const tips = [
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
  '03-values': ['variables', 'references', 'copying'],
  '04-modules': ['functions', 'modules'], '05-execution': ['promise', 'await', 'queues'],
  '24-control-flow': ['variables', 'iteration'],
  '06-collections': ['array-methods', 'iteration', 'functions'], '08-errors': ['promise', 'await'],
  '09-typescript': ['functions', 'modules'], '14-files': ['await'],
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
      {tip && <><p className="eyebrow"><button onClick={() => open('all')}>TIPS</button> / {tips.indexOf(tip) + 1}</p><h2>{text(tip.title)}</h2><p>{text(tip.intro)}</p><pre>{tip.code}</pre>{tip.id === 'queues' && <QueueDemo en={en} />}<h3>{en ? 'Connect to Go' : '对照 Go'}</h3><p>{text(tip.go)}</p><h3>{en ? 'Watch out' : '容易误解的地方'}</h3><p>{text(tip.trap)}</p><p><a href={tip.url} target="_blank" rel="noreferrer">{en ? 'Official reference' : '官方参考'}</a> · <a href={`#tip=${tip.id}`}>{en ? 'Link to this tip' : '本条链接'}</a></p></>}
    </dialog></>;
}
