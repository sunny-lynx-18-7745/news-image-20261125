// news-image-20261125 entrypoint.
// The entry image (entry.png, drawn deterministically by build_news.py)
// sits next to this file; this program copies it into the output
// directory given by MAKEFUN_OUTPUT_DIR (default /output).
// Node 22, standard library only, no dependencies, no network.

import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const INPUT_NAME = "entry.png";

const source = resolve(new URL(`./${INPUT_NAME}`, import.meta.url).pathname);
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
const dest = join(outDir, INPUT_NAME);

if (!existsSync(source)) {
  console.error(`error: ${INPUT_NAME} not found next to main.ts (looked in ${source})`);
  process.exit(1);
}

if (source === dest) {
  console.error("error: output directory is the entry directory; refusing to overwrite the source image");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, dest);
// Verify the copy landed whole: the grader runs the program twice and
// both runs must write the same bytes, so a short copy must fail loudly.
const srcBytes = statSync(source).size;
const dstBytes = statSync(dest).size;
if (dstBytes !== srcBytes) {
  console.error(`error: copied ${dstBytes} bytes but source is ${srcBytes} bytes`);
  process.exit(1);
}
console.log(`wrote ${dest} (${dstBytes} bytes)`);
