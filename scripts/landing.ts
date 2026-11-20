// Landing page (/). Returns the <main> content; scripts/pages.ts wraps it.
import { readFileSync } from 'node:fs';
import { SURVEYS } from '../src/data/layers.ts';
import { PLACES } from '../src/data/places.ts';
import { card, compare, esc, placePath, R } from './pages.ts';

const cov = JSON.parse(readFileSync(new URL('../public/coverage/coverage.json', import.meta.url), 'utf8')) as Record<string, { main: number; can: number }>;

const NAMES: Record<string, string> = {
  ams: 'Vuelo Americano',
  interministerial: 'Interministerial',
  nacional: 'Vuelo Nacional',
  olistat: 'OLISTAT',
  sigpac: 'SIGPAC',
};

function mini(id: string, label: string, name: string): string {
  const can = (cov[id]?.can ?? 0) > 0;
  return `<figure class="cov">
              <div class="cov-map" role="img" aria-label="${esc(label)}">
                <span class="cov-land"></span><span class="cov-fill" style="--m:url(/coverage/${id}.png)"></span>
                <span class="cov-can"><span class="cov-land"></span>${can ? `<span class="cov-fill" style="--m:url(/coverage/${id}-can.png)"></span>` : ''}</span>
              </div>
              <figcaption><b>${esc(label)}</b>${name ? `<span>${esc(name)}</span>` : ''}</figcaption>
            </figure>`;
}

export function landing(): { title: string; desc: string; html: string } {
  const hero = PLACES[0]!;
  const old = SURVEYS.filter((s) => s.wms && !s.id.startsWith('pnoa'));
  const annual = SURVEYS.filter((s) => s.id.startsWith('pnoa'));

  const faq: [string, string][] = [
    ['¿De dónde salen las fotos?', 'Del Instituto Geográfico Nacional (IGN), que publica los vuelos fotogramétricos históricos ya corregidos para encajar con el mapa (ortofotos). Ayer los muestra tal cual, con su licencia CC BY 4.0, sin retocarlos.'],
    ['¿Por qué en mi zona no aparece 1956?', 'El vuelo de 1956-1957 cubre la península y Baleares. Canarias, Ceuta y Melilla no están en él. En Canarias las fotos empiezan con SIGPAC, hacia el año 2000; en Ceuta y Melilla, con el PNOA de 2006. El mapa solo muestra en la barra de años los vuelos que tienen foto en la zona que estás viendo.'],
    ['¿Por qué faltan años del PNOA?', 'El Plan Nacional de Ortofotografía Aérea no vuela todo el país cada año: lo reparte entre comunidades, de modo que cada zona tiene una foto nueva cada dos o tres años. La foto marcada como «Hoy» es el mosaico más reciente, que junta la última de cada zona.'],
    ['¿Puedo usar las imágenes o los vídeos que exporto?', 'Sí, citando la fuente. Las ortofotos tienen licencia CC BY 4.0 del Sistema Cartográfico Nacional, y los vídeos y GIF que exportas ya llevan la atribución sobreimpresa. Si los publicas, mantenla visible.'],
    ['¿Qué datos míos se guardan?', 'Ninguno asociado a ti. Las búsquedas y las fotos pasan por nuestro servidor para no exponer tu IP al IGN y para guardarlas en caché, y solo quedan unas semanas en los registros técnicos del servidor, como en cualquier web. Los vídeos se crean en tu propio navegador. Solo si aceptas, Google Analytics mide visitas de forma agregada.'],
    ['¿Por qué algunas fotos antiguas se ven borrosas o en blanco?', 'Los primeros vuelos se hicieron a menor resolución y en blanco y negro, y a mucho zoom se nota. Si una zona sale en blanco es que ese vuelo no pasó por ahí: elige otro año o aléjate un poco.'],
  ];

  const html = `      <section class="hero">
        ${compare(hero, true).replace('class="compare fid big"', 'class="compare fid big hero-compare"')}
        <div class="hero-copy">
          <div class="wrap">
            <h1>Tu calle, <em>ayer</em>.</h1>
            <p class="lead">Escribe una dirección y mira cómo era ese lugar desde el aire hace setenta años. Desliza los años y verás crecer ciudades, desaparecer ríos y llenarse las costas.</p>
            <form class="hero-search" action="${R.map}" method="get" role="search">
              <i data-icon="search" data-size="20"></i>
              <input name="q" type="search" autocomplete="off" enterkeyhint="search" placeholder="Una calle, un pueblo, un lugar…" aria-label="Buscar una dirección" required />
              <button class="btn" type="submit">Volar allí</button>
            </form>
            <p class="hero-credit">Benidorm en 1956 y hoy. Arrastra la línea. <a href="${placePath(hero)}">Leer la historia de Benidorm</a></p>
          </div>
        </div>
      </section>


      <section class="block" id="lugares">
        <div class="wrap">
          <div class="section-head">
            <h2>Lugares en 1956 y hoy</h2>
            <a class="text-link" href="${R.places}">Todos los lugares<i data-icon="arrowRight" data-size="15"></i></a>
          </div>
          <div class="grid-cards">
            ${PLACES.slice(0, 8)
              .map((p) => card(p))
              .join('\n            ')}
          </div>
        </div>
      </section>

      <section class="block coverage" id="cobertura">
        <div class="wrap">
          <div class="section-head">
            <h2>Qué fotos hay de cada zona</h2>
          </div>
          <div class="cov-intro">
            <p class="lead">No hay una foto de cada sitio cada año. Los vuelos antiguos se hicieron con fines distintos y no siempre cubrieron todo el país; el PNOA, desde 2004, vuela una parte cada año.</p>
            <dl class="facts">
              <div><dt>Península y Baleares</dt><dd>Desde <b>1956</b>, casi sin huecos.</dd></div>
              <div><dt>Canarias</dt><dd>Desde <b>SIGPAC</b> (1997-2003). No está en los vuelos anteriores.</dd></div>
              <div><dt>Ceuta y Melilla</dt><dd>Desde el <b>PNOA 2006</b>.</dd></div>
              <div><dt>Años setenta, ochenta y noventa</dt><dd>Solo en parte: mira los mapas.</dd></div>
            </dl>
          </div>
          <h3 class="cov-title">Los vuelos históricos</h3>
          <div class="cov-grid big">
            ${old
              .map((s) => mini(s.id, s.label, NAMES[s.id]!))
              .join('\n            ')}
          </div>
          <h3 class="cov-title">El PNOA, año a año</h3>
          <p class="cov-note">Cada mapa marca lo que se fotografió ese año. Fíjate en cómo las zonas se turnan: por eso cada lugar tiene una foto nueva cada dos o tres años.</p>
          <div class="cov-grid">
            ${annual.map((s) => mini(s.id, s.label, '')).join('\n            ')}
          </div>
          <p class="cov-source">Mapas calculados a partir del servicio WMS de ortofotos históricas del IGN. Zona coloreada: hay foto.</p>
        </div>
      </section>

      <section class="block" id="preguntas">
        <div class="wrap two-col">
          <div class="section-head"><h2>Preguntas frecuentes</h2></div>
          <div class="faq">
            ${faq.map(([k, v]) => `<details><summary>${esc(k)}<i data-icon="plus" data-size="18"></i></summary><p>${esc(v)}</p></details>`).join('\n            ')}
          </div>
        </div>
      </section>`;

  return {
    title: 'Ayer — Fotos aéreas de España de 1956 a hoy, en un mapa',
    desc: 'Busca cualquier lugar de España y mira cómo ha cambiado desde el aire, de 1956 a hoy, con las fotos aéreas históricas del IGN. Compara épocas, crea timelapses y compártelos.',
    html,
  };
}
