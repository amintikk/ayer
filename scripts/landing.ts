// Landing page (/ and /en/). Returns the <main> content; scripts/pages.ts wraps it.
import { readFileSync } from 'node:fs';
import { SURVEYS } from '../src/data/layers.ts';
import { PLACES } from '../src/data/places.ts';
import { card, compare, esc, placePath, R, type Lang } from './pages.ts';

const cov = JSON.parse(readFileSync(new URL('../public/coverage/coverage.json', import.meta.url), 'utf8')) as Record<string, { main: number; can: number }>;

const NAMES: Record<string, [string, string]> = {
  ams: ['Vuelo Americano', 'American Flight'],
  interministerial: ['Interministerial', 'Interministerial'],
  nacional: ['Vuelo Nacional', 'National Flight'],
  olistat: ['OLISTAT', 'OLISTAT'],
  sigpac: ['SIGPAC', 'SIGPAC'],
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

export function landing(l: Lang): { title: string; desc: string; html: string } {
  const es = l === 'es';
  const hero = PLACES[0]!;
  const old = SURVEYS.filter((s) => s.wms && !s.id.startsWith('pnoa'));
  const annual = SURVEYS.filter((s) => s.id.startsWith('pnoa'));
  const q = (s: string, e: string) => (es ? s : e);

  const faq: [string, string][] = es
    ? [
        ['¿De dónde salen las fotos?', 'Del Instituto Geográfico Nacional (IGN), que publica los vuelos fotogramétricos históricos ya corregidos para encajar con el mapa (ortofotos). Ayer los muestra tal cual, con su licencia CC BY 4.0, sin retocarlos.'],
        ['¿Por qué en mi zona no aparece 1956?', 'El vuelo de 1956-1957 cubre la península y Baleares. Canarias, Ceuta y Melilla no están en él. En Canarias las fotos empiezan con SIGPAC, hacia el año 2000; en Ceuta y Melilla, con el PNOA de 2006. El mapa solo muestra en la barra de años los vuelos que tienen foto en la zona que estás viendo.'],
        ['¿Por qué faltan años del PNOA?', 'El Plan Nacional de Ortofotografía Aérea no vuela todo el país cada año: lo reparte entre comunidades, de modo que cada zona tiene una foto nueva cada dos o tres años. La foto marcada como «Hoy» es el mosaico más reciente, que junta la última de cada zona.'],
        ['¿Puedo usar las imágenes o los vídeos que exporto?', 'Sí, citando la fuente. Las ortofotos tienen licencia CC BY 4.0 del Sistema Cartográfico Nacional, y los vídeos y GIF que exportas ya llevan la atribución sobreimpresa. Si los publicas, mantenla visible.'],
        ['¿Qué datos míos se guardan?', 'Ninguno asociado a ti. Las búsquedas y las fotos pasan por nuestro servidor para no exponer tu IP al IGN y para guardarlas en caché, y solo quedan unas semanas en los registros técnicos del servidor, como en cualquier web. Los vídeos se crean en tu propio navegador. Solo si aceptas, Google Analytics mide visitas de forma agregada.'],
        ['¿Por qué algunas fotos antiguas se ven borrosas o en blanco?', 'Los primeros vuelos se hicieron a menor resolución y en blanco y negro, y a mucho zoom se nota. Si una zona sale en blanco es que ese vuelo no pasó por ahí: elige otro año o aléjate un poco.'],
      ]
    : [
        ['Where do the photos come from?', 'From the Spanish National Geographic Institute (IGN), which publishes the historical survey flights already corrected to fit the map (orthophotos). Ayer shows them as they are, under their CC BY 4.0 licence, without retouching.'],
        ['Why is there no 1956 photo of my area?', 'The 1956-1957 flight covers the mainland and the Balearic Islands. The Canary Islands, Ceuta and Melilla are not in it. In the Canaries the photos start with SIGPAC, around 2000; in Ceuta and Melilla, with the 2006 PNOA. The map only shows on its year bar the surveys that have a photo of the area you are looking at.'],
        ['Why are some PNOA years missing?', 'The National Aerial Orthophotography Plan does not fly the whole country every year: it takes turns between regions, so each area gets a new photo every two or three years. The photo labelled “Today” is the latest mosaic, which joins the newest photo of every area.'],
        ['Can I use the images or the videos I export?', 'Yes, citing the source. The orthophotos are licensed CC BY 4.0 by the Spanish National Cartographic System, and the videos and GIFs you export already carry the attribution. If you publish them, keep it visible.'],
        ['What data about me is stored?', 'Nothing linked to you. Searches and photos go through our server so that your IP is not exposed to the IGN and so they can be cached, and they only stay a few weeks in the server’s technical logs, as on any website. Videos are made in your own browser. Only if you accept, Google Analytics measures visits in aggregate.'],
        ['Why do some old photos look blurry or blank?', 'The first surveys were flown at lower resolution and in black and white, which shows at high zoom. If an area is blank, that survey did not cover it: pick another year or zoom out a little.'],
      ];

  const html = `      <section class="hero">
        ${compare(hero, l, true).replace('class="compare big"', 'class="compare big hero-compare"')}
        <div class="hero-copy">
          <div class="wrap">
            <p class="kicker light">${q('Fotografía aérea de España · 1956 → hoy', 'Aerial photography of Spain · 1956 → today')}</p>
            <h1>${q('Tu calle, <em>ayer</em>.', 'Your street, <em>yesterday</em>.')}</h1>
            <p class="lead">${q(
              'Escribe una dirección y mira cómo era ese lugar desde el aire hace setenta años. Desliza los años y verás crecer ciudades, desaparecer ríos y llenarse las costas.',
              'Type an address and see what that place looked like from the air seventy years ago. Slide through the years and watch cities grow, rivers vanish and coastlines fill up.',
            )}</p>
            <form class="hero-search" action="${R.map[l]}" method="get" role="search">
              <i data-icon="search" data-size="20"></i>
              <input name="q" type="search" autocomplete="off" enterkeyhint="search" placeholder="${q('Una calle, un pueblo, un lugar…', 'A street, a town, a place…')}" aria-label="${q('Buscar una dirección', 'Search an address')}" required />
              <button class="btn" type="submit">${q('Volar allí', 'Fly there')}</button>
            </form>
            <p class="hero-credit">${q('Benidorm en 1956 y hoy. Arrastra la línea.', 'Benidorm in 1956 and today. Drag the line.')} <a href="${placePath(hero, l)}">${q('Leer la historia de Benidorm', 'Read the story of Benidorm')}</a></p>
          </div>
        </div>
      </section>

      <section class="block steps-block">
        <div class="wrap">
          <ol class="steps">
            <li><span class="num">1</span><h2>${q('Busca', 'Search')}</h2><p>${q('Cualquier dirección, pueblo o paraje de España. El buscador es CartoCiudad, del propio IGN.', 'Any address, town or spot in Spain. The search uses CartoCiudad, from the IGN itself.')}</p></li>
            <li><span class="num">2</span><h2>${q('Desliza los años', 'Slide the years')}</h2><p>${q('Las fotos se funden de un vuelo al siguiente. Solo aparecen los años que tienen foto de esa zona.', 'The photos blend from one survey to the next. Only the years with a photo of that area appear.')}</p></li>
            <li><span class="num">3</span><h2>${q('Compara y comparte', 'Compare and share')}</h2><p>${q('Pon dos épocas lado a lado con la cortina, crea un timelapse en vídeo o GIF y comparte el enlace.', 'Put two periods side by side with the curtain, make a video or GIF timelapse and share the link.')}</p></li>
          </ol>
        </div>
      </section>

      <section class="block" id="${q('lugares', 'places')}">
        <div class="wrap">
          <div class="section-head">
            <p class="kicker">${q('Galería', 'Gallery')}</p>
            <h2>${q('Dieciocho lugares que ya no son lo que eran', 'Eighteen places that are not what they used to be')}</h2>
            <a class="text-link" href="${R.places[l]}">${q('Ver los 18 lugares', 'See all 18 places')}<i data-icon="arrowRight" data-size="15"></i></a>
          </div>
          <div class="grid-cards">
            ${PLACES.slice(0, 8)
              .map((p) => card(p, l))
              .join('\n            ')}
          </div>
        </div>
      </section>

      <section class="block coverage" id="${q('cobertura', 'coverage')}">
        <div class="wrap">
          <div class="section-head">
            <p class="kicker">${q('Qué fotos hay', 'Which photos exist')}</p>
            <h2>${q('Desde qué año hay foto de cada zona', 'From which year each area has a photo')}</h2>
          </div>
          <div class="cov-intro">
            <p class="lead">${q(
              'No hay una foto de cada sitio cada año. Los vuelos antiguos se hicieron con fines distintos y no siempre cubrieron todo el país; el PNOA, desde 2004, vuela una parte cada año.',
              'There is not a photo of every place every year. The old surveys were flown for different purposes and did not always cover the whole country; since 2004 the PNOA flies a part of it each year.',
            )}</p>
            <dl class="facts">
              <div><dt>${q('Península y Baleares', 'Mainland and Balearics')}</dt><dd>${q('Desde <b>1956</b>, casi sin huecos.', 'From <b>1956</b>, with almost no gaps.')}</dd></div>
              <div><dt>${q('Canarias', 'Canary Islands')}</dt><dd>${q('Desde <b>SIGPAC</b> (1997-2003). No está en los vuelos anteriores.', 'From <b>SIGPAC</b> (1997-2003). Not in the earlier surveys.')}</dd></div>
              <div><dt>${q('Ceuta y Melilla', 'Ceuta and Melilla')}</dt><dd>${q('Desde el <b>PNOA 2006</b>.', 'From the <b>2006 PNOA</b>.')}</dd></div>
              <div><dt>${q('Años setenta, ochenta y noventa', 'Seventies, eighties and nineties')}</dt><dd>${q('Solo en parte: mira los mapas.', 'Partial only: see the maps.')}</dd></div>
            </dl>
          </div>
          <h3 class="cov-title">${q('Los vuelos históricos', 'The historical surveys')}</h3>
          <div class="cov-grid big">
            ${old
              .map((s) => mini(s.id, s.label, NAMES[s.id]![es ? 0 : 1]))
              .join('\n            ')}
          </div>
          <h3 class="cov-title">${q('El PNOA, año a año', 'The PNOA, year by year')}</h3>
          <p class="cov-note">${q(
            'Cada mapa marca lo que se fotografió ese año. Fíjate en cómo las zonas se turnan: por eso cada lugar tiene una foto nueva cada dos o tres años.',
            'Each map marks what was photographed that year. Notice how regions take turns: that is why each place gets a new photo every two or three years.',
          )}</p>
          <div class="cov-grid">
            ${annual.map((s) => mini(s.id, s.label, '')).join('\n            ')}
          </div>
          <p class="cov-source">${q(
            'Mapas calculados a partir del servicio WMS de ortofotos históricas del IGN. Zona coloreada: hay foto.',
            'Maps computed from the IGN historical orthophoto WMS. Coloured area: there is a photo.',
          )}</p>
        </div>
      </section>

      <section class="block" id="${q('preguntas', 'faq')}">
        <div class="wrap two-col">
          <div class="section-head"><p class="kicker">${q('Preguntas', 'Questions')}</p><h2>${q('Lo que suele preguntarse', 'What people usually ask')}</h2></div>
          <div class="faq">
            ${faq.map(([k, v]) => `<details><summary>${esc(k)}<i data-icon="plus" data-size="18"></i></summary><p>${esc(v)}</p></details>`).join('\n            ')}
          </div>
        </div>
      </section>

      <section class="closing">
        <div class="wrap">
          <h2>${q('¿Cómo era tu calle?', 'What did your street look like?')}</h2>
          <a class="btn big" href="${R.map[l]}"><i data-icon="map"></i>${q('Abrir el mapa', 'Open the map')}</a>
        </div>
      </section>`;

  return {
    title: es ? 'Ayer · Fotos aéreas de España de 1956 a hoy, en un mapa' : 'Ayer · Aerial photos of Spain from 1956 to today, on a map',
    desc: es
      ? 'Busca cualquier lugar de España y mira cómo ha cambiado desde el aire, de 1956 a hoy, con las fotos aéreas históricas del IGN. Compara épocas, crea timelapses y compártelos.'
      : 'Search any place in Spain and see how it has changed from the air, from 1956 to today, with the IGN historical aerial photos. Compare periods, make timelapses and share them.',
    html,
  };
}
