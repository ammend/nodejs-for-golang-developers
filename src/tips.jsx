import React, { useEffect, useRef, useState } from "react";

const tips = [
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
  '04-modules': ['functions', 'modules'], '05-execution': ['promise', 'await', 'queues'],
  '06-collections': ['functions'], '08-errors': ['promise', 'await'],
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
  const readHash = () => {const id = location.hash.slice(1).replace(/^tip=/, ''); return tips.some(t => t.id === id) ? id : null;};
  const [selected, setSelected] = useState(readHash);
  const dialog = useRef(null);
  useEffect(() => {const changed = () => setSelected(readHash()); window.addEventListener('hashchange', changed); return () => window.removeEventListener('hashchange', changed);}, []);
  useEffect(() => {if (selected && !dialog.current.open) dialog.current.showModal(); if (!selected && dialog.current.open) dialog.current.close();}, [selected]);
  function open(id) {history.replaceState(null, '', `${location.pathname}${location.search}#tip=${id}`); setSelected(id);}
  function close() {history.replaceState(null, '', `${location.pathname}${location.search}`); setSelected(null);}
  const tip = tips.find(t => t.id === selected);
  const text = a => a[en ? 1 : 0];
  return <><div className="tips-bar"><strong>Tips</strong>{(related[lesson.id] || ['modules', 'await']).map(id => {const t = tips.find(t => t.id === id);return <button key={id} onClick={() => open(id)}>{text(t.title)}</button>;})}</div>
    <dialog ref={dialog} className="tips-drawer" aria-label={en ? 'Knowledge tips' : '知识 Tips'} onCancel={close}>
      <button className="tips-close" onClick={close}>{en ? 'Close' : '关闭'} ×</button>
      {tip && <><p className="eyebrow">TIPS / {tips.indexOf(tip) + 1}</p><h2>{text(tip.title)}</h2><p>{text(tip.intro)}</p><pre>{tip.code}</pre>{tip.id === 'queues' && <QueueDemo en={en} />}<h3>{en ? 'Connect to Go' : '对照 Go'}</h3><p>{text(tip.go)}</p><h3>{en ? 'Watch out' : '容易误解的地方'}</h3><p>{text(tip.trap)}</p><p><a href={tip.url} target="_blank" rel="noreferrer">{en ? 'Official reference' : '官方参考'}</a> · <a href={`#tip=${tip.id}`}>{en ? 'Link to this tip' : '本条链接'}</a></p><nav aria-label={en ? 'All tips' : '全部 Tips'}>{tips.map(t => <button key={t.id} aria-pressed={selected === t.id} onClick={() => open(t.id)}>{text(t.title)}</button>)}</nav></>}
    </dialog></>;
}
