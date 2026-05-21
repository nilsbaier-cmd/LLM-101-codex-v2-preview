const CACHE_PREFIX = 'llm-101-codex-v2-preview-offline-';
const CACHE_NAME = `${CACHE_PREFIX}2026-05-18-codex-v2m`;

const CORE_ASSETS = [
  './',
  './index.html',
  './meine-notizen.html',
  './handout.html',
  './trainer-export.html',
  './quellen-refresh.html',
  './manifest.webmanifest',
  './assets/icon.svg',
  './assets/icons.svg',
  './assets/github-xray-light.png',
  './assets/github-xray-dark.png',
  './tokens.css',
  './app.css',
  './presentation.css',
  './print.css',
  './app.js',
  './lib/storage.js',
  './lib/mode.js',
  './lib/icons.js',
  './lib/tabs.js',
  './lib/exercises.js',
  './lib/notes-export.js',
  './lib/learning-paths.js',
  './explainer/a-context-window.html',
  './explainer/b-chat-vs-project.html',
  './explainer/c-skills-architektur.html',
  './explainer/d-skill-ladder.html',
  './explainer/e-phasen.html',
  './explainer/f-bund-erlaubt.html',
  './explainer/g-modellwahl.html',
  './explainer/explainer.css',
  './assets/fonts/hanken-grotesk-variable-normal-latin.woff2',
  './assets/fonts/hanken-grotesk-variable-normal-latin-ext.woff2',
  './assets/fonts/hanken-grotesk-variable-italic-latin.woff2',
  './assets/fonts/hanken-grotesk-variable-italic-latin-ext.woff2',
  './assets/fonts/jetbrains-mono-variable-normal-latin.woff2',
  './assets/fonts/jetbrains-mono-variable-normal-latin-ext.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

async function putFresh(request, response) {
  if (!response || !response.ok) return response;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  try {
    return await putFresh(request, await fetch(request));
  } catch (error) {
    return await caches.match(request, { ignoreSearch: true })
      || await caches.match('./index.html');
  }
}

async function cacheFirst(request) {
  const url = new URL(request.url);
  if (url.searchParams.has('v')) {
    try {
      return await putFresh(request, await fetch(request));
    } catch (error) {
      // Offline: auf die unversionierten Precache-Einträge zurückfallen.
    }
  }
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;
  return putFresh(request, await fetch(request));
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    request.mode === 'navigate'
      ? networkFirst(request)
      : cacheFirst(request)
  );
});
