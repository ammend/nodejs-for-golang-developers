import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
const names = ["Ada", "Alan", "Grace", "Lin"];
function App() {
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  const visible = useMemo(() => names.filter(name =>
    name.toLowerCase().includes(query.toLowerCase())
  ), [query]); // cache until query changes / query 变化时重新计算
  // For four names this optimization is unnecessary; remove useMemo and results stay identical.
  // 只有四个名字不需要优化；直接 filter 也能得到同样结果。
  return <main className="card" style={{background:dark ? "#203744" : "white", color:dark ? "white" : "#203744"}}>
    <h1>Memo / 缓存计算结果</h1>
    <input aria-label="Search / 搜索" value={query} onChange={e => setQuery(e.target.value)} />
    <button onClick={() => setDark(v => !v)}>Theme / 切换主题</button>
    <ul>{visible.map(name => <li key={name}>{name}</li>)}</ul>
    <p>Changing theme does not change the filter dependency. / 主题变化不改变筛选依赖。</p>
  </main>;
}
createRoot(document.getElementById("root")).render(<App />);
