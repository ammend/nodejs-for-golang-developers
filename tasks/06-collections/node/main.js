const nums = [1, 2, 3, 4];
const out = nums.filter((n) => n % 2 === 0).map((n) => n * 2);
console.log(JSON.stringify(out));
console.log(out.reduce((sum, n) => sum + n, 0));
