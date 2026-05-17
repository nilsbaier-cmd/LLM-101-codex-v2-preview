import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');
const app = read('app.js');
const css = read('presentation.css');
const appCss = read('app.css');
const tokens = read('tokens.css');
const pkg = JSON.parse(read('package.json'));

describe('codex v2 slide navigation and layout safeguards', () => {
  it('keeps codex slides in the legacy absolute slide frame', () => {
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\.codex\s*{[^}]*position:\s*absolute;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\.codex\s*{[^}]*height:\s*100%;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\.codex\s*{[^}]*min-height:\s*0;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\.codex\s*{[^}]*pointer-events:\s*none;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\.codex\.is-active\s*{[^}]*pointer-events:\s*auto;/s);
  });

  it('prevents hidden step content from intercepting navigation clicks', () => {
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\[data-stepped\] \[data-step\]\s*{[^}]*display:\s*none;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\[data-stepped\] \[data-step\]\s*{[^}]*pointer-events:\s*none;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\[data-stepped\] \[data-step\]\.is-revealed\s*{[^}]*display:\s*revert;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\[data-stepped\] \[data-step\]\.is-revealed\s*{[^}]*pointer-events:\s*auto;/s);
  });

  it('routes the visible slide footer controls through the same navigation logic', () => {
    expect(app).toContain(".slide-nav.prev, .slide-nav.next");
    expect(app).toMatch(/classList\.contains\('next'\)[\s\S]*goNext\(\)/);
    expect(app).toMatch(/else goPrev\(\)/);
  });

  it('keeps slide-mode controls singular and applies body fitting', () => {
    expect(css).toMatch(/body\[data-layout="slide"\] \.app-controls\s*{[^}]*display:\s*none;/s);
    expect(css).toContain('.slide-body-fit');
    expect(app).toContain('initSlideBodyFitWrappers');
    expect(app).toContain('queueSlideBodyFit');
  });

  it('keeps lime actions readable in light and dark mode', () => {
    expect(tokens).toContain('--text-on-accent: #111400');
    expect(appCss).toMatch(/\.btn\.btn-primary\s*{[^}]*color:\s*var\(--text-on-accent\)/s);
    expect(appCss).toMatch(/\.code-block \.copy-btn\s*{[^}]*color:\s*var\(--text-on-accent\)/s);
    expect(css).toMatch(/\.pp-mode\.active\s*{[^}]*color:\s*var\(--text-on-accent\)/s);
    expect(css).toMatch(/\.xray-mode\.active\s*{[^}]*color:\s*var\(--text-on-accent\)/s);
  });

  it('keeps phone slide mode readable with a local body scroller instead of page scroll', () => {
    expect(css).toMatch(/@media \(max-width: 480px\)\s*{[\s\S]*body\[data-layout="slide"\] \.slide\.codex \.slide-body\s*{[^}]*overflow-y:\s*auto;/s);
    expect(css).toMatch(/@media \(max-width: 480px\)\s*{[\s\S]*body\[data-layout="slide"\] \.slide-body\.is-fit-scaled \.slide-body-fit\s*{[^}]*transform:\s*none;/s);
  });

  it('isolates preview browser state from the main course URL', () => {
    const notes = read('meine-notizen.html');
    const explainer = read('explainer/a-context-window.html');
    const sw = read('sw.js');
    expect(app).toContain("const NS = 'llm-101-codex-v2-preview'");
    expect(notes).toContain("new Storage('llm-101-codex-v2-preview')");
    expect(explainer).toContain("new Storage('llm-101-codex-v2-preview')");
    expect(sw).toContain("const CACHE_PREFIX = 'llm-101-codex-v2-preview-offline-'");
  });

  it('exposes a reproducible browser QA command for the redesign branch', () => {
    expect(pkg.scripts['qa:redesign']).toBe('node scripts/redesign-qa.mjs');
  });
});
