function parse(text) {
  const user = JSON.parse(text);
  if (typeof user.name !== "string" || !user.name)
    throw new Error("name is required");
  return user;
}
for (const text of ['{"name":"Ada"}', "{}"]) {
  try {
    console.log(parse(text).name);
  } catch (error) {
    console.log(error.message);
  }
}
