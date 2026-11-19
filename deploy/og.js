// njs helpers for shared map links (/mapa/?lat=..&lon=..&z=..&y=..):
//  - image(): the og:image URL of the page, a preview of that exact view (/og/view?...),
//  - upstream(): the IGN request /og/view proxies to: a 1200x630 GetMap of the view.
// Unknown or out-of-range parameters fall back to the static preview image.
const SITE = 'https://ayer.aminox.dev';
const LAYERS = {
  ams: 'AMS_1956-1957',
  interministerial: 'Interministerial_1973-1986',
  nacional: 'Nacional_1981-1986',
  olistat: 'OLISTAT',
  sigpac: 'SIGPAC',
};
for (let y = 2004; y <= 2024; y++) LAYERS['pnoa' + y] = 'PNOA' + y;
LAYERS.actual = '';

function view(r) {
  const a = r.args;
  const lat = Number(a.lat);
  const lon = Number(a.lon);
  const z = a.z === undefined ? 15 : Number(a.z);
  const y = a.y || a.a || 'ams';
  if (!(lat >= 26 && lat <= 45 && lon >= -19.5 && lon <= 6 && z >= 6 && z <= 19.5)) return null;
  if (!Object.prototype.hasOwnProperty.call(LAYERS, y)) return null;
  return { lat: lat, lon: lon, z: z, y: y };
}

function image(r) {
  const v = view(r);
  if (!v) return SITE + '/og/mapa.jpg';
  return SITE + '/og/view?lat=' + v.lat.toFixed(5) + '&lon=' + v.lon.toFixed(5) + '&z=' + v.z.toFixed(1) + '&y=' + v.y;
}

function upstream(r) {
  const v = view(r);
  if (!v) return '';
  const R = 6378137;
  const res = (2 * Math.PI * R) / (256 * Math.pow(2, Math.round(v.z * 10) / 10));
  const cx = (R * v.lon * Math.PI) / 180;
  const cy = R * Math.log(Math.tan(Math.PI / 4 + (v.lat * Math.PI) / 360));
  const w = 1200 / 2;
  const h = 630 / 2;
  const bbox = [cx - w * res, cy - h * res, cx + w * res, cy + h * res].map((n) => n.toFixed(2)).join(',');
  const layer = LAYERS[v.y];
  const path = layer ? '/wms/pnoa-historico?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=' + layer : '/wms-inspire/pnoa-ma?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=OI.OrthoimageCoverage';
  return path + '&STYLES=&CRS=EPSG:3857&BBOX=' + bbox + '&WIDTH=1200&HEIGHT=630&FORMAT=image/jpeg';
}

export default { image, upstream };
