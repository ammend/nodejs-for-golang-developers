console.log("start");
const work = Promise.resolve().then(() => console.log("work"));
await work;
console.log("end");
