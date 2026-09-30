import "./style.css";
document.querySelector("#root").innerHTML =
  '<div class="card"><h1>Counter / 计数器</h1><output id="count">0</output><button id="add">Add / 加一</button></div>';
let count = 0;
document.querySelector("#add").addEventListener("click", () => {
  count += 1;
  document.querySelector("#count").textContent = String(count);
});
