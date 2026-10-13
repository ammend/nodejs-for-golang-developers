import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
function App() {
  const inputRef = useRef(null); // DOM handle / 输入框引用
  const clicks = useRef(0); // remembered without re-render / 保存但不触发重渲染
  const [snapshot, setSnapshot] = useState(0);
  return <main className="card"><h1>Ref / 小抽屉</h1>
    <input ref={inputRef} aria-label="Name / 名字" placeholder="Name / 名字" />
    <button onClick={() => inputRef.current?.focus()}>Focus / 聚焦</button>
    <button onClick={() => { clicks.current += 1; }}>Remember / 记一次</button>
    <button onClick={() => setSnapshot(clicks.current)}>Show / 显示记录</button>
    <output>{snapshot}</output>
    <p>Remember changes the ref, not the screen. Show copies it to state. / 记一次只改 ref；显示记录才把它放进 state。</p>
  </main>;
}
createRoot(document.getElementById("root")).render(<App />);
