// lib/icons.js — Icon-API.
//
// Zwei APIs koexistieren:
//   1. icon(name, opts) — Legacy-String-API. Erzeugt eigenständiges <svg>-Markup
//      aus der eingebauten ICONS-Map. Wird weiter genutzt von app.js
//      (Theme-Buttons + [data-icon]-Auflösung) und allen explainer/*.html.
//      Tests in tests/icons.test.js stützen sich auf icon() + ICONS.
//   2. renderIcon(name, attrs) — Codex-Sprite-API gemäss Spec §4.5. Gibt ein
//      SVGElement zurück, das via <use href="#i-NAME"/> auf das in assets/icons.svg
//      hinterlegte Symbol verweist. Setzt voraus, dass initSprite() (siehe
//      lib/icons-sprite.js) bereits gelaufen ist.
//
// Beide APIs greifen auf dieselbe Bibliothek von Symbol-Namen zu (siehe
// docs/codex-design-spec.md §4.2 für die kanonische Liste).

export const ICONS = {
  'paperclip': 'M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48',
  'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h8',
  'message-square': 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  'sun': 'M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42 circle:12,12,5',
  'moon': 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  'copy': 'M9 9h13v13H9z M5 15H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2',
  'check': 'M20 6 9 17l-5-5',
  'x': 'M18 6L6 18 M6 6l12 12',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  'rotate-ccw': 'M3 12a9 9 0 1 0 9-9 M3 3v6h6',
  'layers': 'M12 2 2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
  'search': 'circle:11,11,8 M21 21l-4.35-4.35',
  'messages-square': 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M14 9h4 M14 13h4',
  'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'git-branch': 'M6 3v12 M6 21a3 3 0 1 1 0-6 3 3 0 0 1 0 6z M18 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6z M18 9a9 9 0 0 1-9 9',
  'package': 'M16.5 9.4l-9-5.19 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
  'cpu': 'M4 4h16v16H4z M9 9h6v6H9z M9 1v3 M15 1v3 M9 20v3 M15 20v3 M20 9h3 M20 14h3 M1 9h3 M1 14h3',
  'brain': 'M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18z M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18z',
  'book': 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  'code': 'M16 18l6-6-6-6 M8 6l-6 6 6 6',
  'sparkles': 'M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6l-4.9 3.6 1.9-5.8L4 8.8h6.1z',
  'lightbulb': 'M9 18h6 M10 22h4 M12 2a7 7 0 0 0-4 12.7c.6.6 1 1.4 1 2.3V18h6v-1c0-.9.4-1.7 1-2.3A7 7 0 0 0 12 2z',
  'play-circle': 'circle:12,12,10 M10 8l6 4-6 4V8z',
  'database': 'M4 6a8 4 0 0 0 16 0 8 4 0 0 0-16 0z M4 6v6a8 4 0 0 0 16 0V6 M4 12v6a8 4 0 0 0 16 0v-6',
  'workflow': 'M3 5h6 M15 5h6 M15 19h6 M3 19h6 M9 5v14 M15 19v-7 M15 12h6',
  'cog': 'M12 1v3 M12 20v3 M4.22 4.22l2.12 2.12 M17.66 17.66l2.12 2.12 M1 12h3 M20 12h3 M4.22 19.78l2.12-2.12 M17.66 6.34l2.12-2.12 circle:12,12,6 circle:12,12,2',
  'laptop': 'M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9 M2 20h20',
  'smartphone': 'M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z M12 18h.01'
};

// Kanonische Sprite-Symbole gemäss Spec §4.2 (Codex-Set, 30 Symbole; assets/icons.svg
// liefert zusätzlich die 11 Legacy-Icons aus ICONS oben, insgesamt 41 Symbole).
// Diese Liste dient als Sanity-Check für renderIcon(): unbekannte Namen
// erzeugen eine Warnung, weil das <use>-Target dann nicht existiert.
const CODEX_SPRITE_NAMES = new Set([
  'arrow-left', 'arrow-right', 'chevron-right', 'check', 'x',
  'sun', 'moon', 'bookmark', 'book-open', 'book', 'compass', 'route',
  'shield', 'shield-check', 'sparkles', 'eye', 'layers',
  'globe', 'lock', 'alert-triangle', 'octagon', 'circle-help', 'circle-dashed',
  'edit', 'quote', 'zap', 'play', 'rotate-ccw', 'message-square', 'list', 'target',
  // Legacy (auch im Sprite enthalten, siehe Spec §4.4)
  'brain', 'code', 'file-text', 'lightbulb', 'search', 'database',
  'workflow', 'git-branch', 'package', 'play-circle', 'messages-square'
]);

/**
 * Legacy-API: rendert ein Icon als SVG-String aus der ICONS-Map.
 * Wird von app.js (Theme-Buttons, [data-icon]-Resolver) und den
 * explainer/*.html eingesetzt. Bitte bei Neu-Code renderIcon() bevorzugen.
 */
export function icon(name, opts = {}) {
  if (!ICONS[name]) throw new Error(`Unknown icon: ${name}`);
  const svg = `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${pathsFor(name)}</svg>`;
  return opts.wrap ? `<span class="icon">${svg}</span>` : svg;
}

function pathsFor(name) {
  const def = ICONS[name];
  // Split on spaces preceding M (uppercase Move) or circle: tokens. Handles
  // multiple circles per icon (e.g. cog has outer + inner circle).
  return def.split(/ (?=M|circle:)/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => p.startsWith('circle:') ? circleEl(p) : `<path d="${p}"/>`)
    .join('');
}

function circleEl(p) {
  const [, args] = p.split(':');
  const [cx, cy, r] = args.split(',');
  return `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

/**
 * Rendert ein Icon als SVG-Element via Sprite-Reference.
 *
 * Spec §4.5 — der Vertrag im Wortlaut:
 *
 * @param {string} name - Symbol-Name OHNE Präfix, z.B. 'sun', 'check'.
 *                        Die Funktion fügt 'i-' selbst hinzu.
 * @param {Object} [attrs={}] - Optionale HTML-Attribute, die auf das <svg>-Element
 *                          gesetzt werden. Behandelte Keys:
 *                          - class: Default 'ic'. Wenn gegeben, wird angehängt
 *                            (NICHT überschrieben), damit '.ic' immer drin ist.
 *                          - aria-label: setzt zusätzlich role="img" auf SVG
 *                            und entfernt aria-hidden.
 *                          - title: rendert als <title>-Child für Tooltip.
 *                          - Alle anderen: direkt als Attribut auf SVG.
 *                          Wenn weder aria-label noch title gegeben: SVG bekommt
 *                          aria-hidden="true".
 * @returns {SVGElement}
 *
 * @example
 *   renderIcon('sun')
 *   // <svg class="ic" aria-hidden="true"><use href="#i-sun"/></svg>
 *
 *   renderIcon('check', { 'aria-label': 'Erledigt' })
 *   // <svg class="ic" role="img" aria-label="Erledigt"><use href="#i-check"/></svg>
 *
 *   renderIcon('zap', { class: 'ic lg' })
 *   // <svg class="ic lg" aria-hidden="true"><use href="#i-zap"/></svg>
 */
export function renderIcon(name, attrs = {}) {
  if (typeof document === 'undefined') {
    // Stiller No-Op ausserhalb des DOM (z.B. SSR/Node ohne jsdom).
    return null;
  }

  const svg = document.createElementNS(SVG_NS, 'svg');

  // Class: '.ic' immer drin halten.
  const userClass = attrs.class != null ? String(attrs.class).trim() : '';
  const classList = userClass
    ? (userClass.split(/\s+/).includes('ic') ? userClass : `ic ${userClass}`)
    : 'ic';
  svg.setAttribute('class', classList);

  const hasLabel = Object.prototype.hasOwnProperty.call(attrs, 'aria-label');
  const hasTitle = Object.prototype.hasOwnProperty.call(attrs, 'title');

  if (hasLabel) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', String(attrs['aria-label']));
  } else if (!hasTitle) {
    svg.setAttribute('aria-hidden', 'true');
  }

  // Übrige Attribute durchreichen (ausser den oben behandelten Keys).
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class' || key === 'aria-label' || key === 'title') continue;
    if (value === false || value == null) continue;
    svg.setAttribute(key, value === true ? '' : String(value));
  }

  if (hasTitle) {
    const titleEl = document.createElementNS(SVG_NS, 'title');
    titleEl.textContent = String(attrs.title);
    svg.appendChild(titleEl);
  }

  if (!CODEX_SPRITE_NAMES.has(name)) {
    console.warn(`[renderIcon] unknown icon: "${name}" — returning empty <svg>`);
    return svg;
  }

  const use = document.createElementNS(SVG_NS, 'use');
  const href = `#i-${name}`;
  use.setAttribute('href', href);
  // xlink:href als Fallback für ältere User-Agents / Test-Umgebungen.
  use.setAttributeNS(XLINK_NS, 'xlink:href', href);
  svg.appendChild(use);

  return svg;
}
