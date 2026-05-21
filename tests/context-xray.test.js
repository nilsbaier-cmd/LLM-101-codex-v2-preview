import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const index = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
const app = readFileSync(join(process.cwd(), 'app.js'), 'utf8');
const css = readFileSync(join(process.cwd(), 'presentation.css'), 'utf8');

describe('context window x-ray demo', () => {
  document.body.innerHTML = index;

  it('adds the context rot slide directly after prompt wird produkt', () => {
    const promptSlide = document.querySelector('[data-slide-id="usecase-4"]');
    const rotSlide = document.querySelector('[data-slide-id="usecase-5"]');

    expect(rotSlide).toBeTruthy();
    expect(promptSlide?.nextElementSibling).toBe(rotSlide);
    expect(rotSlide?.textContent).toContain('Context Rot');
  });

  it('explains context rot with reliability curves and context noise', () => {
    const slide = document.querySelector('[data-slide-id="usecase-5"]');

    expect(slide?.querySelector('.context-rot')).toBeTruthy();
    expect(slide?.querySelector('.rot-curve-clean')).toBeTruthy();
    expect(slide?.querySelector('.rot-curve-noisy')).toBeTruthy();
    expect(slide?.querySelectorAll('.rot-marker')).toHaveLength(3);
    expect(slide?.textContent).toContain('Gefahrenzone');
    expect(slide?.textContent).toContain('Context Rot');
    expect(slide?.textContent).toContain('Rauschen kippt früher');
    expect(slide?.textContent).toContain('Signal verdünnt');
    expect(slide?.textContent).toContain('Gegenmittel');
  });

  it('styles the context rot visualization as a stable slide graphic', () => {
    expect(css).toContain('.context-rot');
    expect(css).toContain('.rot-chart');
    expect(css).toContain('.rot-explain');
    expect(css).toContain('.rot-curve-noisy');
    expect(css).toContain('.rot-link-2');
    expect(css).toContain('.rot-note-2');
  });
});
