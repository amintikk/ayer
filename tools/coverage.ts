// Probe which surveys have imagery at a point: one 64 px tile at zoom 14 (or the given zoom) per survey.
// Usage: node tools/coverage.ts lon lat [zoom]   or   node tools/coverage.ts --places (writes src/data/coverage.json)
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { SURVEYS, concreteTile, lonLatToTile, type Survey } from '../src/data/layers.ts';
import { PLACES } from '../src/data/places.ts';

const ORIGIN = 'https://www.ign.es';
const direct = (u: string) => u.replace('/ign/wms', '/wms/pnoa-historico').replace('/ign/wmts', '/wmts/pnoa-ma');

async function fetchRetry(url: string, tries = 4): Promise<Buffer> {
  for (let i = 0; ; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(45000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (i >= tries - 1) throw e;
      await new Promise((ok) => setTimeout(ok, 800 * 2 ** i));
    }
  }
}

/** Fraction of non-white pixels (0 = empty). */
export async function filled(s: Survey, lon: number, lat: number, z: number): Promise<number> {
  const [x, y] = lonLatToTile(lon, lat, z);
  const size = s.wms ? 64 : 256;
  const buf = await fetchRetry(direct(concreteTile(s, z, x, y, size, ORIGIN)));
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let n = 0;
  for (let i = 0; i < data.length; i += info.channels) if (data[i]! < 248 || data[i + 1]! < 248 || data[i + 2]! < 248) n++;
  return n / (info.width * info.height);
}

async function point(lon: number, lat: number, z: number): Promise<string[]> {
  const out: string[] = [];
  for (const s of SURVEYS) {
    try {
      const f = await filled(s, lon, lat, z);
      if (f > 0.15) out.push(s.id);
    } catch (e) {
      console.error(`  ${s.id}: ${(e as Error).message}`);
    }
  }
  return out;
}

if (process.argv[2] === '--places') {
  const res: Record<string, string[]> = {};
  for (const p of PLACES) {
    res[p.slug] = await point(p.lon, p.lat, 14);
    console.log(p.slug, res[p.slug]!.join(' '));
  }
  writeFileSync(new URL('../src/data/coverage.json', import.meta.url), JSON.stringify(res, null, 1) + '\n');
} else if (process.argv[2]) {
  const [lon, lat, z] = process.argv.slice(2).map(Number);
  console.log((await point(lon!, lat!, z || 14)).join(' '));
}
