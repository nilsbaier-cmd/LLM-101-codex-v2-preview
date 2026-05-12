// lib/icons.js — Inline-SVG Helper für Lucide-Stil Icons

export const ICONS = {
  'paperclip': 'M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48',
  'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h8',
  'message-square': 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  'sun': 'M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42 circle:12,12,5',
  'moon': 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  'copy': 'M9 9h13v13H9z M5 15H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2',
  'check': 'M20 6 9 17l-5-5',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  'rotate-ccw': 'M3 12a9 9 0 1 0 9-9 M3 3v6h6',
  'layers': 'M12 2 2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5'
};

export function icon(name, opts = {}) {
  if (!ICONS[name]) throw new Error(`Unknown icon: ${name}`);
  const svg = `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${pathsFor(name)}</svg>`;
  return opts.wrap ? `<span class="icon">${svg}</span>` : svg;
}

function pathsFor(name) {
  const def = ICONS[name];
  return def.split(' M').map((p, i) => i === 0 ? p : 'M' + p)
    .flatMap(p => {
      const idx = p.indexOf(' circle:');
      if (idx === -1) return [p];
      return [p.slice(0, idx), p.slice(idx + 1)];
    })
    .map(p => p.startsWith('circle:') ? circleEl(p) : `<path d="${p.trim()}"/>`)
    .join('');
}

function circleEl(p) {
  const [, args] = p.split(':');
  const [cx, cy, r] = args.split(',');
  return `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
}
