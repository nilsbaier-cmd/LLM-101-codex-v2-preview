import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('output quality check and case library', () => {
  const document = new JSDOM(read('index.html')).window.document;
  const css = read('presentation.css');
  const notesPage = read('meine-notizen.html');

  it('adds a self-study station for checking AI outputs', () => {
    const slide = document.querySelector('[data-slide-id="usecase-6"]');
    const exercise = slide?.querySelector('.exercise[data-exercise="r3"]');

    expect(slide?.querySelector('h2')?.textContent).toBe('Output prüfen');
    expect(exercise?.dataset.learningStation).toBe('');
    expect(exercise?.querySelectorAll('.quality-answer').length).toBe(2);
    expect(exercise?.querySelector('.quality-answer.is-smooth')).toBeTruthy();
    expect(exercise?.querySelectorAll('.quality-verdict')).toHaveLength(0);
    expect(exercise?.textContent).not.toContain('Risiko: klingt');
    expect(exercise?.textContent).not.toContain('Brauchbar: macht');
    expect(exercise?.querySelector('.ex-outcome-grid')).toBeNull();
    expect(exercise?.textContent).not.toContain('Erwartbar:');
    expect(exercise?.textContent).not.toContain('Reflexion:');
    expect(exercise?.querySelectorAll('.quality-checklist span').length).toBe(5);
    expect(exercise?.textContent).toContain('Fakten');
    expect(exercise?.textContent).toContain('Verantwortung');
  });

  it('adds a compact mini case library with useful risk labels', () => {
    const slide = document.querySelector('[data-slide-id="usecase-7"]');
    const cards = Array.from(slide?.querySelectorAll('.case-card') || []);

    expect(slide?.querySelector('h2')?.textContent).toBe('Mini-Fallbibliothek');
    expect(cards).toHaveLength(6);
    expect(slide?.textContent).toContain('Sitzung vorbereiten');
    expect(slide?.textContent).toContain('Personalfall beurteilen');
    expect(slide?.querySelectorAll('.case-status.is-green').length).toBeGreaterThanOrEqual(2);
    expect(slide?.querySelectorAll('.case-status.is-red').length).toBe(1);
  });

  it('ships responsive styles and note labels for the new use-case station', () => {
    expect(css).toContain('.quality-answer-grid');
    expect(css).toContain('.quality-answer.is-smooth');
    expect(css).not.toContain('.quality-answer.is-risky');
    expect(css).not.toContain('.quality-verdict');
    expect(css).toContain('.case-library-grid');
    expect(css).toContain('[data-slide-id="usecase-6"] .ex-steps');
    expect(notesPage).toContain("usecases: 'Use Cases'");
  });
});
