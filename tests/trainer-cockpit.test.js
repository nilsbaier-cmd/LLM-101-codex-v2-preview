import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { TRAINER_NOTES, TRAINER_VARIANTS } from '../lib/learning-paths.js';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('trainer cockpit', () => {
  const index = read('index.html');
  const app = read('app.js');
  const css = read('app.css');
  const document = new JSDOM(index).window.document;
  const slideIds = Array.from(document.querySelectorAll('.slide')).map(slide => slide.dataset.slideId);

  it('keeps trainer UI behind the trainer query flag', () => {
    expect(document.querySelector('#trainer-toggle')?.textContent).toContain('Cockpit');
    expect(document.querySelector('#trainer-panel')?.getAttribute('aria-label')).toBe('Trainer-Cockpit');
    expect(app).toContain("params.get('trainer') === '1'");
    expect(app).toContain("document.body.dataset.trainer = 'on'");
    expect(css).toContain('body[data-trainer="on"] .trainer-only');
  });

  it('covers the key live-workshop slides with notes and fallbacks', () => {
    [
      'einstieg-1',
      'grundlagen-1',
      'verwaltung-1',
      'verwaltung-4',
      'claude-1',
      'claude-3b',
      'context-1',
      'usecase-4',
      'usecase-5',
      'usecase-6',
      'usecase-7',
      'usecase-8',
      'usecase-lab',
      'skills-1',
      'skills-3',
      'next-3',
      'next-5',
      'next-4'
    ].forEach(id => {
      expect(slideIds).toContain(id);
      expect(TRAINER_NOTES[id]?.focus?.length).toBeGreaterThan(20);
      expect(TRAINER_NOTES[id]?.fallback?.length).toBeGreaterThan(20);
    });
  });

  it('provides workshop variants for compact, standard and deep-dive sessions', () => {
    expect(TRAINER_VARIANTS.map(item => item.id)).toEqual(['60', '120', '180']);
    TRAINER_VARIANTS.forEach(item => {
      expect(item.checkpoints.length).toBeGreaterThanOrEqual(5);
      expect(item.demoChecklist.length).toBeGreaterThanOrEqual(3);
      expect(item.probeCues.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('supports copyable demo prompts where useful', () => {
    expect(app).toContain('data-trainer-copy');
    expect(Object.values(TRAINER_NOTES).some(note => note.prompt)).toBe(true);
  });

  it('surfaces a demo checklist in the trainer cockpit', () => {
    expect(app).toContain('trainer-demo-checklist');
    expect(app).toContain('trainer-probe-cues');
    expect(css).toContain('.trainer-demo-checklist ul');
  });
});
