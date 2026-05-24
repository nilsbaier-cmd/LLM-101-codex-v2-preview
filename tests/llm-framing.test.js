import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');

describe('llm-agnostic framing', () => {
  document.body.innerHTML = html;

  it('frames the deck as LLM 101 while keeping Claude as an example', () => {
    expect(document.title).toBe('LLM 101');
    expect(document.querySelector('.app-brand-id')?.textContent).toBe('LLM 101');
    // Codex cover: h1.display + p.cover-lead replace .cover-title/.cover-subtitle
    const cover = document.querySelector('[data-slide-id="einstieg-1"]');
    // Soft-hyphen (­) splits "Sprachmodelle" in the source — strip it before asserting.
    const display = (cover?.querySelector('h1.display')?.textContent ?? '').replace(/­/g, '');
    expect(display).toContain('Sprachmodelle');
    expect(display).toContain('erklärt');
    const coverLead = cover?.querySelector('.cover-lead')?.textContent ?? '';
    expect(coverLead).toContain('Claude');
    expect(coverLead).toContain('ChatGPT');
    expect(coverLead).toContain('Gemini');
  });

  it('uses provider-neutral labels for the core tool chapter', () => {
    // Codex frame: .slide-crumb-chap (mono uppercase eyebrow) replaces .chapter-label
    const labels = [...document.querySelectorAll('[data-chapter="claude"].codex .slide-crumb-chap')]
      .map(label => label.textContent.trim());

    expect(labels.length).toBeGreaterThanOrEqual(5);
    labels.forEach(label => expect(label).toContain('LLM-Tools 101'));
    expect(document.querySelector('[data-slide-id="claude-1"] .slide-crumb-topic')?.textContent).toBe('Modellfamilien verstehen');
    // next-3 is migrated by package D3 — keep legacy h2 assertion until then.
    expect(document.querySelector('[data-slide-id="next-3"] h2')?.textContent).toBe('LLM überall');
  });

  it('keeps README slide count and framing current', () => {
    expect(readme).toContain('LLM 101');
    expect(readme).toContain('35 Folien');
    expect(readme).toContain('Claude, ChatGPT und Gemini');
    expect(readme).toContain('verwaltungsnahes Workflow-Lernsystem');
  });
});
