import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('offline delivery shell', () => {
  const index = read('index.html');
  const app = read('app.js');
  const sw = read('sw.js');
  const manifest = JSON.parse(read('manifest.webmanifest'));

  it('exposes a web app manifest from the main deck', () => {
    expect(index).toContain('<link rel="manifest" href="manifest.webmanifest">');
    expect(index).toContain('<meta name="theme-color"');
    expect(manifest.name).toBe('LLM 101');
    expect(manifest.start_url).toBe('./index.html');
    expect(manifest.scope).toBe('./');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons[0].src).toBe('assets/icon.svg');
    expect(manifest.icons[0].purpose).toContain('maskable');
  });

  it('registers the service worker without blocking normal use', () => {
    expect(app).toContain('navigator.serviceWorker.register');
    expect(app).toContain("window.location.protocol === 'file:'");
    expect(app).toContain('Offline-Support ist optional');
    expect(index).toContain('id="update-banner"');
    expect(app).toContain('updatefound');
    expect(app).toContain('controllerchange');
  });

  it('pre-caches the offline-critical deck, notes, explainer and font assets', () => {
    [
      './index.html',
      './meine-notizen.html',
      './assets/icon.svg',
      './tokens.css',
      './app.css',
      './presentation.css',
      './print.css',
      './app.js',
      './lib/storage.js',
      './lib/notes-export.js',
      './lib/learning-paths.js',
      './explainer/a-context-window.html',
      './explainer/g-modellwahl.html',
      './explainer/explainer.css',
      './assets/fonts/hanken-grotesk-variable-normal-latin.woff2',
      './assets/fonts/jetbrains-mono-variable-normal-latin.woff2'
    ].forEach(asset => {
      expect(sw).toContain(asset);
    });

    expect(sw).toContain('CACHE_PREFIX');
    expect(sw).toContain('networkFirst');
    expect(sw).toContain('cacheFirst');
    expect(sw).toContain("url.searchParams.has('v')");
  });
});
