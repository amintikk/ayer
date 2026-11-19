// Build-time images for the gallery, generated from the IGN services (run again to refresh them):
//   public/places/<slug>/<survey>.webp  360 px squares, one per survey with imagery at the place
//   public/places/<slug>/hero-a.webp, hero-b.webp   1600x1000, the two surveys the page compares
//   public/og/<slug>.jpg   1200x630 Open Graph card: oldest on the left, today on the right
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
  // Open Graph: two halves of the same 1200x630 frame, a thin rule between them.
  const half = async (img: Buffer, left: boolean) =>
    sharp(img).resize(1200, 750, { fit: 'cover' }).extract({ left: left ? 0 : 600, top: 60, width: 600, height: 630 }).toBuffer();
  const label = (txt: string, x: number) =>
    Buffer.from(
      `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect x="${x}" y="540" width="${txt.length * 26 + 44}" height="64" fill="#14120f" fill-opacity="0.82"/><text x="${x + 22}" y="584" font-family="Georgia, serif" font-size="40" fill="#f4f0e6">${txt}</text></svg>`,
    );
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#14120f' } })
    .composite([
      { input: await half(heroA, true), left: 0, top: 0 },
      { input: await half(heroB, false), left: 600, top: 0 },
      { input: Buffer.from('<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect x="598" y="0" width="4" height="630" fill="#f4f0e6"/></svg>'), left: 0, top: 0 },
      { input: label(a.label, 28), left: 0, top: 0 },
      { input: label(b.label === 'Hoy' ? 'Hoy' : b.label, 628), left: 0, top: 0 },
    ])
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(new URL(`../public/og/${p.slug}.jpg`, import.meta.url).pathname);
  // The sequence: one small square per survey available at the centre.
  for (const id of coverage[p.slug] ?? []) {
    const out = new URL(`${id}.webp`, dir).pathname;
    if (existsSync(out)) continue;
    const img = await wms(byId.get(id)!, p, 480, 480, p.zoom + 0.4);
    await sharp(img).resize(360, 360).webp({ quality: 70 }).toFile(out);
  }
  console.log('ok', p.slug);
}
