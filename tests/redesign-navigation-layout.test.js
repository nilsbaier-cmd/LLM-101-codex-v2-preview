import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');
const app = read('app.js');
const css = read('presentation.css');
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
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\[data-stepped\] \[data-step\]\s*{[^}]*pointer-events:\s*none;/s);
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

  it('exposes a reproducible browser QA command for the redesign branch', () => {
    expect(pkg.scripts['qa:redesign']).toBe('node scripts/redesign-qa.mjs');
  });
});
