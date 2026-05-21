import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('Codex v2 Safari and readability polish', () => {
  const index = read('index.html');
  const app = read('app.js');
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
    expect(css).toContain('.slide-body.is-overflowing');
    expect(css).toContain('overflow-y: auto');
    expect(app).toContain("body.classList.add('is-overflowing')");
    expect(app).not.toContain('Math.min(0.98');
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="einstieg-2"] .see-more');
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="verwaltung-1"] .see-more');
    expect(css).toContain('margin-top: auto !important');
  });

  it('lets long slide callouts use the available horizontal space', () => {
    expect(css).toContain('body[data-layout="slide"] .pull-quote');
    expect(css).toContain('body[data-layout="slide"] .lead');
    expect(css).toContain('body[data-layout="slide"] .ex-prompt');
    expect(css).toContain('max-width: min(100%, 86ch)');
  });

  it('keeps revealed skill ladder levels in the same icon/text grid', () => {
    expect(css).toContain('body[data-layout="slide"] .slide[data-slide-id="einstieg-3"][data-stepped] .ladder-item[data-step].is-revealed');
    expect(css).toContain('display: grid');
    expect(css).toContain('grid-template-columns: 36px 64px minmax(0, 1fr)');
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="einstieg-3"] .ladder-divider');
    expect(css).toContain('display: none');
  });

  it('keeps the policy slide readable after all reveal steps', () => {
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="verwaltung-1"] .policy-card li');
    expect(css).toContain('font-size: 18px');
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="verwaltung-1"] .merkblatt-section li');
    expect(css).toContain('font-size: 17px');
  });

  it('raises the persistence settings tab text across all providers', () => {
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="claude-3"] .llm-tabs-nav button');
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="claude-3"] .settings-section-label');
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="claude-3"] .settings-card h4');
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="claude-3"] .settings-card p');
    expect(css).toContain('font-size: 17px');

    const slide = document.querySelector('[data-slide-id="claude-3"]');
    expect(slide?.querySelectorAll('[data-tab-panel]')).toHaveLength(3);
    expect(slide?.querySelectorAll('.settings-card').length).toBeGreaterThan(12);
  });

  it('keeps chat option body copy consistent across all provider tabs', () => {
    const slide = document.querySelector('[data-slide-id="claude-2"]');

    expect(slide?.querySelectorAll('[data-tab-panel]')).toHaveLength(3);
    expect(slide?.querySelectorAll('.letter-content p').length).toBeGreaterThan(20);
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="claude-2"] .letter-content p');
    expect(css).toMatch(/body\[data-layout="slide"\] \[data-slide-id="claude-2"\] \.letter-content p\s*{[^}]*font-size:\s*16px;/s);
  });

  it('shows an icon on the regenerate settings card', () => {
    const card = Array.from(document.querySelectorAll('[data-slide-id="claude-4"] .settings-card'))
      .find(el => el.textContent?.includes('Regenerieren'));

    expect(card?.querySelector('svg use')?.getAttribute('href')).toBe('#i-rotate-ccw');
  });

  it('keeps the live skill demo exercise readable with larger copy buttons', () => {
    const slide = document.querySelector('[data-slide-id="skills-3"]');

    expect(slide?.querySelector('.exercise .ex-outcome-grid')).toBeTruthy();
    expect(slide?.querySelectorAll('.code-block .copy-btn')).toHaveLength(2);
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="skills-3"] .ex-objective');
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="skills-3"] .ex-steps li');
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="skills-3"] .ex-reflection');
    expect(css).toContain('font-size: 17px');
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="skills-3"] .code-block .copy-btn');
    expect(css).toContain('min-height: 30px');
    expect(css).toContain('font-size: 15px');
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
    expect(css).toContain('.uc-example-panel[hidden]');
    expect(css).toContain('display: none');
  });

  it('keeps the first three use-case slides readable in slide mode', () => {
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="usecase-1"] .uc-bubble');
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="usecase-2"] .uc-bubble');
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="usecase-3"] .uc-bubble');
    expect(css).toContain('font-size: 17px');
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="usecase-1"] .uc-prompt-btn');
    expect(css).toContain('font-size: 16px');
    expect(css).toContain('body[data-layout="slide"] [data-slide-id="usecase-1"] .uc-steps li');
    expect(css).toContain('font-size: 15px');
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
