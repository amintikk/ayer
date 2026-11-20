// The site is only in Spanish. t() fills {placeholders} in a text; it is kept as the single
// place where interface strings pass through.
export function t(text: string, vars?: Record<string, string | number>): string {
  return vars ? text.replace(/\{(\w+)\}/g, (_: string, k: string) => String(vars[k] ?? '')) : text;
}

export const paths = {
  home: '/',
  map: '/mapa/',
  places: '/lugares/',
  credits: '/creditos/',
};
