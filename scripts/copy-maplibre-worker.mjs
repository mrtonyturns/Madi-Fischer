/**
 * Copies MapLibre's web-worker files into public/, unrenamed.
 *
 * MapLibre 6 ships its worker as an ES module that imports its sibling by a
 * relative path: `import … from "./maplibre-gl-shared.mjs"`. When the bundler
 * emits those two files it gives each a content hash, so the worker's import
 * points at a filename that doesn't exist, the worker dies on start, and the
 * map draws no tiles — silently, because the failure is inside the worker.
 *
 * Serving the pair from public/ under their real names keeps that relative
 * import intact. components/area-map.tsx points MapLibre at the copy with
 * setWorkerUrl(). The folder is versioned so a MapLibre upgrade can never be
 * served a stale worker, and it is gitignored: this script regenerates it
 * before every `dev` and `build`.
 */
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const pkgPath = require.resolve("maplibre-gl/package.json");
const { version } = JSON.parse(readFileSync(pkgPath, "utf8"));
const dist = join(dirname(pkgPath), "dist");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "maplibre", version);
mkdirSync(out, { recursive: true });

for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(join(dist, file), join(out, file));
}

console.log(`maplibre-gl ${version} worker → public/maplibre/${version}/`);
