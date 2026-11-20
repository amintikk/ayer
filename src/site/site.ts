import '@fontsource-variable/jost';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import './site.css';
import { initConsent } from '../ui/consent.ts';
import { hydrateIcons, icon } from '../ui/icons.ts';
import { wireThemeButton } from '../ui/theme.ts';

// Tell the inline safety net in <head> that the script loaded (it would otherwise unhide everything).
(window as unknown as { ayerReady?: boolean }).ayerReady = true;
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

function wireNav(): void {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  const set = (open: boolean) => {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.replaceChildren(icon(open ? 'x' : 'menu'));
  };
  toggle.addEventListener('click', () => set(!document.body.classList.contains('nav-open')));
  nav.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) set(false);
  });
  addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
  const onScroll = () => document.documentElement.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Before/after images. The transparent range input on top gives keyboard and screen-reader
 * support; pointer drags anywhere on the image move the line too (horizontal drags only, so
 * vertical swipes still scroll the page on phones).
 */
function wireCompare(el: HTMLElement): void {
  const range = el.querySelector<HTMLInputElement>('.compare-range')!;
  const set = (pct: number) => {
    const v = Math.max(0, Math.min(100, pct));
    el.style.setProperty('--pos', `${v}%`);
    range.value = String(v);
  };
  range.addEventListener('input', () => set(Number(range.value)));
  // On wide screens the landing headline sits on the left: start the line past it.
  const initial = el.classList.contains('hero-compare') && matchMedia('(min-width: 601px)').matches ? 66 : 50;
  set(initial);
  let start: { x: number; y: number; id: number } | null = null;
  let active = false;
  const pct = (x: number) => {
    const r = el.getBoundingClientRect();
    return ((x - r.left) / r.width) * 100;
  };
  el.addEventListener('pointerdown', (e) => {
    start = { x: e.clientX, y: e.clientY, id: e.pointerId };
    active = e.pointerType === 'mouse';
    if (active) {
      el.setPointerCapture(e.pointerId);
      el.classList.add('dragging');
      set(pct(e.clientX));
      e.preventDefault();
    }
  });
  el.addEventListener('pointermove', (e) => {
    if (!start || e.pointerId !== start.id) return;
    if (!active) {
      const dx = Math.abs(e.clientX - start.x);
      const dy = Math.abs(e.clientY - start.y);
      if (dy > 8 && dy > dx) {
        start = null; // vertical: let the page scroll
        return;
      }
      if (dx < 6) return;
      active = true;
      el.setPointerCapture(e.pointerId);
      el.classList.add('dragging');
    }
    set(pct(e.clientX));
  });
  const end = (e: PointerEvent) => {
    if (start && !active && e.type === 'pointerup') set(pct(e.clientX)); // a tap moves the line there
    start = null;
    active = false;
    el.classList.remove('dragging');
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
  // A short sweep the first time the comparison is seen, to show that it moves.
  if (still) return;
  new IntersectionObserver(
    (entries, io) => {
      if (!entries.some((x) => x.isIntersecting)) return;
      io.disconnect();
      const t0 = performance.now();
      const from = initial;
      const step = (t: number) => {
        if (el.classList.contains('dragging')) return;
        const k = Math.min(1, (t - t0) / 2200);
        set(from + Math.sin(k * Math.PI * 2) * 22 * (1 - k));
        if (k < 1) requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), 500);
    },
    { threshold: 0.5 },
  ).observe(el);
}

/** On touch screens there is no hover: cards in view flip slowly between their two years. */
function wireCards(): void {
  if (still || matchMedia('(hover: hover)').matches) return;
  const cards = [...document.querySelectorAll<HTMLElement>('.card')];
  const visible = new Set<HTMLElement>();
  const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? visible.add(e.target as HTMLElement) : visible.delete(e.target as HTMLElement))), {
    threshold: 0.6,
  });
  cards.forEach((c) => io.observe(c));
  let i = 0;
  setInterval(() => {
    for (const c of visible) if ((cards.indexOf(c) + i) % 2 === 0) c.classList.toggle('flip');
    i++;
  }, 2200);
}

function wireReveal(): void {
  const items = [
    ...document.querySelectorAll<HTMLElement>(
      '.section-head, .steps li, .card, .cov, .cov-intro > *, .faq details, .closing h2, .closing .btn, .page-head .wrap > *, .story-head > *, .story-figure, .prose p, .story-aside, .seq li, .doc .wrap > *',
    ),
  ];
  if (still || !('IntersectionObserver' in window)) return;
  items.forEach((el) => el.classList.add('rv'));
  const io = new IntersectionObserver(
    (entries) => {
      let n = 0;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        el.style.setProperty('--rv-delay', `${Math.min(n++, 8) * 60}ms`);
        el.classList.add('in');
        io.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -5% 0px', threshold: 0.06 },
  );
  items.forEach((el) => io.observe(el));
}

hydrateIcons();
wireThemeButton(document.getElementById('btn-theme'), (dark) => {
  const b = document.getElementById('btn-theme');
  b?.replaceChildren(icon(dark ? 'sun' : 'moon'));
  const meta = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
  meta.forEach((m) => (m.content = dark ? '#111213' : '#eeece6'));
});
wireNav();
document.querySelectorAll<HTMLElement>('[data-compare]').forEach(wireCompare);
wireCards();
wireReveal();
initConsent();
