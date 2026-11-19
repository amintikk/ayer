// The time bar: one tick per survey available in the view, evenly spaced (the old surveys are
// decades apart, the PNOA ones a year). In blend mode one handle moves continuously and the map
// cross-fades between the two neighbouring surveys; on release it settles on the nearest one.
// In curtain mode two handles pick the surveys on each side of the curtain.
import { SURVEYS, type Survey } from '../data/layers.ts';
import { t } from '../i18n.ts';

export type Mode = 'fade' | 'curtain';

interface Events {
  /** Continuous position in blend mode (index into items, may be fractional). */
  onValue: (v: number) => void;
  /** The pair of surveys in curtain mode (indices). */
  onPair: (a: number, b: number) => void;
  /** The user grabbed the bar (stops the timelapse). */
  onGrab: () => void;
}

const SURVEY_YEAR = new Map(SURVEYS.map((s) => [s.id, s.year]));
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const ease = (k: number) => 1 - Math.pow(1 - k, 3);

export class Timeline {
  readonly el: HTMLElement;
  private track: HTMLElement;
  private fill: HTMLElement;
  private thumbs: [HTMLElement, HTMLElement];
  private ticks: HTMLElement[] = [];
  items: Survey[] = [];
  value = 0;
  pair: [number, number] = [0, 0];
  mode: Mode = 'fade';
  private anim = 0;
  private drag: { thumb: 0 | 1; id: number } | null = null;

  constructor(private ev: Events) {
    this.el = document.createElement('div');
    this.el.className = 'tl';
    this.track = document.createElement('div');
    this.track.className = 'tl-track';
    this.fill = document.createElement('div');
    this.fill.className = 'tl-fill';
    const mk = (cls: string) => {
      const b = document.createElement('div');
      b.className = `tl-thumb ${cls}`;
      b.tabIndex = 0;
      b.setAttribute('role', 'slider');
      b.innerHTML = '<span class="tl-thumb-flag"></span>';
      return b;
    };
    this.thumbs = [mk('a'), mk('b')];
    this.track.append(this.fill, ...this.thumbs);
    this.el.append(this.track);
    this.wire();
    new ResizeObserver(() => this.layoutLabels()).observe(this.track);
  }

  get n(): number {
    return this.items.length;
  }

  private pos(i: number): string {
    return this.n <= 1 ? '50%' : `${(i / (this.n - 1)) * 100}%`;
  }

  /** Replace the surveys shown; keeps the current survey(s) when they are still there. */
  setItems(items: Survey[], keep: { y?: string; a?: string; b?: string }): void {
    this.items = items;
    for (const tk of this.ticks) tk.remove();
    this.ticks = items.map((s, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tl-tick';
      b.style.left = this.pos(i);
      b.tabIndex = -1;
      b.dataset.i = String(i);
      b.innerHTML = `<span class="tl-dot"></span><span class="tl-label">${s.label === 'Hoy' ? t('Hoy') : s.label}</span>`;
      b.setAttribute('aria-label', s.label === 'Hoy' ? t('Hoy') : s.label);
      return b;
    });
    this.track.prepend(...this.ticks);
    const find = (id: string | undefined, fallback: number) => {
      if (!id) return fallback;
      const i = items.findIndex((s) => s.id === id);
      if (i >= 0) return i;
      // The survey is not available here: take the nearest in time.
      const year = SURVEY_YEAR.get(id) ?? 0;
      let best = fallback;
      let d = Infinity;
      items.forEach((s, j) => {
        if (Math.abs(s.year - year) < d) {
          d = Math.abs(s.year - year);
          best = j;
        }
      });
      return best;
    };
    this.value = find(keep.y, 0);
    this.pair = [find(keep.a, 0), find(keep.b, items.length - 1)];
    if (this.pair[0] === this.pair[1] && items.length > 1) this.pair = this.pair[0] > 0 ? [this.pair[0] - 1, this.pair[1]] : [0, 1];
    this.render();
    this.layoutLabels();
  }

  /** While the coverage probe runs: dim the ticks of surveys that turned out to have no photo here. */
  mark(id: string, ok: boolean): void {
    const i = this.items.findIndex((s) => s.id === id);
    this.ticks[i]?.classList.toggle('gone', !ok);
  }

  setMode(m: Mode): void {
    this.mode = m;
    this.el.classList.toggle('curtain', m === 'curtain');
    this.render();
  }

  /** Hide labels that would overlap, measuring their real width; the first and last always show. */
  private layoutLabels(): void {
    const w = this.track.clientWidth;
    if (!w || !this.n) return;
    const pos = (i: number) => (this.n > 1 ? (i / (this.n - 1)) * w : w / 2);
    const width = this.ticks.map((tk) => (tk.lastElementChild as HTMLElement).offsetWidth || 30);
    const gap = 8;
    const show = new Array<boolean>(this.n).fill(false);
    show[0] = true;
    show[this.n - 1] = true;
    const right = (i: number) => pos(i) + width[i]! / 2;
    const left = (i: number) => pos(i) - width[i]! / 2;
    let last = 0;
    for (let i = 1; i < this.n - 1; i++) {
      if (left(i) >= right(last) + gap && right(i) + gap <= left(this.n - 1)) {
        show[i] = true;
        last = i;
      }
    }
    this.ticks.forEach((tk, i) => tk.classList.toggle('quiet', !show[i]));
  }

  private render(): void {
    const curtain = this.mode === 'curtain';
    const [a, b] = this.pair;
    const near = Math.round(this.value);
    this.thumbs[0].style.left = this.pos(curtain ? a : this.value);
    this.thumbs[1].style.left = this.pos(b);
    this.thumbs[1].hidden = !curtain;
    if (curtain) {
      this.fill.style.left = this.pos(Math.min(a, b));
      this.fill.style.width = this.n > 1 ? `${(Math.abs(b - a) / (this.n - 1)) * 100}%` : '0';
    } else {
      this.fill.style.left = '0';
      this.fill.style.width = this.pos(this.value);
    }
    this.ticks.forEach((tk, i) => {
      tk.classList.toggle('on', curtain ? i === a || i === b : i === near);
      tk.classList.toggle('past', curtain ? i > Math.min(a, b) && i < Math.max(a, b) : i < this.value);
    });
    const label = (i: number) => {
      const s = this.items[i];
      return s ? (s.label === 'Hoy' ? t('Hoy') : s.label) : '';
    };
    const set = (el: HTMLElement, i: number, name: string) => {
      el.setAttribute('aria-label', name);
      el.setAttribute('aria-valuemin', '0');
      el.setAttribute('aria-valuemax', String(Math.max(0, this.n - 1)));
      el.setAttribute('aria-valuenow', String(Math.round(i)));
      el.setAttribute('aria-valuetext', label(Math.round(i)));
      (el.firstElementChild as HTMLElement).textContent = curtain ? label(i) : '';
    };
    set(this.thumbs[0], curtain ? a : this.value, curtain ? t('Época de la izquierda') : t('Año'));
    set(this.thumbs[1], b, t('Época de la derecha'));
  }

  /** Move the blend handle, optionally animated. */
  setValue(v: number, ms = 0): Promise<void> {
    cancelAnimationFrame(this.anim);
    const to = clamp(v, 0, Math.max(0, this.n - 1));
    if (!ms) {
      this.value = to;
      this.render();
      this.ev.onValue(this.value);
      return Promise.resolve();
    }
    const from = this.value;
    const t0 = performance.now();
    return new Promise((done) => {
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / ms);
        this.value = from + (to - from) * ease(k);
        this.render();
        this.ev.onValue(this.value);
        if (k < 1) this.anim = requestAnimationFrame(step);
        else done();
      };
      this.anim = requestAnimationFrame(step);
    });
  }

  setPair(a: number, b: number): void {
    this.pair = [clamp(a, 0, this.n - 1), clamp(b, 0, this.n - 1)];
    this.render();
    this.ev.onPair(...this.pair);
  }

  private at(clientX: number): number {
    const r = this.track.getBoundingClientRect();
    return clamp(((clientX - r.left) / r.width) * (this.n - 1), 0, this.n - 1);
  }

  private wire(): void {
    const down = (e: PointerEvent) => {
      if (this.n < 2 || e.button > 0) return;
      e.preventDefault();
      this.ev.onGrab();
      cancelAnimationFrame(this.anim);
      const v = this.at(e.clientX);
      let thumb: 0 | 1 = 0;
      if (this.mode === 'curtain') {
        const hit = (e.target as HTMLElement).closest('.tl-thumb');
        thumb = hit ? (hit === this.thumbs[1] ? 1 : 0) : Math.abs(v - this.pair[0]) <= Math.abs(v - this.pair[1]) ? 0 : 1;
      }
      this.drag = { thumb, id: e.pointerId };
      this.track.setPointerCapture(e.pointerId);
      this.el.classList.add('dragging');
      this.move(v);
    };
    const move = (e: PointerEvent) => {
      if (!this.drag || e.pointerId !== this.drag.id) return;
      this.move(this.at(e.clientX));
    };
    const up = (e: PointerEvent) => {
      if (!this.drag || e.pointerId !== this.drag.id) return;
      this.drag = null;
      this.el.classList.remove('dragging');
      if (this.mode === 'fade') void this.setValue(Math.round(this.value), 260);
    };
    this.track.addEventListener('pointerdown', down);
    this.track.addEventListener('pointermove', move);
    this.track.addEventListener('pointerup', up);
    this.track.addEventListener('pointercancel', up);
    this.thumbs.forEach((th, k) =>
      th.addEventListener('keydown', (e) => {
        const d = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageDown: -3, PageUp: 3 }[e.key];
        const abs = e.key === 'Home' ? 0 : e.key === 'End' ? this.n - 1 : null;
        if (d === undefined && abs === null) return;
        e.preventDefault();
        this.ev.onGrab();
        if (this.mode === 'fade') void this.setValue(abs ?? Math.round(this.value) + d!, 240);
        else {
          const p: [number, number] = [...this.pair];
          p[k] = clamp(abs ?? p[k]! + d!, 0, this.n - 1);
          this.setPair(p[0], p[1]);
        }
      }),
    );
  }

  private move(v: number): void {
    if (this.mode === 'fade') {
      this.value = v;
      this.render();
      this.ev.onValue(v);
      return;
    }
    const p: [number, number] = [...this.pair];
    p[this.drag?.thumb ?? 0] = Math.round(v);
    if (p[0] !== this.pair[0] || p[1] !== this.pair[1]) this.setPair(p[0], p[1]);
  }

  focus(): void {
    this.thumbs[0].focus();
  }
}

