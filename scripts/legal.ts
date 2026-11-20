// Legal pages and data credits. HTML fragments; scripts/pages.ts adds the layout.
interface Doc {
  path: string;
  title: string;
  desc: string;
  html: string;
}

const owner = (site: string) => `          <div class="card">
            <p><strong>Titular:</strong> Amin Tahtah Toumi</p>
            <p><strong>Correo electrónico:</strong> <a href="mailto:amintahtahtoumi@gmail.com">amintahtahtoumi@gmail.com</a></p>
            <p><strong>Sitio web:</strong> ${site}</p>
          </div>`;

const attribution = `<code>Vuelo Americano Serie B 1956-1957 CC-BY 4.0 scne.es</code>, <code>PNOA 2024 CC-BY 4.0 scne.es</code>`;

export const LEGAL: Doc[] = [
  {
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
  {
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
  {
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
  {
    path: '/creditos/',
    title: 'Créditos de los datos',
    desc: 'Origen, licencia y atribución de las fotos aéreas del IGN y de los datos de CartoCiudad que usa Ayer.',
    html: `          <p>Todas las fotos aéreas y los datos de direcciones de Ayer son del <strong>Instituto Geográfico Nacional de España (IGN)</strong> y del <strong>Sistema Cartográfico Nacional</strong>, publicados con licencia <a href="https://creativecommons.org/licenses/by/4.0/deed.es" target="_blank" rel="noopener">CC BY 4.0</a> según la <a href="https://www.ign.es/resources/licencia/Condiciones_licenciaUso_IGN.pdf" target="_blank" rel="noopener">Orden FOM/2807/2015 y las condiciones de uso del IGN</a>. Instituto Geográfico Nacional de España.</p>
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
            <li>Tipografías <a href="https://github.com/indestructible-type/Jost" target="_blank" rel="noopener">Jost</a> y <a href="https://github.com/quoteunquoteapps/CourierPrime" target="_blank" rel="noopener">Courier Prime</a>, licencia SIL Open Font License 1.1, servidas desde este dominio.</li>
            <li>Todos los iconos son de <a href="https://lucide.dev" target="_blank" rel="noopener">Lucide</a>, licencia ISC.</li>
          </ul>`,
  },
];
