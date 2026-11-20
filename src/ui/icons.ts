/**
 * Every icon on the site comes from Lucide (https://lucide.dev, ISC licence).
 * The same set renders as DOM nodes in the browser and as SVG strings for the static pages,
 * so no text symbols (arrows, dots, ×…) are needed anywhere.
 */
import {
  ArrowLeft, ArrowRight, Blend, Building, Check, ChevronDown, ChevronsLeftRight, CircleExclamationPoint, CodeXml, Columns2, Copy, Dot,
  Download, Film, House, Image, Info, Layers, Link, LocateFixed, Map as MapIcon, MapPin, Menu, Minus, Moon, Mountain, Pause, Play, Plus,
  Search, Share, Signpost, Sun, Type, X, type IconNode,
} from 'lucide';

const ICONS = {
  search: Search,
  sun: Sun,
  moon: Moon,
  menu: Menu,
  plus: Plus,
  minus: Minus,
  x: X,
  times: X,
  check: Check,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  chevronDown: ChevronDown,
  map: MapIcon,
  drag: ChevronsLeftRight,
  play: Play,
  pause: Pause,
  share: Share,
  link: Link,
  copy: Copy,
  film: Film,
  download: Download,
  columns: Columns2,
  blend: Blend,
  layers: Layers,
  type: Type,
  locate: LocateFixed,
  pin: MapPin,
  road: Signpost,
  building: Building,
  mountain: Mountain,
  info: Info,
  home: House,
  image: Image,
  alert: CircleExclamationPoint,
  code: CodeXml,
  dot: Dot,
} satisfies Record<string, IconNode>;

export type IconName = keyof typeof ICONS;
const FILLED = new Set<IconName>(['play', 'pause', 'dot']);
const STROKE = '1.75';

function attrs(name: IconName, size: number): Record<string, string> {
  const filled = FILLED.has(name);
  return {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: name === 'dot' ? '9.1 9.1 6 6' : '0 0 24 24',
    width: String(size),
    height: String(size),
    fill: filled ? 'currentColor' : 'none',
    stroke: 'currentColor',
    'stroke-width': name === 'dot' ? '0' : filled ? '1' : STROKE,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
  };
}

/** The icon as a DOM node (browser). */
export function icon(name: IconName, size = 18, cls = ''): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  for (const [k, v] of Object.entries(attrs(name, size))) if (k !== 'xmlns') svg.setAttribute(k, v);
  svg.setAttribute('class', `ico ico-${name}${cls ? ` ${cls}` : ''}`);
  for (const [tag, a] of ICONS[name]) {
    const el = document.createElementNS(ns, tag);
    for (const [k, v] of Object.entries(a)) el.setAttribute(k, String(v));
    svg.append(el);
  }
  return svg;
}

const escAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** The icon as markup (static pages, built in Node). */
export function iconSvg(name: IconName, size = 18, cls = ''): string {
  const a = Object.entries(attrs(name, size)).map(([k, v]) => `${k}="${v}"`).join(' ');
  const body = ICONS[name].map(([tag, at]) => `<${tag} ${Object.entries(at).map(([k, v]) => `${k}="${escAttr(String(v))}"`).join(' ')}/>`).join('');
  return `<svg class="ico ico-${name}${cls ? ` ${cls}` : ''}" ${a}>${body}</svg>`;
}

/** A small dot that separates items in a line of text (instead of a "·" character). */
export const sepSvg = (): string => `<span class="sep">${iconSvg('dot', 10)}</span>`;
export function sep(): HTMLSpanElement {
  const s = document.createElement('span');
  s.className = 'sep';
  s.append(icon('dot', 10));
  return s;
}

/** Shapes of an icon for drawing on a canvas (video and GIF overlay). */
export function iconNode(name: IconName): IconNode {
  return ICONS[name];
}

/** Replace every <i data-icon="name" data-size="n"> in the document with its SVG. */
export function hydrateIcons(root: ParentNode = document): void {
  for (const el of root.querySelectorAll<HTMLElement>('i[data-icon]')) {
    el.replaceWith(icon(el.dataset.icon as IconName, Number(el.dataset.size) || 18));
  }
}
