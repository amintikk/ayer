// Editorial text of every gallery page. Plain text; one string per paragraph.
interface Text {
  dek: string;
  body: string[];
  look: string[];
}

export const PLACE_TEXT: Record<string, Text> = {
  benidorm: {
    dek: 'De pueblo de pescadores a la ciudad con más rascacielos por habitante de Europa.',
    body: [
      'En la foto de 1956 Benidorm es un pueblo blanco apretado en torno a la punta del Castell, con dos playas casi vacías a cada lado y huertos de secano que llegan hasta la arena. Ese mismo año el ayuntamiento aprobó un plan de ordenación que apostaba por el turismo y por edificar en altura dejando espacio libre alrededor de cada bloque.',
      'Las fotos de los años noventa y dos mil enseñan el resultado: la avenida del Mediterráneo y la de Europa se llenan de torres, la playa de Poniente se urbaniza hasta La Cala y los barrancos que bajaban de la sierra desaparecen bajo calles. El vuelo más reciente deja ver los últimos rascacielos, que pasan de los 180 metros.',
    ],
    look: ['La forma de la playa de Levante, casi igual en 1956 que hoy.', 'Los campos en terrazas detrás del pueblo, donde ahora está el centro de la ciudad.', 'La sombra de las torres, que en la foto actual cae sobre manzanas enteras.'],
  },
  'puerto-banus-marbella': {
    dek: 'Un puerto deportivo de lujo donde en 1956 solo había huertas y una playa.',
    body: [
      'En 1956 la costa entre Marbella y San Pedro Alcántara es una franja de cultivos, cañaverales y alguna finca aislada, cortada por la antigua carretera de Cádiz. No hay ningún puerto ni urbanización a la vista.',
      'Puerto Banús se inauguró en 1970 como un pueblo marinero de nueva planta con dársena para yates. Alrededor creció Nueva Andalucía, con campos de golf y urbanizaciones que suben hacia la sierra. Comparando los años se ve cómo la mancha urbana rellena primero la línea de costa y después los valles del interior.',
    ],
    look: ['Los espigones del puerto, que cambian la forma de las playas vecinas.', 'La autovía, que en las fotos antiguas es una carretera estrecha.', 'Los campos de golf de Nueva Andalucía, verdes incluso en verano.'],
  },
  'aeropuerto-madrid-barajas': {
    dek: 'De aeródromo con pistas cortas a uno de los mayores aeropuertos de Europa.',
    body: [
      'Barajas abrió en 1931. En la foto de 1956 es todavía un aeródromo modesto rodeado de campos de cereal, con pocas pistas y una terminal pequeña junto al pueblo de Barajas.',
      'Las ampliaciones de los años noventa y dos mil lo convirtieron en un aeropuerto de cuatro pistas paralelas dos a dos. La T4, abierta en 2006, ocupa terrenos que en las fotos antiguas eran tierras de labor y el cauce del Jarama tuvo que acomodarse a las nuevas pistas.',
    ],
    look: ['La T4 y su satélite, con sus cubiertas onduladas.', 'El trazado del río Jarama al este de las pistas.', 'Los pueblos de alrededor, que en 1956 aparecen separados por campos.'],
  },
  'bilbao-guggenheim-abandoibarra': {
    dek: 'Muelles, vías y astilleros convertidos en el escaparate del nuevo Bilbao.',
    body: [
      'En las fotos antiguas la orilla izquierda de la ría en Abandoibarra es puerto e industria: muelles de carga, playas de vías, almacenes y, aguas abajo, el astillero Euskalduna, que cerró en 1988.',
      'El Museo Guggenheim abrió en 1997 y fue la pieza más visible de la regeneración de la ría. Le siguieron el Palacio Euskalduna, un parque de ribera, la universidad y la Torre Iberdrola. Con el deslizador se ve cómo las vías y los tinglados se sustituyen por paseos y edificios singulares.',
    ],
    look: ['Las cubiertas de titanio del museo, que brillan en la foto actual.', 'El puente de La Salve, que el museo abraza por debajo.', 'Las gradas del antiguo astillero, junto al Palacio Euskalduna.'],
  },
  'valencia-ciudad-artes-ciencias': {
    dek: 'El río que ya no pasa por Valencia y lo que se construyó en su cauce.',
    body: [
      'La foto de 1956 es anterior a la gran riada de octubre de 1957. Por eso se ve el Turia atravesando la ciudad por su cauce natural, con huertas a ambos lados y la desembocadura junto al puerto.',
      'Tras la riada, el Plan Sur desvió el río por un nuevo cauce al sur de la ciudad, y el antiguo se convirtió en el Jardín del Turia. En su tramo final se levantó la Ciudad de las Artes y las Ciencias, que abrió por fases desde 1998. Las fotos de SIGPAC y de los primeros PNOA muestran los edificios a medio construir.',
    ],
    look: ['El agua del Turia en 1956, donde hoy hay jardines.', 'El nuevo cauce del río, al sur, en las fotos más recientes.', 'Los edificios blancos a medio hacer en los vuelos de 1997 a 2005.'],
  },
  'el-ejido-invernaderos': {
    dek: 'El mar de plástico que se ve desde el espacio, campo a campo.',
    body: [
      'En 1956 el Campo de Dalías es una llanura semidesértica entre la sierra de Gádor y el mar, con algunas acequias y casas dispersas. El tono claro de la foto es tierra desnuda.',
      'A partir de los años sesenta el cultivo enarenado y después el invernadero de plástico transformaron la comarca. Hoy la provincia de Almería tiene más de 30.000 hectáreas de invernaderos y El Ejido, que se segregó de Dalías en 1982, es su centro. El deslizador enseña cómo los rectángulos blancos van tapando el suelo año a año.',
    ],
    look: ['Las balsas de riego, manchas oscuras entre los invernaderos.', 'El núcleo de El Ejido, que en 1956 es apenas un cruce de caminos.', 'Las ramblas, que el plástico respeta a duras penas.'],
  },
  'puerto-de-barcelona': {
    dek: 'Un puerto que creció hacia el sur hasta mover la desembocadura de un río.',
    body: [
      'En 1956 el puerto de Barcelona se limita a los muelles junto a la ciudad y la montaña de Montjuïc. Al sur, el delta del Llobregat es un paisaje de huertas, lagunas y playa.',
      'Para ganar espacio, el puerto se amplió con nuevos diques y muelles, y en 2004 la desembocadura del Llobregat se desvió unos kilómetros al sur. Las fotos recientes muestran las terminales de contenedores, la zona logística y el nuevo cauce del río.',
    ],
    look: ['El antiguo cauce final del Llobregat, ocupado hoy por muelles.', 'Los diques de abrigo, cada vez más largos.', 'Las pilas de contenedores, como píxeles de colores.'],
  },
  'sevilla-isla-cartuja-expo-92': {
    dek: 'De huertas junto a un monasterio a recinto de la Exposición Universal.',
    body: [
      'En la foto de 1956 la Cartuja es una vega de huertas entre dos brazos del Guadalquivir, con el monasterio de Santa María de las Cuevas y su fábrica de loza como únicas construcciones grandes.',
      'Para la Expo 92 la isla se urbanizó entera: pabellones, lagos, nuevas avenidas y puentes como el del Alamillo, de Calatrava. Después de la exposición el recinto se convirtió en un parque tecnológico y, más tarde, apareció la Torre Sevilla. Las fotos de 1997 en adelante enseñan la Expo ya cerrada, con muchos pabellones aún en pie.',
    ],
    look: ['El monasterio, que aparece igual en todas las épocas.', 'El puente del Alamillo y su mástil inclinado.', 'Los solares que dejaron los pabellones desmontados.'],
  },
  'barcelona-vila-olimpica': {
    dek: 'Fábricas y vías junto al mar que se convirtieron en barrio para los Juegos de 1992.',
    body: [
      'En las fotos antiguas, el litoral del Poblenou es una sucesión de fábricas, almacenes y vías de tren que separan la ciudad del mar. Las playas son estrechas y casi inaccesibles.',
      'Con los Juegos Olímpicos de 1992 se levantaron las vías, se abrieron playas y paseos y se construyó la Vila Olímpica, el Port Olímpic y las dos torres gemelas. El deslizador muestra un caso claro de ciudad que se da la vuelta hacia el mar.',
    ],
    look: ['Las vías del tren paralelas a la costa en 1956.', 'Las dos torres junto al Port Olímpic.', 'La anchura de la playa, mucho mayor tras la regeneración.'],
  },
  torrevieja: {
    dek: 'Entre dos lagunas saladas, una de las ciudades que más ha crecido de España.',
    body: [
      'En 1956 Torrevieja es un pequeño pueblo salinero y pesquero junto al mar, con la gran laguna salada a un lado y campos de secano alrededor.',
      'Desde los años setenta las urbanizaciones de segunda residencia ocuparon la costa y el terreno entre las lagunas de Torrevieja y La Mata. En las fotos recientes casi no queda suelo sin construir fuera de las propias lagunas, que hoy son parque natural.',
    ],
    look: ['El color de la laguna de Torrevieja, que cambia según el año y la sal.', 'Las urbanizaciones de casas bajas, con piscinas como puntos azules.', 'El puerto y sus diques, más grandes en cada vuelo.'],
  },
  'sesena-el-quinon': {
    dek: 'Una ciudad de miles de pisos levantada en pocos años en medio del campo.',
    body: [
      'Aquí la comparación empieza en el vuelo de SIGPAC, alrededor del año 2000, cuando el lugar es todavía un paisaje de cereal y caminos. La foto de 1956 muestra lo mismo: campo.',
      'El Quiñón se construyó a mediados de los dos mil con un plan de más de diez mil viviendas, de las que solo se terminó una parte antes de la crisis de 2008. Los PNOA anuales de esta zona, muy frecuentes, permiten seguir la obra casi año a año, con manzanas a medio hacer y calles sin edificios.',
    ],
    look: ['Las manzanas completas frente a las parcelas que quedaron vacías.', 'El cambio entre 2004 y 2008, casi de un vuelo a otro.', 'Las grandes rotondas trazadas antes que los edificios.'],
  },
  'madrid-cuatro-torres': {
    dek: 'Del límite norte de Madrid a su perfil de rascacielos.',
    body: [
      'En 1956 este lugar está en las afueras: la Castellana todavía no llega hasta aquí y alrededor hay campos, caminos y alguna instalación aislada.',
      'Durante décadas los terrenos fueron la Ciudad Deportiva del Real Madrid, visible en los vuelos intermedios con sus campos de fútbol. Tras su venta se levantaron las Cuatro Torres, terminadas hacia 2008, y años después una quinta. El deslizador enseña cómo los campos de entrenamiento se convierten en el distrito financiero.',
    ],
    look: ['Los campos de fútbol de la antigua Ciudad Deportiva.', 'Las sombras alargadas de las torres en la foto actual.', 'El final de la Castellana, que avanza hacia el norte.'],
  },
  'zaragoza-expo-2008': {
    dek: 'Un meandro del Ebro con huertas que se convirtió en recinto de la Expo del agua.',
    body: [
      'En la foto de 1956 el meandro de Ranillas es tierra de huerta rodeada por el Ebro, sin puentes ni edificios cerca, a las afueras de Zaragoza.',
      'La Exposición Internacional de 2008, dedicada al agua y el desarrollo sostenible, ocupó el meandro con pabellones, el Palacio de Congresos, la Torre del Agua y el Pabellón Puente. Al lado se creó el Parque del Agua. Los vuelos de 2006 y 2009 muestran el antes y el después inmediato de las obras.',
    ],
    look: ['La curva del Ebro, igual en todas las épocas.', 'El Pabellón Puente cruzando el río.', 'Las parcelas de huerta que se mantienen en el parque.'],
  },
  'salou-portaventura': {
    dek: 'Un parque temático entre Salou y Vila-seca, sobre antiguos campos.',
    body: [
      'En 1956 la zona entre Salou y Vila-seca es campo: algarrobos, avellanos y viña, con la vía del tren y la costa casi sin construir.',
      'PortAventura abrió en 1995 y en los vuelos posteriores se ven sus zonas temáticas, el lago central y las montañas rusas, además de hoteles y campos de golf. Salou crece a la vez a lo largo de la costa.',
    ],
    look: ['El lago central del parque.', 'El trazado de las montañas rusas, visible desde el aire.', 'Los campos que aún quedan alrededor.'],
  },
  'magaluf-calvia': {
    dek: 'Una bahía de pinares en Mallorca que se convirtió en destino de masas.',
    body: [
      'En 1956 la bahía de Magaluf tiene pinares, dunas y una playa sin edificios, con la isla de sa Porrassa enfrente y algunas casas dispersas.',
      'El turismo de los años sesenta y setenta llenó la primera línea de hoteles y apartamentos, y después las laderas de urbanizaciones. Las fotos recientes muestran una costa construida casi sin interrupción entre Palmanova y Magaluf.',
    ],
    look: ['La línea de costa, que se mantiene mientras todo lo demás cambia.', 'Los pinares que sobreviven en las laderas.', 'Las piscinas de los hoteles.'],
  },
  'maspalomas-playa-del-ingles': {
    dek: 'Dunas y urbanizaciones en Gran Canaria, donde la foto más antigua es de hacia el año 2000.',
    body: [
      'Canarias no está en el vuelo de 1956 ni en los de los años setenta y ochenta que publica el IGN, así que aquí la comparación empieza con las ortofotos de SIGPAC. Para entonces Playa del Inglés y Maspalomas ya estaban construidas: el gran cambio había ocurrido entre los años sesenta y ochenta.',
      'Lo que sí se ve de un vuelo a otro es la vida de las dunas, protegidas como reserva natural, que se desplazan y pierden arena, y el relleno de los últimos huecos entre hoteles.',
    ],
    look: ['La forma de las dunas, distinta en cada vuelo.', 'La charca de Maspalomas, junto al faro.', 'Las parcelas vacías que se van ocupando.'],
  },
  'embalse-de-riano': {
    dek: 'Un valle con nueve pueblos que quedó bajo el agua en 1987.',
    body: [
      'Las fotos de 1956 y del vuelo interministerial muestran el valle del Esla en la montaña de León: el pueblo de Riaño en el fondo, prados, caminos y la confluencia de los ríos.',
      'La presa se cerró en 1987, tras un largo conflicto con los vecinos, y el embalse inundó nueve pueblos. Riaño se reconstruyó en la ladera. Desde los vuelos de finales de los noventa el valle es un lago, y en años secos asoman restos de los antiguos caminos.',
    ],
    look: ['El pueblo antiguo de Riaño, en el fondo del valle en 1956.', 'El nuevo Riaño, en la ladera, en las fotos recientes.', 'El nivel del agua, que cambia de un año a otro.'],
  },
  'aeropuerto-barcelona-el-prat': {
    dek: 'Un aeropuerto que creció sobre el delta del Llobregat.',
    body: [
      'En 1956 el aeropuerto de El Prat ocupa una parte pequeña del delta, rodeado de huertas, lagunas y la playa. Las pistas son cortas y la terminal, modesta.',
      'Con los años llegaron pistas más largas, la tercera pista junto al mar en 2004 y la terminal T1, abierta en 2009. Las fotos muestran cómo el aeropuerto se encaja entre el mar, los espacios naturales protegidos del delta y el puerto vecino.',
    ],
    look: ['La tercera pista, paralela a la playa.', 'La T1 y su forma de ala.', 'Las lagunas del delta que siguen entre las pistas.'],
  },
};
