// The two dialogs of the map: share the view, and export a timelapse. Native <dialog>
// (focus trap, Escape, backdrop); shown as a bottom sheet on phones.
import type { Survey } from '../data/layers.ts';
import { t } from '../i18n.ts';
import { track } from '../ui/consent.ts';
import { icon, sep } from '../ui/icons.ts';
import type { Aspect, ExportResult, Format, Speed } from './export.ts';

// The encoders (MP4/WebM muxers, GIF) load only when the export dialog is first opened.
const load = () => import('./export.ts');

function sheet(titleText: string): { dialog: HTMLDialogElement; body: HTMLElement } {
  const dialog = document.createElement('dialog');
  dialog.className = 'sheet';
  const head = document.createElement('div');
  head.className = 'sheet-head';
  const h = document.createElement('h2');
  h.textContent = titleText;
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'icon-btn';
  close.setAttribute('aria-label', t('Cerrar'));
  close.append(icon('x', 20));
  close.addEventListener('click', () => dialog.close());
  head.append(h, close);
  const body = document.createElement('div');
  body.className = 'sheet-body';
  dialog.append(head, body);
  // Click on the backdrop closes.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  document.body.append(dialog);
  return { dialog, body };
}

function choice<T extends string>(name: string, legend: string, options: [T, string, string?][], value: T): { el: HTMLFieldSetElement; get: () => T; set: (v: T) => void } {
  const fs = document.createElement('fieldset');
  fs.className = 'choice';
  fs.innerHTML = `<legend>${legend}</legend>`;
  const row = document.createElement('div');
  row.className = 'choice-row';
  for (const [v, text, cls] of options) {
    const l = document.createElement('label');
    l.innerHTML = `<input type="radio" name="${name}" value="${v}"${v === value ? ' checked' : ''} /><span>${cls ? `<i class="shape ${cls}"></i>` : ''}<b>${text}</b></span>`;
    row.append(l);
  }
  fs.append(row);
  return {
    el: fs,
    get: () => (fs.querySelector<HTMLInputElement>('input:checked')?.value ?? value) as T,
    set: (v: T) => {
      const i = fs.querySelector<HTMLInputElement>(`input[value="${v}"]`);
      if (i) i.checked = true;
    },
  };
}

export class ShareSheet {
  private s = sheet(t('Compartir esta vista'));
  private img = document.createElement('img');
  private input = document.createElement('input');

  constructor(private get: () => { url: string; title: string; image: string }) {
    const { body } = this.s;
    const fig = document.createElement('figure');
    fig.className = 'share-preview';
    this.img.alt = t('Imagen de previsualización del enlace');
    this.img.width = 1200;
    this.img.height = 630;
    this.img.addEventListener('load', () => fig.classList.add('loaded'));
    const cap = document.createElement('figcaption');
    cap.textContent = t('Así se verá el enlace al compartirlo.');
    fig.append(this.img, cap);
    const row = document.createElement('div');
    row.className = 'share-row';
    this.input.readOnly = true;
    this.input.className = 'share-url';
    this.input.setAttribute('aria-label', t('Enlace'));
    this.input.addEventListener('focus', () => this.input.select());
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'btn';
    copy.append(icon('copy', 17), document.createTextNode(t('Copiar')));
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(this.input.value);
      } catch {
        this.input.select();
        document.execCommand('copy');
      }
      copy.replaceChildren(icon('check', 17), document.createTextNode(t('Copiado')));
      setTimeout(() => copy.replaceChildren(icon('copy', 17), document.createTextNode(t('Copiar'))), 1800);
      track('share', { method: 'copy' });
    });
    row.append(this.input, copy);
    body.append(fig, row);
    if (navigator.share) {
      const native = document.createElement('button');
      native.type = 'button';
      native.className = 'btn ghost wide';
      native.append(icon('share', 17), document.createTextNode(t('Compartir con…')));
      native.addEventListener('click', async () => {
        const g = this.get();
        try {
          await navigator.share({ title: g.title ? t('{p}, desde el aire', { p: g.title }) : 'Ayer', url: g.url });
          track('share', { method: 'native' });
        } catch {
          /* cancelled */
        }
      });
      body.append(native);
    }
  }

  open(): void {
    const g = this.get();
    this.input.value = g.url;
    const fig = this.img.parentElement!;
    fig.classList.remove('loaded');
    this.img.src = g.image;
    this.s.dialog.showModal();
  }
}

interface ExportContext {
  surveys: Survey[];
  all: Survey[];
  lon: number;
  lat: number;
  zoom: number;
  screen: { w: number; h: number };
  title: string;
  slug: string;
  findTitle: () => Promise<string>;
}

export class ExportSheet {
  private s = sheet(t('Crear un timelapse'));
  private form = document.createElement('form');
  private progress = document.createElement('div');
  private result = document.createElement('div');
  private ctl: AbortController | null = null;
  private url = '';
  private ctx: ExportContext | null = null;
  private fmt = choice<Format>('fmt', t('Formato'), [['video', t('Vídeo')], ['gif', 'GIF']], 'video');
  private aspect = choice<Aspect>(
    'aspect',
    t('Encuadre'),
    [
      ['square', t('Cuadrado'), 'sq'],
      ['landscape', t('Horizontal'), 'ls'],
      ['portrait', t('Vertical'), 'pt'],
    ],
    'square',
  );
  private speed = choice<Speed>(
    'speed',
    t('Velocidad'),
    [
      ['slow', t('Lenta')],
      ['normal', t('Normal')],
      ['fast', t('Rápida')],
    ],
    'normal',
  );
  private titleInput = document.createElement('input');
  private range = document.createElement('p');
  private go = document.createElement('button');

  constructor(private get: () => ExportContext) {
    const { body, dialog } = this.s;
    dialog.classList.add('export');
    const tl = document.createElement('label');
    tl.className = 'field';
    tl.innerHTML = `<span>${t('Texto sobre la imagen')}</span>`;
    this.titleInput.maxLength = 48;
    this.titleInput.placeholder = t('Nombre del lugar');
    tl.append(this.titleInput);
    this.range.className = 'export-range';
    this.go.type = 'submit';
    this.go.className = 'btn accent wide';
    this.go.append(icon('film', 18), document.createTextNode(t('Crear')));
    this.form.append(this.range, this.fmt.el, this.aspect.el, this.speed.el, tl, this.go);
    this.form.addEventListener('change', () => this.describe());
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      void this.run();
    });
    this.progress.className = 'export-progress';
    this.progress.hidden = true;
    this.progress.innerHTML = `<div class="bar"><span></span></div><p class="msg"></p>`;
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'btn ghost';
    cancel.textContent = t('Cancelar');
    cancel.addEventListener('click', () => this.ctl?.abort());
    this.progress.append(cancel);
    this.result.className = 'export-result';
    this.result.hidden = true;
    body.append(this.form, this.progress, this.result);
    dialog.addEventListener('close', () => {
      this.ctl?.abort();
      this.reset();
    });
  }

  private probed = false;
  private async probe(): Promise<void> {
    if (this.probed) return;
    this.probed = true;
    const v = await (await load()).videoSupport();
    const b = this.fmt.el.querySelector('input[value="video"] + span b')!;
    if (!v) {
      this.fmt.set('gif');
      this.fmt.el.querySelector<HTMLInputElement>('input[value="video"]')!.disabled = true;
    } else b.replaceChildren(t('Vídeo'), sep(), v.kind === 'recorder' ? (v.mime.includes('mp4') ? 'MP4' : 'WebM') : v.kind.toUpperCase());
  }

  private tileCount: ((j: Parameters<Awaited<ReturnType<typeof load>>['tileCount']>[0]) => number) | null = null;

  private describe(): void {
    const c = this.ctx!;
    if (!this.tileCount) return;
    const first = c.surveys[0]!;
    const last = c.surveys[c.surveys.length - 1]!;
    const l = (s: Survey) => (s.label === 'Hoy' ? t('Hoy') : s.label);
    const tiles = this.tileCount({ format: this.fmt.get(), aspect: this.aspect.get(), zoom: c.zoom, screen: c.screen, surveys: c.surveys });
    this.range.innerHTML = '';
    const b = document.createElement('b');
    b.textContent = t('De {a} a {b}', { a: l(first), b: l(last) });
    this.range.append(b, sep(), document.createTextNode(`${t('{n} fotos de esta zona', { n: c.surveys.length })}. ${t('Se descargarán unas {n} teselas.', { n: tiles })}`));
  }

  private reset(): void {
    this.form.hidden = false;
    this.progress.hidden = true;
    this.result.hidden = true;
    this.result.replaceChildren();
    if (this.url) URL.revokeObjectURL(this.url);
    this.url = '';
  }

  open(): void {
    this.reset();
    this.ctx = this.get();
    this.titleInput.value = this.ctx.title;
    if (!this.ctx.title) void this.ctx.findTitle().then((n) => (this.titleInput.value ||= n));
    this.range.textContent = '';
    this.s.dialog.showModal();
    void load().then((m) => {
      this.tileCount = m.tileCount;
      this.describe();
    });
    void this.probe();
  }

  private async run(): Promise<void> {
    const c = this.ctx!;
    this.form.hidden = true;
    this.progress.hidden = false;
    const bar = this.progress.querySelector<HTMLElement>('.bar span')!;
    const msg = this.progress.querySelector<HTMLElement>('.msg')!;
    this.ctl = new AbortController();
    const fmt = this.fmt.get();
    const t0 = performance.now();
    try {
      const res = await (await load()).runExport({
        format: fmt,
        aspect: this.aspect.get(),
        speed: this.speed.get(),
        surveys: c.surveys,
        lon: c.lon,
        lat: c.lat,
        zoom: c.zoom,
        screen: c.screen,
        title: this.titleInput.value.trim(),
        signal: this.ctl.signal,
        onProgress: (text, k) => {
          msg.textContent = text;
          bar.style.width = `${Math.round(k * 100)}%`;
        },
      });
      track('export', { format: res.ext, aspect: this.aspect.get(), surveys: c.surveys.length, seconds: Math.round((performance.now() - t0) / 1000) });
      this.show(res, c);
    } catch (e) {
      if ((e as Error).name === 'AbortError') {
        this.reset();
        return;
      }
      msg.textContent = `${t('No se pudo crear')}: ${(e as Error).message || e}`;
      bar.style.width = '0';
      setTimeout(() => this.reset(), 4500);
    }
  }

  private show(r: ExportResult, c: ExportContext): void {
    this.progress.hidden = true;
    this.result.hidden = false;
    this.url = URL.createObjectURL(r.blob);
    const media = r.ext === 'gif' ? Object.assign(document.createElement('img'), { src: this.url, alt: t('Vista previa del GIF') }) : Object.assign(document.createElement('video'), { src: this.url, controls: true, autoplay: true, muted: true, loop: true, playsInline: true });
    media.className = 'export-media';
    media.style.aspectRatio = `${r.width} / ${r.height}`;
    const first = c.surveys[0]!.label;
    const name = `ayer-${c.slug || 'vista'}-${first.replace(/[^\w]+/g, '')}-${c.surveys.length}.${r.ext}`;
    const info = document.createElement('p');
    info.className = 'export-info';
    info.replaceChildren(r.ext.toUpperCase(), sep(), String(r.width), icon('times', 12), String(r.height), sep(), `${(r.blob.size / 1048576).toFixed(1)} MB`);
    const row = document.createElement('div');
    row.className = 'share-row';
    const dl = document.createElement('a');
    dl.className = 'btn accent';
    dl.href = this.url;
    dl.download = name;
    dl.append(icon('download', 17), document.createTextNode(t('Descargar')));
    row.append(dl);
    const file = new File([r.blob], name, { type: r.mime });
    if (navigator.canShare?.({ files: [file] })) {
      const sh = document.createElement('button');
      sh.type = 'button';
      sh.className = 'btn ghost';
      sh.append(icon('share', 17), document.createTextNode(t('Compartir')));
      sh.addEventListener('click', () => void navigator.share({ files: [file], title: 'Ayer' }).catch(() => undefined));
      row.append(sh);
    }
    const again = document.createElement('button');
    again.type = 'button';
    again.className = 'btn ghost';
    again.textContent = t('Otro');
    again.addEventListener('click', () => this.reset());
    row.append(again);
    const note = document.createElement('p');
    note.className = 'export-note';
    note.textContent = t('Las fotos son del IGN con licencia CC BY 4.0: si lo publicas, deja visible la atribución.');
    this.result.append(media, info, row, note);
  }
}
