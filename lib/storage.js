// lib/storage.js — localStorage-Wrapper mit Namespace und JSON-Serialisierung

export class Storage {
  constructor(namespace) {
    this.ns = namespace;
  }

  #key(suffix) {
    return `${this.ns}.${suffix}`;
  }

  set(suffix, value) {
    localStorage.setItem(this.#key(suffix), JSON.stringify(value));
  }

  get(suffix) {
    const raw = localStorage.getItem(this.#key(suffix));
    if (raw === null) return null;
    try { return JSON.parse(raw); } catch { return raw; }
  }

  remove(suffix) {
    localStorage.removeItem(this.#key(suffix));
  }

  keysWithPrefix(prefix) {
    const fullPrefix = this.#key(prefix);
    const result = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(fullPrefix)) {
        result.push(k.slice(this.ns.length + 1));
      }
    }
    return result;
  }
}
