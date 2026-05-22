import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
const css = readFileSync(join(process.cwd(), 'presentation.css'), 'utf8');

describe('prompt lab learning station', () => {
  document.body.innerHTML = html;

  it('upgrades the use-case reflection into a prompt lab', () => {
    const slide = document.querySelector('[data-slide-id="usecase-lab"]');
    const exercise = document.querySelector('[data-chapter="usecases"][data-exercise="r2"]');
    const lab = exercise?.querySelector('[data-prompt-lab]');

    expect(slide?.contains(exercise)).toBe(true);
    expect(lab).toBeTruthy();
    expect(lab?.textContent).toContain('Prompt-Labor');
    expect(lab?.querySelectorAll('.prompt-lab-step').length).toBe(3);
    expect(lab?.querySelector('[data-copy-source]')).toBeTruthy();
    expect(lab?.querySelector('.prompt-lab-template .copy-btn')).toBeTruthy();
    expect(lab?.textContent).toContain('Musterbeobachtung');
  });

  it('has responsive styles for the prompt lab', () => {
    expect(css).toContain('.prompt-lab-grid');
    expect(css).toContain('.prompt-lab-grid');
    expect(css).toContain('[data-slide-id="usecase-lab"] .prompt-lab-template .copy-btn');
    expect(css).toContain('position: sticky');
    expect(css).toContain('float: right');
    expect(css).toContain('grid-template-columns: 1fr');
  });
});
