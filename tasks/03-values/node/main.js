const a = { name: "Ada" };
const b = { ...a };
b.name = "Grace";
console.log("original:", a.name);
const ref = a;
ref.name = "Lin";
console.log("shared:", a.name);
