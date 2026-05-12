// tests/setup.js
// In Node 25 the experimental globalThis.localStorage stub (requires
// --localstorage-file) shadows jsdom's window.localStorage, and even
// window.localStorage methods come up undefined inside the vitest jsdom env.
// Replace both with a fresh in-memory polyfill so tests behave like a browser.

function createStoragePolyfill() {
  const store = new Map();
  return {
    get length() { return store.size; },
    key(i) { return Array.from(store.keys())[i] ?? null; },
    getItem(k) { return store.has(String(k)) ? store.get(String(k)) : null; },
    setItem(k, v) { store.set(String(k), String(v)); },
    removeItem(k) { store.delete(String(k)); },
    clear() { store.clear(); }
  };
}

const ls = createStoragePolyfill();
const ss = createStoragePolyfill();

Object.defineProperty(globalThis, 'localStorage', { value: ls, configurable: true, writable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: ss, configurable: true, writable: true });
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', { value: ls, configurable: true, writable: true });
  Object.defineProperty(window, 'sessionStorage', { value: ss, configurable: true, writable: true });
}
