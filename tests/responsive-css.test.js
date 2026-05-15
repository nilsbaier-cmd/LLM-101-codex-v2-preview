import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('responsive css', () => {
  const appCss = read('app.css');
  const presentationCss = read('presentation.css');
  const explainerCss = read('explainer/explainer.css');

  it('lets the app shell and deck adapt below tablet width', () => {
    expect(appCss).toMatch(/@media\s*\(max-width:\s*900px\)/);
    expect(appCss).toContain('flex-wrap: wrap');
    expect(presentationCss).toMatch(/@media\s*\(max-width:\s*900px\)/);
    expect(presentationCss).toContain('body[data-layout="scroll"] .app-main');
    expect(presentationCss).toContain('body[data-layout="scroll"] .app-toc');
  });

  it('collapses dense slide grids and learning stations on mobile', () => {
    expect(presentationCss).toMatch(/@media\s*\(max-width:\s*700px\)/);
    expect(presentationCss).toContain('.policy-grid');
    expect(presentationCss).toContain('.myth-table');
    expect(presentationCss).toContain('.ex-header');
    expect(presentationCss).toContain('grid-template-columns: 1fr');
  });

  it('adds mobile safeguards for standalone explainers', () => {
    expect(explainerCss).toMatch(/@media\s*\(max-width:\s*700px\)/);
    expect(explainerCss).toContain('.explainer-page');
    expect(explainerCss).toContain('.path-viz');
    expect(explainerCss).toContain('.timeline-track');
  });
});
