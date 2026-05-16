import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { analyzeReflections, renderNotesMarkdown } from '../lib/notes-export.js';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('workshop readiness package', () => {
  const index = read('index.html');
  const document = new JSDOM(index).window.document;
  const app = read('app.js');
  const appCss = read('app.css');
  const presentationCss = read('presentation.css');

  it('adds participant and trainer support pages', () => {
    expect(read('handout.html')).toContain('Prompt-Bausteine');
    expect(read('trainer-export.html')).toContain('Moderationsblatt');
    expect(read('quellen-refresh.html')).toContain('Quellen- und Faktencheck');
    expect(read('trainer-export.html')).toContain('TRAINER_VARIANTS');
  });

  it('adds pattern gallery and Codex bridge slides', () => {
    const gallery = document.querySelector('[data-slide-id="usecase-8"]');
    const bridge = document.querySelector('[data-slide-id="next-5"]');

    expect(gallery?.querySelectorAll('.ba-card').length).toBe(3);
    expect(gallery?.textContent).toContain('Vorher');
    expect(gallery?.textContent).toContain('Nachher');
    expect(bridge?.querySelectorAll('.bridge-card').length).toBe(3);
    expect(bridge?.textContent).toContain('Codex / Skill');
  });

  it('adds chapter progress and Safari/iPad hardening CSS', () => {
    expect(document.querySelector('#chapter-progress')).toBeTruthy();
    expect(app).toContain('updateChapterProgress');
    expect(appCss).toContain('-webkit-fill-available');
    expect(appCss).toContain('-webkit-text-size-adjust');
    expect(presentationCss).toContain('100svh');
    expect(presentationCss).toContain('align-items: center');
  });

  it('groups reflection notes into useful learning patterns', () => {
    const notes = [
      { chapter: 'usecases', ex: 'r2', antwort: 'Ich teste nächste Woche ein Statusupdate als Experiment.', ts: 1 },
      { chapter: 'usecases', ex: 'r3', antwort: 'Risiko: Daten und Freigabe müssen geprüft werden.', ts: 2 }
    ];
    const analysis = analyzeReflections(notes);
    expect(analysis.find(bucket => bucket.id === 'experiments')?.items.length).toBeGreaterThan(0);
    expect(analysis.find(bucket => bucket.id === 'risks')?.items.length).toBeGreaterThan(0);
    expect(renderNotesMarkdown(notes)).toContain('## Muster');
  });
});
