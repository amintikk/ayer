// Gallery places. Coordinates are the centre of the view; `zoom` frames the change.
// `from`/`to` are the survey ids the place page and the shared link open with.
export interface Place {
  slug: string;
  slugEn: string;
  name: string;
  nameEn?: string;
  region: string;
  lon: number;
  lat: number;
  zoom: number;
  from: string;
  to: string;
}

export const PLACES: Place[] = [
  { slug: 'benidorm', slugEn: 'benidorm', name: 'Benidorm', region: 'Alicante', lon: -0.1275, lat: 38.5365, zoom: 14.6, from: 'ams', to: 'actual' },
  { slug: 'puerto-banus-marbella', slugEn: 'puerto-banus-marbella', name: 'Puerto Banús, Marbella', region: 'Málaga', lon: -4.9535, lat: 36.4865, zoom: 15.4, from: 'ams', to: 'actual' },
  { slug: 'aeropuerto-madrid-barajas', slugEn: 'madrid-barajas-airport', name: 'Aeropuerto de Barajas', nameEn: 'Madrid-Barajas Airport', region: 'Madrid', lon: -3.5720, lat: 40.4900, zoom: 12.8, from: 'ams', to: 'actual' },
  { slug: 'bilbao-guggenheim-abandoibarra', slugEn: 'bilbao-guggenheim-abandoibarra', name: 'Abandoibarra y el Guggenheim, Bilbao', nameEn: 'Abandoibarra and the Guggenheim, Bilbao', region: 'Bizkaia', lon: -2.9370, lat: 43.2670, zoom: 15.6, from: 'ams', to: 'actual' },
  { slug: 'valencia-ciudad-artes-ciencias', slugEn: 'valencia-city-of-arts-and-sciences', name: 'Ciudad de las Artes y las Ciencias, Valencia', nameEn: 'City of Arts and Sciences, Valencia', region: 'Valencia', lon: -0.3535, lat: 39.4565, zoom: 15.2, from: 'ams', to: 'actual' },
  { slug: 'el-ejido-invernaderos', slugEn: 'el-ejido-greenhouses', name: 'Los invernaderos de El Ejido', nameEn: 'The greenhouses of El Ejido', region: 'Almería', lon: -2.8150, lat: 36.7550, zoom: 12.6, from: 'ams', to: 'actual' },
  { slug: 'puerto-de-barcelona', slugEn: 'port-of-barcelona', name: 'Puerto de Barcelona', nameEn: 'Port of Barcelona', region: 'Barcelona', lon: 2.1500, lat: 41.3420, zoom: 13.2, from: 'ams', to: 'actual' },
  { slug: 'sevilla-isla-cartuja-expo-92', slugEn: 'seville-isla-de-la-cartuja-expo-92', name: 'Isla de la Cartuja, Sevilla', nameEn: 'Isla de la Cartuja, Seville', region: 'Sevilla', lon: -6.0055, lat: 37.4085, zoom: 14.4, from: 'ams', to: 'actual' },
  { slug: 'barcelona-vila-olimpica', slugEn: 'barcelona-olympic-village', name: 'Vila Olímpica, Barcelona', nameEn: 'Olympic Village, Barcelona', region: 'Barcelona', lon: 2.1985, lat: 41.3890, zoom: 15.4, from: 'ams', to: 'actual' },
  { slug: 'torrevieja', slugEn: 'torrevieja', name: 'Torrevieja', region: 'Alicante', lon: -0.6880, lat: 37.9850, zoom: 13.4, from: 'ams', to: 'actual' },
  { slug: 'sesena-el-quinon', slugEn: 'sesena-el-quinon', name: 'El Quiñón, Seseña', region: 'Toledo', lon: -3.6620, lat: 40.1060, zoom: 14.8, from: 'sigpac', to: 'actual' },
  { slug: 'madrid-cuatro-torres', slugEn: 'madrid-four-towers', name: 'Cuatro Torres, Madrid', nameEn: 'Four Towers, Madrid', region: 'Madrid', lon: -3.6885, lat: 40.4765, zoom: 15.6, from: 'ams', to: 'actual' },
  { slug: 'zaragoza-expo-2008', slugEn: 'zaragoza-expo-2008', name: 'Meandro de Ranillas, Zaragoza', nameEn: 'Ranillas meander, Zaragoza', region: 'Zaragoza', lon: -0.9060, lat: 41.6700, zoom: 15, from: 'ams', to: 'actual' },
  { slug: 'salou-portaventura', slugEn: 'salou-portaventura', name: 'PortAventura, Salou', region: 'Tarragona', lon: 1.1535, lat: 41.0875, zoom: 14.6, from: 'ams', to: 'actual' },
  { slug: 'magaluf-calvia', slugEn: 'magaluf-calvia', name: 'Magaluf, Calvià', region: 'Mallorca', lon: 2.5355, lat: 39.5085, zoom: 15, from: 'ams', to: 'actual' },
  { slug: 'maspalomas-playa-del-ingles', slugEn: 'maspalomas-playa-del-ingles', name: 'Maspalomas y Playa del Inglés', nameEn: 'Maspalomas and Playa del Inglés', region: 'Gran Canaria', lon: -15.5800, lat: 27.7600, zoom: 14, from: 'sigpac', to: 'actual' },
  { slug: 'embalse-de-riano', slugEn: 'riano-reservoir', name: 'Embalse de Riaño', nameEn: 'Riaño reservoir', region: 'León', lon: -5.0010, lat: 42.9750, zoom: 13.4, from: 'ams', to: 'actual' },
  { slug: 'aeropuerto-barcelona-el-prat', slugEn: 'barcelona-el-prat-airport', name: 'Aeropuerto de El Prat', nameEn: 'Barcelona-El Prat Airport', region: 'Barcelona', lon: 2.0780, lat: 41.2970, zoom: 13, from: 'ams', to: 'actual' },
];
