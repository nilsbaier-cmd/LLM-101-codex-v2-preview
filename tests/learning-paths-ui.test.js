import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { LEARNING_PATHS } from '../lib/learning-paths.js';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('learning path compass', () => {
  const index = read('index.html');
  const app = read('app.js');
  const document = new JSDOM(index).window.document;
  const slideIds = Array.from(document.querySelectorAll('.slide')).map(slide => slide.dataset.slideId);

  it('exposes a learner-facing path panel from the main deck', () => {
    expect(document.querySelector('#path-toggle')?.textContent).toContain('Lernpfad');
    expect(document.querySelector('#path-panel')?.getAttribute('aria-label')).toBe('Lernpfad-Kompass');
    expect(document.querySelector('#path-status')).toBeTruthy();
  });

  it('defines multiple paths that can be completed independently', () => {
    expect(LEARNING_PATHS.map(path => path.id)).toEqual([
      'einsteiger',
      'praxis',
      'power-user',
      'governance'
    ]);

    LEARNING_PATHS.forEach(path => {
      expect(path.stations.length).toBeGreaterThanOrEqual(7);
      path.stations.forEach(id => expect(slideIds).toContain(id));
    });
  });

  it('keeps the governance reflection and AI-Bridge stations in meaningful learning paths', () => {
    const praxis = LEARNING_PATHS.find(path => path.id === 'praxis');
    const governance = LEARNING_PATHS.find(path => path.id === 'governance');
    const einsteiger = LEARNING_PATHS.find(path => path.id === 'einsteiger');
    const powerUser = LEARNING_PATHS.find(path => path.id === 'power-user');

    expect(praxis?.stations).toContain('verwaltung-3');
    expect(praxis?.stations).toContain('verwaltung-4');
    expect(praxis?.stations).toContain('claude-3b');
    expect(einsteiger?.stations).toContain('grundlagen-1');
    expect(einsteiger?.stations).toContain('verwaltung-4');
    expect(powerUser?.stations).toContain('claude-3b');
    expect(governance?.stations).toContain('grundlagen-1');
    expect(governance?.stations).toContain('verwaltung-3');
    expect(governance?.stations).toContain('verwaltung-4');
  });

  it('stores progress locally and lets learners switch paths', () => {
    expect(app).toContain("storage.get('learningPaths')");
    expect(app).toContain("storage.set('learningPaths'");
    expect(app).toContain('activePathId');
    expect(app).toContain('data-path-start');
    expect(app).toContain('Aktiven Pfad pausieren');
    expect(app).toContain('Alle Fortschritte zurücksetzen');
    expect(app).toContain("storage.remove('path.active')");
  });

  it('turns on useful learner modes when a path starts', () => {
    expect(app).toContain("mode.set('llm', true)");
    expect(app).toContain("mode.set('exercises', true)");
  });
});
