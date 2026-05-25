import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { VISUAL_QA_TARGETS } from '../lib/visual-qa-targets.js';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('transfer close and visual QA targets', () => {
  const index = read('index.html');
  const appCss = read('app.css');
  const presentationCss = read('presentation.css');
  const document = new JSDOM(index).window.document;
  const slideIds = Array.from(document.querySelectorAll('.slide')).map(slide => slide.dataset.slideId);

  it('turns the old context-window TODO into a real explainer link', () => {
    const contextSlide = document.querySelector('[data-slide-id="context-2"]');
    expect(contextSlide?.textContent).not.toContain('Phase 7 in Arbeit');

    const link = contextSlide?.querySelector('a[href^="explainer/a-context-window.html"]');
    expect(link?.getAttribute('href')).toBe('explainer/a-context-window.html?back=context-2');
  });

  it('splits the context-window mini quiz onto its own readable slide', () => {
    const strategySlide = document.querySelector('[data-slide-id="context-2"]');
    const quizSlide = document.querySelector('[data-slide-id="context-quiz"]');

    expect(strategySlide?.querySelector('.exercise')).toBeNull();
    expect(strategySlide?.querySelector('.slide-nav.next')?.getAttribute('href')).toBe('#context-quiz');
    expect(quizSlide?.querySelector('.exercise.quiz')).toBeTruthy();
    expect(quizSlide?.querySelector('.slide-nav.prev')?.getAttribute('href')).toBe('#context-2');
    expect(quizSlide?.querySelector('.slide-nav.next')?.getAttribute('href')).toBe('#usecase-1');
  });

  it('adds a compact final transfer slide and resource links', () => {
    const transferSlide = document.querySelector('[data-slide-id="next-4"]');
    expect(transferSlide).toBeTruthy();
    expect(transferSlide.querySelector('h2')?.textContent).toBe('Monday Morning Kit');
    expect(transferSlide.textContent).toContain('7-Tage-Experiment');
    expect(transferSlide.textContent).toContain('Prompt-Check');
    expect(transferSlide.textContent).toContain('Annahmen');
    expect(transferSlide.querySelector('a[href="meine-notizen.html?back=next-4"]')?.textContent).toContain('Meine Notizen');
    expect(transferSlide.querySelector('a[href="handout.html"]')?.textContent).toContain('Handout');
    expect(document.querySelector('[data-slide-id="next-5"]')?.nextElementSibling?.dataset.slideId).toBe('next-4');
  });

  it('ships responsive styling for the transfer slide and trainer checklist', () => {
    expect(presentationCss).toContain('.transfer-grid');
    expect(presentationCss).toContain('.transfer-commitment');
    expect(presentationCss).toContain('@media (max-width: 700px)');
    expect(appCss).toContain('.trainer-demo-checklist ul');
  });

  it('keeps green transfer and volatile note text high contrast', () => {
    expect(presentationCss).toMatch(/\.bridge-rule p\s*{[^}]*color:\s*#fff;/s);
    expect(presentationCss).toMatch(/\.transfer-commitment p\s*{[^}]*color:\s*#0a0a0b;/s);
    expect(presentationCss).toMatch(/\.transfer-commitment p strong\s*{[^}]*color:\s*#0a0a0b;/s);
    expect(presentationCss).toMatch(/\.source-strip\.volatile-note,\s*\.source-strip\.volatile-note strong\s*{[^}]*color:\s*#000000;/s);
    expect(presentationCss).toMatch(/\[data-theme="dark"\] \.source-strip\.volatile-note,\s*\[data-theme="dark"\] \.source-strip\.volatile-note strong,[^}]*color:\s*#fff;/s);
  });

  it('defines stable visual QA targets for high-risk states', () => {
    expect(VISUAL_QA_TARGETS.length).toBeGreaterThanOrEqual(12);
    expect(VISUAL_QA_TARGETS.map(target => target.id)).toEqual(expect.arrayContaining([
      'mental-model-desktop',
      'promptathon-desktop',
      'context-architecture-desktop'
    ]));
    expect(new Set(VISUAL_QA_TARGETS.map(target => target.id)).size).toBe(VISUAL_QA_TARGETS.length);

    VISUAL_QA_TARGETS.forEach(target => {
      expect(target.id).toMatch(/^[a-z0-9-]+$/);
      expect(target.viewport.width).toBeGreaterThanOrEqual(320);
      expect(target.viewport.height).toBeGreaterThanOrEqual(568);
      expect(['light', 'dark', 'auto']).toContain(target.theme);
      expect(target.note.length).toBeGreaterThan(20);

      const hash = target.url.split('#')[1];
      if (hash) {
        expect(slideIds).toContain(hash);
      }

      if (target.action) {
        expect(target.action).toMatch(/^click:.+/);
      }
    });
  });

  it('does not reference removed x-ray controls in visual QA targets', () => {
    const actions = VISUAL_QA_TARGETS.map(target => target.action || '').join('\n');
    expect(actions).not.toContain('data-context-xray-mode');
    expect(VISUAL_QA_TARGETS.map(target => target.id)).toContain('context-rot-desktop');
  });

  it('includes measured high-risk overflow states as visual QA targets', () => {
    expect(VISUAL_QA_TARGETS.map(target => target.id)).toEqual(expect.arrayContaining([
      'timeline-final-desktop',
      'governance-traffic-light-desktop',
      'settings-desktop',
      'prompt-product-desktop',
      'skill-anatomy-desktop',
      'llm-everywhere-final-desktop',
      'ghostwriter-phone-375'
    ]));
  });
});
