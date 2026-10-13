import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(n => n + 1), 1000);
    return () => clearInterval(id); // cleanup / 清理外部计时器
  }, [running]); // re-sync when running changes / running 变化时重新同步
  return <main className="card"><h1>Effect / 与计时器同步</h1>
    <output>{seconds}</output>
    <button onClick={() => setRunning(r => !r)}>{running ? "Pause / 暂停" : "Start / 开始"}</button>
    <p>Pause and watch the count stop. / 暂停后计数不再变化。</p>
  </main>;
}
createRoot(document.getElementById("root")).render(<Timer />);
