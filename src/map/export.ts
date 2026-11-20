// Timelapse export, done entirely in the browser. For every survey we stitch the tiles covering
// the frame into one image (through the same cached proxy the map uses), then draw the frames:
// each survey held, then cross-faded into the next, with the place, the year, the IGN credit and
// a small mark of the site printed on top. Video is encoded with WebCodecs (H.264 in MP4, or
// VP9/VP8 in WebM); without WebCodecs we fall back to MediaRecorder in real time. GIF uses gifenc.
import { applyPalette, GIFEncoder, quantize } from 'gifenc';
import { ArrayBufferTarget as Mp4Target, Muxer as Mp4Muxer } from 'mp4-muxer';
import { ArrayBufferTarget as WebmTarget, Muxer as WebmMuxer } from 'webm-muxer';
import { concreteTile, type Survey } from '../data/layers.ts';
import { t } from '../i18n.ts';
import { fetchRetry } from './tiles.ts';

export type Format = 'video' | 'gif';
export type Aspect = 'square' | 'landscape' | 'portrait';
export type Speed = 'slow' | 'normal' | 'fast';

export interface ExportJob {
  format: Format;
  aspect: Aspect;
  speed: Speed;
  surveys: Survey[];
  lon: number;
  lat: number;
  zoom: number;
  /** Size of the map on screen in CSS pixels; the export frames the same area. */
  screen: { w: number; h: number };
  title: string;
  onProgress: (text: string, k: number) => void;
  signal: AbortSignal;
}

export interface ExportResult {
  blob: Blob;
  ext: string;
  mime: string;
  width: number;
  height: number;
}

const SIZES: Record<Format, Record<Aspect, [number, number]>> = {
  video: { square: [1080, 1080], landscape: [1280, 720], portrait: [720, 1280] },
  gif: { square: [540, 540], landscape: [640, 360], portrait: [360, 640] },
};
const TIMING: Record<Speed, { hold: number; fade: number }> = {
  slow: { hold: 1.7, fade: 1.1 },
  normal: { hold: 1.05, fade: 0.75 },
  fast: { hold: 0.6, fade: 0.45 },
};
const FPS = 30;
const PAPER = '#e4e1d8';

const yearLabel = (s: Survey) => (s.label === 'Hoy' ? t('Hoy') : s.label);
const tick = () => new Promise<void>((ok) => setTimeout(ok, 0));

/** Which video encoder this browser can use, if any (checked before offering the format). */
export async function videoSupport(w = 1080, h = 1080): Promise<{ kind: 'mp4' | 'webm'; codec: string } | { kind: 'recorder'; mime: string } | null> {
  if (typeof VideoEncoder !== 'undefined') {
    const tries: [string, 'mp4' | 'webm'][] = [
      ['avc1.640028', 'mp4'],
      ['avc1.4d0028', 'mp4'],
      ['avc1.42e028', 'mp4'],
      ['vp09.00.40.08', 'webm'],
      ['vp8', 'webm'],
    ];
    for (const [codec, kind] of tries) {
      try {
        const s = await VideoEncoder.isConfigSupported({ codec, width: w, height: h, bitrate: 6_000_000, framerate: FPS });
        if (s.supported) return { kind, codec };
      } catch {
        /* try the next one */
      }
    }
  }
  if (typeof MediaRecorder !== 'undefined' && typeof HTMLCanvasElement.prototype.captureStream === 'function') {
    for (const mime of ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm']) if (MediaRecorder.isTypeSupported(mime)) return { kind: 'recorder', mime };
  }
  return null;
}

/** Share of a picture that is neither blank white nor the paper background. */
function filledShare(bmp: ImageBitmap): number {
  const c = new OffscreenCanvas(48, 48).getContext('2d', { willReadFrequently: true })!;
  c.drawImage(bmp, 0, 0, 48, 48);
  const d = c.getImageData(0, 0, 48, 48).data;
  let n = 0;
  for (let i = 0; i < d.length; i += 4) {
    const white = d[i]! > 245 && d[i + 1]! > 245 && d[i + 2]! > 245;
    const paper = Math.abs(d[i]! - 0xe4) < 3 && Math.abs(d[i + 1]! - 0xe1) < 3 && Math.abs(d[i + 2]! - 0xd8) < 3;
    if (!white && !paper) n++;
  }
  return n / (48 * 48);
}

/** Stitch the tiles of one survey covering the frame. */
async function stitch(s: Survey, job: ExportJob, w: number, h: number, done: () => void): Promise<ImageBitmap> {
  // The frame covers the largest box of the output's aspect that fits in the screen view.
  const r = w / h;
  const cssW = job.screen.w / job.screen.h > r ? job.screen.h * r : job.screen.w;
  const zf = job.zoom + Math.log2(w / cssW);
  const zt = Math.max(6, Math.min(18, Math.round(zf)));
  const scale = 2 ** (zf - zt);
  const world = 256 * 2 ** zt;
  const cx = ((job.lon + 180) / 360) * world;
  const lr = (job.lat * Math.PI) / 180;
  const cy = ((1 - Math.log(Math.tan(lr) + 1 / Math.cos(lr)) / Math.PI) / 2) * world;
  const x0 = cx - w / 2 / scale;
  const y0 = cy - h / 2 / scale;
  const tx0 = Math.floor(x0 / 256);
  const ty0 = Math.floor(y0 / 256);
  const tx1 = Math.floor((x0 + w / scale) / 256);
  const ty1 = Math.floor((y0 + h / scale) / 256);
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  const jobs: [number, number][] = [];
  for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) jobs.push([tx, ty]);
  let i = 0;
  const worker = async () => {
    while (i < jobs.length) {
      const [tx, ty] = jobs[i++]!;
      try {
        const res = await fetchRetry(concreteTile(s, zt, tx, ty), job.signal, 4);
        const bmp = await createImageBitmap(await res.blob());
        ctx.drawImage(bmp, Math.round((tx * 256 - x0) * scale), Math.round((ty * 256 - y0) * scale), Math.ceil(256 * scale) + 1, Math.ceil(256 * scale) + 1);
        bmp.close();
      } catch (e) {
        if ((e as Error).name === 'AbortError') throw e;
        // A tile that keeps failing stays as paper; the rest of the frame is still useful.
      }
      done();
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));
  return canvas.transferToImageBitmap();
}

export function tileCount(job: Pick<ExportJob, 'format' | 'aspect' | 'zoom' | 'screen' | 'surveys'>): number {
  const [w, h] = SIZES[job.format][job.aspect];
  const r = w / h;
  const cssW = job.screen.w / job.screen.h > r ? job.screen.h * r : job.screen.w;
  const zf = job.zoom + Math.log2(w / cssW);
  const scale = 2 ** (zf - Math.max(6, Math.min(18, Math.round(zf))));
  return (Math.ceil(w / scale / 256) + 1) * (Math.ceil(h / scale / 256) + 1) * job.surveys.length;
}

/** Everything printed over the photo. */
function overlay(ctx: CanvasRenderingContext2D, w: number, h: number, job: ExportJob, cur: Survey, next: Survey | null, k: number, index: number): void {
  const u = Math.min(w, h) / 720;
  const pad = Math.round(36 * u);
  const g = ctx.createLinearGradient(0, h * 0.55, 0, h);
  g.addColorStop(0, 'rgba(12,10,8,0)');
  g.addColorStop(1, 'rgba(12,10,8,0.66)');
  ctx.fillStyle = g;
  ctx.fillRect(0, h * 0.55, w, h * 0.45);
  const top = ctx.createLinearGradient(0, 0, 0, h * 0.16);
  top.addColorStop(0, 'rgba(12,10,8,0.42)');
  top.addColorStop(1, 'rgba(12,10,8,0)');
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, w, h * 0.16);

  const n = job.surveys.length;
  // Progress: one dot per survey along the bottom.
  const py = h - pad;
  const span = w - pad * 2;
  ctx.strokeStyle = 'rgba(246,241,231,0.35)';
  ctx.lineWidth = Math.max(1, 1.5 * u);
  ctx.beginPath();
  ctx.moveTo(pad, py);
  ctx.lineTo(pad + span, py);
  ctx.stroke();
  const pos = n > 1 ? (index + k) / (n - 1) : 1;
  ctx.strokeStyle = '#a9c6ff';
  ctx.lineWidth = Math.max(2, 3 * u);
  ctx.beginPath();
  ctx.moveTo(pad, py);
  ctx.lineTo(pad + span * Math.min(1, pos), py);
  ctx.stroke();
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = i <= index + k + 1e-6 ? '#a9c6ff' : 'rgba(246,241,231,0.6)';
    ctx.beginPath();
    ctx.arc(pad + (n > 1 ? (span * i) / (n - 1) : span), py, Math.max(2, 3.2 * u), 0, Math.PI * 2);
    ctx.fill();
  }

  // Year, cross-fading with the photos.
  const yearSize = Math.round(112 * u);
  const yb = py - Math.round(30 * u);
  ctx.textBaseline = 'alphabetic';
  ctx.font = `500 ${yearSize}px "Jost Variable", Futura, sans-serif`;
  const drawYear = (s: Survey, a: number) => {
    if (a <= 0) return;
    ctx.globalAlpha = a;
    ctx.fillStyle = '#f6f1e7';
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 18 * u;
    ctx.fillText(yearLabel(s), pad - 4 * u, yb);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  };
  drawYear(cur, next ? 1 - Math.min(1, k * 2) : 1);
  if (next) drawYear(next, Math.max(0, k * 2 - 1));

  // Place name above the year.
  const ts = Math.round(19 * u);
  ctx.font = `700 ${ts}px "Courier Prime", "Courier New", monospace`;
  const c = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
  if ('letterSpacing' in c) c.letterSpacing = `${(0.06 * ts).toFixed(1)}px`;
  ctx.fillStyle = '#a9c6ff';
  const title = job.title.toUpperCase();
  let tt = title;
  while (ctx.measureText(tt).width > w - pad * 2 && tt.length > 4) tt = tt.slice(0, -2);
  if (tt !== title) tt = tt.replace(/.$/, '…');
  ctx.fillText(tt, pad, yb - yearSize * 0.86);
  if ('letterSpacing' in c) c.letterSpacing = '0px';

  // Credit (required by the licence) top left, site mark top right.
  const shown = next && k > 0.5 ? next : cur;
  const cs = Math.max(10, Math.round(13 * u));
  ctx.font = `400 ${cs}px "Courier Prime", "Courier New", monospace`;
  ctx.fillStyle = 'rgba(246,241,231,0.85)';
  ctx.textBaseline = 'top';
  const credit = `${shown.product} · CC-BY 4.0 scne.es · © IGN`;
  ctx.fillText(credit, pad, pad * 0.7);
  ctx.font = `600 ${Math.round(14 * u)}px "Jost Variable", Futura, sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(246,241,231,0.78)';
  if ('letterSpacing' in c) c.letterSpacing = `${(0.2 * 14 * u).toFixed(1)}px`;
  ctx.fillText('AYER.AMINOX.DEV', w - pad, pad * 0.7 + (ctx.measureText(credit).width > w - pad * 2 - 140 * u ? cs * 1.5 : 0));
  if ('letterSpacing' in c) c.letterSpacing = '0px';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Fiducial marks in the corners, as on the survey prints.
  const fi = Math.round(14 * u);
  const fl = Math.round(22 * u);
  ctx.strokeStyle = 'rgba(247,246,242,0.85)';
  ctx.lineWidth = Math.max(1, 1.6 * u);
  ctx.beginPath();
  for (const [x, y, dx, dy] of [
    [fi, fi, 1, 1],
    [w - fi, fi, -1, 1],
    [fi, h - fi, 1, -1],
    [w - fi, h - fi, -1, -1],
  ] as const) {
    ctx.moveTo(x + dx * fl, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * fl);
  }
  ctx.stroke();
}

/** Frame plan: for each output frame, which survey, the next one, and the blend factor. */
function plan(n: number, speed: Speed, fps: number): { i: number; k: number }[] {
  const { hold, fade } = TIMING[speed];
  const out: { i: number; k: number }[] = [];
  for (let i = 0; i < n; i++) {
    const h = Math.round((hold + (i === 0 ? 0.5 : 0) + (i === n - 1 ? 1.6 : 0)) * fps);
    for (let f = 0; f < h; f++) out.push({ i, k: 0 });
    if (i < n - 1) {
      const fl = Math.max(2, Math.round(fade * fps));
      for (let f = 1; f <= fl; f++) out.push({ i, k: f / (fl + 1) });
    }
  }
  return out;
}

export async function runExport(job: ExportJob): Promise<ExportResult> {
  const [w, h] = SIZES[job.format][job.aspect];
  await Promise.all([
    document.fonts.load(`500 100px "Jost Variable"`),
    document.fonts.load(`700 20px "Courier Prime"`),
    document.fonts.load(`400 20px "Courier Prime"`),
  ]).catch(() => undefined);

  // 1. Photos.
  const total = tileCount({ ...job });
  let got = 0;
  const bump = () => job.onProgress(t('Descargando fotos… {p} %', { p: Math.min(99, Math.round((++got / total) * 100)) }), (got / total) * 0.6);
  job.onProgress(t('Descargando fotos… {p} %', { p: 0 }), 0);
  const frames: ImageBitmap[] = [];
  const kept: Survey[] = [];
  for (const s of job.surveys) {
    const bmp = await stitch(s, job, w, h, bump);
    if (job.signal.aborted) throw new DOMException('aborted', 'AbortError');
    // A survey that turns out not to cover the frame would be a blank picture: leave it out.
    if (filledShare(bmp) < 0.1) bmp.close();
    else {
      frames.push(bmp);
      kept.push(s);
    }
  }
  if (kept.length < 2) throw new Error(t('No hay fotos suficientes de esta zona.'));
  job = { ...job, surveys: kept };

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: job.format === 'gif' })!;
  const draw = (i: number, k: number) => {
    ctx.globalAlpha = 1;
    ctx.drawImage(frames[i]!, 0, 0);
    const next = k > 0 ? job.surveys[i + 1] ?? null : null;
    if (next) {
      ctx.globalAlpha = k;
      ctx.drawImage(frames[i + 1]!, 0, 0);
      ctx.globalAlpha = 1;
    }
    overlay(ctx, w, h, job, job.surveys[i]!, next, k, i);
  };

  try {
    if (job.format === 'gif') return await encodeGif(job, draw, ctx, w, h);
    return await encodeVideo(job, draw, canvas, w, h);
  } finally {
    frames.forEach((f) => f.close());
  }
}

async function encodeGif(job: ExportJob, draw: (i: number, k: number) => void, ctx: CanvasRenderingContext2D, w: number, h: number): Promise<ExportResult> {
  const gif = GIFEncoder();
  const { hold, fade } = TIMING[job.speed];
  const n = job.surveys.length;
  const steps = 4;
  const seq: { i: number; k: number; ms: number }[] = [];
  for (let i = 0; i < n; i++) {
    seq.push({ i, k: 0, ms: Math.round((hold + (i === n - 1 ? 1.6 : 0)) * 1000) });
    if (i < n - 1) for (let s = 1; s <= steps; s++) seq.push({ i, k: s / (steps + 1), ms: Math.round((fade * 1000) / steps) });
  }
  for (let f = 0; f < seq.length; f++) {
    if (job.signal.aborted) throw new DOMException('aborted', 'AbortError');
    const { i, k, ms } = seq[f]!;
    draw(i, k);
    const data = ctx.getImageData(0, 0, w, h).data;
    const palette = quantize(data, 256, { format: 'rgb444' });
    const index = applyPalette(data, palette, 'rgb444');
    gif.writeFrame(index, w, h, { palette, delay: ms, repeat: 0 });
    job.onProgress(t('Creando el GIF… {p} %', { p: Math.round(((f + 1) / seq.length) * 100) }), 0.6 + ((f + 1) / seq.length) * 0.4);
    await tick();
  }
  gif.finish();
  return { blob: new Blob([gif.bytes() as Uint8Array<ArrayBuffer>], { type: 'image/gif' }), ext: 'gif', mime: 'image/gif', width: w, height: h };
}

async function encodeVideo(job: ExportJob, draw: (i: number, k: number) => void, canvas: HTMLCanvasElement, w: number, h: number): Promise<ExportResult> {
  const support = await videoSupport(w, h);
  if (!support) throw new Error(t('Este navegador no puede crear vídeo. Prueba con el GIF.'));
  if (support.kind === 'recorder') return record(job, draw, canvas, plan(job.surveys.length, job.speed, FPS), support.mime, w, h);
  // Encoders can claim support and still fail (Firefox's H.264 emits frames the MP4 muxer
  // rejects; some builds have no working encoder at all): try MP4, then WebM, then MediaRecorder.
  const attempts: { kind: 'mp4' | 'webm'; codec: string }[] = [support];
  if (support.kind === 'mp4') attempts.push({ kind: 'webm', codec: 'vp09.00.40.08' }, { kind: 'webm', codec: 'vp8' });
  let last: unknown;
  for (const a of attempts) {
    try {
      return await encodeWith(job, draw, canvas, w, h, a);
    } catch (e) {
      if ((e as Error).name === 'AbortError') throw e;
      console.warn(`Export with ${a.codec} failed:`, e);
      last = e;
    }
  }
  if (typeof MediaRecorder !== 'undefined' && typeof canvas.captureStream === 'function') {
    for (const mime of ['video/mp4', 'video/webm;codecs=vp9', 'video/webm']) {
      if (MediaRecorder.isTypeSupported(mime)) return record(job, draw, canvas, plan(job.surveys.length, job.speed, FPS), mime, w, h);
    }
  }
  throw last;
}

async function encodeWith(
  job: ExportJob,
  draw: (i: number, k: number) => void,
  canvas: HTMLCanvasElement,
  w: number,
  h: number,
  support: { kind: 'mp4' | 'webm'; codec: string },
): Promise<ExportResult> {
  const frames = plan(job.surveys.length, job.speed, FPS);

  const mp4 = support.kind === 'mp4';
  const target = mp4 ? new Mp4Target() : new WebmTarget();
  const muxer = mp4
    ? new Mp4Muxer({ target: target as Mp4Target, video: { codec: 'avc', width: w, height: h, frameRate: FPS }, fastStart: 'in-memory' })
    : new WebmMuxer({ target: target as WebmTarget, video: { codec: support.codec.startsWith('vp09') ? 'V_VP9' : 'V_VP8', width: w, height: h, frameRate: FPS } });
  let failure: unknown = null;
  const encoder = new VideoEncoder({
    output: (chunk, meta) => {
      if (failure) return;
      try {
        (muxer as Mp4Muxer<Mp4Target>).addVideoChunk(chunk, meta);
      } catch (e) {
        failure = e;
      }
    },
    error: (e) => (failure = e),
  });
  encoder.configure({
    codec: support.codec,
    width: w,
    height: h,
    bitrate: Math.round(w * h * 5.5),
    framerate: FPS,
    // Real-time mode keeps frames in order (no B-frames), which the MP4 muxer needs.
    ...(mp4 ? { avc: { format: 'avc' as const }, latencyMode: 'realtime' as const } : {}),
  });
  for (let f = 0; f < frames.length; f++) {
    if (job.signal.aborted) {
      if (encoder.state !== 'closed') encoder.close();
      throw new DOMException('aborted', 'AbortError');
    }
    if (failure) {
      if (encoder.state !== 'closed') encoder.close();
      throw failure;
    }
    const { i, k } = frames[f]!;
    draw(i, k);
    const vf = new VideoFrame(canvas, { timestamp: Math.round((f * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
    encoder.encode(vf, { keyFrame: f % (FPS * 2) === 0 });
    vf.close();
    while (encoder.encodeQueueSize > 6) await new Promise((ok) => setTimeout(ok, 4));
    if (f % 6 === 0) {
      job.onProgress(t('Creando el vídeo… {p} %', { p: Math.round(((f + 1) / frames.length) * 100) }), 0.6 + ((f + 1) / frames.length) * 0.4);
      await tick();
    }
  }
  await encoder.flush();
  if (failure) {
    if (encoder.state !== 'closed') encoder.close();
    throw failure;
  }
  if (encoder.state !== 'closed') encoder.close();
  muxer.finalize();
  const buf = (target as Mp4Target).buffer;
  const mime = mp4 ? 'video/mp4' : 'video/webm';
  return { blob: new Blob([buf], { type: mime }), ext: mp4 ? 'mp4' : 'webm', mime, width: w, height: h };
}

/** Real-time fallback for browsers without WebCodecs. */
async function record(job: ExportJob, draw: (i: number, k: number) => void, canvas: HTMLCanvasElement, frames: { i: number; k: number }[], mime: string, w: number, h: number): Promise<ExportResult> {
  draw(0, 0);
  const stream = canvas.captureStream(FPS);
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: Math.round(w * h * 5.5) });
  const parts: Blob[] = [];
  rec.ondataavailable = (e) => e.data.size && parts.push(e.data);
  const stopped = new Promise<void>((ok) => (rec.onstop = () => ok()));
  rec.start(500);
  const t0 = performance.now();
  for (let f = 0; f < frames.length; f++) {
    if (job.signal.aborted) {
      rec.stop();
      throw new DOMException('aborted', 'AbortError');
    }
    const { i, k } = frames[f]!;
    draw(i, k);
    if (f % 6 === 0) job.onProgress(t('Grabando el vídeo… {p} %', { p: Math.round(((f + 1) / frames.length) * 100) }), 0.6 + ((f + 1) / frames.length) * 0.4);
    const due = t0 + ((f + 1) * 1000) / FPS;
    await new Promise((ok) => setTimeout(ok, Math.max(0, due - performance.now())));
  }
  rec.stop();
  await stopped;
  stream.getTracks().forEach((tr) => tr.stop());
  const type = mime.split(';')[0]!;
  return { blob: new Blob(parts, { type }), ext: type.includes('mp4') ? 'mp4' : 'webm', mime: type, width: w, height: h };
}
