// Land silhouettes for the coverage maps: union of every survey mask in public/coverage/.
// Run after tools/coverage-maps.ts (which calls it at the end).
import sharp from 'sharp';
import { SURVEYS } from '../src/data/layers.ts';

const dir = new URL('../public/coverage/', import.meta.url);
for (const suffix of ['', '-can']) {
  let acc: Buffer | null = null;
  let w = 0;
  let h = 0;
  for (const s of SURVEYS) {
    if (!s.wms) continue;
    const { data, info } = await sharp(new URL(`${s.id}${suffix}.png`, dir).pathname).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    w = info.width;
    h = info.height;
    acc ??= Buffer.alloc(data.length);
    for (let i = 3; i < data.length; i += 4) if (data[i]! > 0) acc[i] = 255;
  }
  await sharp(acc!, { raw: { width: w, height: h, channels: 4 } }).png({ compressionLevel: 9, palette: true, colours: 2 }).toFile(new URL(`land${suffix}.png`, dir).pathname);
  console.log('land' + suffix, w, h);
}
