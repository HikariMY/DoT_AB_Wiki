/**
 * Scans public/characters for artwork and writes a manifest the data loader
 * imports. Running this at build time keeps filesystem access out of the app
 * bundle, so a character image can be added by dropping in a file.
 */
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_ROOT = join(ROOT, "public", "characters");
const MANIFEST_PATH = join(ROOT, "src", "data", "image-manifest.json");
const SUPPORTED_EXTENSIONS = new Set([".webp", ".png", ".jpg", ".jpeg", ".avif"]);

function scan(kind) {
  const directory = join(IMAGE_ROOT, kind);
  if (!existsSync(directory)) {
    return {};
  }

  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && SUPPORTED_EXTENSIONS.has(extname(entry.name).toLowerCase()))
    .reduce((acc, entry) => {
      const slug = entry.name.slice(0, -extname(entry.name).length);
      return { ...acc, [slug]: `/characters/${kind}/${entry.name}` };
    }, {});
}

const manifest = {
  icons: scan("icons"),
  portraits: scan("portraits"),
};

writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `image manifest: ${Object.keys(manifest.icons).length} icons, ${Object.keys(manifest.portraits).length} portraits`,
);
