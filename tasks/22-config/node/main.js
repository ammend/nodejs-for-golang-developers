function port() {
  const raw = process.env.APP_PORT || "3000";
  const value = Number(raw);
  if (
    !/^\d+$/.test(raw) ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > 65535
  )
    throw Error("invalid port");
  return value;
}
for (const value of ["3000", "oops"]) {
  process.env.APP_PORT = value;
  try {
    console.log(port());
  } catch (error) {
    console.log(error.message);
  }
}
