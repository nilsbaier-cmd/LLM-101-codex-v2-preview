// lib/mode.js — verwaltet layout/theme/palette/llm/exercises modes

const DEFAULTS = {
  layout: 'slide',     // 'slide' | 'scroll'
  theme: 'auto',       // 'auto' | 'light' | 'dark'
  palette: 'codex',    // 'codex' | 'cobalt' | 'clay'
  llm: false,          // v2: LLM-Tab-Switcher ein/aus
  exercises: false     // v2: Übungen ein/aus
};

const VALIDATORS = {
  layout: (v) => v === 'slide' || v === 'scroll',
  theme: (v) => v === 'auto' || v === 'light' || v === 'dark',
  palette: (v) => v === 'codex' || v === 'cobalt' || v === 'clay',
  llm: (v) => typeof v === 'boolean',
  exercises: (v) => typeof v === 'boolean'
};

function isValid(key, value) {
  const v = VALIDATORS[key];
  return typeof v === 'function' && v(value);
}

export class ModeManager extends EventTarget {
  constructor(storage) {
    super();
    this.storage = storage;
    this.state = { ...DEFAULTS };
    for (const key of Object.keys(DEFAULTS)) {
      const stored = this.storage.get(`mode.${key}`);
      if (stored !== null && isValid(key, stored)) this.state[key] = stored;
    }
    this.#applyTheme();
    this.#applyPalette();
  }

  get(key) { return this.state[key]; }

  set(key, value) {
    if (!(key in DEFAULTS)) {
      console.warn(`[ModeManager] ignoriere unbekannten key: ${key}`);
      return false;
    }
    if (!isValid(key, value)) {
      console.warn(`[ModeManager] ignoriere ungültigen wert für ${key}: ${JSON.stringify(value)}`);
      return false;
    }
    this.state[key] = value;
    this.storage.set(`mode.${key}`, value);
    if (key === 'theme') this.#applyTheme();
    if (key === 'palette') this.#applyPalette();
    this.dispatchEvent(new CustomEvent('change', { detail: { key, value } }));
    return true;
  }

  toggle(key) { this.set(key, !this.state[key]); }

  on(name, handler) {
    const wrapped = (e) => handler(e.detail);
    this.addEventListener(name, wrapped);
    return () => this.removeEventListener(name, wrapped);
  }

  #applyTheme() {
    const t = this.state.theme;
    document.documentElement.dataset.theme = t === 'auto' ? '' : t;
  }

  #applyPalette() {
    const p = this.state.palette;
    if (p === 'codex') {
      document.documentElement.removeAttribute('data-palette');
    } else {
      document.documentElement.dataset.palette = p;
    }
  }
}
