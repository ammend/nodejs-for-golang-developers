type User = { name: string };
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string"
  );
}
const input: unknown = JSON.parse('{"name":"Ada"}');
if (!isUser(input)) throw new Error("invalid user");
console.log("hello", input.name);
