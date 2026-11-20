// Build-time images for the gallery, generated from the IGN services (run again to refresh them):
//   public/places/<slug>/<survey>.webp  360 px squares, one per survey with imagery at the place
//   public/places/<slug>/hero-a.webp, hero-b.webp   1600x1000, the two surveys the page compares
// Usage: node tools/make-images.ts [slug ...]
import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { byId, type Survey } from '../src/data/layers.ts';
import { PLACES, type Place } from '../src/data/places.ts';

const coverage = JSON.parse(readFileSync(new URL('../src/data/coverage.json', import.meta.url), 'utf8')) as Record<string, string[]>;
const R = 6378137;
const C = 2 * Math.PI * R;
const merc = (lon: number, lat: number): [number, number] => [(R * lon * Math.PI) / 180, R * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))];
const UA = { 'User-Agent': 'ayer.aminox.dev build (gallery images)' };

async function get(url: string): Promise<Buffer> {
  for (let i = 0; ; i++) {
    try {
      const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(90000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (i > 4) throw e;
      await new Promise((ok) => setTimeout(ok, 1500 * 2 ** i));
    }
  }
}

/** One WMS GetMap request, split into ≤512 px chunks (big requests to the 1956 layer fail with 500). */
async function wms(s: Survey, p: Place, w: number, h: number, zoom: number): Promise<Buffer> {
  const res = C / (256 * 2 ** zoom);
  const [cx, cy] = merc(p.lon, p.lat);
  const x0 = cx - (w / 2) * res;
  const y1 = cy + (h / 2) * res;
  const base = s.wms
    ? `https://www.ign.es/wms/pnoa-historico?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=${s.wms}&STYLES=`
    : 'https://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=OI.OrthoimageCoverage&STYLES=';
  const parts: { input: Buffer; left: number; top: number }[] = [];
  const step = 512;
  for (let oy = 0; oy < h; oy += step) {
    for (let ox = 0; ox < w; ox += step) {
      const cw = Math.min(step, w - ox);
      const ch = Math.min(step, h - oy);
      const bx0 = x0 + ox * res;
      const by1 = y1 - oy * res;
      const url = `${base}&CRS=EPSG:3857&BBOX=${bx0},${by1 - ch * res},${bx0 + cw * res},${by1}&WIDTH=${cw}&HEIGHT=${ch}&FORMAT=image/jpeg`;
      parts.push({ input: await get(url), left: ox, top: oy });
    }
  }
  return sharp({ create: { width: w, height: h, channels: 3, background: '#ffffff' } }).composite(parts).png().toBuffer();
}

const only = process.argv.slice(2);
for (const p of PLACES) {
  if (only.length && !only.includes(p.slug)) continue;
  const dir = new URL(`../public/places/${p.slug}/`, import.meta.url);
  mkdirSync(dir, { recursive: true });
  mkdirSync(new URL('../public/og/', import.meta.url), { recursive: true });
  const a = byId.get(p.from)!;
  const b = byId.get(p.to)!;
  const heroA = await wms(a, p, 1600, 1000, p.zoom + 0.6);
  const heroB = await wms(b, p, 1600, 1000, p.zoom + 0.6);
  await sharp(heroA).webp({ quality: 72 }).toFile(new URL('hero-a.webp', dir).pathname);
  await sharp(heroB).webp({ quality: 72 }).toFile(new URL('hero-b.webp', dir).pathname);
  // The sequence: one small square per survey available at the centre.
  for (const id of coverage[p.slug] ?? []) {
    const out = new URL(`${id}.webp`, dir).pathname;
    if (existsSync(out)) continue;
    const img = await wms(byId.get(id)!, p, 480, 480, p.zoom + 0.4);
    await sharp(img).resize(360, 360).webp({ quality: 70 }).toFile(out);
  }
  console.log('ok', p.slug);
}

// Smaller copies of the comparison images for phones (srcset), from the files above.
for (const p of PLACES) {
  if (only.length && !only.includes(p.slug)) continue;
  for (const k of ['a', 'b']) {
    const src = new URL(`../public/places/${p.slug}/hero-${k}.webp`, import.meta.url).pathname;
    await sharp(src).resize(800, 500).webp({ quality: 70 }).toFile(src.replace('.webp', '-800.webp'));
  }
}

await import('./og-cards.ts');
