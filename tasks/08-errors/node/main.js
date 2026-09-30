async function divide(n) {
  if (n === 0) throw new Error("division by zero");
  return 12 / n;
}
for (const n of [3, 0, 2]) {
  try {
    console.log(await divide(n));
  } catch (error) {
    console.log(error.message);
  }
}
