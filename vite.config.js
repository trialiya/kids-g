import { defineConfig } from "vite";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// Файлы из public/, которые тоже нужно положить в офлайн-кэш
const PUBLIC_FILES = ["manifest.json", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/icon.svg"];

// Собирает sw.js из src/sw.template.js: подставляет список файлов сборки и версию кэша
function serviceWorker() {
  return {
    name: "kids-g-service-worker",
    apply: "build",
    generateBundle(_, bundle) {
      const files = ["./", ...Object.keys(bundle), ...PUBLIC_FILES];
      const hash = createHash("sha1").update(Object.keys(bundle).sort().join()).digest("hex").slice(0, 8);
      const source = readFileSync(new URL("./src/sw.template.js", import.meta.url), "utf8")
        .replace("__PRECACHE__", JSON.stringify(files))
        .replace("__VERSION__", hash);
      this.emitFile({ type: "asset", fileName: "sw.js", source });
    },
  };
}

export default defineConfig({
  // Относительные пути: сайт работает и в корне, и на https://<user>.github.io/<repo>/
  base: "./",
  plugins: [serviceWorker()],
});
