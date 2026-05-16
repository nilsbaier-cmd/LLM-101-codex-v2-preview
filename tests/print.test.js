import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('print and pdf delivery', () => {
  const index = read('index.html');
  const printCss = read('print.css');
  const readme = read('README.md');

  it('loads print styles only for browser print output', () => {
    expect(index).toContain('href="print.css');
    expect(index).toContain('media="print"');
  });

  it('prints as a 16:9 slide handout without navigation chrome', () => {
    expect(printCss).toContain('@page');
    expect(printCss).toContain('size: 16in 9in');
    expect(printCss).toContain('@media print');
    expect(printCss).toContain('.app-header');
    expect(printCss).toContain('.side-panel');
    expect(printCss).toContain('display: none !important');
    expect(printCss).toContain('break-after: page');
    expect(printCss).toContain('page-break-after: always');
  });

  it('reveals stepped content for static PDF export', () => {
    expect(printCss).toContain('.slide[data-stepped] [data-step]');
    expect(printCss).toContain('opacity: 1 !important');
    expect(printCss).toContain('visibility: visible !important');
  });

  it('documents the browser pdf path', () => {
    expect(readme).toContain('PDF/Deck-Handout');
    expect(readme).toContain('print.css');
    expect(readme).toContain('16:9-Seiten');
  });
});
