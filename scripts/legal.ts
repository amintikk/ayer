// Legal pages and data credits, in Spanish and English. HTML fragments; scripts/pages.ts adds the layout.
interface Doc {
  path: string;
  title: string;
  desc: string;
  html: string;
}

const owner = (site: string, es = true) => `          <div class="card">
            <p><strong>${es ? 'Titular' : 'Owner'}:</strong> Amin Tahtah Toumi</p>
            <p><strong>${es ? 'Correo electrónico' : 'Email'}:</strong> <a href="mailto:amintahtahtoumi@gmail.com">amintahtahtoumi@gmail.com</a></p>
            <p><strong>${es ? 'Sitio web' : 'Website'}:</strong> ${site}</p>
          </div>`;

const attribution = `<code>Vuelo Americano Serie B 1956-1957 CC-BY 4.0 scne.es</code>, <code>PNOA 2024 CC-BY 4.0 scne.es</code>`;

export const LEGAL: { es: Doc; en: Doc }[] = [
  {
    es: {
      path: '/aviso-legal/',
      title: 'Aviso legal',
      desc: 'Datos del titular de Ayer (ayer.aminox.dev) y condiciones generales del sitio.',
      html: `          <p>En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI), estos son los datos del titular de este sitio web:</p>
${owner('ayer.aminox.dev')}
          <h2>Objeto</h2>
          <p>Ayer es un proyecto personal, gratuito, sin ánimo de lucro y de código abierto que muestra en un mapa las fotografías aéreas históricas publicadas por el Instituto Geográfico Nacional (IGN). No se venden productos ni servicios, no hay publicidad y no hace falta registrarse.</p>
          <h2>Relación con el IGN</h2>
          <p>Ayer no es un servicio oficial ni tiene relación con el IGN, el Centro Nacional de Información Geográfica (CNIG) ni el Ministerio de Transportes. Usa sus servicios públicos y sus datos según la licencia CC BY 4.0 que los acompaña, tal como se detalla en los <a href="/creditos/">créditos de los datos</a>.</p>
          <h2>Uso del sitio</h2>
          <p>El acceso es libre y gratuito. Al usarlo te comprometes a hacerlo de forma lícita y a no perjudicar su funcionamiento ni el de los servicios de los que depende, por ejemplo con descargas automatizadas masivas. Las condiciones detalladas están en los <a href="/terminos/">términos de uso</a> y el tratamiento de datos en la <a href="/privacidad/">política de privacidad</a>.</p>
          <h2>Propiedad intelectual</h2>
          <p>El código de Ayer se publica con licencia MIT en <a href="https://github.com/amintikk/ayer" target="_blank" rel="noopener">GitHub</a>. Las ortofotos y los datos de direcciones son propiedad del IGN y del Sistema Cartográfico Nacional y se usan con su licencia CC BY 4.0. Los textos de la galería son del titular y puedes citarlos con un enlace a la página.</p>
          <h2>Responsabilidad</h2>
          <p>Las imágenes se muestran tal como las publica el IGN, que puede cambiarlas o dejar de servirlas. Las fechas de los vuelos son las que indica el IGN y pueden abarcar varios años. Los textos de la galería tienen fin divulgativo; se procura que sean correctos, pero pueden contener errores. El titular no responde de los daños derivados del uso del sitio en la medida permitida por la ley.</p>
          <h2>Ley aplicable</h2>
          <p>Este aviso legal se rige por la legislación española.</p>`,
    },
    en: {
      path: '/en/legal-notice/',
      title: 'Legal notice',
      desc: 'Owner details of Ayer (ayer.aminox.dev) and general conditions of the site.',
      html: `          <p>In accordance with Spanish Law 34/2002 on information society services and electronic commerce (LSSI), these are the details of the owner of this website:</p>
${owner('ayer.aminox.dev', false)}
          <h2>Purpose</h2>
          <p>Ayer is a free, non-profit, open-source personal project that shows on a map the historical aerial photographs published by the Spanish National Geographic Institute (IGN). Nothing is sold, there is no advertising and no sign-up.</p>
          <h2>Relationship with the IGN</h2>
          <p>Ayer is not an official service and has no relationship with the IGN, the National Centre for Geographic Information (CNIG) or the Ministry of Transport. It uses their public services and data under the CC BY 4.0 licence that comes with them, as detailed in the <a href="/en/credits/">data credits</a>.</p>
          <h2>Use of the site</h2>
          <p>Access is free. By using it you agree to do so lawfully and not to harm its operation or that of the services it depends on, for example with massive automated downloads. The detailed conditions are in the <a href="/en/terms/">terms of use</a> and data processing in the <a href="/en/privacy/">privacy policy</a>.</p>
          <h2>Intellectual property</h2>
          <p>The code of Ayer is published under the MIT licence on <a href="https://github.com/amintikk/ayer" target="_blank" rel="noopener">GitHub</a>. The orthophotos and address data belong to the IGN and the Spanish National Cartographic System and are used under their CC BY 4.0 licence. The gallery texts are the owner’s and you may quote them with a link to the page.</p>
          <h2>Liability</h2>
          <p>The images are shown as published by the IGN, which may change them or stop serving them. Survey dates are those given by the IGN and may span several years. The gallery texts are for general information; care is taken to make them accurate, but they may contain errors. The owner is not liable for damage arising from the use of the site to the extent permitted by law.</p>
          <h2>Governing law</h2>
          <p>This legal notice is governed by Spanish law.</p>`,
    },
  },
  {
    es: {
      path: '/privacidad/',
      title: 'Privacidad y cookies',
      desc: 'Qué datos trata Ayer, para qué, cuánto tiempo y qué cookies usa (solo con tu consentimiento).',
      html: `          <p>Resumen: <strong>no hay cuentas ni formularios.</strong> Las fotos y las búsquedas pasan por nuestro servidor, que hace de intermediario con el IGN para que este no reciba tu dirección IP. Los vídeos y GIF se crean en tu navegador. <strong>Solo si lo aceptas</strong>, Google Analytics mide las visitas con cookies.</p>
          <h2>Responsable del tratamiento</h2>
${owner('ayer.aminox.dev')}
          <h2>Datos que se tratan y para qué</h2>
          <div class="card table-card">
            <table>
              <thead><tr><th>Dato</th><th>Finalidad</th><th>Base legal</th><th>Conservación</th></tr></thead>
              <tbody>
                <tr><td>Dirección IP, fecha, dirección pedida (incluye la zona del mapa o el texto buscado) y navegador, en los registros del servidor de entrada</td><td>Servir la web, seguridad y resolución de fallos</td><td>Interés legítimo (art. 6.1.f RGPD)</td><td>Hasta unas 5 semanas; se borran por rotación automática</td></tr>
                <tr><td>Datos de navegación de Google Analytics (páginas vistas, dispositivo, zona aproximada, identificador de cookie)</td><td>Saber cuántas personas usan la web y qué partes</td><td>Tu consentimiento (art. 6.1.a RGPD y art. 22.2 LSSI)</td><td>14 meses en Google Analytics; las cookies, hasta 2 años o hasta que las borres</td></tr>
                <tr><td>Correo que nos envíes</td><td>Responder a tu consulta</td><td>Tu consentimiento al escribirnos</td><td>El tiempo necesario para atenderla</td></tr>
              </tbody>
            </table>
          </div>
          <p>No se elaboran perfiles, no se toman decisiones automatizadas sobre ti y no se ceden datos a terceros salvo obligación legal.</p>
          <h2>El intermediario con el IGN</h2>
          <p>Las fotos aéreas y el buscador de direcciones son servicios públicos del IGN y de CartoCiudad. En lugar de que tu navegador los pida directamente, los pide nuestro servidor y guarda una copia temporal (caché) de las fotos. Así el IGN no recibe tu dirección IP ni tu navegador, y recibe menos peticiones. Nuestro servidor no envía al IGN ningún dato tuyo y no guarda registros propios de estas peticiones, más allá de los registros técnicos indicados arriba.</p>
          <h2>Cookies</h2>
          <p>Al entrar se te pregunta si aceptas la medición. Mientras no aceptes, <strong>no se carga ningún script de Google ni se instala ninguna cookie</strong>. Si aceptas, Google Analytics 4 instala estas cookies:</p>
          <div class="card table-card">
            <table>
              <thead><tr><th>Cookie</th><th>Titular</th><th>Finalidad</th><th>Duración</th></tr></thead>
              <tbody>
                <tr><td><code>_ga</code></td><td>Google</td><td>Distinguir visitantes de forma anónima</td><td>2 años</td></tr>
                <tr><td><code>_ga_&lt;id&gt;</code></td><td>Google</td><td>Mantener el estado de la sesión</td><td>2 años</td></tr>
              </tbody>
            </table>
          </div>
          <p>Google actúa como encargado del tratamiento y puede tratar los datos fuera del Espacio Económico Europeo con las garantías del Marco de Privacidad de Datos UE-EE. UU. y las cláusulas contractuales tipo. <a href="https://policies.google.com/privacy?hl=es" target="_blank" rel="noopener">Política de privacidad de Google</a>. Puedes cambiar de opinión cuando quieras con el enlace «Preferencias de cookies» del pie de página; si retiras el consentimiento, se borran las cookies de Analytics de este sitio.</p>
          <h2>Almacenamiento local</h2>
          <p>Sin enviarlo a ningún servidor, tu navegador guarda en localStorage el tema claro u oscuro y tu respuesta sobre las cookies. Es necesario para prestar el servicio que pides, por lo que no requiere consentimiento.</p>
          <h2>Proveedores que intervienen</h2>
          <ul>
            <li><strong>Oracle Cloud</strong> (servidor en Madrid, UE): aloja la web y la caché de fotos.</li>
            <li><strong>Cloudflare</strong> (red de entrega y seguridad): recibe tu dirección IP al visitar la web. Puede tratarla fuera del EEE con las garantías del Marco de Privacidad de Datos UE-EE. UU. y las cláusulas contractuales tipo. <a href="https://www.cloudflare.com/es-es/privacypolicy/" target="_blank" rel="noopener">Política de Cloudflare</a>.</li>
            <li><strong>Google</strong> (solo si aceptas la medición): Google Analytics 4.</li>
          </ul>
          <h2>Tus derechos</h2>
          <p>Puedes pedir el acceso, la rectificación, la supresión, la oposición, la limitación y la portabilidad de tus datos escribiendo al correo de arriba. Si crees que no se han respetado tus derechos, puedes reclamar ante la <a href="https://www.aepd.es" target="_blank" rel="noopener">Agencia Española de Protección de Datos</a>. Como no hay cuentas, normalmente no podremos relacionar una dirección IP de los registros con una persona.</p>
          <h2>Cambios</h2>
          <p>Si esta política cambia, se publicará aquí con su nueva fecha.</p>`,
    },
    en: {
      path: '/en/privacy/',
      title: 'Privacy and cookies',
      desc: 'What data Ayer processes, why, for how long, and which cookies it uses (only with your consent).',
      html: `          <p>Summary: <strong>there are no accounts or forms.</strong> Photos and searches go through our server, which acts as an intermediary with the IGN so that it does not receive your IP address. Videos and GIFs are made in your browser. <strong>Only if you accept</strong>, Google Analytics measures visits with cookies.</p>
          <h2>Data controller</h2>
${owner('ayer.aminox.dev', false)}
          <h2>Data processed and why</h2>
          <div class="card table-card">
            <table>
              <thead><tr><th>Data</th><th>Purpose</th><th>Legal basis</th><th>Retention</th></tr></thead>
              <tbody>
                <tr><td>IP address, date, requested address (including the map area or the search text) and browser, in the front server logs</td><td>Serving the site, security and troubleshooting</td><td>Legitimate interest (art. 6.1.f GDPR)</td><td>Up to about 5 weeks; deleted by automatic rotation</td></tr>
                <tr><td>Google Analytics browsing data (pages viewed, device, approximate area, cookie identifier)</td><td>Knowing how many people use the site and which parts</td><td>Your consent (art. 6.1.a GDPR and art. 22.2 LSSI)</td><td>14 months in Google Analytics; cookies up to 2 years or until you delete them</td></tr>
                <tr><td>Email you send us</td><td>Answering your query</td><td>Your consent when writing to us</td><td>As long as needed to deal with it</td></tr>
              </tbody>
            </table>
          </div>
          <p>No profiles are built, no automated decisions are made about you and no data is shared with third parties unless required by law.</p>
          <h2>The intermediary with the IGN</h2>
          <p>The aerial photos and the address search are public services of the IGN and CartoCiudad. Instead of your browser requesting them directly, our server requests them and keeps a temporary copy (cache) of the photos. That way the IGN does not receive your IP address or browser details, and gets fewer requests. Our server sends none of your data to the IGN and keeps no logs of its own of these requests beyond the technical logs listed above.</p>
          <h2>Cookies</h2>
          <p>When you arrive you are asked whether you accept measurement. Until you accept, <strong>no Google script is loaded and no cookie is set</strong>. If you accept, Google Analytics 4 sets these cookies:</p>
          <div class="card table-card">
            <table>
              <thead><tr><th>Cookie</th><th>Owner</th><th>Purpose</th><th>Duration</th></tr></thead>
              <tbody>
                <tr><td><code>_ga</code></td><td>Google</td><td>Telling visitors apart anonymously</td><td>2 years</td></tr>
                <tr><td><code>_ga_&lt;id&gt;</code></td><td>Google</td><td>Keeping the session state</td><td>2 years</td></tr>
              </tbody>
            </table>
          </div>
          <p>Google acts as data processor and may process data outside the European Economic Area under the EU-US Data Privacy Framework and standard contractual clauses. <a href="https://policies.google.com/privacy?hl=en" target="_blank" rel="noopener">Google privacy policy</a>. You can change your mind at any time with the “Cookie preferences” link in the footer; if you withdraw consent, the Analytics cookies of this site are deleted.</p>
          <h2>Local storage</h2>
          <p>Without sending it to any server, your browser keeps in localStorage the light or dark theme and your answer about cookies. This is necessary to provide the service you ask for, so it does not require consent.</p>
          <h2>Providers involved</h2>
          <ul>
            <li><strong>Oracle Cloud</strong> (server in Madrid, EU): hosts the site and the photo cache.</li>
            <li><strong>Cloudflare</strong> (delivery and security network): receives your IP address when you visit. It may process it outside the EEA under the EU-US Data Privacy Framework and standard contractual clauses. <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">Cloudflare policy</a>.</li>
            <li><strong>Google</strong> (only if you accept measurement): Google Analytics 4.</li>
          </ul>
          <h2>Your rights</h2>
          <p>You can request access, rectification, erasure, objection, restriction and portability of your data by writing to the email above. If you believe your rights have not been respected, you can complain to the <a href="https://www.aepd.es" target="_blank" rel="noopener">Spanish Data Protection Agency</a>. As there are no accounts, we will usually be unable to link an IP address in the logs to a person.</p>
          <h2>Changes</h2>
          <p>If this policy changes, it will be published here with its new date.</p>`,
    },
  },
  {
    es: {
      path: '/terminos/',
      title: 'Términos de uso',
      desc: 'Condiciones de uso de Ayer y de las imágenes y vídeos que exportas.',
      html: `          <h2>El servicio</h2>
          <p>Ayer te deja ver, comparar y exportar fotos aéreas del IGN. Se ofrece gratis, tal cual y sin garantía de disponibilidad: depende de los servicios del IGN y de CartoCiudad, que pueden fallar, cambiar o dejar de estar disponibles.</p>
          <h2>Uso aceptable</h2>
          <ul>
            <li>Úsalo de forma personal, educativa, periodística o profesional, pero sin automatizar descargas masivas de teselas o imágenes a través de este sitio. Si necesitas las ortofotos completas, descárgalas del <a href="https://centrodedescargas.cnig.es" target="_blank" rel="noopener">Centro de Descargas del CNIG</a>.</li>
            <li>No intentes saltarte los límites del servidor ni usarlo como intermediario para otros fines.</li>
          </ul>
          <h2>Imágenes, vídeos y GIF que exportas</h2>
          <p>Las fotos tienen licencia <a href="https://creativecommons.org/licenses/by/4.0/deed.es" target="_blank" rel="noopener">CC BY 4.0</a> del Sistema Cartográfico Nacional. Puedes usar lo que exportes para cualquier fin, también comercial, siempre que mantengas visible la atribución que lleva sobreimpresa (por ejemplo ${attribution}) o la cites junto a la publicación. La marca «ayer.aminox.dev» del vídeo es opcional para ti; la atribución al IGN no.</p>
          <h2>Enlaces compartidos</h2>
          <p>Los enlaces que compartes contienen la posición, el zoom y los años elegidos. Quien los abra verá esa misma vista. No incluyen ningún dato tuyo.</p>
          <h2>Cambios</h2>
          <p>Estos términos pueden cambiar; la versión vigente es la publicada aquí. Se rigen por la legislación española.</p>`,
    },
    en: {
      path: '/en/terms/',
      title: 'Terms of use',
      desc: 'Conditions of use of Ayer and of the images and videos you export.',
      html: `          <h2>The service</h2>
          <p>Ayer lets you view, compare and export IGN aerial photos. It is offered for free, as is, with no guarantee of availability: it depends on IGN and CartoCiudad services, which may fail, change or stop being available.</p>
          <h2>Acceptable use</h2>
          <ul>
            <li>Use it for personal, educational, journalistic or professional purposes, but do not automate massive downloads of tiles or images through this site. If you need the full orthophotos, download them from the <a href="https://centrodedescargas.cnig.es" target="_blank" rel="noopener">CNIG Download Centre</a>.</li>
            <li>Do not try to bypass the server limits or use it as an intermediary for other purposes.</li>
          </ul>
          <h2>Images, videos and GIFs you export</h2>
          <p>The photos are licensed <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a> by the Spanish National Cartographic System. You can use what you export for any purpose, including commercial, as long as you keep the attribution printed on it visible (for example ${attribution}) or cite it next to the publication. The “ayer.aminox.dev” mark on the video is optional for you; the IGN attribution is not.</p>
          <h2>Shared links</h2>
          <p>The links you share contain the position, zoom and chosen years. Whoever opens them sees that same view. They include no data about you.</p>
          <h2>Changes</h2>
          <p>These terms may change; the version in force is the one published here. They are governed by Spanish law.</p>`,
    },
  },
  {
    es: {
      path: '/creditos/',
      title: 'Créditos de los datos',
      desc: 'Origen, licencia y atribución de las fotos aéreas del IGN y de los datos de CartoCiudad que usa Ayer.',
      html: `          <p>Todas las fotos aéreas y los datos de direcciones de Ayer son del <strong>Instituto Geográfico Nacional de España (IGN)</strong> y del <strong>Sistema Cartográfico Nacional</strong>, publicados con licencia <a href="https://creativecommons.org/licenses/by/4.0/deed.es" target="_blank" rel="noopener">CC BY 4.0</a> según la <a href="https://www.ign.es/resources/licencia/Condiciones_licenciaUso_IGN.pdf" target="_blank" rel="noopener">Orden FOM/2807/2015 y las condiciones de uso del IGN</a>. © Instituto Geográfico Nacional de España.</p>
          <p>Siguiendo esas condiciones, el mapa muestra a pie de imagen la mención de cada vuelo visible con la forma «&lt;producto&gt; &lt;fecha&gt; CC-BY 4.0 scne.es», y los vídeos y GIF exportados la llevan sobreimpresa.</p>
          <h2>Ortofotos</h2>
          <div class="card table-card">
            <table>
              <thead><tr><th>Vuelo</th><th>Servicio</th><th>Capa</th><th>Atribución</th></tr></thead>
              <tbody>
                <tr><td>Vuelo Americano, serie B (1956-1957)</td><td rowspan="5">WMS <code>ign.es/wms/pnoa-historico</code></td><td><code>AMS_1956-1957</code></td><td>Vuelo Americano Serie B 1956-1957 CC-BY 4.0 scne.es</td></tr>
                <tr><td>Vuelo Interministerial (1973-1986)</td><td><code>Interministerial_1973-1986</code></td><td>Vuelo Interministerial 1973-1986 CC-BY 4.0 scne.es</td></tr>
                <tr><td>Vuelo Nacional (1981-1986)</td><td><code>Nacional_1981-1986</code></td><td>Vuelo Nacional 1981-1986 CC-BY 4.0 scne.es</td></tr>
                <tr><td>OLISTAT (1997-1998)</td><td><code>OLISTAT</code></td><td>OLISTAT 1997-1998 CC-BY 4.0 scne.es</td></tr>
                <tr><td>SIGPAC (1997-2003)</td><td><code>SIGPAC</code></td><td>SIGPAC 1997-2003 CC-BY 4.0 scne.es</td></tr>
                <tr><td>PNOA anual (2004-2024)</td><td>WMS <code>ign.es/wms/pnoa-historico</code></td><td><code>PNOA2004</code> … <code>PNOA2024</code></td><td>PNOA &lt;año&gt; CC-BY 4.0 scne.es</td></tr>
                <tr><td>PNOA de máxima actualidad («Hoy»)</td><td>WMTS <code>ign.es/wmts/pnoa-ma</code></td><td><code>OI.OrthoimageCoverage</code></td><td>PNOA máxima actualidad CC-BY 4.0 scne.es</td></tr>
                <tr><td>Nombres y calles (opcional)</td><td>WMTS <code>ign.es/wmts/ign-base</code></td><td><code>IGNBaseOrto</code></td><td>IGN Base CC-BY 4.0 scne.es</td></tr>
              </tbody>
            </table>
          </div>
          <h2>Direcciones</h2>
          <p>El buscador usa el geocodificador de <a href="https://www.cartociudad.es" target="_blank" rel="noopener">CartoCiudad</a> (CNIG), cuya política de uso permite el uso libre y gratuito, comercial o no, mencionando su procedencia: CartoCiudad CC-BY 4.0 scne.es.</p>
          <h2>Cómo se usan</h2>
          <p>Las imágenes se muestran sin modificar. Para la galería y las imágenes de previsualización se recortan y se ponen lado a lado; los mapas de cobertura de la portada son una obra derivada calculada a partir de los mismos servicios («Obra derivada de PNOA y vuelos históricos CC-BY 4.0 scne.es»). El servidor de Ayer guarda una caché temporal de las teselas que se piden para reducir la carga sobre los servicios del IGN.</p>
          <h2>Software y tipografías</h2>
          <ul>
            <li><a href="https://maplibre.org" target="_blank" rel="noopener">MapLibre GL JS</a>, licencia BSD-3-Clause.</li>
            <li><a href="https://github.com/Vanilagy/mp4-muxer" target="_blank" rel="noopener">mp4-muxer</a> y <a href="https://github.com/Vanilagy/webm-muxer" target="_blank" rel="noopener">webm-muxer</a>, licencia MIT.</li>
            <li><a href="https://github.com/mattdesl/gifenc" target="_blank" rel="noopener">gifenc</a>, licencia MIT.</li>
            <li>Tipografías <a href="https://github.com/productiontype/Newsreader" target="_blank" rel="noopener">Newsreader</a> e <a href="https://github.com/Instrument/instrument-sans" target="_blank" rel="noopener">Instrument Sans</a>, licencia SIL Open Font License 1.1, servidas desde este dominio.</li>
            <li>Iconos con la geometría de <a href="https://lucide.dev" target="_blank" rel="noopener">Lucide</a>, licencia ISC.</li>
          </ul>`,
    },
    en: {
      path: '/en/credits/',
      title: 'Data credits',
      desc: 'Origin, licence and attribution of the IGN aerial photos and the CartoCiudad data used by Ayer.',
      html: `          <p>All aerial photos and address data in Ayer come from the <strong>Spanish National Geographic Institute (IGN)</strong> and the <strong>Spanish National Cartographic System</strong>, published under the <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a> licence according to <a href="https://www.ign.es/resources/licencia/Condiciones_licenciaUso_IGN.pdf" target="_blank" rel="noopener">Order FOM/2807/2015 and the IGN conditions of use</a>. © Instituto Geográfico Nacional de España.</p>
          <p>Following those conditions, the map shows below the image the credit of every visible survey in the form “&lt;product&gt; &lt;date&gt; CC-BY 4.0 scne.es”, and exported videos and GIFs carry it printed on them.</p>
          <h2>Orthophotos</h2>
          <div class="card table-card">
            <table>
              <thead><tr><th>Survey</th><th>Service</th><th>Layer</th><th>Attribution</th></tr></thead>
              <tbody>
                <tr><td>American Flight, series B (1956-1957)</td><td rowspan="5">WMS <code>ign.es/wms/pnoa-historico</code></td><td><code>AMS_1956-1957</code></td><td>Vuelo Americano Serie B 1956-1957 CC-BY 4.0 scne.es</td></tr>
                <tr><td>Interministerial Flight (1973-1986)</td><td><code>Interministerial_1973-1986</code></td><td>Vuelo Interministerial 1973-1986 CC-BY 4.0 scne.es</td></tr>
                <tr><td>National Flight (1981-1986)</td><td><code>Nacional_1981-1986</code></td><td>Vuelo Nacional 1981-1986 CC-BY 4.0 scne.es</td></tr>
                <tr><td>OLISTAT (1997-1998)</td><td><code>OLISTAT</code></td><td>OLISTAT 1997-1998 CC-BY 4.0 scne.es</td></tr>
                <tr><td>SIGPAC (1997-2003)</td><td><code>SIGPAC</code></td><td>SIGPAC 1997-2003 CC-BY 4.0 scne.es</td></tr>
                <tr><td>Annual PNOA (2004-2024)</td><td>WMS <code>ign.es/wms/pnoa-historico</code></td><td><code>PNOA2004</code> … <code>PNOA2024</code></td><td>PNOA &lt;year&gt; CC-BY 4.0 scne.es</td></tr>
                <tr><td>Latest PNOA mosaic (“Today”)</td><td>WMTS <code>ign.es/wmts/pnoa-ma</code></td><td><code>OI.OrthoimageCoverage</code></td><td>PNOA máxima actualidad CC-BY 4.0 scne.es</td></tr>
                <tr><td>Names and streets (optional)</td><td>WMTS <code>ign.es/wmts/ign-base</code></td><td><code>IGNBaseOrto</code></td><td>IGN Base CC-BY 4.0 scne.es</td></tr>
              </tbody>
            </table>
          </div>
          <h2>Addresses</h2>
          <p>The search uses the <a href="https://www.cartociudad.es" target="_blank" rel="noopener">CartoCiudad</a> geocoder (CNIG), whose usage policy allows free use, commercial or not, citing its origin: CartoCiudad CC-BY 4.0 scne.es.</p>
          <h2>How they are used</h2>
          <p>The images are shown unmodified. For the gallery and the preview images they are cropped and placed side by side; the coverage maps on the home page are a derived work computed from the same services (“Derived from PNOA and historical surveys CC-BY 4.0 scne.es”). The Ayer server keeps a temporary cache of the requested tiles to reduce the load on the IGN services.</p>
          <h2>Software and typefaces</h2>
          <ul>
            <li><a href="https://maplibre.org" target="_blank" rel="noopener">MapLibre GL JS</a>, BSD-3-Clause licence.</li>
            <li><a href="https://github.com/Vanilagy/mp4-muxer" target="_blank" rel="noopener">mp4-muxer</a> and <a href="https://github.com/Vanilagy/webm-muxer" target="_blank" rel="noopener">webm-muxer</a>, MIT licence.</li>
            <li><a href="https://github.com/mattdesl/gifenc" target="_blank" rel="noopener">gifenc</a>, MIT licence.</li>
            <li><a href="https://github.com/productiontype/Newsreader" target="_blank" rel="noopener">Newsreader</a> and <a href="https://github.com/Instrument/instrument-sans" target="_blank" rel="noopener">Instrument Sans</a> typefaces, SIL Open Font License 1.1, served from this domain.</li>
            <li>Icons with <a href="https://lucide.dev" target="_blank" rel="noopener">Lucide</a> geometry, ISC licence.</li>
          </ul>`,
    },
  },
];
