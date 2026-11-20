// Open Graph cards (1200x630) from the gallery comparison images: oldest survey on the left,
// today on the right, survey labels, fiducial marks and the site's name. No IGN requests.
// Usage: node tools/og-cards.ts   (run after tools/make-images.ts)
import sharp from 'sharp';
import { byId } from '../src/data/layers.ts';
import { PLACES } from '../src/data/places.ts';

const W = 1200;
const H = 630;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const mono = "'Courier Prime', 'Nimbus Mono PS', 'Courier New', monospace";

function overlay(a: string, b: string, name: string): Buffer {
  const fid = (x: number, y: number, dx: number, dy: number) => `M${x + dx * 26} ${y}H${x}V${y + dy * 26}`;
  const i = 18;
  const label = (txt: string, x: number) =>
    `<rect x="${x}" y="532" width="${txt.length * 24 + 32}" height="56" fill="#0c0c0c" fill-opacity="0.82"/><text x="${x + 16}" y="571" font-family="${mono}" font-weight="700" font-size="38" fill="#f7f6f2">${esc(txt)}</text>`;
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect x="598" y="0" width="4" height="${H}" fill="#f7f6f2"/>
    <path d="${fid(i, i, 1, 1)} ${fid(W - i, i, -1, 1)} ${fid(i, H - i, 1, -1)} ${fid(W - i, H - i, -1, -1)}" fill="none" stroke="#f7f6f2" stroke-width="3" stroke-opacity="0.9"/>
    <rect x="40" y="40" width="${name.length * 12 + 136}" height="42" fill="#0c0c0c" fill-opacity="0.82"/>
    <text x="56" y="69" font-family="Jost, 'DejaVu Sans', sans-serif" font-weight="700" font-size="20" letter-spacing="5" fill="#f7f6f2">AYER</text>
    <text x="152" y="68" font-family="${mono}" font-size="20" fill="#e6d3ab">${esc(name.toUpperCase())}</text>
    ${label(a, 40)}${label(b, 640)}
  </svg>`);
}

for (const p of PLACES) {
  const dir = new URL(`../public/places/${p.slug}/`, import.meta.url).pathname;
  const half = async (f: string, left: boolean) =>
    sharp(dir + f).resize(1200, 750, { fit: 'cover' }).extract({ left: left ? 0 : 600, top: 60, width: 600, height: 630 }).toBuffer();
  const a = byId.get(p.from)!.label;
  const b = byId.get(p.to)!.label === 'Hoy' ? 'HOY' : byId.get(p.to)!.label;
  await sharp({ create: { width: W, height: H, channels: 3, background: '#151515' } })
    .composite([
      { input: await half('hero-a.webp', true), left: 0, top: 0 },
      { input: await half('hero-b.webp', false), left: 600, top: 0 },
      { input: overlay(a, b, p.name), left: 0, top: 0 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(new URL(`../public/og/${p.slug}.jpg`, import.meta.url).pathname);
}
await sharp(new URL('../public/og/benidorm.jpg', import.meta.url).pathname).toFile(new URL('../public/og/mapa.jpg', import.meta.url).pathname);
console.log(`${PLACES.length} tarjetas`);
