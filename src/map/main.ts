import '@fontsource-variable/jost';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import * as maplibregl from 'maplibre-gl';
import { SURVEYS, type Survey } from '../data/layers.ts';
import { paths, t } from '../i18n.ts';
import { initConsent, track } from '../ui/consent.ts';
import { hydrateIcons, icon, sep, type IconName } from '../ui/icons.ts';
import { isDark, setTheme } from '../ui/theme.ts';
import { available, probeFor } from './availability.ts';
import { Curtain } from './curtain.ts';
import { ExportSheet } from './sheets.ts';
import { ShareSheet } from './sheets.ts';
import { baseStyle, Photos } from './photos.ts';
import { placeName, SearchBox, type Place } from './search.ts';
import { parse, serialize, type View } from './state.ts';
import { registerRetryProtocol } from './tiles.ts';
import { Timeline } from './timeline.ts';

(window as unknown as { ayerReady?: boolean }).ayerReady = true;
const ids = new Set(SURVEYS.map((s) => s.id));
const view: View = parse(location.search, ids);
const label = (s: Survey) => (s.label === 'Hoy' ? t('Hoy') : s.label);
const bg = () => (isDark() ? '#1a1b1d' : '#e4e1d8');
const LOW_ZOOM = 7;

registerRetryProtocol();

// ---------- DOM ----------
const app = document.getElementById('app')!;
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', html = ''): HTMLElementTagNameMap[K] => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};
const btn = (name: IconName, title: string, cls = 'icon-btn glass'): HTMLButtonElement => {
  const b = el('button', cls);
  b.type = 'button';
  b.setAttribute('aria-label', title);
  b.title = title;
  b.append(icon(name, 19));
  return b;
};

const top = el('div', 'topbar');
const brand = el('a', 'brand-mini', `<img src="/icon.svg" width="30" height="30" alt="" /><span>Ayer</span>`);
brand.href = paths.home;
brand.setAttribute('aria-label', t('Ayer, inicio'));
const search = new SearchBox((p) => goTo(p));
const tools = el('div', 'top-tools');
const bLabels = btn('type', t('Nombres de calles y lugares'));
bLabels.setAttribute('aria-pressed', 'false');
const bLocate = btn('locate', t('Ir a mi ubicación'));
const bTheme = btn(isDark() ? 'sun' : 'moon', t('Cambiar tema'));
tools.append(bLabels, bLocate, bTheme);
top.append(brand, search.el, tools);

const zoomCtl = el('div', 'zoom glass');
const bIn = btn('plus', t('Acercar'), 'icon-btn');
const bOut = btn('minus', t('Alejar'), 'icon-btn');
zoomCtl.append(bIn, bOut);

const hint = el('div', 'hint');
hint.setAttribute('role', 'status');
hint.setAttribute('aria-live', 'polite');

const panel = el('section', 'panel');
panel.setAttribute('aria-label', t('Línea del tiempo'));
const head = el('div', 'panel-head');
const when = el('div', 'when');
const year = el('div', 'when-year');
const note = el('div', 'when-note');
when.append(year, note);
const acts = el('div', 'panel-actions');
const bPlay = btn('play', t('Reproducir'), 'icon-btn play');
const seg = el('div', 'seg');
seg.setAttribute('role', 'group');
seg.setAttribute('aria-label', t('Modo de comparación'));
const sFade = el('button', 'seg-btn');
const sCurtain = el('button', 'seg-btn');
sFade.type = sCurtain.type = 'button';
sFade.append(icon('blend', 17), el('span', '', t('Fundido')));
sCurtain.append(icon('columns', 17), el('span', '', t('Cortina')));
seg.append(sFade, sCurtain);
const bShare = btn('share', t('Compartir'), 'icon-btn');
const bExport = btn('film', t('Crear vídeo o GIF'), 'icon-btn');
acts.append(seg, bPlay, bShare, bExport);
head.append(when, acts);
const timeline = new Timeline({
  onValue: (v) => onBlend(v),
  onPair: () => onPair(),
  onGrab: () => stop(),
});
const attr = el('p', 'attr');
panel.append(head, timeline.el, attr);

const mapEl = document.getElementById('map')!;
const stage = el('div', 'stage');
mapEl.replaceWith(stage);
stage.append(mapEl);
app.append(top, zoomCtl, hint, panel);

// ---------- Map ----------
// MapLibre needs WebGL2; without it, say so instead of leaving an empty page.
if (!document.createElement('canvas').getContext('webgl2')) {
  const box = el('div', 'nogl');
  box.innerHTML = `<h1>${t('Tu navegador no puede mostrar el mapa')}</h1><p>${t('El mapa necesita WebGL2. Actívalo o prueba con otro navegador. Mientras tanto, puedes ver la galería de lugares.')}</p>`;
  const a = Object.assign(el('a', 'btn', t('Ver la galería')), { href: paths.places });
  box.append(a);
  app.replaceChildren(box);
  throw new Error('WebGL2 not available');
}
const map = new maplibregl.Map({
  container: mapEl,
  style: baseStyle(bg()),
  center: [view.lon, view.lat],
  zoom: view.z,
  minZoom: 4.5,
  maxZoom: 19.5,
  maxBounds: [
    [-26, 24],
    [12, 47],
  ],
  attributionControl: false,
  dragRotate: false,
  pitchWithRotate: false,
  touchPitch: false,
  fadeDuration: 0,
  cooperativeGestures: false,
});
map.touchZoomRotate.disableRotation();
map.keyboard.disableRotation();

let photos: Photos;
let items: Survey[] = SURVEYS;
let curtain: Curtain | null = null;
let labels = false;
let pin: maplibregl.Marker | null = null;
let placeTitle = '';
/** After a search, start at the oldest photo of the new place once its surveys are known. */
let jumpOldest = false;

// ---------- State ----------
function current(): Survey {
  return items[Math.round(timeline.value)] ?? items[0]!;
}

function syncUrl(): void {
  const c = map.getCenter();
  view.lat = c.lat;
  view.lon = c.lng;
  view.z = map.getZoom();
  if (view.curtain) {
    view.a = items[timeline.pair[0]]!.id;
    view.b = items[timeline.pair[1]]!.id;
  } else view.y = current().id;
  history.replaceState(null, '', serialize(view));
}

function setWhen(): void {
  if (view.curtain) {
    const [a, b] = timeline.pair;
    year.innerHTML = '';
    year.append(el('span', '', label(items[a]!)), icon('arrowRight', 22), el('span', '', label(items[b]!)));
    note.textContent = t('Arrastra la línea del mapa para comparar.');
  } else {
    const s = current();
    year.textContent = label(s);
    note.textContent = t(s.note);
  }
  const shown = view.curtain ? [items[timeline.pair[0]]!, items[timeline.pair[1]]!] : [items[Math.floor(timeline.value)]!, items[Math.ceil(timeline.value)]!];
  const prods = [...new Set(shown.filter(Boolean).map((s) => s.product))];
  attr.innerHTML = '';
  attr.append(
    document.createTextNode(`${t('Fotos')}: `),
    ...prods.flatMap((x, i) => (i ? [sep(), document.createTextNode(x)] : [document.createTextNode(x)])),
    document.createTextNode(' '),
    Object.assign(el('a', '', 'CC-BY 4.0 scne.es'), { href: 'https://www.scne.es', target: '_blank', rel: 'noopener' }),
    sep(),
    document.createTextNode('Instituto Geográfico Nacional'),
    sep(),
    Object.assign(el('a', '', t('Créditos')), { href: paths.credits }),
  );
}

function onBlend(v: number): void {
  if (!photos || view.curtain) return;
  photos.blend(items, v);
  setWhen();
  if (Number.isInteger(v)) syncUrl();
}

function onPair(): void {
  if (!photos || !view.curtain) return;
  const [a, b] = timeline.pair;
  photos.single(items[a]!.id, [items[a + 1]?.id, items[a - 1]?.id].filter(Boolean) as string[]);
  void curtain?.show(items[b]!.id, label(items[a]!), label(items[b]!));
  setWhen();
  syncUrl();
}

function setMode(c: boolean): void {
  stop();
  view.curtain = c;
  sFade.setAttribute('aria-pressed', String(!c));
  sCurtain.setAttribute('aria-pressed', String(c));
  timeline.setMode(c ? 'curtain' : 'fade');
  app.classList.toggle('is-curtain', c);
  if (c) {
    curtain ??= new Curtain(stage, map, bg(), labels);
    // Start from what was on screen: the current survey on the left, the newest on the right.
    const i = Math.round(timeline.value);
    const j = items.length - 1;
    timeline.setPair(i === j ? Math.max(0, j - 1) : i, j);
  } else {
    curtain?.destroy();
    curtain = null;
    void timeline.setValue(timeline.pair[0]);
  }
  setWhen();
  syncUrl();
}

let hintTimer = 0;
function say(text: string, ms = 0): void {
  clearTimeout(hintTimer);
  hint.textContent = text;
  hint.classList.toggle('show', !!text);
  if (ms) hintTimer = window.setTimeout(() => hint.classList.remove('show'), ms);
}

// ---------- Which surveys exist here ----------
let probeKey = '';
let probeCtl: AbortController | null = null;
async function refreshAvailability(): Promise<void> {
  const c = map.getCenter();
  const z = map.getZoom();
  if (z < LOW_ZOOM) {
    probeKey = 'low';
    applyItems(SURVEYS);
    say(t('Busca un lugar o acércate para ver qué años tienen foto.'));
    return;
  }
  const key = probeFor(c.lng, c.lat, z).key;
  if (key === probeKey) return;
  probeKey = key;
  probeCtl?.abort();
  const ctl = (probeCtl = new AbortController());
  panel.classList.add('probing');
  bPlay.disabled = bExport.disabled = true;
  say(t('Buscando qué años tienen foto aquí…'));
  try {
    const set = await available(c.lng, c.lat, z, ctl.signal, (id, ok) => timeline.mark(id, ok));
    if (ctl.signal.aborted) return;
    applyItems(SURVEYS.filter((s) => set.has(s.id)));
    if (jumpOldest && !view.curtain) {
      jumpOldest = false;
      void timeline.setValue(0, 700);
    }
    const first = items[0]!;
    say(items.length > 1 ? t('{n} vuelos con foto aquí, desde {y}.', { n: items.length, y: label(first) }) : t('Aquí solo hay foto actual.'), 3200);
  } catch (e) {
    if ((e as Error).name !== 'AbortError') say(t('El IGN tarda en responder. Inténtalo en un momento.'), 4000);
  } finally {
    if (probeCtl === ctl) {
      panel.classList.remove('probing');
      bPlay.disabled = bExport.disabled = items.length < 2;
    }
  }
}

function applyItems(next: Survey[]): void {
  const same = next.length === items.length && next.every((s, i) => s === items[i]);
  if (same && timeline.n) return;
  const keep = view.curtain ? { a: items[timeline.pair[0]]?.id ?? view.a, b: items[timeline.pair[1]]?.id ?? view.b } : { y: current()?.id ?? view.y };
  items = next;
  timeline.setItems(items, { y: keep.y ?? view.y, a: keep.a ?? view.a, b: keep.b ?? view.b });
  if (view.curtain) onPair();
  else onBlend(timeline.value);
  bPlay.disabled = items.length < 2;
  bExport.disabled = items.length < 2;
}

// ---------- Timelapse ----------
let playing = false;
const sleep = (ms: number) => new Promise((ok) => setTimeout(ok, ms));
async function play(): Promise<void> {
  if (playing) return stop();
  if (view.curtain) setMode(false);
  if (items.length < 2) return;
  playing = true;
  app.classList.add('playing');
  bPlay.replaceChildren(icon('pause', 19));
  bPlay.setAttribute('aria-label', t('Pausa'));
  track('timelapse_play', { surveys: items.length });
  if (Math.round(timeline.value) >= items.length - 1) {
    await timeline.setValue(0, 500);
    await photos.ready(items[0]!.id, 5000);
  }
  while (playing && Math.round(timeline.value) < items.length - 1) {
    const i = Math.round(timeline.value);
    await Promise.all([photos.ready(items[i + 1]!.id, 7000), sleep(900)]);
    if (!playing) break;
    await timeline.setValue(i + 1, 1100);
  }
  stop();
}
function stop(): void {
  if (!playing) return;
  playing = false;
  app.classList.remove('playing');
  bPlay.replaceChildren(icon('play', 19));
  bPlay.setAttribute('aria-label', t('Reproducir'));
}

// ---------- Search, location ----------
function goTo(p: Place): void {
  stop();
  placeTitle = p.short;
  jumpOldest = true;
  pin?.remove();
  const m = el('div', 'pin');
  m.append(icon('pin', 30));
  pin = new maplibregl.Marker({ element: m, anchor: 'bottom' }).setLngLat([p.lon, p.lat]).addTo(map);
  m.addEventListener('click', () => {
    pin?.remove();
    pin = null;
  });
  if (p.bbox && (p.bbox[2] - p.bbox[0] > 0.004 || p.bbox[3] - p.bbox[1] > 0.004)) {
    map.fitBounds(
      [
        [p.bbox[0], p.bbox[1]],
        [p.bbox[2], p.bbox[3]],
      ],
      { padding: { top: 90, bottom: panel.offsetHeight + 30, left: 40, right: 40 }, maxZoom: 16.5, duration: 2600, essential: true },
    );
  } else map.flyTo({ center: [p.lon, p.lat], zoom: 16.5, duration: 2600, essential: true, padding: { top: 0, bottom: panel.offsetHeight / 2, left: 0, right: 0 } });
  track('search', { place: p.short });
}

bLocate.addEventListener('click', () => {
  if (!navigator.geolocation) return say(t('Tu navegador no permite saber tu ubicación.'), 3500);
  bLocate.classList.add('busy');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      bLocate.classList.remove('busy');
      const { longitude: lon, latitude: lat } = pos.coords;
      if (lon < -19.5 || lon > 5.5 || lat < 26.5 || lat > 44.5) return say(t('Estás fuera de España: las fotos del IGN solo cubren España.'), 4500);
      goTo({ label: '', short: '', lon, lat });
    },
    () => {
      bLocate.classList.remove('busy');
      say(t('No pudimos obtener tu ubicación.'), 3500);
    },
    { enableHighAccuracy: true, timeout: 10000 },
  );
});

// ---------- Buttons ----------
bIn.addEventListener('click', () => map.zoomIn());
bOut.addEventListener('click', () => map.zoomOut());
bPlay.addEventListener('click', () => void play());
sFade.addEventListener('click', () => view.curtain && setMode(false));
sCurtain.addEventListener('click', () => !view.curtain && setMode(true));
bLabels.addEventListener('click', () => {
  labels = !labels;
  bLabels.setAttribute('aria-pressed', String(labels));
  bLabels.classList.toggle('on', labels);
  photos?.labels(labels);
  curtain?.labels(labels);
});
bTheme.addEventListener('click', () => {
  setTheme(isDark() ? 'light' : 'dark');
  applyTheme();
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
function applyTheme(): void {
  bTheme.replaceChildren(icon(isDark() ? 'sun' : 'moon', 19));
  if (map.isStyleLoaded()) map.setPaintProperty('bg', 'background-color', bg());
  curtain?.background(bg());
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', isDark() ? '#111213' : '#eeece6');
}

const share = new ShareSheet(() => ({
  url: location.href,
  title: placeTitle,
  image: shareImage(),
}));
bShare.addEventListener('click', () => {
  stop();
  syncUrl();
  share.open();
  track('share_open');
});

function shareImage(): string {
  const c = map.getCenter();
  const s = view.curtain ? items[timeline.pair[0]]! : current();
  return `/og/view?lat=${c.lat.toFixed(5)}&lon=${c.lng.toFixed(5)}&z=${map.getZoom().toFixed(2)}&y=${s.id}`;
}

const exporter = new ExportSheet(() => {
  const c = map.getCenter();
  const [a, b] = view.curtain ? timeline.pair : [0, items.length - 1];
  return {
    surveys: items.slice(Math.min(a, b), Math.max(a, b) + 1),
    all: items,
    lon: c.lng,
    lat: c.lat,
    zoom: map.getZoom(),
    screen: { w: stage.clientWidth, h: stage.clientHeight },
    title: placeTitle,
    slug: (placeTitle || 'espana').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    findTitle: () => placeName(c.lng, c.lat),
  };
});
bExport.addEventListener('click', () => {
  stop();
  exporter.open();
});

// ---------- Boot ----------
map.on('load', () => {
  photos = new Photos(map);
  timeline.setItems(items, { y: view.y, a: view.a, b: view.b });
  if (view.curtain) setMode(true);
  else {
    sFade.setAttribute('aria-pressed', 'true');
    sCurtain.setAttribute('aria-pressed', 'false');
    onBlend(timeline.value);
  }
  void refreshAvailability();
  if (view.q) {
    search.input.value = view.q;
    void search.submit(view.q);
  } else if (view.z < LOW_ZOOM) setTimeout(() => search.input.focus({ preventScroll: true }), 300);
  else void placeName(view.lon, view.lat).then((n) => (placeTitle ||= n));
});

let moveTimer = 0;
map.on('moveend', () => {
  clearTimeout(moveTimer);
  moveTimer = window.setTimeout(() => {
    void refreshAvailability();
    syncUrl();
  }, 300);
});
map.on('dragstart', () => search.close());
addEventListener('resize', () => curtain?.resize());
addEventListener('keydown', (e) => {
  if ((e.target as HTMLElement).closest('input, textarea, [role="slider"], dialog')) return;
  if (e.key === ' ' || e.key === 'k') {
    e.preventDefault();
    void play();
  } else if (e.key === '/') {
    e.preventDefault();
    search.input.focus();
  }
});

// On phones the blend/curtain switch moves to its own row in the top bar to leave room for the years.
const narrow = matchMedia('(max-width: 680px)');
const placeSeg = () => (narrow.matches ? top.append(seg) : acts.prepend(seg));
narrow.addEventListener('change', placeSeg);
placeSeg();

hydrateIcons();
initConsent();
// Help the year bar fit: the panel's height is known only now.
requestAnimationFrame(() => document.documentElement.style.setProperty('--panel-h', `${panel.offsetHeight}px`));
new ResizeObserver(() => document.documentElement.style.setProperty('--panel-h', `${panel.offsetHeight}px`)).observe(panel);

if (import.meta.env.DEV) Object.assign(window, { __map: map, __timeline: timeline });
