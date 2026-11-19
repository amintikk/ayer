// Tile loading with retries. The IGN WMS sometimes answers 500 or times out (above all the 1956
// layer); MapLibre does not retry raster tiles, so every tile goes through the "retry" protocol.
import * as maplibregl from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';

// Vite copies the worker as an asset; tell MapLibre where it is (its own guess breaks when bundled).
maplibregl.setWorkerUrl(workerUrl);

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((ok, ko) => {
    const id = setTimeout(ok, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(id);
      ko(new DOMException('aborted', 'AbortError'));
    });
  });

/** fetch() that retries network errors and 5xx answers with backoff. */
export async function fetchRetry(url: string, signal?: AbortSignal, tries = 4): Promise<Response> {
  let last: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal, credentials: 'omit' });
      if (r.ok) return r;
      if (r.status < 500 && r.status !== 429) throw Object.assign(new Error(`HTTP ${r.status}`), { fatal: true });
      last = new Error(`HTTP ${r.status}`);
    } catch (e) {
      if ((e as Error).name === 'AbortError' || (e as { fatal?: boolean }).fatal) throw e;
      last = e;
    }
    await sleep(350 * 3 ** i + Math.random() * 200, signal);
  }
  throw last;
}

let registered = false;
/** Register once: tile URLs written as retry://host/path are fetched over the page's own scheme. */
export function registerRetryProtocol(): void {
  if (registered) return;
  registered = true;
  maplibregl.addProtocol('retry', async (params, abort) => {
    const url = params.url.replace(/^retry:\/\//, `${location.protocol}//`);
    const r = await fetchRetry(url, abort.signal);
    return { data: await r.arrayBuffer(), cacheControl: r.headers.get('Cache-Control'), expires: r.headers.get('Expires') };
  });
}
