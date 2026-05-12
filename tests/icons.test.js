// tests/icons.test.js
import { describe, it, expect } from 'vitest';
import { icon, ICONS } from '../lib/icons.js';

describe('icons', () => {
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
});
