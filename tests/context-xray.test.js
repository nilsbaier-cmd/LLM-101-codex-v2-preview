import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const index = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
const app = readFileSync(join(process.cwd(), 'app.js'), 'utf8');
const css = readFileSync(join(process.cwd(), 'presentation.css'), 'utf8');

describe('context window x-ray demo', () => {
  document.body.innerHTML = index;

  it('adds the x-ray slide directly after prompt wird produkt', () => {
    const promptSlide = document.querySelector('[data-slide-id="usecase-4"]');
    const xraySlide = document.querySelector('[data-slide-id="usecase-5"]');

    expect(xraySlide).toBeTruthy();
    expect(promptSlide?.nextElementSibling).toBe(xraySlide);
    expect(xraySlide?.textContent).toContain('Context Window X-Ray');
  });

  it('shows the three context visibility states', () => {
    const slide = document.querySelector('[data-slide-id="usecase-5"]');
    const states = [...slide.querySelectorAll('.xray-state')].map(el => el.textContent.trim());

    expect(states).toEqual(expect.arrayContaining(['aktiv', 'matt', 'verdrängt', 'Rauschen']));
    expect(slide?.querySelectorAll('[data-context-xray-mode]').length).toBe(2);
    expect(slide?.querySelector('[data-xray-result]')).toBeTruthy();
    expect(slide?.textContent).toContain('Signal 86%');
    expect(slide?.textContent).toContain('Signal 28%');
    expect(slide?.querySelectorAll('[data-xray-window]').length).toBe(2);
  });

  it('initializes the context x-ray interaction in app.js', () => {
    expect(app).toContain('initContextXray');
    expect(app).toContain('data-context-xray-mode');
    expect(app).toContain('data-result-noisy');
    expect(app).toContain('data-xray-window');
    expect(css).toContain('.xray-stack[hidden]');
    expect(css).toContain('.xray-window-noisy');
  });
});
