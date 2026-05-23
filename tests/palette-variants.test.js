// tests/palette-variants.test.js
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const tokens = readFileSync(join(root, 'tokens.css'), 'utf8');
const index = readFileSync(join(root, 'index.html'), 'utf8');
const appCss = readFileSync(join(root, 'app.css'), 'utf8');

function blockFor(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = tokens.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  return match?.[1] ?? '';
}

describe('palette variants', () => {
  it('stellt palette-buttons für Lime, Clay und Cobalt ohne inline-farben bereit', () => {
    expect(index).toContain('aria-label="Farbvariante"');
    expect(index).toContain('data-mode="palette" data-value="codex"');
    expect(index).toContain('aria-label="Palette Lime"');
    expect(index).toContain('data-mode="palette" data-value="clay"');
    expect(index).toContain('data-mode="palette" data-value="cobalt"');
    expect(index).toContain('app.js?v=2026-05-23-palette-variants');
    expect(index).not.toMatch(/style=["'][^"']*background/i);
    expect(appCss).toContain('.palette-dot-lime');
    expect(appCss).toContain('.palette-dot-clay');
    expect(appCss).toContain('.palette-dot-cobalt');
  });

  it('deklariert zentrale tokens für alle neuen paletten in light und dark', () => {
    for (const palette of ['cobalt', 'clay']) {
      const light = blockFor(`:root[data-palette="${palette}"]`);
      const dark = blockFor(`:root[data-palette="${palette}"][data-theme="dark"]`);
      const autoDark = blockFor(`:root[data-palette="${palette}"]:not([data-theme="light"])`);

      for (const block of [light, dark, autoDark]) {
        expect(block).toContain('--accent:');
        expect(block).toContain('--cobalt:');
        expect(block).toContain('--bg-base:');
        expect(block).toContain('--text-on-accent:');
      }
    }
  });

  it('überschreibt funktionale statusfarben nicht in palette-blöcken', () => {
    for (const palette of ['cobalt', 'clay']) {
      const blocks = [
        blockFor(`:root[data-palette="${palette}"]`),
        blockFor(`:root[data-palette="${palette}"][data-theme="dark"]`),
        blockFor(`:root[data-palette="${palette}"]:not([data-theme="light"])`)
      ].join('\n');

      expect(blocks).not.toContain('--crimson:');
      expect(blocks).not.toContain('--signal:');
      expect(blocks).not.toContain('--warn:');
      expect(blocks).not.toContain('--success:');
      expect(blocks).not.toContain('--success-soft:');
    }
  });
});
