// Coverage masks for the landing: one low-resolution GetMap of the whole country per survey.
// White (no imagery) becomes transparent, anything else opaque. Output: public/coverage/<id>.png
// (peninsula and Balearics) and public/coverage/<id>-can.png (Canary Islands). Usage: node tools/coverage-maps.ts
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { SURVEYS } from '../src/data/layers.ts';

const merc = (lon: number, lat: number) => {
  const R = 6378137;
  return [(R * lon * Math.PI) / 180, R * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))];
};
export const FRAMES = {
  main: { w: [-9.6, 35.8], e: [4.6, 44.0], width: 560 },
  can: { w: [-18.3, 27.55], e: [-13.3, 29.5], width: 240 },
};
const out = new URL('../public/coverage/', import.meta.url);
mkdirSync(out, { recursive: true });

async function get(url: string): Promise<Buffer> {
  for (let i = 0; ; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(120000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (i > 3) throw e;
      await new Promise((ok) => setTimeout(ok, 2000 * 2 ** i));
    }
  }
}

const meta: Record<string, { main: number; can: number }> = {};
for (const s of SURVEYS) {
  if (!s.wms) continue;
  meta[s.id] = { main: 0, can: 0 };
  for (const [k, f] of Object.entries(FRAMES)) {
    const [x0, y0] = merc(f.w[0]!, f.w[1]!);
    const [x1, y1] = merc(f.e[0]!, f.e[1]!);
    const h = Math.round((f.width * (y1! - y0!)) / (x1! - x0!));
    const url = `https://www.ign.es/wms/pnoa-historico?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=${s.wms}&STYLES=&CRS=EPSG:3857&BBOX=${x0},${y0},${x1},${y1}&WIDTH=${f.width}&HEIGHT=${h}&FORMAT=image/png&TRANSPARENT=TRUE`;
    const buf = await get(url);
    const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const mask = Buffer.alloc(info.width * info.height * 4);
    let on = 0;
    for (let i = 0, j = 0; i < data.length; i += 4, j += 4) {
      const white = data[i]! > 247 && data[i + 1]! > 247 && data[i + 2]! > 247;
      const a = data[i + 3]! > 20 && !white ? 255 : 0;
      if (a) on++;
      mask[j] = mask[j + 1] = mask[j + 2] = 0;
      mask[j + 3] = a;
    }
    meta[s.id]![k as 'main' | 'can'] = Math.round((on / (info.width * info.height)) * 1000) / 1000;
    await sharp(mask, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png({ compressionLevel: 9, palette: true, colours: 2 })
      .toFile(new URL(`${s.id}${k === 'can' ? '-can' : ''}.png`, out).pathname);
    console.log(s.id, k, info.width, info.height, meta[s.id]![k as 'main' | 'can']);
  }
}
writeFileSync(new URL('coverage.json', out), JSON.stringify(meta) + '\n');
await import('./land.ts');
