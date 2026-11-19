// Curtain mode: a second map, stacked on the first and clipped to the right of a vertical line,
// shows the "after" survey. It follows the main map's camera and ignores the pointer; the line
// has its own drag handle (mouse, touch and keyboard).
import * as maplibregl from 'maplibre-gl';
import { t } from '../i18n.ts';
import { icon } from '../ui/icons.ts';
import { baseStyle, Photos } from './photos.ts';

export class Curtain {
  readonly map: maplibregl.Map;
  photos: Photos | null = null;
  private wrap: HTMLElement;
  private line: HTMLElement;
  private tagA: HTMLElement;
  private tagB: HTMLElement;
  pos = 0.5;
  private ready: Promise<void>;
  private sync = () => this.map.jumpTo({ center: this.main.getCenter(), zoom: this.main.getZoom(), bearing: 0, pitch: 0 });

  constructor(
    private host: HTMLElement,
    private main: maplibregl.Map,
    bg: string,
    labels: boolean,
  ) {
    this.wrap = document.createElement('div');
    this.wrap.className = 'curtain-map';
    host.append(this.wrap);
    this.map = new maplibregl.Map({
      container: this.wrap,
      style: baseStyle(bg),
      center: main.getCenter(),
      zoom: main.getZoom(),
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
    });
    this.ready = new Promise((ok) =>
      this.map.once('load', () => {
        this.photos = new Photos(this.map);
        this.photos.labels(labels);
        ok();
      }),
    );
    main.on('move', this.sync);

    this.line = document.createElement('div');
    this.line.className = 'curtain-line';
    const knob = document.createElement('button');
    knob.type = 'button';
    knob.className = 'curtain-knob';
    knob.setAttribute('role', 'slider');
    knob.setAttribute('aria-label', t('Posición de la cortina'));
    knob.setAttribute('aria-valuemin', '0');
    knob.setAttribute('aria-valuemax', '100');
    knob.append(icon('drag', 20));
    this.line.append(knob);
    this.tagA = document.createElement('span');
    this.tagA.className = 'curtain-tag a';
    this.tagB = document.createElement('span');
    this.tagB.className = 'curtain-tag b';
    this.line.append(this.tagA, this.tagB);
    host.append(this.line);

    let id: number | null = null;
    const at = (x: number) => {
      const r = this.host.getBoundingClientRect();
      this.set((x - r.left) / r.width);
    };
    this.line.addEventListener('pointerdown', (e) => {
      id = e.pointerId;
      this.line.setPointerCapture(e.pointerId);
      this.line.classList.add('dragging');
      e.preventDefault();
      e.stopPropagation();
    });
    this.line.addEventListener('pointermove', (e) => e.pointerId === id && at(e.clientX));
    const up = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = null;
      this.line.classList.remove('dragging');
    };
    this.line.addEventListener('pointerup', up);
    this.line.addEventListener('pointercancel', up);
    knob.addEventListener('keydown', (e) => {
      const d = { ArrowLeft: -0.05, ArrowRight: 0.05 }[e.key];
      if (d) {
        e.preventDefault();
        this.set(this.pos + d);
      }
    });
    this.set(0.5);
    // Give a hint of the gesture once: the line sways a little after appearing.
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t0 = performance.now();
      const sway = (now: number) => {
        const k = Math.min(1, (now - t0) / 1600);
        if (id === null) this.set(0.5 + Math.sin(k * Math.PI * 2) * 0.08 * (1 - k));
        if (k < 1) requestAnimationFrame(sway);
      };
      setTimeout(() => requestAnimationFrame(sway), 450);
    }
  }

  set(p: number): void {
    this.pos = Math.max(0.02, Math.min(0.98, p));
    const pct = `${this.pos * 100}%`;
    this.wrap.style.clipPath = `inset(0 0 0 ${pct})`;
    this.line.style.left = pct;
    this.line.querySelector('.curtain-knob')!.setAttribute('aria-valuenow', String(Math.round(this.pos * 100)));
  }

  async show(id: string, labelA: string, labelB: string): Promise<void> {
    this.tagA.textContent = labelA;
    this.tagB.textContent = labelB;
    await this.ready;
    this.photos!.single(id);
  }

  labels(on: boolean): void {
    void this.ready.then(() => this.photos!.labels(on));
  }

  background(bg: string): void {
    void this.ready.then(() => this.map.setPaintProperty('bg', 'background-color', bg));
  }

  resize(): void {
    this.map.resize();
  }

  destroy(): void {
    this.main.off('move', this.sync);
    this.map.remove();
    this.wrap.remove();
    this.line.remove();
  }
}
