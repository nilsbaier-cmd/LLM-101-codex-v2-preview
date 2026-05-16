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

  it('adds a compact final transfer slide after the platform overview', () => {
    const transferSlide = document.querySelector('[data-slide-id="next-4"]');
    expect(transferSlide).toBeTruthy();
    expect(transferSlide.querySelector('h2')?.textContent).toBe('Dein nächster Schritt');
    expect(transferSlide.textContent).toContain('7-Tage-Experiment');
    expect(transferSlide.querySelector('a[href="meine-notizen.html"]')?.textContent).toContain('Meine Notizen');

    const platformSlide = document.querySelector('[data-slide-id="next-3"]');
    expect(platformSlide?.nextElementSibling?.dataset.slideId).toBe('next-4');
  });

  it('ships responsive styling for the transfer slide and trainer checklist', () => {
    expect(presentationCss).toContain('.transfer-grid');
    expect(presentationCss).toContain('.transfer-commitment');
    expect(presentationCss).toContain('@media (max-width: 700px)');
    expect(appCss).toContain('.trainer-demo-checklist ul');
  });

  it('defines stable visual QA targets for high-risk states', () => {
    expect(VISUAL_QA_TARGETS.length).toBeGreaterThanOrEqual(8);
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
});
