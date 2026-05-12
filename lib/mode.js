// lib/mode.js — verwaltet layout/theme/llm/exercises modes

const DEFAULTS = {
  layout: 'slide',     // 'slide' | 'scroll'
  theme: 'auto',       // 'auto' | 'light' | 'dark'
  llm: false,          // v2: LLM-Tab-Switcher ein/aus
  exercises: false     // v2: Übungen ein/aus
};

export class ModeManager extends EventTarget {
  constructor(storage) {
    super();
    this.storage = storage;
    this.state = { ...DEFAULTS };
    for (const key of Object.keys(DEFAULTS)) {
      const stored = this.storage.get(`mode.${key}`);
      if (stored !== null) this.state[key] = stored;
    }
    this.#applyTheme();
  }

  get(key) { return this.state[key]; }

  set(key, value) {
    this.state[key] = value;
    this.storage.set(`mode.${key}`, value);
    if (key === 'theme') this.#applyTheme();
    this.dispatchEvent(new CustomEvent('change', { detail: { key, value } }));
  }

  toggle(key) { this.set(key, !this.state[key]); }

  on(name, handler) {
    this.addEventListener(name, (e) => handler(e.detail));
  }

  #applyTheme() {
    const t = this.state.theme;
    document.documentElement.dataset.theme = t === 'auto' ? '' : t;
  }
}
