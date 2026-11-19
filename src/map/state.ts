// The view lives in the query string so that links can be shared and the server can build a
// preview image for them: ?lat&lon&z, the survey shown (y) or the two compared (a, b, m=cortina).
export interface View {
  lat: number;
  lon: number;
  z: number;
  y: string;
  a: string;
  b: string;
  curtain: boolean;
  q?: string;
}

export const DEFAULT: View = { lat: 40.2, lon: -3.6, z: 5.4, y: 'ams', a: 'ams', b: 'actual', curtain: false };

const num = (v: string | null, min: number, max: number): number | null => {
  if (v === null || v.trim() === '') return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};

export function parse(search: string, ids: Set<string>): View {
  const p = new URLSearchParams(search);
  const lat = num(p.get('lat'), 26, 45);
  const lon = num(p.get('lon'), -19.5, 6);
  const z = num(p.get('z'), 4, 20);
  const id = (k: string, d: string) => {
    const v = p.get(k);
    return v && ids.has(v) ? v : d;
  };
  const v: View = {
    lat: lat ?? DEFAULT.lat,
    lon: lon ?? DEFAULT.lon,
    z: lat !== null && lon !== null ? (z ?? 15) : DEFAULT.z,
    y: id('y', DEFAULT.y),
    a: id('a', DEFAULT.a),
    b: id('b', DEFAULT.b),
    curtain: p.get('m') === 'cortina',
  };
  // Without a place, the country overview looks best with today's mosaic.
  if (lat === null || lon === null) v.y = p.get('y') && ids.has(p.get('y')!) ? v.y : 'actual';
  const q = p.get('q')?.trim();
  if (q) v.q = q.slice(0, 120);
  if (!p.has('y') && p.has('a')) v.y = v.a;
  return v;
}

export function serialize(v: View): string {
  const p = new URLSearchParams();
  p.set('lat', v.lat.toFixed(5));
  p.set('lon', v.lon.toFixed(5));
  p.set('z', v.z.toFixed(2).replace(/\.?0+$/, ''));
  if (v.curtain) {
    p.set('a', v.a);
    p.set('b', v.b);
    p.set('m', 'cortina');
  } else p.set('y', v.y);
  return `?${p.toString()}`;
}
