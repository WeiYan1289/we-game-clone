// Generates PWA icons from the WeGame share image (512×512 logo on black).
// Run: node scripts/make-icons.mjs
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, "public/images/wegame-h5-share.jpg");
const out = path.join(root, "public/icons");
const BG = { r: 11, g: 11, b: 13, alpha: 1 }; // --c-bg

await mkdir(out, { recursive: true });

const plain = (size, file) => sharp(src).resize(size, size).png().toFile(path.join(out, file));

await plain(192, "icon-192.png");
await plain(512, "icon-512.png");
await plain(180, "apple-touch-icon.png");
await plain(32, "favicon-32.png");

// Maskable: keep the logo inside the 80% safe zone so circular/squircle masks don't clip it.
const inner = await sharp(src).resize(360, 360).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: BG } })
  .composite([{ input: inner, gravity: "center" }])
  .png()
  .toFile(path.join(out, "maskable-512.png"));

console.log("Icons written to", out);
