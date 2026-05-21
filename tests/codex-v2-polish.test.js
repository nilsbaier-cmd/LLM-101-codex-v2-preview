import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('Codex v2 Safari and readability polish', () => {
  const index = read('index.html');
  const appCss = read('app.css');
  const css = read('presentation.css');
  const document = new JSDOM(index).window.document;

  it('keeps the slide footer status on one non-colliding row', () => {
    expect(css).toContain('.slide-progress');
    expect(css).toContain('grid-auto-flow: column');
    expect(css).toContain('.slide-progress .slide-status');
    expect(css).toContain('translateY(-3px)');
    expect(appCss).toContain('bottom: 3px');
    expect(appCss).toContain('z-index: 20');
  });

  it('prevents stepped slide content from shrinking as animations reveal', () => {
    expect(css).toContain('body[data-layout="slide"] .slide.codex {');
    expect(css).toContain('max-height: 100%');
    expect(css).toContain('.slide-body-fit');
    expect(css).toContain('--slide-fit-scale');
    expect(css).toContain('.slide-body.is-fit-scaled .slide-body-fit');
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="einstieg-2"] .see-more');
    expect(css).toContain('margin-top: auto !important');
  });

  it('lets long slide callouts use the available horizontal space', () => {
    expect(css).toContain('body[data-layout="slide"] .pull-quote');
    expect(css).toContain('body[data-layout="slide"] .lead');
    expect(css).toContain('body[data-layout="slide"] .ex-prompt');
    expect(css).toContain('max-width: min(100%, 86ch)');
  });

  it('shows an icon on the regenerate settings card', () => {
    const card = Array.from(document.querySelectorAll('[data-slide-id="claude-4"] .settings-card'))
      .find(el => el.textContent?.includes('Regenerieren'));

    expect(card?.querySelector('svg use')?.getAttribute('href')).toBe('#i-rotate-ccw');
  });

  it('adds interactive text-form and data-form examples to the use-case slides', () => {
    const ghostwriter = document.querySelector('[data-slide-id="usecase-2"]');
    const analyst = document.querySelector('[data-slide-id="usecase-3"]');

    expect(ghostwriter?.querySelector('[data-uc-tabs]')).toBeTruthy();
    expect(ghostwriter?.querySelectorAll('[data-uc-tab]')).toHaveLength(4);
    expect(ghostwriter?.textContent).toContain('Entscheidungs-E-Mail');
    expect(ghostwriter?.textContent).toContain('Folienstruktur');

    expect(analyst?.querySelector('[data-uc-tabs]')).toBeTruthy();
    expect(analyst?.querySelectorAll('[data-uc-tab]')).toHaveLength(4);
    expect(analyst?.textContent).toContain('Datenqualität prüfen');
    expect(analyst?.textContent).toContain('Management Summary');
  });

  it('clarifies the context simulator without binding the method to Claude', () => {
    const explainer = read('explainer/a-context-window.html');

    expect(explainer).toContain('jedes moderne Sprachmodell');
    expect(explainer).toContain('das Modell');
    expect(explainer).not.toContain('wie Claude den Kontext sieht');
    expect(explainer).not.toContain('Claude nutzt die');
  });

  it('adds reading-direction affordances to case and pattern cards', () => {
    expect(css).toContain('.case-check');
    expect(css).toContain('.ba-flow-arrow');
    expect(index).toContain('Von oben nach unten lesen');
    expect(index).toContain('Prüffrage');
  });

});
