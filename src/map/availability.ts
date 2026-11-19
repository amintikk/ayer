// Which surveys have imagery where the map is looking. The IGN answers a plain white image when a
// survey does not cover an area, so we fetch one tiny 32 px image of the area around the centre per
// survey and count non-white pixels. Results are cached per tile.
import { concreteTile, lonLatToTile, SURVEYS } from '../data/layers.ts';
import { fetchRetry } from './tiles.ts';

const cache = new Map<string, boolean>();
const SIZE = 32;
let canvas: OffscreenCanvas | HTMLCanvasElement | null = null;

function ctx(): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D {
  canvas ??= typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(SIZE, SIZE) : Object.assign(document.createElement('canvas'), { width: SIZE, height: SIZE });
  return canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
}

/** Share of the image that is not blank white (0 to 1). */
async function filled(blob: Blob): Promise<number> {
  const bmp = await createImageBitmap(blob);
  const c = ctx();
  c.clearRect(0, 0, SIZE, SIZE);
  c.drawImage(bmp, 0, 0, SIZE, SIZE);
  bmp.close();
  const d = c.getImageData(0, 0, SIZE, SIZE).data;
  let n = 0;
  for (let i = 0; i < d.length; i += 4) if (d[i]! < 246 || d[i + 1]! < 246 || d[i + 2]! < 246) n++;
  return n / (SIZE * SIZE);
}

export interface Probe {
  key: string;
  zoom: number;
}

/** The tile that stands for the current view: one zoom level above, so it spans about the screen. */
export function probeFor(lon: number, lat: number, zoom: number): Probe & { x: number; y: number } {
  const z = Math.max(6, Math.min(16, Math.floor(zoom) - 1));
  const [x, y] = lonLatToTile(lon, lat, z);
  return { key: `${z}/${x}/${y}`, zoom: z, x, y };
}

/**
 * Resolve the surveys with imagery around (lon, lat). `onEach` reports results as they arrive,
 * so the time bar can fill in progressively. The current mosaic ("actual") always counts.
 */
export async function available(lon: number, lat: number, zoom: number, signal: AbortSignal, onEach?: (id: string, ok: boolean) => void): Promise<Set<string>> {
  const p = probeFor(lon, lat, zoom);
  const out = new Set<string>(['actual']);
  const todo = SURVEYS.filter((s) => s.wms);
  let i = 0;
  const worker = async () => {
    while (i < todo.length) {
      const s = todo[i++]!;
      const k = `${s.id}@${p.key}`;
      let ok = cache.get(k);
      if (ok === undefined) {
        try {
          const r = await fetchRetry(concreteTile(s, p.zoom, p.x, p.y, SIZE), signal, 3);
          ok = (await filled(await r.blob())) > 0.06;
          cache.set(k, ok);
        } catch (e) {
          if ((e as Error).name === 'AbortError') throw e;
          ok = true; // unknown: better to offer it than to hide it
        }
      }
      if (ok) out.add(s.id);
      onEach?.(s.id, ok);
    }
  };
  await Promise.all(Array.from({ length: 10 }, worker));
  return out;
}
