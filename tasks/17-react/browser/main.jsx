import { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
function Counter() {
  // count: current value; setCount: request an update; 0: initial value
  // count 是本次渲染的值；setCount 请求更新；0 是初始值
  const [count, setCount] = useState(0);
  return (
    <main className="card">
      <h1>React counter / 计数器</h1>
      <output>{count}</output>
      <button onClick={() => setCount((n) => n + 1)}>Add / 加一</button>
    </main>
  );
}
createRoot(document.getElementById("root")).render(<Counter />);
