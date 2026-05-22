import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('volatile fact guardrails', () => {
  const index = read('index.html');
  const document = new JSDOM(index).window.document;

  it('marks slides with fast-changing product or governance facts', () => {
    // Codex frame: .slide-stand inherits data-volatile from the slide; scope to actual slides.
    const volatileSlides = Array.from(document.querySelectorAll('section.slide[data-volatile="true"]'));
    const ids = volatileSlides.map(slide => slide.dataset.slideId);

    expect(ids).toEqual(expect.arrayContaining([
      'verwaltung-1',
      'verwaltung-2',
      'claude-1',
      'claude-5',
      'next-3'
    ]));

    volatileSlides.filter(slide => slide.dataset.slideId !== 'claude-5').forEach(slide => {
      expect(slide.dataset.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(slide.querySelector('.source-strip')?.textContent).toContain('Stand');
    });
  });

  it('uses per-provider pricing links on the pricing slide without a redundant source box', () => {
    const start = index.indexOf('data-slide-id="claude-5"');
    const end = index.indexOf('data-slide-id="context-1"', start);
    const slideHtml = index.slice(start, end);

    expect(slideHtml).not.toContain('source-strip volatile-note');
    expect(slideHtml).toContain('https://claude.com/pricing');
    expect(slideHtml).toContain('https://openai.com/chatgpt/pricing/');
    expect(slideHtml).toContain('https://gemini.google/subscriptions/');
    expect((slideHtml.match(/class="see-more"/g) || [])).toHaveLength(3);
  });

  it('keeps provider examples source-linked instead of frozen as hard truth', () => {
    expect(index).toContain('Modellnamen, Limits und Plan-Zugänge ändern sich häufig');
    expect(index).toContain('https://claude.com/pricing');
    expect(index).toContain('https://openai.com/chatgpt/pricing/');
    expect(index).toContain('https://gemini.google/subscriptions/');
    expect(index).not.toContain('Opus 4.7');
    expect(index).not.toContain('Sonnet 4.6');
    expect(index).not.toContain('Haiku 4.5');
  });
});
