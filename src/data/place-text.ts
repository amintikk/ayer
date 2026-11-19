// Editorial text of every gallery page, in both languages. Plain text; one string per paragraph.
interface Text {
  dek: string;
  body: string[];
  look: string[];
}

export const PLACE_TEXT: Record<string, { es: Text; en: Text }> = {
  benidorm: {
    es: {
      dek: 'De pueblo de pescadores a la ciudad con más rascacielos por habitante de Europa.',
      body: [
        'En la foto de 1956 Benidorm es un pueblo blanco apretado en torno a la punta del Castell, con dos playas casi vacías a cada lado y huertos de secano que llegan hasta la arena. Ese mismo año el ayuntamiento aprobó un plan de ordenación que apostaba por el turismo y por edificar en altura dejando espacio libre alrededor de cada bloque.',
        'Las fotos de los años noventa y dos mil enseñan el resultado: la avenida del Mediterráneo y la de Europa se llenan de torres, la playa de Poniente se urbaniza hasta La Cala y los barrancos que bajaban de la sierra desaparecen bajo calles. El vuelo más reciente deja ver los últimos rascacielos, que pasan de los 180 metros.',
      ],
      look: ['La forma de la playa de Levante, casi igual en 1956 que hoy.', 'Los campos en terrazas detrás del pueblo, donde ahora está el centro de la ciudad.', 'La sombra de las torres, que en la foto actual cae sobre manzanas enteras.'],
    },
    en: {
      dek: 'From a fishing village to the city with the most skyscrapers per resident in Europe.',
      body: [
        'In the 1956 photo Benidorm is a white village huddled around the Castell headland, with two almost empty beaches on either side and dry orchards reaching the sand. That same year the town council approved a plan that bet on tourism and on building tall, leaving open space around each block.',
        'The surveys of the nineties and two thousands show the result: Avenida del Mediterráneo and Avenida de Europa fill with towers, Poniente beach is built up all the way to La Cala and the ravines coming down from the hills disappear under streets. The latest survey shows the newest skyscrapers, some over 180 metres tall.',
      ],
      look: ['The shape of Levante beach, almost the same in 1956 as today.', 'The terraced fields behind the village, where the city centre is now.', 'The shadows of the towers, which in the current photo cover whole blocks.'],
    },
  },
  'puerto-banus-marbella': {
    es: {
      dek: 'Un puerto deportivo de lujo donde en 1956 solo había huertas y una playa.',
      body: [
        'En 1956 la costa entre Marbella y San Pedro Alcántara es una franja de cultivos, cañaverales y alguna finca aislada, cortada por la antigua carretera de Cádiz. No hay ningún puerto ni urbanización a la vista.',
        'Puerto Banús se inauguró en 1970 como un pueblo marinero de nueva planta con dársena para yates. Alrededor creció Nueva Andalucía, con campos de golf y urbanizaciones que suben hacia la sierra. Comparando los años se ve cómo la mancha urbana rellena primero la línea de costa y después los valles del interior.',
      ],
      look: ['Los espigones del puerto, que cambian la forma de las playas vecinas.', 'La autovía, que en las fotos antiguas es una carretera estrecha.', 'Los campos de golf de Nueva Andalucía, verdes incluso en verano.'],
    },
    en: {
      dek: 'A luxury marina where in 1956 there were only orchards and a beach.',
      body: [
        'In 1956 the coast between Marbella and San Pedro Alcántara is a strip of crops, reed beds and the odd farmhouse, cut by the old Cádiz road. There is no harbour or housing estate in sight.',
        'Puerto Banús opened in 1970 as a purpose-built fishing village with a basin for yachts. Nueva Andalucía grew around it, with golf courses and estates climbing towards the hills. Comparing the years you can see the built-up area first fill the coastline and then the valleys inland.',
      ],
      look: ['The harbour breakwaters, which change the shape of the nearby beaches.', 'The motorway, a narrow road in the old photos.', 'The golf courses of Nueva Andalucía, green even in summer.'],
    },
  },
  'aeropuerto-madrid-barajas': {
    es: {
      dek: 'De aeródromo con pistas cortas a uno de los mayores aeropuertos de Europa.',
      body: [
        'Barajas abrió en 1931. En la foto de 1956 es todavía un aeródromo modesto rodeado de campos de cereal, con pocas pistas y una terminal pequeña junto al pueblo de Barajas.',
        'Las ampliaciones de los años noventa y dos mil lo convirtieron en un aeropuerto de cuatro pistas paralelas dos a dos. La T4, abierta en 2006, ocupa terrenos que en las fotos antiguas eran tierras de labor y el cauce del Jarama tuvo que acomodarse a las nuevas pistas.',
      ],
      look: ['La T4 y su satélite, con sus cubiertas onduladas.', 'El trazado del río Jarama al este de las pistas.', 'Los pueblos de alrededor, que en 1956 aparecen separados por campos.'],
    },
    en: {
      dek: 'From an airfield with short runways to one of the largest airports in Europe.',
      body: [
        'Barajas opened in 1931. In the 1956 photo it is still a modest airfield surrounded by cereal fields, with few runways and a small terminal next to the village of Barajas.',
        'The expansions of the nineties and two thousands turned it into an airport with four runways in two parallel pairs. Terminal 4, opened in 2006, sits on land that was farmland in the old photos, and the course of the Jarama river had to make room for the new runways.',
      ],
      look: ['Terminal 4 and its satellite, with their wavy roofs.', 'The course of the Jarama river east of the runways.', 'The surrounding villages, which in 1956 are separated by fields.'],
    },
  },
  'bilbao-guggenheim-abandoibarra': {
    es: {
      dek: 'Muelles, vías y astilleros convertidos en el escaparate del nuevo Bilbao.',
      body: [
        'En las fotos antiguas la orilla izquierda de la ría en Abandoibarra es puerto e industria: muelles de carga, playas de vías, almacenes y, aguas abajo, el astillero Euskalduna, que cerró en 1988.',
        'El Museo Guggenheim abrió en 1997 y fue la pieza más visible de la regeneración de la ría. Le siguieron el Palacio Euskalduna, un parque de ribera, la universidad y la Torre Iberdrola. Con el deslizador se ve cómo las vías y los tinglados se sustituyen por paseos y edificios singulares.',
      ],
      look: ['Las cubiertas de titanio del museo, que brillan en la foto actual.', 'El puente de La Salve, que el museo abraza por debajo.', 'Las gradas del antiguo astillero, junto al Palacio Euskalduna.'],
    },
    en: {
      dek: 'Docks, rail yards and shipyards turned into the showcase of the new Bilbao.',
      body: [
        'In the old photos the left bank of the estuary at Abandoibarra is port and industry: cargo quays, rail yards, warehouses and, downstream, the Euskalduna shipyard, which closed in 1988.',
        'The Guggenheim Museum opened in 1997 and was the most visible piece of the regeneration of the estuary. The Euskalduna Palace, a riverside park, the university and the Iberdrola Tower followed. With the slider you can watch the tracks and sheds give way to promenades and landmark buildings.',
      ],
      look: ['The titanium roofs of the museum, shining in the current photo.', 'La Salve bridge, which the museum wraps around from below.', 'The slipways of the old shipyard, next to the Euskalduna Palace.'],
    },
  },
  'valencia-ciudad-artes-ciencias': {
    es: {
      dek: 'El río que ya no pasa por Valencia y lo que se construyó en su cauce.',
      body: [
        'La foto de 1956 es anterior a la gran riada de octubre de 1957. Por eso se ve el Turia atravesando la ciudad por su cauce natural, con huertas a ambos lados y la desembocadura junto al puerto.',
        'Tras la riada, el Plan Sur desvió el río por un nuevo cauce al sur de la ciudad, y el antiguo se convirtió en el Jardín del Turia. En su tramo final se levantó la Ciudad de las Artes y las Ciencias, que abrió por fases desde 1998. Las fotos de SIGPAC y de los primeros PNOA muestran los edificios a medio construir.',
      ],
      look: ['El agua del Turia en 1956, donde hoy hay jardines.', 'El nuevo cauce del río, al sur, en las fotos más recientes.', 'Los edificios blancos a medio hacer en los vuelos de 1997 a 2005.'],
    },
    en: {
      dek: 'The river that no longer runs through Valencia and what was built in its bed.',
      body: [
        'The 1956 photo predates the great flood of October 1957. That is why it shows the Turia crossing the city along its natural bed, with orchards on both sides and the mouth next to the port.',
        'After the flood, the South Plan diverted the river into a new channel south of the city, and the old bed became the Turia Gardens. At its lower end the City of Arts and Sciences was built, opening in stages from 1998. The SIGPAC and early PNOA photos show the buildings half finished.',
      ],
      look: ['The water of the Turia in 1956, where there are gardens today.', 'The new river channel to the south in the latest photos.', 'The white buildings half built in the surveys from 1997 to 2005.'],
    },
  },
  'el-ejido-invernaderos': {
    es: {
      dek: 'El mar de plástico que se ve desde el espacio, campo a campo.',
      body: [
        'En 1956 el Campo de Dalías es una llanura semidesértica entre la sierra de Gádor y el mar, con algunas acequias y casas dispersas. El tono claro de la foto es tierra desnuda.',
        'A partir de los años sesenta el cultivo enarenado y después el invernadero de plástico transformaron la comarca. Hoy la provincia de Almería tiene más de 30.000 hectáreas de invernaderos y El Ejido, que se segregó de Dalías en 1982, es su centro. El deslizador enseña cómo los rectángulos blancos van tapando el suelo año a año.',
      ],
      look: ['Las balsas de riego, manchas oscuras entre los invernaderos.', 'El núcleo de El Ejido, que en 1956 es apenas un cruce de caminos.', 'Las ramblas, que el plástico respeta a duras penas.'],
    },
    en: {
      dek: 'The sea of plastic visible from space, field by field.',
      body: [
        'In 1956 the Campo de Dalías is a semi-desert plain between the Sierra de Gádor and the sea, with a few irrigation channels and scattered houses. The pale tone of the photo is bare ground.',
        'From the sixties on, sand-mulch farming and then plastic greenhouses transformed the area. Today the province of Almería has more than 30,000 hectares of greenhouses, and El Ejido, which split from Dalías in 1982, is its centre. The slider shows the white rectangles covering the ground year after year.',
      ],
      look: ['The irrigation ponds, dark patches among the greenhouses.', 'The town of El Ejido, barely a crossroads in 1956.', 'The dry riverbeds, which the plastic barely leaves alone.'],
    },
  },
  'puerto-de-barcelona': {
    es: {
      dek: 'Un puerto que creció hacia el sur hasta mover la desembocadura de un río.',
      body: [
        'En 1956 el puerto de Barcelona se limita a los muelles junto a la ciudad y la montaña de Montjuïc. Al sur, el delta del Llobregat es un paisaje de huertas, lagunas y playa.',
        'Para ganar espacio, el puerto se amplió con nuevos diques y muelles, y en 2004 la desembocadura del Llobregat se desvió unos kilómetros al sur. Las fotos recientes muestran las terminales de contenedores, la zona logística y el nuevo cauce del río.',
      ],
      look: ['El antiguo cauce final del Llobregat, ocupado hoy por muelles.', 'Los diques de abrigo, cada vez más largos.', 'Las pilas de contenedores, como píxeles de colores.'],
    },
    en: {
      dek: 'A port that grew south until it moved the mouth of a river.',
      body: [
        'In 1956 the port of Barcelona is limited to the quays next to the city and Montjuïc hill. To the south, the Llobregat delta is a landscape of orchards, lagoons and beach.',
        'To gain room the port was extended with new breakwaters and quays, and in 2004 the mouth of the Llobregat was moved a few kilometres south. The recent photos show the container terminals, the logistics area and the new river channel.',
      ],
      look: ['The old lower course of the Llobregat, now taken up by quays.', 'The breakwaters, longer in every survey.', 'The stacks of containers, like coloured pixels.'],
    },
  },
  'sevilla-isla-cartuja-expo-92': {
    es: {
      dek: 'De huertas junto a un monasterio a recinto de la Exposición Universal.',
      body: [
        'En la foto de 1956 la Cartuja es una vega de huertas entre dos brazos del Guadalquivir, con el monasterio de Santa María de las Cuevas y su fábrica de loza como únicas construcciones grandes.',
        'Para la Expo 92 la isla se urbanizó entera: pabellones, lagos, nuevas avenidas y puentes como el del Alamillo, de Calatrava. Después de la exposición el recinto se convirtió en un parque tecnológico y, más tarde, apareció la Torre Sevilla. Las fotos de 1997 en adelante enseñan la Expo ya cerrada, con muchos pabellones aún en pie.',
      ],
      look: ['El monasterio, que aparece igual en todas las épocas.', 'El puente del Alamillo y su mástil inclinado.', 'Los solares que dejaron los pabellones desmontados.'],
    },
    en: {
      dek: 'From orchards next to a monastery to the grounds of a World Expo.',
      body: [
        'In the 1956 photo La Cartuja is a plain of orchards between two arms of the Guadalquivir, with the monastery of Santa María de las Cuevas and its pottery factory as the only large buildings.',
        'For Expo 92 the whole island was developed: pavilions, lakes, new avenues and bridges such as Calatrava’s Alamillo. After the exposition the grounds became a technology park, and later the Torre Sevilla went up. The photos from 1997 on show the Expo already closed, with many pavilions still standing.',
      ],
      look: ['The monastery, unchanged in every period.', 'The Alamillo bridge and its slanted mast.', 'The empty plots left by dismantled pavilions.'],
    },
  },
  'barcelona-vila-olimpica': {
    es: {
      dek: 'Fábricas y vías junto al mar que se convirtieron en barrio para los Juegos de 1992.',
      body: [
        'En las fotos antiguas, el litoral del Poblenou es una sucesión de fábricas, almacenes y vías de tren que separan la ciudad del mar. Las playas son estrechas y casi inaccesibles.',
        'Con los Juegos Olímpicos de 1992 se levantaron las vías, se abrieron playas y paseos y se construyó la Vila Olímpica, el Port Olímpic y las dos torres gemelas. El deslizador muestra un caso claro de ciudad que se da la vuelta hacia el mar.',
      ],
      look: ['Las vías del tren paralelas a la costa en 1956.', 'Las dos torres junto al Port Olímpic.', 'La anchura de la playa, mucho mayor tras la regeneración.'],
    },
    en: {
      dek: 'Factories and rail lines by the sea that became a neighbourhood for the 1992 Games.',
      body: [
        'In the old photos the Poblenou waterfront is a row of factories, warehouses and railway lines that cut the city off from the sea. The beaches are narrow and hard to reach.',
        'For the 1992 Olympic Games the tracks were removed, beaches and promenades were opened, and the Olympic Village, the Olympic Port and the twin towers were built. The slider shows a clear case of a city turning to face the sea.',
      ],
      look: ['The railway lines running along the coast in 1956.', 'The two towers next to the Olympic Port.', 'The width of the beach, much larger after the works.'],
    },
  },
  torrevieja: {
    es: {
      dek: 'Entre dos lagunas saladas, una de las ciudades que más ha crecido de España.',
      body: [
        'En 1956 Torrevieja es un pequeño pueblo salinero y pesquero junto al mar, con la gran laguna salada a un lado y campos de secano alrededor.',
        'Desde los años setenta las urbanizaciones de segunda residencia ocuparon la costa y el terreno entre las lagunas de Torrevieja y La Mata. En las fotos recientes casi no queda suelo sin construir fuera de las propias lagunas, que hoy son parque natural.',
      ],
      look: ['El color de la laguna de Torrevieja, que cambia según el año y la sal.', 'Las urbanizaciones de casas bajas, con piscinas como puntos azules.', 'El puerto y sus diques, más grandes en cada vuelo.'],
    },
    en: {
      dek: 'Between two salt lagoons, one of the fastest-growing towns in Spain.',
      body: [
        'In 1956 Torrevieja is a small salt and fishing town by the sea, with the large salt lagoon on one side and dry farmland around it.',
        'From the seventies on, holiday-home estates spread along the coast and across the land between the Torrevieja and La Mata lagoons. In the recent photos there is hardly any unbuilt ground left outside the lagoons themselves, now a nature park.',
      ],
      look: ['The colour of the Torrevieja lagoon, which changes with the year and the salt.', 'The low-rise estates, with swimming pools as blue dots.', 'The harbour and its breakwaters, larger in every survey.'],
    },
  },
  'sesena-el-quinon': {
    es: {
      dek: 'Una ciudad de miles de pisos levantada en pocos años en medio del campo.',
      body: [
        'Aquí la comparación empieza en el vuelo de SIGPAC, alrededor del año 2000, cuando el lugar es todavía un paisaje de cereal y caminos. La foto de 1956 muestra lo mismo: campo.',
        'El Quiñón se construyó a mediados de los dos mil con un plan de más de diez mil viviendas, de las que solo se terminó una parte antes de la crisis de 2008. Los PNOA anuales de esta zona, muy frecuentes, permiten seguir la obra casi año a año, con manzanas a medio hacer y calles sin edificios.',
      ],
      look: ['Las manzanas completas frente a las parcelas que quedaron vacías.', 'El cambio entre 2004 y 2008, casi de un vuelo a otro.', 'Las grandes rotondas trazadas antes que los edificios.'],
    },
    en: {
      dek: 'A town of thousands of flats built in a few years in the middle of the fields.',
      body: [
        'Here the comparison starts with the SIGPAC survey, around 2000, when the site is still a landscape of cereal and farm tracks. The 1956 photo shows the same thing: fields.',
        'El Quiñón was built in the mid two thousands under a plan for more than ten thousand homes, only part of which was finished before the 2008 crisis. The annual PNOA surveys, very frequent here, let you follow the works almost year by year, with half-built blocks and streets without buildings.',
      ],
      look: ['The finished blocks next to the plots that stayed empty.', 'The change between 2004 and 2008, almost from one survey to the next.', 'The large roundabouts laid out before the buildings.'],
    },
  },
  'madrid-cuatro-torres': {
    es: {
      dek: 'Del límite norte de Madrid a su perfil de rascacielos.',
      body: [
        'En 1956 este lugar está en las afueras: la Castellana todavía no llega hasta aquí y alrededor hay campos, caminos y alguna instalación aislada.',
        'Durante décadas los terrenos fueron la Ciudad Deportiva del Real Madrid, visible en los vuelos intermedios con sus campos de fútbol. Tras su venta se levantaron las Cuatro Torres, terminadas hacia 2008, y años después una quinta. El deslizador enseña cómo los campos de entrenamiento se convierten en el distrito financiero.',
      ],
      look: ['Los campos de fútbol de la antigua Ciudad Deportiva.', 'Las sombras alargadas de las torres en la foto actual.', 'El final de la Castellana, que avanza hacia el norte.'],
    },
    en: {
      dek: 'From the northern edge of Madrid to its skyline.',
      body: [
        'In 1956 this place lies on the outskirts: the Castellana does not reach this far yet, and around it there are fields, tracks and the odd isolated building.',
        'For decades the land was Real Madrid’s sports ground, visible in the middle surveys with its football pitches. After it was sold, the Four Towers went up, finished around 2008, and years later a fifth. The slider shows the training pitches turning into the business district.',
      ],
      look: ['The football pitches of the old sports ground.', 'The long shadows of the towers in the current photo.', 'The end of the Castellana, moving north.'],
    },
  },
  'zaragoza-expo-2008': {
    es: {
      dek: 'Un meandro del Ebro con huertas que se convirtió en recinto de la Expo del agua.',
      body: [
        'En la foto de 1956 el meandro de Ranillas es tierra de huerta rodeada por el Ebro, sin puentes ni edificios cerca, a las afueras de Zaragoza.',
        'La Exposición Internacional de 2008, dedicada al agua y el desarrollo sostenible, ocupó el meandro con pabellones, el Palacio de Congresos, la Torre del Agua y el Pabellón Puente. Al lado se creó el Parque del Agua. Los vuelos de 2006 y 2009 muestran el antes y el después inmediato de las obras.',
      ],
      look: ['La curva del Ebro, igual en todas las épocas.', 'El Pabellón Puente cruzando el río.', 'Las parcelas de huerta que se mantienen en el parque.'],
    },
    en: {
      dek: 'A meander of the Ebro with orchards that became the grounds of the water Expo.',
      body: [
        'In the 1956 photo the Ranillas meander is farmland surrounded by the Ebro, with no bridges or buildings nearby, on the outskirts of Zaragoza.',
        'The 2008 International Exposition, devoted to water and sustainable development, filled the meander with pavilions, the Conference Centre, the Water Tower and the Bridge Pavilion. The Water Park was laid out next to it. The 2006 and 2009 surveys show the moments just before and after the works.',
      ],
      look: ['The bend of the Ebro, the same in every period.', 'The Bridge Pavilion crossing the river.', 'The orchard plots kept inside the park.'],
    },
  },
  'salou-portaventura': {
    es: {
      dek: 'Un parque temático entre Salou y Vila-seca, sobre antiguos campos.',
      body: [
        'En 1956 la zona entre Salou y Vila-seca es campo: algarrobos, avellanos y viña, con la vía del tren y la costa casi sin construir.',
        'PortAventura abrió en 1995 y en los vuelos posteriores se ven sus zonas temáticas, el lago central y las montañas rusas, además de hoteles y campos de golf. Salou crece a la vez a lo largo de la costa.',
      ],
      look: ['El lago central del parque.', 'El trazado de las montañas rusas, visible desde el aire.', 'Los campos que aún quedan alrededor.'],
    },
    en: {
      dek: 'A theme park between Salou and Vila-seca, on former farmland.',
      body: [
        'In 1956 the area between Salou and Vila-seca is countryside: carob and hazelnut trees and vineyards, with the railway and an almost unbuilt coast.',
        'PortAventura opened in 1995, and the later surveys show its themed areas, the central lake and the roller coasters, plus hotels and golf courses. Salou grows along the coast at the same time.',
      ],
      look: ['The central lake of the park.', 'The track of the roller coasters, visible from the air.', 'The fields still left around it.'],
    },
  },
  'magaluf-calvia': {
    es: {
      dek: 'Una bahía de pinares en Mallorca que se convirtió en destino de masas.',
      body: [
        'En 1956 la bahía de Magaluf tiene pinares, dunas y una playa sin edificios, con la isla de sa Porrassa enfrente y algunas casas dispersas.',
        'El turismo de los años sesenta y setenta llenó la primera línea de hoteles y apartamentos, y después las laderas de urbanizaciones. Las fotos recientes muestran una costa construida casi sin interrupción entre Palmanova y Magaluf.',
      ],
      look: ['La línea de costa, que se mantiene mientras todo lo demás cambia.', 'Los pinares que sobreviven en las laderas.', 'Las piscinas de los hoteles.'],
    },
    en: {
      dek: 'A bay of pine woods in Mallorca that became a mass-tourism resort.',
      body: [
        'In 1956 Magaluf bay has pine woods, dunes and a beach without buildings, with the islet of sa Porrassa in front and a few scattered houses.',
        'The tourism of the sixties and seventies filled the seafront with hotels and apartments, and then the slopes with estates. The recent photos show a coast built up almost without a break between Palmanova and Magaluf.',
      ],
      look: ['The coastline, which stays put while everything else changes.', 'The pine woods that survive on the slopes.', 'The hotel swimming pools.'],
    },
  },
  'maspalomas-playa-del-ingles': {
    es: {
      dek: 'Dunas y urbanizaciones en Gran Canaria, donde la foto más antigua es de hacia el año 2000.',
      body: [
        'Canarias no está en el vuelo de 1956 ni en los de los años setenta y ochenta que publica el IGN, así que aquí la comparación empieza con las ortofotos de SIGPAC. Para entonces Playa del Inglés y Maspalomas ya estaban construidas: el gran cambio había ocurrido entre los años sesenta y ochenta.',
        'Lo que sí se ve de un vuelo a otro es la vida de las dunas, protegidas como reserva natural, que se desplazan y pierden arena, y el relleno de los últimos huecos entre hoteles.',
      ],
      look: ['La forma de las dunas, distinta en cada vuelo.', 'La charca de Maspalomas, junto al faro.', 'Las parcelas vacías que se van ocupando.'],
    },
    en: {
      dek: 'Dunes and resorts in Gran Canaria, where the oldest photo dates from around 2000.',
      body: [
        'The Canary Islands are not in the 1956 survey or in the seventies and eighties surveys published by the IGN, so here the comparison starts with the SIGPAC photos. By then Playa del Inglés and Maspalomas were already built: the big change had happened between the sixties and the eighties.',
        'What you can see from one survey to the next is the life of the dunes, protected as a nature reserve, as they shift and lose sand, and the last gaps between hotels being filled.',
      ],
      look: ['The shape of the dunes, different in every survey.', 'The Maspalomas pond, next to the lighthouse.', 'The empty plots being built on.'],
    },
  },
  'embalse-de-riano': {
    es: {
      dek: 'Un valle con nueve pueblos que quedó bajo el agua en 1987.',
      body: [
        'Las fotos de 1956 y del vuelo interministerial muestran el valle del Esla en la montaña de León: el pueblo de Riaño en el fondo, prados, caminos y la confluencia de los ríos.',
        'La presa se cerró en 1987, tras un largo conflicto con los vecinos, y el embalse inundó nueve pueblos. Riaño se reconstruyó en la ladera. Desde los vuelos de finales de los noventa el valle es un lago, y en años secos asoman restos de los antiguos caminos.',
      ],
      look: ['El pueblo antiguo de Riaño, en el fondo del valle en 1956.', 'El nuevo Riaño, en la ladera, en las fotos recientes.', 'El nivel del agua, que cambia de un año a otro.'],
    },
    en: {
      dek: 'A valley with nine villages that went under water in 1987.',
      body: [
        'The 1956 photo and the interministerial survey show the Esla valley in the mountains of León: the village of Riaño on the valley floor, meadows, tracks and the meeting of the rivers.',
        'The dam was closed in 1987 after a long struggle with the villagers, and the reservoir flooded nine villages. Riaño was rebuilt on the hillside. From the late-nineties surveys on, the valley is a lake, and in dry years remains of the old roads reappear.',
      ],
      look: ['The old village of Riaño on the valley floor in 1956.', 'The new Riaño on the hillside in the recent photos.', 'The water level, which changes from year to year.'],
    },
  },
  'aeropuerto-barcelona-el-prat': {
    es: {
      dek: 'Un aeropuerto que creció sobre el delta del Llobregat.',
      body: [
        'En 1956 el aeropuerto de El Prat ocupa una parte pequeña del delta, rodeado de huertas, lagunas y la playa. Las pistas son cortas y la terminal, modesta.',
        'Con los años llegaron pistas más largas, la tercera pista junto al mar en 2004 y la terminal T1, abierta en 2009. Las fotos muestran cómo el aeropuerto se encaja entre el mar, los espacios naturales protegidos del delta y el puerto vecino.',
      ],
      look: ['La tercera pista, paralela a la playa.', 'La T1 y su forma de ala.', 'Las lagunas del delta que siguen entre las pistas.'],
    },
    en: {
      dek: 'An airport that grew across the Llobregat delta.',
      body: [
        'In 1956 El Prat airport takes up a small part of the delta, surrounded by orchards, lagoons and the beach. The runways are short and the terminal is modest.',
        'Over the years came longer runways, the third runway next to the sea in 2004, and Terminal 1, opened in 2009. The photos show how the airport squeezes in between the sea, the protected natural areas of the delta and the neighbouring port.',
      ],
      look: ['The third runway, parallel to the beach.', 'Terminal 1 and its wing shape.', 'The delta lagoons still lying between the runways.'],
    },
  },
};
