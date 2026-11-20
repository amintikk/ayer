// Generates every HTML page of the site from src/ (run by `npm run build` and `npm run dev`):
// the landing, the map, the gallery and one page per place, and the legal pages, in Spanish (/)
// and English (/en/). Also writes public/sitemap.xml and pages.json (the Vite entry points).
// Header and footer come from src/site/partials/. Generated files are not committed.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { byId, SURVEYS } from '../src/data/layers.ts';
import { PLACE_TEXT } from '../src/data/place-text.ts';
import { PLACES, type Place } from '../src/data/places.ts';
import { LEGAL } from './legal.ts';
import { landing } from './landing.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SITE = 'https://ayer.aminox.dev';
const UPDATED = '2026-11-20';
const coverage = JSON.parse(readFileSync(join(ROOT, 'src/data/coverage.json'), 'utf8')) as Record<string, string[]>;

export type Lang = 'es' | 'en';
export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const R = {
  map: { es: '/mapa/', en: '/en/map/' },
  places: { es: '/lugares/', en: '/en/places/' },
  home: { es: '/', en: '/en/' },
};
export const placePath = (p: Place, l: Lang) => (l === 'es' ? `/lugares/${p.slug}/` : `/en/places/${p.slugEn}/`);
export const placeName = (p: Place, l: Lang) => (l === 'en' && p.nameEn ? p.nameEn : p.name);
export const surveyLabel = (id: string, l: Lang) => {
  const s = byId.get(id)!;
  return s.label === 'Hoy' ? (l === 'en' ? 'Today' : 'Hoy') : s.label;
};
/** Map link that opens a place in curtain mode between its two surveys. */
export const mapLink = (p: Place, l: Lang, y?: string) =>
  `${R.map[l]}?lat=${p.lat}&lon=${p.lon}&z=${p.zoom}` + (y ? `&y=${y}` : `&a=${p.from}&b=${p.to}&m=cortina`);

interface Head {
  lang: Lang;
  title: string;
  desc: string;
  path: string;
  alt: string;
  image?: string;
  imageAlt?: string;
  type?: string;
  jsonld?: object[];
  noindex?: boolean;
  bodyClass?: string;
}

function head(h: Head): string {
  const other: Lang = h.lang === 'es' ? 'en' : 'es';
  const es = h.lang === 'es' ? h.path : h.alt;
  const en = h.lang === 'en' ? h.path : h.alt;
  const img = `${SITE}${h.image ?? '/og/benidorm.jpg'}`;
  return `<!doctype html>
<html lang="${h.lang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${esc(h.title)}</title>
    <meta name="description" content="${esc(h.desc)}" />
    ${h.noindex ? '<meta name="robots" content="noindex" />' : ''}
    <link rel="canonical" href="${SITE}${h.path}" />
    <link rel="alternate" hreflang="es" href="${SITE}${es}" />
    <link rel="alternate" hreflang="en" href="${SITE}${en}" />
    <link rel="alternate" hreflang="x-default" href="${SITE}${es}" />
    <meta property="og:type" content="${h.type ?? 'website'}" />
    <meta property="og:site_name" content="Ayer" />
    <meta property="og:title" content="${esc(h.title)}" />
    <meta property="og:description" content="${esc(h.desc)}" />
    <meta property="og:url" content="${SITE}${h.path}" />
    <meta property="og:image" content="${img}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(h.imageAlt ?? h.title)}" />
    <meta property="og:locale" content="${h.lang === 'es' ? 'es_ES' : 'en_GB'}" />
    <meta property="og:locale:alternate" content="${other === 'es' ? 'es_ES' : 'en_GB'}" />
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

function partial(name: string, l: Lang, alt: string): string {
  return readFileSync(join(ROOT, `src/site/partials/${name}${l === 'en' ? '-en' : ''}.html`), 'utf8').replaceAll('{{alt-href}}', alt);
}

function page(h: Head, main: string, script = '/src/site/site.ts'): string {
  return `${head(h)}
  <body class="${h.bodyClass ?? 'site'}">
    <a class="skip" href="#main">${h.lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}</a>
    ${partial('header', h.lang, h.alt)}
    <main id="main">
${main}
    </main>
    ${partial('footer', h.lang, h.alt)}
    <script type="module" src="${script}"></script>
  </body>
</html>
`;
}

const out: string[] = [];
function write(path: string, html: string): void {
  const file = join(ROOT, path === '/' ? '' : path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
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
export function compare(p: Place, l: Lang, big = false): string {
  const a = surveyLabel(p.from, l);
  const b = surveyLabel(p.to, l);
  const name = placeName(p, l);
  const alt = (y: string) => (l === 'es' ? `${name}, foto aérea de ${y === 'Hoy' ? 'hoy' : y}` : `${name}, aerial photo from ${y === 'Today' ? 'today' : y}`);
  return `<div class="compare fid${big ? ' big' : ''}" data-compare style="--pos:50%">
          <img class="compare-b" src="/places/${p.slug}/hero-b.webp" srcset="/places/${p.slug}/hero-b-800.webp 800w, /places/${p.slug}/hero-b.webp 1600w" sizes="(max-width: 600px) 60vw, 100vw" width="1600" height="1000" alt="${esc(alt(b))}" ${big ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />
          <div class="compare-a"><img src="/places/${p.slug}/hero-a.webp" srcset="/places/${p.slug}/hero-a-800.webp 800w, /places/${p.slug}/hero-a.webp 1600w" sizes="(max-width: 600px) 60vw, 100vw" width="1600" height="1000" alt="${esc(alt(a))}" ${big ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" /></div>
          <span class="compare-tag left">${a}</span><span class="compare-tag right">${b}</span>
          <span class="compare-data" aria-hidden="true">${dms(p.lat, p.lon)} · IGN</span>
          <div class="compare-rule" aria-hidden="true"><span class="compare-knob"><i data-icon="drag"></i></span></div>
          <input class="compare-range" type="range" min="0" max="100" value="50" step="0.1" aria-label="${l === 'es' ? `Comparar ${a} y ${b}` : `Compare ${a} and ${b}`}" />
        </div>`;
}

export function card(p: Place, l: Lang): string {
  const name = placeName(p, l);
  const a = surveyLabel(p.from, l);
  const b = surveyLabel(p.to, l);
  return `<a class="card" href="${placePath(p, l)}">
            <span class="card-img fid">
              <img class="card-a" src="/places/${p.slug}/${p.from}.webp" width="360" height="360" alt="" loading="lazy" decoding="async" />
              <img class="card-b" src="/places/${p.slug}/${p.to}.webp" width="360" height="360" alt="" loading="lazy" decoding="async" />
              <span class="card-years"><span>${a}</span><i data-icon="arrowRight" data-size="13"></i><span>${b}</span></span>
            </span>
            <span class="card-meta"><span class="kicker">${esc(p.region)}</span><strong>${esc(name)}</strong><span class="card-dek">${esc(PLACE_TEXT[p.slug]![l].dek)}</span></span>
          </a>`;
}

// ---------- Landing ----------
for (const l of ['es', 'en'] as Lang[]) {
  const L = landing(l);
  write(
    R.home[l],
    page(
      {
        lang: l,
        title: L.title,
        desc: L.desc,
        path: R.home[l],
        alt: R.home[l === 'es' ? 'en' : 'es'],
        image: '/og/benidorm.jpg',
        imageAlt: l === 'es' ? 'Benidorm en 1956 y hoy, desde el aire' : 'Benidorm in 1956 and today, from the air',
        bodyClass: 'site landing',
        jsonld: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Ayer',
            url: `${SITE}${R.home[l]}`,
            description: L.desc,
            inLanguage: l,
            applicationCategory: 'ReferenceApplication',
            operatingSystem: l === 'es' ? 'Navegador web' : 'Web browser',
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
for (const l of ['es', 'en'] as Lang[]) {
  const es = l === 'es';
  const title = es ? 'Lugares de España antes y ahora: 18 cambios vistos desde el aire · Ayer' : 'Places in Spain then and now: 18 changes seen from the air · Ayer';
  const desc = es
    ? 'Benidorm, Marbella, Barajas, el Guggenheim, la Ciudad de las Artes, los invernaderos de El Ejido y más lugares de España comparados en fotos aéreas desde 1956 hasta hoy.'
    : 'Benidorm, Marbella, Barajas, the Guggenheim, the City of Arts and Sciences, the greenhouses of El Ejido and more places in Spain compared in aerial photos from 1956 to today.';
  write(
    R.places[l],
    page(
      {
        lang: l,
        title,
        desc,
        path: R.places[l],
        alt: R.places[es ? 'en' : 'es'],
        jsonld: [
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: title,
            url: `${SITE}${R.places[l]}`,
            inLanguage: l,
            hasPart: PLACES.map((p) => ({ '@type': 'Article', headline: placeName(p, l), url: `${SITE}${placePath(p, l)}` })),
          },
        ],
      },
      `      <section class="page-head">
        <div class="wrap">
          <p class="kicker">${es ? 'Galería' : 'Gallery'}</p>
          <h1>${es ? 'Dieciocho lugares que ya no son lo que eran' : 'Eighteen places that are not what they used to be'}</h1>
          <p class="lead">${
            es
              ? 'Costas que se llenaron de torres, ríos que cambiaron de sitio, aeropuertos que crecieron sobre huertas. Cada página compara la foto aérea más antigua del lugar con la de hoy y explica qué mirar.'
              : 'Coasts filled with towers, rivers that moved, airports that grew over orchards. Each page compares the oldest aerial photo of the place with today’s and explains what to look at.'
          }</p>
        </div>
      </section>
      <section class="block tight">
        <div class="wrap grid-cards">
          ${PLACES.map((p) => card(p, l)).join('\n          ')}
        </div>
      </section>`,
    ),
  );
}

// ---------- Place pages ----------
for (const p of PLACES) {
  for (const l of ['es', 'en'] as Lang[]) {
    const es = l === 'es';
    const T = PLACE_TEXT[p.slug]![l];
    const name = placeName(p, l);
    const a = surveyLabel(p.from, l);
    const avail = coverage[p.slug] ?? [];
    const title = es ? `${name} en ${a} y hoy, desde el aire · Ayer` : `${name} in ${a} and today, from the air · Ayer`;
    const h1 = es ? `${name} en ${a} y hoy` : `${name} in ${a} and today`;
    const desc = `${T.dek} ${es ? `Compara las fotos aéreas del IGN de ${a} a hoy` : `Compare the IGN aerial photos from ${a} to today`}${es ? ` en ${avail.length} vuelos.` : ` across ${avail.length} surveys.`}`;
    const others = PLACES.filter((o) => o !== p);
    const i = PLACES.indexOf(p);
    const related = [others[i % others.length]!, others[(i + 5) % others.length]!, others[(i + 11) % others.length]!];
    const products = [...new Set(avail.map((id) => byId.get(id)!.product))];
    write(
      placePath(p, l),
      page(
        {
          lang: l,
          title,
          desc,
          path: placePath(p, l),
          alt: placePath(p, es ? 'en' : 'es'),
          image: `/og/${p.slug}.jpg`,
          imageAlt: es ? `${name}: a la izquierda en ${a}, a la derecha hoy` : `${name}: ${a} on the left, today on the right`,
          type: 'article',
          bodyClass: 'site place',
          jsonld: [
            {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: h1,
              description: T.dek,
              inLanguage: l,
              image: [`${SITE}/og/${p.slug}.jpg`, `${SITE}/places/${p.slug}/hero-a.webp`, `${SITE}/places/${p.slug}/hero-b.webp`],
              author,
              dateModified: UPDATED,
              mainEntityOfPage: `${SITE}${placePath(p, l)}`,
              about: { '@type': 'Place', name, geo: { '@type': 'GeoCoordinates', latitude: p.lat, longitude: p.lon } },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Ayer', item: `${SITE}${R.home[l]}` },
                { '@type': 'ListItem', position: 2, name: es ? 'Lugares' : 'Places', item: `${SITE}${R.places[l]}` },
                { '@type': 'ListItem', position: 3, name, item: `${SITE}${placePath(p, l)}` },
              ],
            },
          ],
        },
        `      <article class="story">
        <header class="wrap story-head">
          <p class="kicker"><a href="${R.places[l]}">${es ? 'Lugares' : 'Places'}</a> · ${esc(p.region)}</p>
          <h1>${esc(h1)}</h1>
          <p class="dek">${esc(T.dek)}</p>
        </header>
        <figure class="wrap wide story-figure">
          ${compare(p, l, true)}
          <figcaption>
            <span>${es ? 'Arrastra la línea para comparar.' : 'Drag the line to compare.'} ${es ? 'Fotos' : 'Photos'}: ${products.length ? esc(byId.get(p.from)!.product) + ' · ' + esc(byId.get(p.to)!.product) : ''}, <a href="https://www.scne.es" target="_blank" rel="noopener">CC-BY 4.0 scne.es</a></span>
            <a class="btn" href="${mapLink(p, l)}"><i data-icon="map"></i>${es ? 'Explorar en el mapa' : 'Explore on the map'}</a>
          </figcaption>
        </figure>
        <div class="wrap story-body">
          <div class="prose">
            ${T.body.map((t) => `<p>${esc(t)}</p>`).join('\n            ')}
          </div>
          <aside class="story-aside">
            <h2 class="kicker">${es ? 'Fíjate en' : 'Look at'}</h2>
            <ol class="look">
              ${T.look.map((t) => `<li>${esc(t)}</li>`).join('\n              ')}
            </ol>
            <h2 class="kicker">${es ? `${avail.length} vuelos con foto aquí` : `${avail.length} surveys with a photo here`}</h2>
            <p class="years">${avail.map((id) => `<a href="${mapLink(p, l, id)}">${surveyLabel(id, l)}</a>`).join(' ')}</p>
          </aside>
        </div>
        <section class="wrap wide sequence" aria-label="${es ? 'Todos los vuelos' : 'Every survey'}">
          <h2>${es ? 'La secuencia completa' : 'The full sequence'}</h2>
          <p class="intro">${es ? 'Cada foto que el IGN tiene de este punto, de la más antigua a la más reciente. Pulsa una para abrirla en el mapa.' : 'Every photo the IGN has of this spot, from oldest to newest. Tap one to open it on the map.'}</p>
          <ol class="seq">
            ${avail
              .map(
                (id) =>
                  `<li><a href="${mapLink(p, l, id)}"><span class="seq-img fid"><img src="/places/${p.slug}/${id}.webp" width="360" height="360" loading="lazy" decoding="async" alt="${esc(es ? `${name} en ${surveyLabel(id, l)}` : `${name} in ${surveyLabel(id, l)}`)}" /></span><span>${surveyLabel(id, l)}</span></a></li>`,
              )
              .join('\n            ')}
          </ol>
        </section>
        <section class="wrap related">
          <h2>${es ? 'Otros lugares' : 'Other places'}</h2>
          <div class="grid-cards three">
            ${related.map((o) => card(o, l)).join('\n            ')}
          </div>
        </section>
      </article>`,
      ),
    );
  }
}

// ---------- Map ----------
for (const l of ['es', 'en'] as Lang[]) {
  const es = l === 'es';
  const title = es ? 'Mapa de fotos aéreas de España de 1956 a hoy · Ayer' : 'Map of aerial photos of Spain from 1956 to today · Ayer';
  const desc = es
    ? 'Busca cualquier dirección de España y mira cómo era desde el aire en 1956, en los años ochenta, en 2000 y hoy. Compara épocas, crea un timelapse y compártelo.'
    : 'Search any address in Spain and see what it looked like from the air in 1956, in the eighties, in 2000 and today. Compare periods, make a timelapse and share it.';
  write(
    R.map[l],
    `${head({
      lang: l,
      title,
      desc,
      path: R.map[l],
      alt: R.map[es ? 'en' : 'es'],
      image: '/og/mapa.jpg',
      bodyClass: 'app',
      jsonld: [],
    })}
  <body class="app">
    <div id="app" class="app-shell" data-surveys="${SURVEYS.length}">
      <div id="map" class="map" role="application" aria-label="${es ? 'Mapa de fotos aéreas' : 'Aerial photo map'}"></div>
      <noscript><p class="noscript">${es ? 'El mapa necesita JavaScript.' : 'The map needs JavaScript.'}</p></noscript>
    </div>
    <script type="module" src="/src/map/main.ts"></script>
  </body>
</html>
`,
  );
}

// ---------- Legal ----------
for (const doc of LEGAL) {
  for (const l of ['es', 'en'] as Lang[]) {
    const d = doc[l];
    write(
      d.path,
      page(
        { lang: l, title: `${d.title} · Ayer`, desc: d.desc, path: d.path, alt: doc[l === 'es' ? 'en' : 'es'].path },
        `      <div class="doc">
        <div class="wrap narrow">
          <p class="kicker">${l === 'es' ? 'Legal' : 'Legal'}</p>
          <h1>${d.title}</h1>
          <p class="updated">${l === 'es' ? 'Última actualización: 20 de noviembre de 2026' : 'Last updated: 20 November 2026'}</p>
${d.html}
        </div>
      </div>`,
      ),
    );
  }
}

// ---------- 404 ----------
{
  const html = page(
    { lang: 'es', title: 'Página no encontrada · Ayer', desc: 'Esta página no existe.', path: '/404.html', alt: '/en/', noindex: true },
    `      <section class="page-head notfound">
        <div class="wrap">
          <p class="kicker">Error 404 · Not found</p>
          <h1>Este lugar ya no está aquí.</h1>
          <p class="lead">Puede que la dirección haya cambiado, como tantas cosas desde 1956. <span lang="en">This page does not exist.</span></p>
          <p><a class="btn big" href="/mapa/">Abrir el mapa</a> <a class="btn big ghost" href="/">Ir al inicio</a></p>
        </div>
      </section>`,
  );
  writeFileSync(join(ROOT, '404.html'), html);
  out.push('404.html');
}

// ---------- Sitemap ----------
const pairs: [string, string, number][] = [
  [R.home.es, R.home.en, 1],
  [R.map.es, R.map.en, 0.9],
  [R.places.es, R.places.en, 0.8],
  ...PLACES.map((p) => [placePath(p, 'es'), placePath(p, 'en'), 0.8] as [string, string, number]),
  ...LEGAL.map((d) => [d.es.path, d.en.path, 0.2] as [string, string, number]),
];
const urls = pairs.flatMap(([es, en, pr]) =>
  [es, en].map(
    (loc) => `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${UPDATED}</lastmod>
    <priority>${pr}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${SITE}${es}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${es}"/>
  </url>`,
  ),
);
writeFileSync(
  join(ROOT, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
);
writeFileSync(join(ROOT, 'pages.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`${out.length} páginas`);
