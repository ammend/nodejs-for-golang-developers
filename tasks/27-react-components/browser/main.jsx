import { createRoot } from "react-dom/client";
import "./style.css";
// Component: a function returning JSX / 组件是返回 JSX 的函数
function Greeting({ name }) { // props: input from parent / 父组件传入的参数
  return <h2>Hello, {name}!</h2>;
}
function App() {
  return <main className="card">
    <h1>Components / 组件</h1>
    <Greeting name="Ada" />
    <Greeting name="Lin" />
    <p>Change a name in the editor, then Run. / 修改名字后重新运行。</p>
  </main>;
}
// Modern JSX transform: no default React import needed here.
// 本项目使用自动 JSX 转换，无须仅为 JSX 导入 React 默认对象。
createRoot(document.getElementById("root")).render(<App />);
