// Runs inside the runner's timed child process and temporary working directory.
import { build, stop } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
const [mode, entry] = process.argv.slice(2);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
try {
  if (mode === "browser") {
    const result = await build({
      entryPoints: [entry],
      outfile: "bundle.js",
      bundle: true,
      write: false,
      platform: "browser",
      format: "iife",
      jsx: "automatic",
      minify: true,
      define: { "process.env.NODE_ENV": '"production"' },
      nodePaths: [path.join(root, "node_modules")],
    });
    const js =
      result.outputFiles.find((file) => file.path.endsWith(".js"))?.text || "";
    const css =
      result.outputFiles.find((file) => file.path.endsWith(".css"))?.text || "";
    const html = await readFile("index.html", "utf8");
    await writeFile(
      "preview.html",
      html +
        `<style>${css.replace(/<\/style/gi, "<\\/style")}</style><script>${js.replace(/<\/script/gi, "<\\/script")}</script>`,
    );
    console.log("Preview built. Interact with the page below.");
  } else {
    await build({
      entryPoints: [entry],
      outfile: ".compiled.mjs",
      bundle: true,
      platform: "node",
      format: "esm",
      target: "node22",
    });
    stop();
    await import(pathToFileURL(path.resolve(".compiled.mjs")).href);
  }
} finally {
  stop();
}
