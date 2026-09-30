import assert from "node:assert/strict";
function clamp(n) {
  return Math.max(0, Math.min(10, n));
}
for (const [input, want] of [
  [-2, 0],
  [5, 5],
  [12, 10],
])
  assert.equal(clamp(input), want, `clamp(${input})`);
console.log("3 checks passed");
