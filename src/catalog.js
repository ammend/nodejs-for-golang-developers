export { stages, lessons } from "../curriculum.js";
const sources = import.meta.glob("../tasks/**/*", {
  query: "?raw",
  import: "default",
  eager: true,
});
export function lessonFiles(id, language) {
  const prefix = `../tasks/${id}/${language}/`;
  return Object.fromEntries(
    Object.entries(sources)
      .filter(([path]) => path.startsWith(prefix))
      .map(([path, code]) => [`/${path.slice(prefix.length)}`, { code }]),
  );
}
