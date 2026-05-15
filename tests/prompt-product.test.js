import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const index = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
const app = readFileSync(join(process.cwd(), 'app.js'), 'utf8');

describe('prompt wird produkt demo', () => {
  document.body.innerHTML = index;

  it('adds a dedicated interactive use-case slide', () => {
    const slide = document.querySelector('[data-slide-id="usecase-4"]');

    expect(slide).toBeTruthy();
    expect(slide?.querySelector('[data-prompt-product]')).toBeTruthy();
    expect(slide?.textContent).toContain('Prompt wird Produkt');
    expect(slide?.querySelectorAll('[data-prompt-product-mode]').length).toBe(2);
  });

  it('shows prompt anatomy and an output preview', () => {
    const demo = document.querySelector('[data-prompt-product]');
    const labels = [...demo.querySelectorAll('.pp-chip')].map((el) => el.textContent.trim());

    expect(labels).toEqual(expect.arrayContaining(['Ziel', 'Kontext', 'Rolle', 'Constraints', 'Stil', 'Output']));
    expect(demo.querySelector('.pp-output')).toBeTruthy();
    expect(demo.querySelector('[data-copy-source]')).toBeTruthy();
  });

  it('initializes the prompt-product interaction in app.js', () => {
    expect(app).toContain('initPromptProduct');
    expect(app).toContain('data-prompt-product-mode');
    expect(app).toContain('data-output-strong');
  });
});
