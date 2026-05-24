import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { JSDOM } from 'jsdom';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const htmlFiles = [
  'index.html',
  'meine-notizen.html',
  'handout.html',
  'trainer-export.html',
  'quellen-refresh.html',
  ...readdirSync(join(root, 'explainer'))
    .filter(file => file.endsWith('.html'))
    .map(file => `explainer/${file}`)
];

function stripUrl(raw) {
  return raw.split('#')[0].split('?')[0];
}

function isLocalAsset(raw) {
  return raw
    && !raw.startsWith('http:')
    && !raw.startsWith('https:')
    && !raw.startsWith('mailto:')
    && !raw.startsWith('tel:')
    && !raw.startsWith('data:')
    && !raw.startsWith('#');
}

function resolveLocal(fromFile, raw) {
  const baseDir = dirname(join(root, fromFile));
  const clean = stripUrl(raw);
  return normalize(join(baseDir, clean));
}

describe('deck integrity', () => {
  const index = read('index.html');
  const document = new JSDOM(index, { url: 'https://example.test/' }).window.document;
  const slides = Array.from(document.querySelectorAll('.slide'));
  const slideIds = slides.map(slide => slide.dataset.slideId);

  it('keeps slide ids unique, navigable and titled', () => {
    expect(slides).toHaveLength(35);
    expect(new Set(slideIds).size).toBe(slideIds.length);

    slides.forEach(slide => {
      expect(slide.dataset.slideId).toBeTruthy();
      expect(slide.dataset.chapter).toBeTruthy();
      expect(slide.querySelector('h1, h2, h3')?.textContent?.trim()).toBeTruthy();
    });
  });

  it('splits the governance reflection exercise onto its own slide', () => {
    const mythSlide = document.querySelector('section[data-slide-id="verwaltung-2"]');
    const reflectionSlide = document.querySelector('section[data-slide-id="verwaltung-3"]');

    expect(mythSlide).toBeTruthy();
    expect(reflectionSlide).toBeTruthy();
    expect(mythSlide?.querySelector('.myth-table')).toBeTruthy();
    expect(mythSlide?.querySelector('.exercise')).toBeNull();
    expect(reflectionSlide?.querySelector('.exercise.reflection[data-exercise="r1"]')).toBeTruthy();
    expect(reflectionSlide?.querySelector('.myth-table')).toBeNull();
    expect(mythSlide?.querySelector('.slide-nav.next')?.getAttribute('href')).toBe('#verwaltung-3');
    expect(reflectionSlide?.querySelector('.slide-nav.prev')?.getAttribute('href')).toBe('#verwaltung-2');
    expect(reflectionSlide?.querySelector('.slide-nav.next')?.getAttribute('href')).toBe('#verwaltung-4');
    expect(document.querySelector('section[data-slide-id="verwaltung-4"] .slide-nav.next')?.getAttribute('href')).toBe('#claude-1');
  });

  it('keeps explainer backlinks pointed at existing slides', () => {
    const internalExplainerLinks = Array.from(document.querySelectorAll('a[href^="explainer/"]'));
    expect(internalExplainerLinks.length).toBeGreaterThanOrEqual(7);

    internalExplainerLinks.forEach(link => {
      const url = new URL(link.getAttribute('href'), 'https://example.test/');
      const targetPath = url.pathname.slice(1);
      const back = url.searchParams.get('back');

      expect(existsSync(join(root, targetPath))).toBe(true);
      expect(back, link.getAttribute('href')).toBeTruthy();
      expect(slideIds).toContain(back);
    });
  });

  it('references only local assets that exist', () => {
    htmlFiles.forEach(file => {
      const doc = new JSDOM(read(file)).window.document;
      const refs = [
        ...Array.from(doc.querySelectorAll('link[href]')).map(el => el.getAttribute('href')),
        ...Array.from(doc.querySelectorAll('script[src]')).map(el => el.getAttribute('src')),
        ...Array.from(doc.querySelectorAll('img[src]')).map(el => el.getAttribute('src')),
        ...Array.from(doc.querySelectorAll('a[href]')).map(el => el.getAttribute('href'))
      ].filter(isLocalAsset);

      refs.forEach(ref => {
        const resolved = resolveLocal(file, ref);
        expect(
          existsSync(resolved),
          `${file} references missing asset ${ref} (${resolved})`
        ).toBe(true);
      });
    });
  });

  it('does not duplicate element ids within a page', () => {
    htmlFiles.forEach(file => {
      const doc = new JSDOM(read(file)).window.document;
      const ids = Array.from(doc.querySelectorAll('[id]')).map(el => el.id);
      expect(new Set(ids).size, `${file} has duplicate ids`).toBe(ids.length);
    });
  });
});
