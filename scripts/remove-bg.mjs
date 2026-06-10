import sharp from "../node_modules/sharp/lib/index.js";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath  = join(__dirname, "../public/logo.png");
const outputPath = join(__dirname, "../public/logo.png");

const image = sharp(inputPath);
const { data, info } = await image
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const buf = Buffer.from(data);

for (let i = 0; i < buf.length; i += channels) {
  const r = buf[i];
  const g = buf[i + 1];
  const b = buf[i + 2];
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;

  if (lum < 45) {
    buf[i + 3] = 0;
  } else if (lum < 80) {
    buf[i + 3] = Math.round(((lum - 45) / 35) * 255);
  }
}

const result = await sharp(buf, {
  raw: { width, height, channels },
}).png().toBuffer();

writeFileSync(outputPath, result);
console.log("Done — fondo removido de logo.png");
