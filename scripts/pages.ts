// Generates every HTML page of the site from src/ (run by `npm run build` and `npm run dev`):
// the landing, the map, the gallery and one page per place, and the legal pages, all in Spanish.
// Also writes public/sitemap.xml and pages.json (the Vite entry points).
// Header and footer come from src/site/partials/. Generated files are not committed.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { byId, SURVEYS } from '../src/data/layers.ts';
import { PLACE_TEXT } from '../src/data/place-text.ts';
import { PLACES, type Place } from '../src/data/places.ts';
import { LEGAL } from './legal.ts';
import { landing } from './landing.ts';
import { iconSvg, sepSvg, type IconName } from '../src/ui/icons.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SITE = 'https://ayer.aminox.dev';
const UPDATED = '2026-11-20';
const coverage = JSON.parse(readFileSync(join(ROOT, 'src/data/coverage.json'), 'utf8')) as Record<string, string[]>;

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const R = { map: '/mapa/', places: '/lugares/', home: '/' };
export const placePath = (p: Place) => `/lugares/${p.slug}/`;
export const surveyLabel = (id: string) => byId.get(id)!.label;
/** Map link that opens a place in curtain mode between its two surveys. */
export const mapLink = (p: Place, y?: string) =>
  `${R.map}?lat=${p.lat}&lon=${p.lon}&z=${p.zoom}` + (y ? `&y=${y}` : `&a=${p.from}&b=${p.to}&m=cortina`);

interface Head {
  title: string;
  desc: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: string;
  jsonld?: object[];
  noindex?: boolean;
  bodyClass?: string;
}

function head(h: Head): string {
  const img = `${SITE}${h.image ?? '/og/benidorm.jpg'}`;
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${esc(h.title)}</title>
    <meta name="description" content="${esc(h.desc)}" />
    ${h.noindex ? '<meta name="robots" content="noindex" />' : ''}
    <link rel="canonical" href="${SITE}${h.path}" />
    <meta property="og:type" content="${h.type ?? 'website'}" />
    <meta property="og:site_name" content="Ayer" />
    <meta property="og:title" content="${esc(h.title)}" />
    <meta property="og:description" content="${esc(h.desc)}" />
    <meta property="og:url" content="${SITE}${h.path}" />
    <meta property="og:image" content="${img}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(h.imageAlt ?? h.title)}" />
    <meta property="og:locale" content="es_ES" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${img}" />
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content="#eeece6" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#111213" media="(prefers-color-scheme: dark)" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <script>
      document.documentElement.classList.add('js');
      setTimeout(() => window.ayerReady || document.documentElement.classList.remove('js'), 2500);
      try {
        const t = localStorage.getItem('ayer-theme');
        if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t;
      } catch {}
    </script>
${(h.jsonld ?? []).map((j) => `    <script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
  </head>`;
}

function partial(name: string): string {
  return readFileSync(join(ROOT, `src/site/partials/${name}.html`), 'utf8');
}

function page(h: Head, main: string, script = '/src/site/site.ts'): string {
  return `${head(h)}
  <body class="${h.bodyClass ?? 'site'}">
    <a class="skip" href="#main">Saltar al contenido</a>
    ${partial('header')}
    <main id="main">
${main}
    </main>
    ${partial('footer')}
    <script type="module" src="${script}"></script>
  </body>
</html>
`;
}

/** Inline the Lucide SVG for every <i data-icon> and <i data-sep> placeholder: no text symbols, no flash before JS. */
function renderIcons(html: string): string {
  return html
    .replace(/<i data-sep><\/i>/g, sepSvg())
    .replace(/<i data-icon="(\w+)"(?: data-size="(\d+)")?><\/i>/g, (_, n: string, s?: string) => iconSvg(n as IconName, s ? Number(s) : 18));
}

const out: string[] = [];
function write(path: string, html: string): void {
  const file = join(ROOT, path === '/' ? '' : path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, renderIcons(html));
  out.push(join(path === '/' ? '' : path.replace(/^\//, ''), 'index.html'));
}

const author = { '@type': 'Person', name: 'Amin Tahtah Toumi' };

/** Coordinates as printed on a survey frame: 38°32′N 0°07′W. */
export function dms(lat: number, lon: number): string {
  const f = (v: number, pos: string, neg: string) => {
    const a = Math.abs(v);
    const d = Math.floor(a);
    const m = Math.round((a - d) * 60);
    return `${m === 60 ? d + 1 : d}°${String(m === 60 ? 0 : m).padStart(2, '0')}′${v >= 0 ? pos : neg}`;
  };
  return `${f(lat, 'N', 'S')} ${f(lon, 'E', 'W')}`;
}

/** A before/after comparison of two still images with a draggable divider (wired by site.ts). */
export function compare(p: Place, big = false): string {
  const a = surveyLabel(p.from);
  const b = surveyLabel(p.to);
  const alt = (y: string) => `${p.name}, foto aérea de ${y === 'Hoy' ? 'hoy' : y}`;
  return `<div class="compare fid${big ? ' big' : ''}" data-compare style="--pos:50%">
          <img class="compare-b" src="/places/${p.slug}/hero-b.webp" srcset="/places/${p.slug}/hero-b-800.webp 800w, /places/${p.slug}/hero-b.webp 1600w" sizes="(max-width: 600px) 60vw, 100vw" width="1600" height="1000" alt="${esc(alt(b))}" ${big ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />
          <div class="compare-a"><img src="/places/${p.slug}/hero-a.webp" srcset="/places/${p.slug}/hero-a-800.webp 800w, /places/${p.slug}/hero-a.webp 1600w" sizes="(max-width: 600px) 60vw, 100vw" width="1600" height="1000" alt="${esc(alt(a))}" ${big ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" /></div>
          <span class="compare-tag left">${a}</span><span class="compare-tag right">${b}</span>
          <span class="compare-data" aria-hidden="true">${dms(p.lat, p.lon)}<i data-sep></i>IGN</span>
          <div class="compare-rule" aria-hidden="true"><span class="compare-knob"><i data-icon="drag"></i></span></div>
          <input class="compare-range" type="range" min="0" max="100" value="50" step="0.1" aria-label="Comparar ${a} y ${b}" />
        </div>`;
}

export function card(p: Place): string {
  const a = surveyLabel(p.from);
  const b = surveyLabel(p.to);
  return `<a class="card" href="${placePath(p)}">
            <span class="card-img fid">
              <img class="card-a" src="/places/${p.slug}/${p.from}.webp" width="360" height="360" alt="" loading="lazy" decoding="async" />
              <img class="card-b" src="/places/${p.slug}/${p.to}.webp" width="360" height="360" alt="" loading="lazy" decoding="async" />
              <span class="card-years"><span>${a}</span><i data-icon="arrowRight" data-size="13"></i><span>${b}</span></span>
            </span>
            <span class="card-meta"><span class="kicker">${esc(p.region)}</span><strong>${esc(p.name)}</strong><span class="card-dek">${esc(PLACE_TEXT[p.slug]!.dek)}</span></span>
          </a>`;
}

// ---------- Landing ----------
{
  const L = landing();
  write(
    R.home,
    page(
      {
        title: L.title,
        desc: L.desc,
        path: R.home,
        image: '/og/benidorm.jpg',
        imageAlt: 'Benidorm en 1956 y hoy, desde el aire',
        bodyClass: 'site landing',
        jsonld: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Ayer',
            url: `${SITE}${R.home}`,
            description: L.desc,
            inLanguage: 'es',
            applicationCategory: 'ReferenceApplication',
            operatingSystem: 'Navegador web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
            author,
            isAccessibleForFree: true,
          },
        ],
      },
      L.html,
    ),
  );
}

// ---------- Gallery index ----------
{
  const title = 'Lugares de España antes y ahora: 18 cambios vistos desde el aire — Ayer';
  const desc =
    'Benidorm, Marbella, Barajas, el Guggenheim, la Ciudad de las Artes, los invernaderos de El Ejido y más lugares de España comparados en fotos aéreas desde 1956 hasta hoy.';
  write(
    R.places,
    page(
      {
        title,
        desc,
        path: R.places,
        jsonld: [
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: title,
            url: `${SITE}${R.places}`,
            inLanguage: 'es',
            hasPart: PLACES.map((p) => ({ '@type': 'Article', headline: p.name, url: `${SITE}${placePath(p)}` })),
          },
        ],
      },
      `      <section class="page-head">
        <div class="wrap">
          <p class="kicker">Galería</p>
          <h1>Dieciocho lugares que ya no son lo que eran</h1>
          <p class="lead">Costas que se llenaron de torres, ríos que cambiaron de sitio, aeropuertos que crecieron sobre huertas. Cada página compara la foto aérea más antigua del lugar con la de hoy y explica qué mirar.</p>
        </div>
      </section>
      <section class="block tight">
        <div class="wrap grid-cards">
          ${PLACES.map((p) => card(p)).join('\n          ')}
        </div>
      </section>`,
    ),
  );
}

// ---------- Place pages ----------
for (const p of PLACES) {
  const T = PLACE_TEXT[p.slug]!;
  const name = p.name;
  const a = surveyLabel(p.from);
  const avail = coverage[p.slug] ?? [];
  const title = `${name} en ${a} y hoy, desde el aire — Ayer`;
  const h1 = `${name} en ${a} y hoy`;
  const desc = `${T.dek} Compara las fotos aéreas del IGN de ${a} a hoy en ${avail.length} vuelos.`;
  const others = PLACES.filter((o) => o !== p);
  const i = PLACES.indexOf(p);
  const related = [others[i % others.length]!, others[(i + 5) % others.length]!, others[(i + 11) % others.length]!];
  const products = [...new Set(avail.map((id) => byId.get(id)!.product))];
  write(
    placePath(p),
    page(
      {
        title,
        desc,
        path: placePath(p),
        image: `/og/${p.slug}.jpg`,
        imageAlt: `${name}: a la izquierda en ${a}, a la derecha hoy`,
        type: 'article',
        bodyClass: 'site place',
        jsonld: [
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: h1,
            description: T.dek,
            inLanguage: 'es',
            image: [`${SITE}/og/${p.slug}.jpg`, `${SITE}/places/${p.slug}/hero-a.webp`, `${SITE}/places/${p.slug}/hero-b.webp`],
            author,
            dateModified: UPDATED,
            mainEntityOfPage: `${SITE}${placePath(p)}`,
            about: { '@type': 'Place', name, geo: { '@type': 'GeoCoordinates', latitude: p.lat, longitude: p.lon } },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Ayer', item: `${SITE}${R.home}` },
              { '@type': 'ListItem', position: 2, name: 'Lugares', item: `${SITE}${R.places}` },
              { '@type': 'ListItem', position: 3, name, item: `${SITE}${placePath(p)}` },
            ],
          },
        ],
      },
      `      <article class="story">
        <header class="wrap story-head">
          <p class="kicker"><a href="${R.places}">Lugares</a><i data-sep></i>${esc(p.region)}</p>
          <h1>${esc(h1)}</h1>
          <p class="dek">${esc(T.dek)}</p>
        </header>
        <figure class="wrap wide story-figure">
          ${compare(p, true)}
          <figcaption>
            <span>Arrastra la línea para comparar. Fotos: ${products.length ? esc(byId.get(p.from)!.product) + '<i data-sep></i>' + esc(byId.get(p.to)!.product) : ''}, <a href="https://www.scne.es" target="_blank" rel="noopener">CC-BY 4.0 scne.es</a></span>
            <a class="btn" href="${mapLink(p)}"><i data-icon="map"></i>Explorar en el mapa</a>
          </figcaption>
        </figure>
        <div class="wrap story-body">
          <div class="prose">
            ${T.body.map((t) => `<p>${esc(t)}</p>`).join('\n            ')}
          </div>
          <aside class="story-aside">
            <h2 class="kicker">Fíjate en</h2>
            <ol class="look">
              ${T.look.map((t) => `<li>${esc(t)}</li>`).join('\n              ')}
            </ol>
            <h2 class="kicker">${avail.length} vuelos con foto aquí</h2>
            <p class="years">${avail.map((id) => `<a href="${mapLink(p, id)}">${surveyLabel(id)}</a>`).join(' ')}</p>
          </aside>
        </div>
        <section class="wrap wide sequence" aria-label="Todos los vuelos">
          <h2>La secuencia completa</h2>
          <p class="intro">Cada foto que el IGN tiene de este punto, de la más antigua a la más reciente. Pulsa una para abrirla en el mapa.</p>
          <ol class="seq">
            ${avail
              .map(
                (id) =>
                  `<li><a href="${mapLink(p, id)}"><span class="seq-img fid"><img src="/places/${p.slug}/${id}.webp" width="360" height="360" loading="lazy" decoding="async" alt="${esc(`${name} en ${surveyLabel(id)}`)}" /></span><span>${surveyLabel(id)}</span></a></li>`,
              )
              .join('\n            ')}
          </ol>
        </section>
        <section class="wrap related">
          <h2>Otros lugares</h2>
          <div class="grid-cards three">
            ${related.map((o) => card(o)).join('\n            ')}
          </div>
        </section>
      </article>`,
    ),
  );
}

// ---------- Map ----------
write(
  R.map,
  `${head({
    title: 'Mapa de fotos aéreas de España de 1956 a hoy — Ayer',
    desc: 'Busca cualquier dirección de España y mira cómo era desde el aire en 1956, en los años ochenta, en 2000 y hoy. Compara épocas, crea un timelapse y compártelo.',
    path: R.map,
    image: '/og/mapa.jpg',
    bodyClass: 'app',
    jsonld: [],
  })}
  <body class="app">
    <div id="app" class="app-shell" data-surveys="${SURVEYS.length}">
      <div id="map" class="map" role="application" aria-label="Mapa de fotos aéreas"></div>
      <noscript><p class="noscript">El mapa necesita JavaScript.</p></noscript>
    </div>
    <script type="module" src="/src/map/main.ts"></script>
  </body>
</html>
`,
);

// ---------- Legal ----------
for (const d of LEGAL) {
  write(
    d.path,
    page(
      { title: `${d.title} — Ayer`, desc: d.desc, path: d.path },
      `      <div class="doc">
        <div class="wrap narrow">
          <p class="kicker">Legal</p>
          <h1>${d.title}</h1>
          <p class="updated">Última actualización: 20 de noviembre de 2026</p>
${d.html}
        </div>
      </div>`,
    ),
  );
}

// ---------- 404 ----------
{
  const html = page(
    { title: 'Página no encontrada — Ayer', desc: 'Esta página no existe.', path: '/404.html', noindex: true },
    `      <section class="page-head notfound">
        <div class="wrap">
          <p class="kicker">Error 404</p>
          <h1>Este lugar ya no está aquí.</h1>
          <p class="lead">Puede que la dirección haya cambiado, como tantas cosas desde 1956.</p>
          <p><a class="btn big" href="/mapa/">Abrir el mapa</a> <a class="btn big ghost" href="/">Ir al inicio</a></p>
        </div>
      </section>`,
  );
  writeFileSync(join(ROOT, '404.html'), renderIcons(html));
  out.push('404.html');
}

// ---------- Sitemap ----------
const entries: [string, number][] = [
  [R.home, 1],
  [R.map, 0.9],
  [R.places, 0.8],
  ...PLACES.map((p) => [placePath(p), 0.8] as [string, number]),
  ...LEGAL.map((d) => [d.path, 0.2] as [string, number]),
];
const urls = entries.map(
  ([loc, pr]) => `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${UPDATED}</lastmod>
    <priority>${pr}</priority>
  </url>`,
);
writeFileSync(
  join(ROOT, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
);
writeFileSync(join(ROOT, 'pages.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`${out.length} páginas`);
