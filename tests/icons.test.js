// tests/icons.test.js
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { icon, ICONS } from '../lib/icons.js';

describe('icons', () => {
  const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

  it('rendert paperclip als svg-string', () => {
    const html = icon('paperclip');
    expect(html).toContain('<svg');
    expect(html).toContain('viewBox');
    expect(html).toContain('class="icon-svg"');
  });

  it('verfügbare icons enthalten alle keys, die wir nutzen', () => {
    const required = ['paperclip', 'file-text', 'message-square', 'sun', 'moon', 'copy', 'check'];
    for (const k of required) expect(ICONS).toHaveProperty(k);
  });

  it('wirft fehler bei unbekanntem icon', () => {
    expect(() => icon('unbekannt')).toThrow();
  });

  it('umhüllt mit span.icon wenn wrap=true', () => {
    const html = icon('paperclip', { wrap: true });
    expect(html).toMatch(/^<span class="icon">/);
  });

  it('alle statischen sprite-referenzen im deck zeigen auf vorhandene symbole', () => {
    const index = read('index.html');
    const sprite = read('assets/icons.svg');
    const refs = [...index.matchAll(/href="#(i-[^"]+)"/g)].map(match => match[1]);
    const uniqueRefs = new Set(refs);

    expect(uniqueRefs.size).toBeGreaterThan(20);
    for (const ref of uniqueRefs) {
      expect(sprite).toContain(`id="${ref}"`);
    }
  });
});
