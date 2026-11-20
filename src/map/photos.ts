// The photo layers of one MapLibre map: a raster source per survey, all added up front in
// chronological order (later surveys on top) and hidden. Only the layers in use are made
// visible: in blend mode the two being mixed plus their neighbours at opacity 0, which makes
// MapLibre download their tiles ahead of time, so the next step of the slider is ready.
// Those preloads wait until the photos on screen have loaded: the IGN draws historical tiles on
// request and slows down when many arrive at once, so what is visible must go first.
import type * as maplibregl from 'maplibre-gl';
import { SURVEYS, tileUrl, WMS_TILE, type Survey } from '../data/layers.ts';

// Deepest zoom with real detail, in 256 px tile levels (the map's own zoom). Beyond it MapLibre enlarges.
const MAXZOOM: Record<string, number> = { ams: 17, interministerial: 17, nacional: 17, olistat: 17, sigpac: 18 };
const host = () => `retry://${location.host}`;
export const LABELS_URL = '/ign/base?layer=IGNBaseOrto&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix={z}&TileCol={x}&TileRow={y}';

export function baseStyle(bg: string): maplibregl.StyleSpecification {
  return {
    version: 8,
    sources: {},
    layers: [{ id: 'bg', type: 'background', paint: { 'background-color': bg } }],
  };
}

export class Photos {
  private visible = new Map<string, number>();
  private wanted = 0;
  private preloading: Promise<void> = Promise.resolve();

  constructor(private map: maplibregl.Map) {
    for (const s of SURVEYS) {
      map.addSource(`s-${s.id}`, {
        type: 'raster',
        tiles: [tileUrl(s, host())],
        // A 512 px tile at level z covers what four 256 px tiles cover at z + 1, so its levels are one lower.
        tileSize: s.wms ? WMS_TILE : 256,
        minzoom: s.wms ? 4 : 0,
        maxzoom: (MAXZOOM[s.id] ?? 19) - (s.wms ? 1 : 0),
        bounds: [-19.5, 26.5, 5.5, 44.5],
      });
      map.addLayer({
        id: `l-${s.id}`,
        type: 'raster',
        source: `s-${s.id}`,
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 0, 'raster-fade-duration': 180, 'raster-resampling': 'linear' },
      });
    }
    map.addSource('labels', { type: 'raster', tiles: [`${host()}${LABELS_URL}`], tileSize: 256, maxzoom: 19, bounds: [-19.5, 26.5, 5.5, 44.5] });
    map.addLayer({ id: 'labels', type: 'raster', source: 'labels', layout: { visibility: 'none' }, paint: { 'raster-fade-duration': 0 } });
  }

  /**
   * Make exactly these layers visible with these opacities; everything else hidden. Layers shown
   * at opacity 0 only to preload them are held back until the map is idle (unless already showing).
   */
  private apply(want: Map<string, number>): void {
    const turn = ++this.wanted;
    const now = new Map<string, number>();
    const later: string[] = [];
    for (const [id, o] of want) (o > 0 || this.visible.has(id) ? now.set(id, o) : later.push(id));
    this.set(now);
    if (!later.length) {
      this.preloading = Promise.resolve();
      return;
    }
    this.preloading = this.idle(8000).then(() => {
      if (turn === this.wanted) this.set(want);
    });
  }

  /** Resolves when the map has finished loading what it shows (or after `timeout`). */
  private idle(timeout: number): Promise<void> {
    return new Promise((done) => {
      const finish = () => {
        clearTimeout(t);
        this.map.off('idle', finish);
        done();
      };
      const t = setTimeout(finish, timeout);
      this.map.on('idle', finish);
      this.map.triggerRepaint(); // so 'idle' fires even if nothing else changes
    });
  }

  private set(want: Map<string, number>): void {
    for (const s of SURVEYS) {
      const o = want.get(s.id);
      const was = this.visible.get(s.id);
      if (o === undefined) {
        if (was !== undefined) this.map.setLayoutProperty(`l-${s.id}`, 'visibility', 'none');
        continue;
      }
      if (was === undefined) this.map.setLayoutProperty(`l-${s.id}`, 'visibility', 'visible');
      if (was !== o) this.map.setPaintProperty(`l-${s.id}`, 'raster-opacity', o, { validate: false });
    }
    this.visible = want;
  }

  /** Blend mode: `v` is a fractional index into `items`. */
  blend(items: Survey[], v: number): void {
    if (!items.length) return;
    const i = Math.max(0, Math.min(items.length - 1, Math.floor(v)));
    const f = v - i;
    const want = new Map<string, number>();
    const pre = (k: number) => items[k] && !want.has(items[k]!.id) && want.set(items[k]!.id, 0);
    want.set(items[i]!.id, 1);
    if (items[i + 1]) want.set(items[i + 1]!.id, Math.round(f * 1000) / 1000);
    pre(i + 2);
    pre(i - 1);
    this.apply(want);
  }

  /** Curtain halves and exports: one survey, fully opaque. Optionally preload others. */
  single(id: string, preload: string[] = []): void {
    const want = new Map<string, number>([[id, 1]]);
    for (const p of preload) if (!want.has(p)) want.set(p, 0);
    this.apply(want);
  }

  labels(on: boolean): void {
    this.map.setLayoutProperty('labels', 'visibility', on ? 'visible' : 'none');
  }

  /** Resolves once the tiles of `id` for the current view are loaded (or after `timeout`). */
  async ready(id: string, timeout = 6000): Promise<void> {
    await this.preloading;
    const src = `s-${id}`;
    return new Promise((done) => {
      if (this.map.isSourceLoaded(src)) return done();
      const t = setTimeout(finish, timeout);
      const map = this.map;
      function check() {
        if (map.isSourceLoaded(src)) finish();
      }
      function finish() {
        clearTimeout(t);
        map.off('sourcedata', check);
        map.off('idle', check);
        done();
      }
      map.on('sourcedata', check);
      map.on('idle', check);
    });
  }
}
