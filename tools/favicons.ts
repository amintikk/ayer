// PNG and ICO favicons from public/icon.svg. Usage: node tools/favicons.ts
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
const svg = new URL('../public/icon.svg', import.meta.url).pathname;
const out = (f: string) => new URL(`../public/${f}`, import.meta.url).pathname;
for (const [f, s] of [['icon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]] as const) {
  await sharp(svg, { density: 600 }).resize(s, s).png().toFile(out(f));
}
// ICO with one embedded 32x32 PNG.
const png = await sharp(svg, { density: 300 }).resize(32, 32).png().toBuffer();
const head = Buffer.alloc(22);
head.writeUInt16LE(0, 0);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(1, 4);
head.writeUInt8(32, 6);
head.writeUInt8(32, 7);
head.writeUInt16LE(1, 10);
head.writeUInt16LE(32, 12);
head.writeUInt32LE(png.length, 14);
head.writeUInt32LE(22, 18);
writeFileSync(out('favicon.ico'), Buffer.concat([head, png]));
