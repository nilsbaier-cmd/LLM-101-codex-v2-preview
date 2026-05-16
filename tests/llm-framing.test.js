import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');

describe('llm-agnostic framing', () => {
  document.body.innerHTML = html;

  it('frames the deck as LLM 101 while keeping Claude as an example', () => {
    expect(document.title).toBe('LLM 101');
    expect(document.querySelector('.app-title')?.textContent).toBe('LLM 101');
    expect(document.querySelector('.cover-title')?.textContent).toBe('LLM 101');
    expect(document.querySelector('.cover-subtitle')?.textContent).toContain('Claude');
    expect(document.querySelector('.cover-subtitle')?.textContent).toContain('ChatGPT');
    expect(document.querySelector('.cover-subtitle')?.textContent).toContain('Gemini');
  });

  it('uses provider-neutral labels for the core tool chapter', () => {
    const labels = [...document.querySelectorAll('[data-chapter="claude"] .chapter-label')]
      .map(label => label.textContent.trim());

    expect(labels.length).toBeGreaterThanOrEqual(5);
    labels.forEach(label => expect(label).toContain('LLM-Tools 101'));
    expect(document.querySelector('[data-slide-id="claude-1"] h2')?.textContent).toBe('Modellfamilien verstehen');
    expect(document.querySelector('[data-slide-id="next-3"] h2')?.textContent).toBe('LLM überall');
  });

  it('keeps README slide count and framing current', () => {
    expect(readme).toContain('LLM 101');
    expect(readme).toContain('28 Folien');
    expect(readme).toContain('Claude, ChatGPT und Gemini');
  });
});
