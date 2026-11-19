// Two languages: Spanish (source text, served at /) and English (served under /en/).
// t() takes the Spanish text itself as the key, so the code stays readable and a missing
// translation falls back to Spanish. tests/i18n.test.ts fails if any t('…') has no English entry.
import { EN } from './i18n.en.ts';

export type Lang = 'es' | 'en';
export const lang: Lang = typeof document !== 'undefined' && document.documentElement.lang.startsWith('en') ? 'en' : 'es';
export const locale = lang === 'en' ? 'en-GB' : 'es-ES';

export function t(es: string, vars?: Record<string, string | number>): string {
  let s = lang === 'en' ? (EN[es] ?? es) : es;
  if (vars) s = s.replace(/\{(\w+)\}/g, (_: string, k: string) => String(vars[k] ?? ''));
  return s;
}

/** Path of the same page in the current language. */
export const paths = {
  home: lang === 'en' ? '/en/' : '/',
  map: lang === 'en' ? '/en/map/' : '/mapa/',
  places: lang === 'en' ? '/en/places/' : '/lugares/',
  credits: lang === 'en' ? '/en/credits/' : '/creditos/',
  other: lang === 'en' ? '/mapa/' : '/en/map/',
};
