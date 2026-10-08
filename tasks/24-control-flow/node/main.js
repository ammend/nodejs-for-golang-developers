const score = 75;
if (score >= 90) console.log("grade A");
else if (score >= 60) console.log("grade B");
else console.log("grade C");

switch (score >= 60) {
  case true: console.log("pass"); break;
  default: console.log("retry");
}

for (let i = 0; i < 3; i++) {
  if (i === 1) continue;
  console.log(`count ${i}`);
}
let remaining = 2;
while (remaining > 0) {
  console.log(`remaining ${remaining}`);
  remaining--;
}
// do…while runs at least once / 至少执行一次
let once = 0;
do { console.log(`once ${once}`); once++; } while (once < 0);

const names = ["Ada", "Lin"];
for (const [i, name] of names.entries()) console.log(`${i} ${name}`);
for (const name of names) {
  console.log(`first ${name}`);
  break;
}
