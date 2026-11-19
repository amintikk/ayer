// Every aerial survey the map can show, oldest first. `year` places it on the time slider;
// `label` is what people read. Historic layers come from the IGN WMS "pnoa-historico"; the
// latest one is the PNOA-MA WMTS (the most recent mosaic, refreshed by the IGN every year).
export interface Survey {
  id: string;
  /** WMS layer name, or '' for the current WMTS mosaic. */
  wms: string;
  year: number;
  label: string;
  /** Name as in the IGN product table, used in the attribution line. */
  product: string;
  /** Short note shown under the slider; Spanish source text, translated with t(). */
  note: string;
  /** Coverage is national, partial, or national without the Canary Islands. */
  scope: 'national' | 'partial' | 'peninsula';
}

const pnoa = (y: number): Survey => ({
  id: `pnoa${y}`,
  wms: `PNOA${y}`,
  year: y,
  label: String(y),
  product: `PNOA ${y}`,
  note: 'Plan Nacional de Ortofotografía Aérea. Cada año se vuela solo una parte del país.',
  scope: 'partial',
});

export const SURVEYS: Survey[] = [
  {
    id: 'ams',
    wms: 'AMS_1956-1957',
    year: 1956,
    label: '1956',
    product: 'Vuelo Americano Serie B 1956-1957',
    note: 'Vuelo Americano, serie B (1956-1957). Blanco y negro, península y Baleares.',
    scope: 'peninsula',
  },
  {
    id: 'interministerial',
    wms: 'Interministerial_1973-1986',
    year: 1977,
    label: '1973–86',
    product: 'Vuelo Interministerial 1973-1986',
    note: 'Vuelo Interministerial (1973-1986). Cobertura parcial.',
    scope: 'partial',
  },
  {
    id: 'nacional',
    wms: 'Nacional_1981-1986',
    year: 1984,
    label: '1981–86',
    product: 'Vuelo Nacional 1981-1986',
    note: 'Vuelo Nacional (1981-1986). Cobertura parcial.',
    scope: 'partial',
  },
  {
    id: 'olistat',
    wms: 'OLISTAT',
    year: 1997,
    label: '1997–98',
    product: 'OLISTAT 1997-1998',
    note: 'Vuelo OLISTAT (1997-1998), hecho para el olivar. Cobertura parcial.',
    scope: 'partial',
  },
  {
    id: 'sigpac',
    wms: 'SIGPAC',
    year: 2000,
    label: '1997–2003',
    product: 'SIGPAC 1997-2003',
    note: 'Ortofotos del SIGPAC (1997-2003), hechas para las ayudas agrarias. Casi todo el país.',
    scope: 'national',
  },
  ...[2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024].map(pnoa),
  {
    id: 'actual',
    wms: '',
    year: 2026,
    label: 'Hoy',
    product: 'PNOA máxima actualidad',
    note: 'El mosaico más reciente del PNOA: la última foto de cada zona.',
    scope: 'national',
  },
];

export const byId = new Map(SURVEYS.map((s) => [s.id, s]));

/** Same-origin proxy paths (nginx caches them); see deploy/nginx.conf. */
export const PROXY = {
  wms: '/ign/wms',
  wmts: '/ign/wmts',
};

/** Tile URL template for MapLibre. {bbox-epsg-3857} is filled in by MapLibre for WMS. */
export function tileUrl(s: Survey, origin = ''): string {
  if (!s.wms) {
    return `${origin}${PROXY.wmts}?layer=OI.OrthoimageCoverage&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/jpeg&TileMatrix={z}&TileCol={x}&TileRow={y}`;
  }
  return `${origin}${PROXY.wms}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=${s.wms}&STYLES=&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/jpeg`;
}

/** Web Mercator bounds of tile z/x/y, as "minx,miny,maxx,maxy". */
export function tileBbox(z: number, x: number, y: number): string {
  const R = 20037508.342789244;
  const s = (2 * R) / 2 ** z;
  return [-R + x * s, R - (y + 1) * s, -R + (x + 1) * s, R - y * s].join(',');
}

export function lonLatToTile(lon: number, lat: number, z: number): [number, number] {
  const n = 2 ** z;
  const x = Math.floor(((lon + 180) / 360) * n);
  const r = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n);
  return [Math.min(n - 1, Math.max(0, x)), Math.min(n - 1, Math.max(0, y))];
}

/** One concrete tile URL (used for probes and for the export renderer). */
export function concreteTile(s: Survey, z: number, x: number, y: number, size = 256, origin = ''): string {
  if (!s.wms) return tileUrl(s, origin).replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y));
  return tileUrl(s, origin)
    .replace('{bbox-epsg-3857}', tileBbox(z, x, y))
    .replace('WIDTH=256&HEIGHT=256', `WIDTH=${size}&HEIGHT=${size}`);
}
