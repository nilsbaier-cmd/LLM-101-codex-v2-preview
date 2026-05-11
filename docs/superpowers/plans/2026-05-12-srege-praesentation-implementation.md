# SREGE Präsentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eine interaktive HTML-Präsentation (v1 Claude-fokussiert / v2 LLM-agnostisch + Übungen) plus sieben standalone Concept-Explainer und eine Notizen-Sammelseite bauen, alles aus einer Codebasis.

**Architecture:** Vanilla HTML/CSS/JS, kein Build-Schritt für die Auslieferung. Dev-Tooling (Vitest) ausschließlich für lib/-Modul-Tests. State via localStorage. Hybrid Slide/Scroll. Hell+Dunkel. Design-System: Anthropic-inspirierte Tokens + Hanken Grotesk + Coral-Akzent + Lucide-Line-Icons.

**Tech Stack:** HTML5, CSS3 (Custom Properties), ES2022 Modules, Vitest (dev-only), Google Fonts (Hanken Grotesk, JetBrains Mono).

**Project Root:** `claude-praesentation/` (im Workstation-Ordner).

**Reference:** Spec unter `docs/superpowers/specs/2026-05-12-srege-praesentation-design.md`.

---

## Phase 0 — Projekt-Setup

### Task 0.1: Projektordner und Skelett anlegen

**Files:**
- Create: `claude-praesentation/.gitignore`
- Create: `claude-praesentation/README.md`
- Create: `claude-praesentation/package.json`

- [ ] **Step 1: Ordnerstruktur anlegen**

```bash
cd "claude-praesentation"
mkdir -p lib explainer tests
```

- [ ] **Step 2: `.gitignore` schreiben**

```
node_modules/
.DS_Store
*.log
.vite/
coverage/
```

- [ ] **Step 3: `README.md` schreiben**

```markdown
# Claude-Einführung — Interaktive Präsentation

Hybrid Slide/Scroll-Präsentation für Claude-Einführungs-Workshops.

## Nutzung

Auslieferung ist **build-frei** — `index.html` per Doppelklick öffnen.

- `index.html` — Hauptpräsentation (v1/v2)
- `meine-notizen.html` — Sammelseite Reflexionsantworten
- `explainer/*.html` — Standalone Concept-Explainer

## Entwicklung

```bash
npm install      # Vitest installieren (nur für Tests)
npm test         # Unit-Tests laufen lassen
```

Quelle: `docs/superpowers/specs/2026-05-12-srege-praesentation-design.md`
```

- [ ] **Step 4: `package.json` schreiben**

```json
{
  "name": "claude-praesentation",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "vitest": "^2.1.0",
    "jsdom": "^25.0.0"
  }
}
```

- [ ] **Step 5: Dependencies installieren**

Run: `npm install`
Expected: `node_modules/` entsteht, kein Fehler.

- [ ] **Step 6: Commit**

```bash
git add . && git commit -m "chore: projekt-skelett claude-praesentation"
```

(Falls kein Git: ignorieren, weiter mit Task 0.2.)

---

### Task 0.2: Vitest-Konfiguration

**Files:**
- Create: `claude-praesentation/vitest.config.js`

- [ ] **Step 1: `vitest.config.js` schreiben**

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    globals: true
  }
});
```

- [ ] **Step 2: Smoke-Test schreiben**

Create: `claude-praesentation/tests/smoke.test.js`

```javascript
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('vitest läuft', () => {
    expect(1 + 1).toBe(2);
  });

  it('jsdom hat document', () => {
    expect(document).toBeDefined();
    expect(document.body).toBeDefined();
  });
});
```

- [ ] **Step 3: Tests ausführen**

Run: `npm test`
Expected: 2 passed, 0 failed.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.js tests/smoke.test.js && git commit -m "test: vitest+jsdom setup"
```

---

## Phase 1 — Design-System (CSS Foundation)

### Task 1.1: tokens.css mit Custom Properties

**Files:**
- Create: `claude-praesentation/tokens.css`

- [ ] **Step 1: `tokens.css` schreiben**

```css
/* Design Tokens — Anthropic-inspiriert, Hell + Dunkel */

@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  /* Farben — Hell (Default) */
  --bg-base: #fafaf7;
  --bg-card: #ffffff;
  --bg-tint: #faf7f0;
  --border: #e8e3d4;
  --text-primary: #1a1817;
  --text-secondary: #6e6860;
  --text-tertiary: #8a847a;
  --accent: #cc785c;
  --accent-soft: rgba(204, 120, 92, 0.08);
  --accent-strong: #b35f44;
  --success: #5fb37e;
  --success-soft: rgba(34, 197, 94, 0.08);

  /* Typografie */
  --font-sans: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', monospace;

  /* Maße */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 14px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 22px;
  --space-6: 30px;
  --space-7: 44px;

  /* Schatten */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 14px rgba(0, 0, 0, 0.06);
}

:root[data-theme="dark"] {
  --bg-base: #141413;
  --bg-card: #1f1d1b;
  --bg-tint: #1a1817;
  --border: #2e2a26;
  --text-primary: #f5f1e9;
  --text-secondary: #a8a298;
  --text-tertiary: #8a847a;
  --accent: #e8a07c;
  --accent-soft: rgba(232, 160, 124, 0.12);
  --accent-strong: #ffb592;
  --success: #86efac;
  --success-soft: rgba(74, 222, 128, 0.10);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 1px 3px rgba(0, 0, 0, 0.4), 0 4px 14px rgba(0, 0, 0, 0.3);
}

/* Bei OS-Präferenz Dark (wenn kein expliziter Theme-Toggle gesetzt) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg-base: #141413;
    --bg-card: #1f1d1b;
    --bg-tint: #1a1817;
    --border: #2e2a26;
    --text-primary: #f5f1e9;
    --text-secondary: #a8a298;
    --text-tertiary: #8a847a;
    --accent: #e8a07c;
    --accent-soft: rgba(232, 160, 124, 0.12);
    --accent-strong: #ffb592;
    --success: #86efac;
    --success-soft: rgba(74, 222, 128, 0.10);
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 1px 3px rgba(0, 0, 0, 0.4), 0 4px 14px rgba(0, 0, 0, 0.3);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add tokens.css && git commit -m "feat: design tokens (hell+dunkel)"
```

---

### Task 1.2: app.css mit Komponenten-Styling

**Files:**
- Create: `claude-praesentation/app.css`

- [ ] **Step 1: `app.css` schreiben**

```css
/* Layout + Komponenten — basiert auf tokens.css */

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  font-family: var(--font-sans);
  background: var(--bg-base);
  color: var(--text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* Typografie */
.chapter-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: var(--space-4);
}

h1, h2, h3, h4 { letter-spacing: -0.025em; line-height: 1.1; font-weight: 600; }
h1 { font-size: 44px; }
h2 { font-size: 32px; }
h3 { font-size: 22px; }
h4 { font-size: 18px; }

p, li { font-size: 14px; line-height: 1.6; }
.pull-quote { font-style: italic; color: var(--text-secondary); font-size: 13px; margin: var(--space-3) 0; }

/* Card */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

/* Stat-Block */
.stat {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
}
.stat-label {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.3px;
  color: var(--text-tertiary);
}
.stat-value {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.025em;
  margin-top: 2px;
}
.stat-value.accent { color: var(--accent); }

/* Progress-Bar */
.progress {
  height: 5px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
  margin-top: var(--space-3);
}
.progress-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.3s ease;
}

/* Button */
.btn {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.btn:hover { border-color: var(--accent); }
.btn.btn-primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
.btn.btn-primary:hover { background: var(--accent-strong); }
.btn.btn-ghost { background: transparent; border-color: transparent; color: var(--text-secondary); }

/* Code-Block mit Copy */
.code-block {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-primary);
  position: relative;
  line-height: 1.6;
  white-space: pre-wrap;
  margin: var(--space-2) 0;
}
.code-block .copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 10px;
  padding: 3px 9px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: var(--font-sans);
  font-weight: 600;
}
.code-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: var(--space-1);
}

/* Icons */
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: -3px;
  color: var(--accent);
}
.icon svg { stroke: currentColor; stroke-width: 1.75; fill: none; width: 14px; height: 14px; }

/* App-Shell */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border);
  background: var(--bg-base);
}
.app-toggles { display: flex; gap: var(--space-2); align-items: center; }
.toggle {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.toggle.active { color: var(--accent); background: var(--accent-soft); }
```

- [ ] **Step 2: Commit**

```bash
git add app.css && git commit -m "feat: app.css komponenten-styling"
```

---

## Phase 2 — Core lib/-Module (TDD)

### Task 2.1: lib/storage.js — localStorage-Wrapper

**Files:**
- Create: `claude-praesentation/lib/storage.js`
- Create: `claude-praesentation/tests/storage.test.js`

- [ ] **Step 1: Test schreiben (failing)**

```javascript
// tests/storage.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { Storage } from '../lib/storage.js';

describe('Storage', () => {
  const NS = 'srege-praesentation-v1';
  let storage;

  beforeEach(() => {
    localStorage.clear();
    storage = new Storage(NS);
  });

  it('schreibt und liest einen string-wert', () => {
    storage.set('mode.theme', 'dark');
    expect(storage.get('mode.theme')).toBe('dark');
  });

  it('schreibt und liest ein objekt', () => {
    storage.set('notiz.kapitel1.uebung1', { antwort: 'Test', ts: 12345 });
    expect(storage.get('notiz.kapitel1.uebung1')).toEqual({ antwort: 'Test', ts: 12345 });
  });

  it('gibt null zurück, wenn schlüssel nicht existiert', () => {
    expect(storage.get('does-not-exist')).toBeNull();
  });

  it('listet alle keys mit gegebenem präfix', () => {
    storage.set('notiz.k1.u1', 'a');
    storage.set('notiz.k2.u1', 'b');
    storage.set('mode.theme', 'dark');
    const keys = storage.keysWithPrefix('notiz.');
    expect(keys.sort()).toEqual(['notiz.k1.u1', 'notiz.k2.u1']);
  });

  it('löscht einen schlüssel', () => {
    storage.set('mode.theme', 'dark');
    storage.remove('mode.theme');
    expect(storage.get('mode.theme')).toBeNull();
  });

  it('namespaced unterschiedliche storages voneinander', () => {
    const s2 = new Storage('andere-app');
    storage.set('x', '1');
    s2.set('x', '2');
    expect(storage.get('x')).toBe('1');
    expect(s2.get('x')).toBe('2');
  });
});
```

- [ ] **Step 2: Tests laufen — alle müssen failen**

Run: `npm test -- storage.test.js`
Expected: FAIL, "Storage is not exported" o.ä.

- [ ] **Step 3: `lib/storage.js` schreiben**

```javascript
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
```

- [ ] **Step 4: Tests laufen — alle müssen passen**

Run: `npm test -- storage.test.js`
Expected: 6 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/storage.js tests/storage.test.js && git commit -m "feat(lib): storage module mit namespace + tests"
```

---

### Task 2.2: lib/mode.js — Modi-Manager

**Files:**
- Create: `claude-praesentation/lib/mode.js`
- Create: `claude-praesentation/tests/mode.test.js`

- [ ] **Step 1: Test schreiben**

```javascript
// tests/mode.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { ModeManager } from '../lib/mode.js';
import { Storage } from '../lib/storage.js';

describe('ModeManager', () => {
  let mode;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = '';
    mode = new ModeManager(new Storage('srege-test'));
  });

  it('default-zustand: slide-mode, theme auto, llm off, exercises off', () => {
    expect(mode.get('layout')).toBe('slide');
    expect(mode.get('theme')).toBe('auto');
    expect(mode.get('llm')).toBe(false);
    expect(mode.get('exercises')).toBe(false);
  });

  it('setzt einen mode und persistiert', () => {
    mode.set('theme', 'dark');
    expect(mode.get('theme')).toBe('dark');
    const mode2 = new ModeManager(new Storage('srege-test'));
    expect(mode2.get('theme')).toBe('dark');
  });

  it('setzt data-theme auf root bei theme-änderung', () => {
    mode.set('theme', 'dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    mode.set('theme', 'light');
    expect(document.documentElement.dataset.theme).toBe('light');
    mode.set('theme', 'auto');
    expect(document.documentElement.dataset.theme).toBe('');
  });

  it('emittet change-event mit mode-key und neuem wert', () => {
    let called = null;
    mode.on('change', (e) => { called = e; });
    mode.set('llm', true);
    expect(called).toEqual({ key: 'llm', value: true });
  });

  it('toggle invertiert boolean-modi', () => {
    mode.toggle('exercises');
    expect(mode.get('exercises')).toBe(true);
    mode.toggle('exercises');
    expect(mode.get('exercises')).toBe(false);
  });
});
```

- [ ] **Step 2: Tests laufen — failing**

Run: `npm test -- mode.test.js`
Expected: FAIL.

- [ ] **Step 3: `lib/mode.js` schreiben**

```javascript
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
```

- [ ] **Step 4: Tests laufen — passing**

Run: `npm test -- mode.test.js`
Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/mode.js tests/mode.test.js && git commit -m "feat(lib): mode manager (layout/theme/llm/exercises)"
```

---

### Task 2.3: lib/icons.js — Lucide-Inline-SVG-Helper

**Files:**
- Create: `claude-praesentation/lib/icons.js`
- Create: `claude-praesentation/tests/icons.test.js`

- [ ] **Step 1: Test schreiben**

```javascript
// tests/icons.test.js
import { describe, it, expect } from 'vitest';
import { icon, ICONS } from '../lib/icons.js';

describe('icons', () => {
  it('rendert paperclip als svg-string', () => {
    const html = icon('paperclip');
    expect(html).toContain('<svg');
    expect(html).toContain('viewBox');
    expect(html).toContain('class="icon-svg"');
  });

  it('verfügbare icons enthalten alle keys, die wir nutzen', () => {
    const required = ['paperclip', 'file-text', 'message-square', 'sun', 'moon', 'copy', 'check'];
    for (const k of required) expect(ICONS).toHaveProperty(k);
  });

  it('wirft fehler bei unbekanntem icon', () => {
    expect(() => icon('unbekannt')).toThrow();
  });

  it('umhüllt mit span.icon wenn wrap=true', () => {
    const html = icon('paperclip', { wrap: true });
    expect(html).toMatch(/^<span class="icon">/);
  });
});
```

- [ ] **Step 2: Tests failing**

Run: `npm test -- icons.test.js`

- [ ] **Step 3: `lib/icons.js` schreiben**

```javascript
// lib/icons.js — Inline-SVG Helper für Lucide-Stil Icons

export const ICONS = {
  'paperclip': 'M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48',
  'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h8',
  'message-square': 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  'sun': 'M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42 circle:12,12,5',
  'moon': 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  'copy': 'M9 9h13v13H9z M5 15H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2',
  'check': 'M20 6 9 17l-5-5',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  'rotate-ccw': 'M3 12a9 9 0 1 0 9-9 M3 3v6h6',
  'layers': 'M12 2 2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5'
};

export function icon(name, opts = {}) {
  if (!ICONS[name]) throw new Error(`Unknown icon: ${name}`);
  const svg = `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${pathsFor(name)}</svg>`;
  return opts.wrap ? `<span class="icon">${svg}</span>` : svg;
}

function pathsFor(name) {
  const def = ICONS[name];
  return def.split(' M').map((p, i) => i === 0 ? p : 'M' + p)
    .map(p => p.startsWith('circle:') ? circleEl(p) : `<path d="${p.trim()}"/>`)
    .join('');
}

function circleEl(p) {
  const [, args] = p.split(':');
  const [cx, cy, r] = args.split(',');
  return `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
}
```

- [ ] **Step 4: Tests passing**

Run: `npm test -- icons.test.js`

- [ ] **Step 5: Commit**

```bash
git add lib/icons.js tests/icons.test.js && git commit -m "feat(lib): icon helper mit lucide-svgs"
```

---

---

## Phase 3 — Präsentations-Shell

### Task 3.1: index.html Skelett mit Header und Toggle-Bar

**Files:**
- Create: `claude-praesentation/index.html`
- Create: `claude-praesentation/app.js`

- [ ] **Step 1: `index.html` schreiben**

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Einführung Claude</title>
  <link rel="stylesheet" href="tokens.css">
  <link rel="stylesheet" href="app.css">
  <link rel="stylesheet" href="presentation.css">
</head>
<body data-layout="slide">
  <header class="app-header">
    <div class="app-title">Einführung Claude</div>
    <div class="app-toggles">
      <button class="toggle" data-mode="layout" data-value="slide">Vortrag</button>
      <button class="toggle" data-mode="layout" data-value="scroll">Lesen</button>
      <span class="toggle-divider"></span>
      <button class="toggle" data-mode="theme" data-value="light" title="Hell"></button>
      <button class="toggle" data-mode="theme" data-value="dark" title="Dunkel"></button>
      <span class="toggle-divider"></span>
      <button class="toggle" data-mode="llm" data-toggle>LLM-Tabs</button>
      <button class="toggle" data-mode="exercises" data-toggle>Übungen</button>
    </div>
  </header>

  <main class="app-main">
    <nav class="app-toc" aria-label="Inhaltsverzeichnis">
      <!-- TOC wird in Task 3.3 gefüllt -->
    </nav>

    <div class="app-deck">
      <!-- Folien-Container — gefüllt in Phase 4 -->
      <section class="slide" data-slide-id="cover">
        <div class="slide-inner">
          <h1>Einführung Claude</h1>
          <p class="pull-quote">Platzhalter — Inhalt folgt in Phase 4</p>
        </div>
      </section>
    </div>

    <div class="app-controls">
      <button class="btn btn-ghost" id="prev-slide" aria-label="Vorherige Folie">‹</button>
      <span class="slide-counter"><span id="current">1</span> / <span id="total">1</span></span>
      <button class="btn btn-ghost" id="next-slide" aria-label="Nächste Folie">›</button>
    </div>
  </main>

  <script type="module" src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: `app.js` schreiben (initial Verkabelung)**

```javascript
// app.js — Haupteinstieg
import { Storage } from './lib/storage.js';
import { ModeManager } from './lib/mode.js';
import { icon } from './lib/icons.js';

const NS = 'srege-praesentation-v1';
const storage = new Storage(NS);
const mode = new ModeManager(storage);

// Theme-Buttons mit Icons befüllen
document.querySelector('[data-mode="theme"][data-value="light"]').innerHTML = icon('sun');
document.querySelector('[data-mode="theme"][data-value="dark"]').innerHTML = icon('moon');

// Toggle-Verkabelung
document.querySelectorAll('.toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const modeKey = btn.dataset.mode;
    if (btn.dataset.toggle !== undefined) {
      mode.toggle(modeKey);
    } else {
      mode.set(modeKey, btn.dataset.value);
    }
    refreshToggleStates();
  });
});

function refreshToggleStates() {
  document.querySelectorAll('.toggle').forEach(btn => {
    const key = btn.dataset.mode;
    const val = btn.dataset.value;
    const current = mode.get(key);
    if (btn.dataset.toggle !== undefined) {
      btn.classList.toggle('active', current === true);
    } else {
      btn.classList.toggle('active', current === val);
    }
  });
  document.body.dataset.layout = mode.get('layout');
  document.body.dataset.llm = mode.get('llm') ? 'on' : 'off';
  document.body.dataset.exercises = mode.get('exercises') ? 'on' : 'off';
}

refreshToggleStates();
```

- [ ] **Step 3: Im Browser öffnen**

Run: `open index.html`
Expected: Header mit Toggle-Buttons sichtbar, Platzhalter-Slide darunter. Klick auf Toggles ändert sichtbar deren `active`-Zustand. Nach Reload bleibt der Zustand erhalten.

- [ ] **Step 4: Commit**

```bash
git add index.html app.js && git commit -m "feat: app-shell mit header + toggle-verkabelung"
```

---

### Task 3.2: Slide-Modus — Layout, Keyboard, Tasten-Buttons

**Files:**
- Create: `claude-praesentation/presentation.css`
- Modify: `claude-praesentation/app.js`

- [ ] **Step 1: `presentation.css` schreiben**

```css
/* Layout-spezifische Styles für Slide- und Scroll-Modus */

.app-main {
  display: grid;
  grid-template-rows: 1fr auto;
  height: calc(100vh - 60px);
}

/* SLIDE-MODUS */
body[data-layout="slide"] .app-toc { display: none; }
body[data-layout="slide"] .app-deck {
  overflow: hidden;
  position: relative;
}
body[data-layout="slide"] .slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-7);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}
body[data-layout="slide"] .slide.is-active {
  opacity: 1;
  pointer-events: auto;
}
body[data-layout="slide"] .slide-inner {
  max-width: 980px;
  width: 100%;
}

/* SCROLL-MODUS */
body[data-layout="scroll"] .app-main {
  grid-template-columns: 220px 1fr;
  grid-template-rows: 1fr;
}
body[data-layout="scroll"] .app-toc {
  display: block;
  position: sticky;
  top: 0;
  padding: var(--space-5);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  height: calc(100vh - 60px);
}
body[data-layout="scroll"] .app-deck {
  overflow-y: auto;
  padding: var(--space-7);
  scroll-behavior: smooth;
}
body[data-layout="scroll"] .slide {
  max-width: 760px;
  margin: 0 auto var(--space-7) auto;
  padding-bottom: var(--space-7);
  border-bottom: 1px solid var(--border);
}
body[data-layout="scroll"] .slide:last-child { border-bottom: none; }
body[data-layout="scroll"] .app-controls { display: none; }

/* CONTROLS */
.app-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-top: 1px solid var(--border);
}
.slide-counter { font-size: 12px; color: var(--text-tertiary); }

/* TOC */
.app-toc ol { list-style: none; counter-reset: toc; }
.app-toc li { counter-increment: toc; margin-bottom: var(--space-2); }
.app-toc a {
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: none;
  display: block;
  padding: 4px 0;
  border-left: 2px solid transparent;
  padding-left: var(--space-3);
}
.app-toc a:hover { color: var(--text-primary); }
.app-toc a.is-current {
  color: var(--accent);
  border-left-color: var(--accent);
}

.toggle-divider {
  width: 1px;
  height: 18px;
  background: var(--border);
  margin: 0 var(--space-2);
}
```

- [ ] **Step 2: Slide-Navigation in `app.js` ergänzen**

Append to `app.js`:

```javascript
// Slide-Navigation
const slides = () => Array.from(document.querySelectorAll('.app-deck .slide'));
let currentIdx = 0;

function showSlide(idx) {
  const list = slides();
  if (idx < 0 || idx >= list.length) return;
  list.forEach((s, i) => s.classList.toggle('is-active', i === idx));
  currentIdx = idx;
  document.getElementById('current').textContent = idx + 1;
  document.getElementById('total').textContent = list.length;
}

document.getElementById('prev-slide').addEventListener('click', () => showSlide(currentIdx - 1));
document.getElementById('next-slide').addEventListener('click', () => showSlide(currentIdx + 1));

document.addEventListener('keydown', (e) => {
  if (mode.get('layout') !== 'slide') return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); showSlide(currentIdx + 1); }
  if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   { e.preventDefault(); showSlide(currentIdx - 1); }
});

mode.on('change', ({ key }) => {
  if (key === 'layout') showSlide(currentIdx);
});

showSlide(0);
```

- [ ] **Step 3: Browser-Smoke-Test**

Run: `open index.html`
Expected: Pfeiltasten/Buttons navigieren, Counter aktualisiert sich, beim Wechsel auf "Lesen" verschwinden die Pfeil-Buttons.

- [ ] **Step 4: Commit**

```bash
git add presentation.css app.js && git commit -m "feat: slide/scroll layout + keyboard-nav"
```

---

### Task 3.3: TOC-Generator im Scroll-Modus

**Files:**
- Modify: `claude-praesentation/app.js`

- [ ] **Step 1: TOC-Generator schreiben**

Append to `app.js`:

```javascript
// TOC im Scroll-Modus aus den Folien generieren
function rebuildTOC() {
  const toc = document.querySelector('.app-toc');
  const list = slides();
  const ol = document.createElement('ol');
  list.forEach((slide) => {
    const id = slide.dataset.slideId || '';
    const label = slide.querySelector('.chapter-label')?.textContent
                || slide.querySelector('h1, h2, h3')?.textContent
                || `Folie ${id}`;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = label;
    a.dataset.slideId = id;
    li.appendChild(a);
    ol.appendChild(li);
  });
  toc.innerHTML = '';
  toc.appendChild(ol);
}

// Scroll-Spy: markiere aktive Sektion im TOC
function setupScrollSpy() {
  const obs = new IntersectionObserver((entries) => {
    if (mode.get('layout') !== 'scroll') return;
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const id = entry.target.dataset.slideId;
        document.querySelectorAll('.app-toc a').forEach(a => {
          a.classList.toggle('is-current', a.dataset.slideId === id);
        });
      }
    }
  }, { threshold: 0.4 });
  slides().forEach(s => obs.observe(s));
}

rebuildTOC();
setupScrollSpy();

// IDs als Anker setzen für Hash-Navigation
slides().forEach(s => {
  if (s.dataset.slideId && !s.id) s.id = s.dataset.slideId;
});
```

- [ ] **Step 2: Browser-Test**

Run: `open index.html`
Expected: Nach Toggle auf "Lesen" sieht man die TOC links, Klick auf einen Eintrag scrollt zur Sektion, aktive Sektion ist Coral markiert.

- [ ] **Step 3: Commit**

```bash
git add app.js && git commit -m "feat: toc-generator + scroll-spy"
```

## Phase 4 — v1 Kapitelinhalte

**Folien-Vorlage (für alle Kapitel-Tasks gleich):**

```html
<section class="slide" data-slide-id="<kapitel>-<n>" data-chapter="<kapitel>">
  <div class="slide-inner">
    <div class="chapter-label">Kapitel N — Titel</div>
    <h2>Folientitel</h2>
    <p class="pull-quote">Optionales Zitat</p>
    <!-- spezifischer Inhalt -->
  </div>
</section>
```

Inhaltliche Quelle: bestehende PDF (`Resources/2022-11-01 SEM Einführung Claude für SREGE März 2026.pdf`) — jede Folie wird als HTML rekonstruiert, generisch (keine SEM/SREGE-Bezüge), mit denselben Strukturkomponenten (Card, Stat, Progress, Code-Block) aus `app.css`.

### Task 4.1: Kapitel 1 — Einstieg & Standort

**Files:** Modify `claude-praesentation/index.html` (Ersetzen der Platzhalter-Section im `.app-deck`)

Vier Folien:
1. `einstieg-1` Cover (Headline „Einführung Claude", Pull-Quote „Context is like milk — best freshly served and condensed", Sub-Untertitel mit Datum-Platzhalter)
2. `einstieg-2` Fünf Phasen der KI-Nutzung (horizontale 5er-Card-Grid)
3. `einstieg-3` 7-Level Skill-Ladder (vertikale Liste mit Icons)
4. `einstieg-4` Agenda (Bullet-Liste der Kapitel)

- [ ] **Step 1:** Folien-HTML aus PDF Slides 1–5 rekonstruieren, in Vorlage einfügen. Folie „Bill Gates"-Quote als optionale Folie weglassen (nicht generisch genug).
- [ ] **Step 2:** Browser-Test: alle 4 Folien navigierbar, im Scroll-Modus untereinander, TOC zeigt alle Einträge.
- [ ] **Step 3:** Commit `feat: kapitel 1 einstieg & standort`.

### Task 4.2: Kapitel 2 — Bund & KI

Zwei Folien:
1. `bund-1` „Was sagt der Bund zu KI?" — Drei-Spalten-Card-Layout: 7 Leitlinien · Merkblatt erlaubt/verboten · Verantwortung. Inhalt: aus PDF Slide 6 generisch übernehmen.
2. `bund-2` „Bund und KI: Kritische Einschätzung" — Tabelle Mythos/Realität/Einordnung mit kleinen Status-Pills.

- [ ] **Step 1:** HTML schreiben.
- [ ] **Step 2:** Browser-Test (sichtbar, lesbar, hell+dunkel).
- [ ] **Step 3:** Commit `feat: kapitel 2 bund & ki`.

### Task 4.3: Kapitel 3 — Claude 101

Fünf Folien — Inhalt aus PDF Slides 8–12:
1. `claude-1` Modelle (drei Card: Opus / Sonnet / Haiku)
2. `claude-2` Chat-Optionen (Liste W/A/D/C/P/M/V/U mit Icons)
3. `claude-3` Einstellungen (Memory · Schreibstil · User Preferences · Feature-Toggles)
4. `claude-4` Menü & Navigation
5. `claude-5` Abos & Preise (Free / Pro / Team / Enterprise)

- [ ] **Step 1:** HTML pro Folie schreiben, Icons via `icon(...)`.
- [ ] **Step 2:** Browser-Smoketest.
- [ ] **Step 3:** Commit `feat: kapitel 3 claude 101`.

### Task 4.4: Kapitel 4 — Context & Pflege (Konsequenz-Redesign)

**Das Schlüssel-Redesign aus dem Spec §5.1.** Statt der drei alten Folien (Context Window / Alles auf einmal / Progressive) eine zentrale Vergleichsfolie. Verweis auf Explainer A für Vertiefung.

**Files:** Modify `claude-praesentation/index.html`

- [ ] **Step 1: Folie `context-1` als Konsequenz-Vergleich schreiben**

```html
<section class="slide" data-slide-id="context-1" data-chapter="context">
  <div class="slide-inner">
    <div class="chapter-label">Kapitel 4 — Kontext & Pflege</div>
    <h2>Context Window</h2>
    <p class="pull-quote">Context is like milk — best freshly served and condensed.</p>

    <div class="consequence-grid">
      <div class="card">
        <div class="code-label">Strategie A — alles rein</div>
        <ul class="ctx-list">
          <li><span class="icon" data-icon="paperclip"></span>12 Anhänge</li>
          <li><span class="icon" data-icon="file-text"></span>8 Vorab-Anweisungen</li>
          <li><span class="icon" data-icon="message-square"></span>Chat-Verlauf 50+ Nachrichten</li>
        </ul>
        <hr>
        <p><strong>Frage:</strong> Was war Schritt 3?</p>
        <p class="answer answer-bad"><strong>Antwort:</strong> ✗ erfunden / falsch</p>
      </div>

      <div class="card">
        <div class="code-label">Strategie B — progressiv</div>
        <ul class="ctx-list">
          <li><span class="icon" data-icon="file-text"></span>Kernkontext (kurz)</li>
          <li><span class="icon" data-icon="paperclip"></span>nur relevanter Anhang</li>
          <li><span class="icon" data-icon="message-square"></span>letzte 5 Nachrichten</li>
        </ul>
        <hr>
        <p><strong>Frage:</strong> Was war Schritt 3?</p>
        <p class="answer answer-good"><strong>Antwort:</strong> ✓ korrekt</p>
      </div>
    </div>

    <p class="see-more">→ Wie pflegt man das? Concept-Explainer A: <a href="explainer/a-context-window.html">Context Window & Pflege-Strategien</a></p>
  </div>
</section>
```

- [ ] **Step 2: Styling in `presentation.css` ergänzen**

```css
.consequence-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin: var(--space-5) 0; }
.ctx-list { list-style: none; }
.ctx-list li { padding: 4px 0; font-size: 13px; }
.answer-bad { color: var(--accent-strong); font-weight: 600; }
.answer-good { color: var(--success); font-weight: 600; }
.see-more { font-size: 12px; color: var(--text-tertiary); margin-top: var(--space-5); }
.see-more a { color: var(--accent); text-decoration: none; font-weight: 500; }
```

- [ ] **Step 3: Icon-Platzhalter im DOM auflösen (in `app.js`)**

```javascript
import { icon } from './lib/icons.js';
document.querySelectorAll('.icon[data-icon]').forEach(el => {
  el.innerHTML = icon(el.dataset.icon);
});
```

- [ ] **Step 4: Browser-Test**

Run: `open index.html`
Expected: Kapitel-4-Folie zeigt zwei nebeneinanderliegende Karten mit Icon-Listen, rote/grüne Antwort, Link zum Explainer.

- [ ] **Step 5: Commit**

```bash
git add index.html presentation.css app.js && git commit -m "feat: kapitel 4 context & pflege (konsequenz-redesign)"
```

### Task 4.5: Kapitel 5 — Use Cases

Drei Folien (PDF Slides 16–18): Sparringpartner, Ghostwriter, Data Analyst. Jede als Chat-Interaktions-Mockup (alternierende Sprechblasen) + Beispiel-Prompts + 4-Schritt-Interaktionsmuster.

- [ ] **Step 1:** HTML pro Folie, Chat-Bubbles als `.bubble.user` / `.bubble.ai`.
- [ ] **Step 2:** Styling in `presentation.css` ergänzen (Bubble-Farben, Pfeile).
- [ ] **Step 3:** Commit `feat: kapitel 5 use cases`.

### Task 4.6: Kapitel 6 — Skills

Drei Folien (PDF Slides 19–21):
1. `skills-1` Was ist ein Skill + Architektur-Diagramm (statisch, animiertes Pendant kommt in Explainer C)
2. `skills-2` Skills entwickeln & verwenden — Lifecycle + 5 Workflow-Patterns
3. `skills-3` „Skills — Demo Time!" — Platzhalter-Folie für Live-Demo, mit „Wir bauen jetzt einen Skill live"-Hinweis

- [ ] **Step 1:** HTML schreiben, Skill-Architektur als 3-Ebenen-Stack mit `code-block`-Styling.
- [ ] **Step 2:** Verlinkung zu Explainer C einbauen (`see-more`).
- [ ] **Step 3:** Commit `feat: kapitel 6 skills`.

### Task 4.7: Kapitel 7 — Next Level

Drei Folien (PDF Slides 22–25):
1. `next-1` Team-Repo-Idee (GitHub Repo-Layout-Diagramm)
2. `next-2` GitHub 101 (Branch/Commit/Merge-Visualisierung als statisches Diagramm)
3. `next-3` Claude Code (Web / CLI / IDE / Mobile als 4er-Grid)

- [ ] **Step 1:** HTML schreiben, GitHub-Flow als simples SVG.
- [ ] **Step 2:** Smoketest.
- [ ] **Step 3:** Commit `feat: kapitel 7 next level`.

## Phase 5 — v2 Modi (LLM-Tabs + Übungen)

### Task 5.1: lib/tabs.js — LLM-Tab-Komponente (TDD)

**Files:**
- Create: `claude-praesentation/lib/tabs.js`
- Create: `claude-praesentation/tests/tabs.test.js`

- [ ] **Step 1: Test schreiben**

```javascript
// tests/tabs.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { initTabs } from '../lib/tabs.js';

describe('initTabs', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="llm-tabs" data-llm-tabs>
        <nav class="llm-tabs-nav">
          <button data-tab="claude" class="active">Claude</button>
          <button data-tab="chatgpt">ChatGPT</button>
          <button data-tab="gemini">Gemini</button>
        </nav>
        <div data-tab-panel="claude" class="active">CLAUDE-INHALT</div>
        <div data-tab-panel="chatgpt" hidden>CHATGPT-INHALT</div>
        <div data-tab-panel="gemini" hidden>GEMINI-INHALT</div>
      </div>`;
  });

  it('zeigt initial den aktiven tab', () => {
    initTabs(document.body);
    expect(document.querySelector('[data-tab-panel="claude"]').hidden).toBe(false);
    expect(document.querySelector('[data-tab-panel="chatgpt"]').hidden).toBe(true);
  });

  it('schaltet beim klick auf ein tab-button um', () => {
    initTabs(document.body);
    document.querySelector('[data-tab="chatgpt"]').click();
    expect(document.querySelector('[data-tab-panel="claude"]').hidden).toBe(true);
    expect(document.querySelector('[data-tab-panel="chatgpt"]').hidden).toBe(false);
    expect(document.querySelector('[data-tab="chatgpt"]').classList.contains('active')).toBe(true);
  });

  it('synchronisiert mehrere tab-gruppen mit data-sync-group', () => {
    document.body.innerHTML = `
      <div data-llm-tabs data-sync-group="llm">
        <button data-tab="claude" class="active">C</button>
        <button data-tab="chatgpt">G</button>
        <div data-tab-panel="claude" class="active">A1</div>
        <div data-tab-panel="chatgpt" hidden>B1</div>
      </div>
      <div data-llm-tabs data-sync-group="llm">
        <button data-tab="claude" class="active">C</button>
        <button data-tab="chatgpt">G</button>
        <div data-tab-panel="claude" class="active">A2</div>
        <div data-tab-panel="chatgpt" hidden>B2</div>
      </div>`;
    initTabs(document.body);
    document.querySelectorAll('[data-tab="chatgpt"]')[0].click();
    const panels = document.querySelectorAll('[data-tab-panel="chatgpt"]');
    expect(panels[0].hidden).toBe(false);
    expect(panels[1].hidden).toBe(false);
  });
});
```

- [ ] **Step 2: Tests failing**

Run: `npm test -- tabs.test.js`

- [ ] **Step 3: `lib/tabs.js` schreiben**

```javascript
// lib/tabs.js — LLM-Tab-Komponente mit optionaler Synchronisation
export function initTabs(root) {
  root.querySelectorAll('[data-llm-tabs]').forEach(group => {
    group.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        activateTab(btn.dataset.tab, group.dataset.syncGroup, group);
      });
    });
  });
}

function activateTab(tabName, syncGroup, originGroup) {
  const targets = syncGroup
    ? document.querySelectorAll(`[data-llm-tabs][data-sync-group="${syncGroup}"]`)
    : [originGroup];

  for (const group of targets) {
    group.querySelectorAll('[data-tab]').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabName);
    });
    group.querySelectorAll('[data-tab-panel]').forEach(p => {
      p.hidden = p.dataset.tabPanel !== tabName;
    });
  }
}
```

- [ ] **Step 4: Tests passing**

Run: `npm test -- tabs.test.js`

- [ ] **Step 5: Commit** `feat(lib): llm-tab komponente mit sync`.

### Task 5.2: LLM-Tabs in Kernfolien einbauen

Die fünf Folien, die LLM-spezifisch werden:
1. Modelle (Kapitel 3, Folie 1) — Claude-Modelle vs. OpenAI-Modelle vs. Gemini-Modelle
2. Chat-Optionen (Kapitel 3, Folie 2) — Begriffe/Features pro Anbieter
3. Einstellungen (Kapitel 3, Folie 3) — Memory/Schreibstil-Äquivalente
4. Skills-Architektur (Kapitel 6, Folie 1) — Skills (Claude) / Custom GPT (OpenAI) / Gem (Gemini)
5. Context Window Konsequenz-Folie (Kapitel 4, Folie 1) — gilt für alle drei, nur Schreenshot-Stil

- [ ] **Step 1:** Pro Folie das LLM-Tab-Wrapper-Markup ergänzen (Buttons + Panels), `data-sync-group="llm"` für globalen Sync.
- [ ] **Step 2:** Styling in `presentation.css`:

```css
.llm-tabs-nav {
  display: flex;
  gap: var(--space-2);
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--space-4);
}
.llm-tabs-nav button {
  font-family: var(--font-sans);
  font-size: 12px;
  padding: 6px 12px;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
}
.llm-tabs-nav button.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
body[data-llm="off"] .llm-tabs-nav { display: none; }
body[data-llm="off"] [data-tab-panel]:not(.active) { display: none; }
```

- [ ] **Step 3:** In `app.js`: `initTabs(document.body)` aufrufen, nachdem das DOM aufgebaut ist.
- [ ] **Step 4:** Browser-Test: Toggle „LLM-Tabs" zeigt/versteckt Tab-Navigation. Klick auf ChatGPT-Tab in einer Folie schaltet alle synchronen Tabs in anderen Folien mit.
- [ ] **Step 5:** Commit `feat: llm-tabs in 5 kernfolien`.

### Task 5.3: lib/exercises.js — Übungs-Logik (TDD)

**Files:**
- Create: `claude-praesentation/lib/exercises.js`
- Create: `claude-praesentation/tests/exercises.test.js`

- [ ] **Step 1: Test schreiben**

```javascript
// tests/exercises.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { Exercises } from '../lib/exercises.js';
import { Storage } from '../lib/storage.js';

describe('Exercises', () => {
  let ex, storage;
  beforeEach(() => {
    localStorage.clear();
    storage = new Storage('test');
    ex = new Exercises(storage);
  });

  it('speichert eine reflexionsantwort', () => {
    ex.saveReflection('kap1', 'ueb1', 'Meine Antwort');
    expect(ex.getReflection('kap1', 'ueb1').antwort).toBe('Meine Antwort');
  });

  it('zählt antworten', () => {
    ex.saveReflection('k1', 'u1', 'a');
    ex.saveReflection('k1', 'u2', 'b');
    ex.saveReflection('k2', 'u1', 'c');
    expect(ex.countReflections()).toBe(3);
  });

  it('sammelt alle reflexionen sortiert nach kapitel', () => {
    ex.saveReflection('k2', 'u1', 'c');
    ex.saveReflection('k1', 'u1', 'a');
    const all = ex.allReflections();
    expect(all.map(r => r.chapter)).toEqual(['k1', 'k2']);
  });

  it('löscht eine reflexion', () => {
    ex.saveReflection('k1', 'u1', 'a');
    ex.deleteReflection('k1', 'u1');
    expect(ex.getReflection('k1', 'u1')).toBeNull();
  });

  it('persistiert quiz-versuche', () => {
    ex.recordQuizAttempt('k1', 'u1', { choice: 'b', correct: false });
    ex.recordQuizAttempt('k1', 'u1', { choice: 'c', correct: true });
    expect(ex.getQuizAttempts('k1', 'u1').length).toBe(2);
  });
});
```

- [ ] **Step 2: Tests failing.**

- [ ] **Step 3: `lib/exercises.js` schreiben**

```javascript
// lib/exercises.js — Reflexion + Quiz Persistenz
export class Exercises {
  constructor(storage) { this.storage = storage; }

  #refKey(chapter, ex) { return `notiz.${chapter}.${ex}`; }
  #quizKey(chapter, ex) { return `quiz.${chapter}.${ex}.attempts`; }

  saveReflection(chapter, ex, text) {
    this.storage.set(this.#refKey(chapter, ex), {
      chapter, ex, antwort: text, ts: Date.now()
    });
  }

  getReflection(chapter, ex) {
    return this.storage.get(this.#refKey(chapter, ex));
  }

  deleteReflection(chapter, ex) {
    this.storage.remove(this.#refKey(chapter, ex));
  }

  countReflections() {
    return this.storage.keysWithPrefix('notiz.').length;
  }

  allReflections() {
    return this.storage.keysWithPrefix('notiz.')
      .map(k => this.storage.get(k.replace(/^[^.]+\./, ''))) // strip ns prefix already done by storage
      .filter(Boolean)
      .sort((a, b) => a.chapter.localeCompare(b.chapter) || a.ex.localeCompare(b.ex));
  }

  recordQuizAttempt(chapter, ex, attempt) {
    const key = this.#quizKey(chapter, ex);
    const all = this.storage.get(key) || [];
    all.push({ ...attempt, ts: Date.now() });
    this.storage.set(key, all);
  }

  getQuizAttempts(chapter, ex) {
    return this.storage.get(this.#quizKey(chapter, ex)) || [];
  }
}
```

- [ ] **Step 4: Tests passing.**

- [ ] **Step 5: Commit** `feat(lib): exercises (reflexion + quiz)`.

### Task 5.4: Übungs-Komponenten ins DOM

Drei wiederverwendbare Markup-Patterns. Ich gebe das HTML-Pattern; die konkreten Texte pro Übung kommen aus Spec §6.4 (7 Übungen verteilt über Kapitel).

**Reflexion-Pattern:**

```html
<div class="exercise reflection" data-chapter="k1" data-exercise="u1">
  <div class="ex-tag">Reflexion</div>
  <p class="ex-prompt">Welche wiederkehrende Aufgabe in deinem Arbeitsalltag würde am meisten von einem Project profitieren?</p>
  <textarea class="ex-textarea" placeholder="Schreib einen Halbsatz ..."></textarea>
  <div class="ex-meta">
    <span class="ex-save-hint">✓ Lokal gespeichert</span>
    <a class="ex-notes-link" href="meine-notizen.html">→ Meine Notizen (<span class="ex-notes-count">0</span>)</a>
  </div>
</div>
```

**Hands-on-Pattern (mit optionalem zweiten Copy-Block):**

```html
<div class="exercise handson" data-chapter="k6" data-exercise="u1">
  <div class="ex-tag">Hands-on</div>
  <p class="ex-prompt">Probier diesen Prompt zweimal — einmal im normalen Chat, einmal in einem Project mit dem Beispiel-Glossar.</p>
  <div class="code-label">Prompt</div>
  <div class="code-block" data-copy-source><button class="copy-btn">Kopieren</button>...PROMPT-TEXT...</div>
  <div class="code-label">Beispiel-Hausstil</div>
  <div class="code-block" data-copy-source><button class="copy-btn">Kopieren</button>...GLOSSAR-TEXT...</div>
  <p class="ex-hint"><strong>Was du erwarten kannst:</strong> ...</p>
</div>
```

**Quiz-Pattern:**

```html
<div class="exercise quiz" data-chapter="k4" data-exercise="u1">
  <div class="ex-tag">Mini-Quiz</div>
  <p class="ex-prompt">Was passiert, wenn das Context Window voll ist?</p>
  <div class="quiz-choices">
    <button class="quiz-choice" data-correct="false">Claude stoppt und meldet „Context full"</button>
    <button class="quiz-choice" data-correct="false">Älteste Nachrichten werden sichtbar entfernt</button>
    <button class="quiz-choice" data-correct="true">Antworten werden schlechter, aber nichts geht offensichtlich kaputt</button>
  </div>
  <div class="quiz-feedback" hidden></div>
</div>
```

- [ ] **Step 1:** CSS für `.exercise`-Komponenten in `presentation.css` ergänzen (Tag-Pill, Textarea, Choice-Buttons, Feedback-Box). Style: `.exercise { background: var(--bg-tint); padding: var(--space-5); border-radius: var(--radius-lg); margin: var(--space-5) 0; }`.

- [ ] **Step 2:** `app.js` ergänzen — Übungs-Initialisierung:

```javascript
import { Exercises } from './lib/exercises.js';
const exercises = new Exercises(storage);

function initExercises(root = document) {
  // Reflexionen
  root.querySelectorAll('.exercise.reflection textarea').forEach(ta => {
    const ex = ta.closest('.exercise');
    const chapter = ex.dataset.chapter;
    const exId = ex.dataset.exercise;
    const existing = exercises.getReflection(chapter, exId);
    if (existing) ta.value = existing.antwort;
    ta.addEventListener('input', () => {
      exercises.saveReflection(chapter, exId, ta.value);
      updateNotesCount();
    });
  });

  // Copy-Buttons
  root.querySelectorAll('.code-block .copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.parentElement.textContent.replace('Kopieren', '').trim();
      await navigator.clipboard.writeText(text);
      btn.textContent = '✓ Kopiert';
      setTimeout(() => btn.textContent = 'Kopieren', 1500);
    });
  });

  // Quiz-Choices
  root.querySelectorAll('.quiz-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      const ex = btn.closest('.exercise');
      const correct = btn.dataset.correct === 'true';
      btn.classList.add(correct ? 'is-correct' : 'is-wrong');
      ex.querySelectorAll('.quiz-choice').forEach(b => b.disabled = true);
      const fb = ex.querySelector('.quiz-feedback');
      fb.textContent = correct ? '✓ Korrekt.' : '✗ Falsche Antwort.';
      fb.hidden = false;
      exercises.recordQuizAttempt(ex.dataset.chapter, ex.dataset.exercise, {
        choice: btn.textContent, correct
      });
    });
  });

  updateNotesCount();
}

function updateNotesCount() {
  const n = exercises.countReflections();
  document.querySelectorAll('.ex-notes-count').forEach(el => el.textContent = n);
}

initExercises();
```

- [ ] **Step 3:** Übungen in die 7 Folien einbauen (siehe Verteilung Spec §6.4: Bund/Modelle/Chat-vs-Project/Context/Use-Cases/Skills/Skill-Ladder). Texte aus Spec übernehmen.

- [ ] **Step 4:** Übungs-Sichtbarkeit per Mode steuern. CSS:

```css
body[data-exercises="off"] .exercise { display: none; }
```

- [ ] **Step 5:** Browser-Test: Toggle „Übungen" blendet alle 7 Übungen ein/aus. Reflexionsantworten bleiben nach Reload. Quiz-Klick zeigt Feedback. Copy-Button funktioniert.

- [ ] **Step 6:** Commit `feat: übungs-komponenten (reflexion/hands-on/quiz)`.

## Phase 6 — Notizen + Markdown-Export

### Task 6.1: lib/notes-export.js — Markdown-Renderer (TDD)

**Files:**
- Create: `claude-praesentation/lib/notes-export.js`
- Create: `claude-praesentation/tests/notes-export.test.js`

- [ ] **Step 1: Test schreiben**

```javascript
// tests/notes-export.test.js
import { describe, it, expect } from 'vitest';
import { renderNotesMarkdown } from '../lib/notes-export.js';

describe('renderNotesMarkdown', () => {
  it('rendert leere notizen', () => {
    expect(renderNotesMarkdown([])).toContain('# Meine Notizen');
    expect(renderNotesMarkdown([])).toContain('Noch keine Notizen');
  });

  it('rendert eine reflexion mit kapitel-überschrift und datum', () => {
    const md = renderNotesMarkdown([
      { chapter: 'context', ex: 'u1', antwort: 'Aha.', ts: new Date('2026-05-12T10:00:00Z').getTime() }
    ]);
    expect(md).toContain('# Meine Notizen');
    expect(md).toContain('## Context');
    expect(md).toContain('Aha.');
    expect(md).toMatch(/2026-05-12/);
  });

  it('gruppiert mehrere reflexionen pro kapitel', () => {
    const md = renderNotesMarkdown([
      { chapter: 'context', ex: 'u1', antwort: 'A', ts: 1 },
      { chapter: 'context', ex: 'u2', antwort: 'B', ts: 2 },
      { chapter: 'skills', ex: 'u1', antwort: 'C', ts: 3 }
    ]);
    expect(md.match(/## Context/g).length).toBe(1);
    expect(md.match(/## Skills/g).length).toBe(1);
  });
});
```

- [ ] **Step 2: Tests failing.**

- [ ] **Step 3: `lib/notes-export.js` schreiben**

```javascript
// lib/notes-export.js — Reflexionsantworten zu Markdown
const CHAPTER_LABELS = {
  bund: 'Bund & KI',
  claude: 'Claude 101',
  context: 'Context',
  use: 'Use Cases',
  skills: 'Skills',
  ladder: 'Skill-Ladder',
  chat: 'Chat vs. Project'
};

export function renderNotesMarkdown(notes) {
  const lines = ['# Meine Notizen', '', '_Aus der Claude-Einführung exportiert._', ''];
  if (notes.length === 0) {
    lines.push('Noch keine Notizen.');
    return lines.join('\n');
  }
  const byChapter = {};
  for (const n of notes) (byChapter[n.chapter] ??= []).push(n);
  for (const chapter of Object.keys(byChapter)) {
    const label = CHAPTER_LABELS[chapter] || chapter;
    lines.push(`## ${label}`, '');
    for (const n of byChapter[chapter]) {
      const date = new Date(n.ts).toISOString().slice(0, 10);
      lines.push(`### Übung ${n.ex} — ${date}`, '', n.antwort, '');
    }
  }
  return lines.join('\n');
}

export function downloadMarkdown(filename, content) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 4: Tests passing.**

- [ ] **Step 5: Commit** `feat(lib): notes-export markdown`.

### Task 6.2: meine-notizen.html — Sammelseite

**Files:** Create: `claude-praesentation/meine-notizen.html`

- [ ] **Step 1:** HTML schreiben

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Meine Notizen — Einführung Claude</title>
  <link rel="stylesheet" href="tokens.css">
  <link rel="stylesheet" href="app.css">
  <style>
    .notes-page { max-width: 760px; margin: 0 auto; padding: var(--space-7); }
    .note-item { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-5); margin-bottom: var(--space-4); }
    .note-meta { font-size: 11px; color: var(--text-tertiary); margin-bottom: var(--space-2); }
    .note-prompt { font-weight: 600; margin-bottom: var(--space-2); }
    .note-answer { color: var(--text-secondary); white-space: pre-wrap; }
    .note-actions { display: flex; gap: var(--space-2); margin-top: var(--space-3); }
    .notes-toolbar { display: flex; justify-content: space-between; margin-bottom: var(--space-5); }
    .notes-empty { color: var(--text-tertiary); text-align: center; padding: var(--space-7); }
    .notes-footer { font-size: 11px; color: var(--text-tertiary); margin-top: var(--space-6); border-top: 1px solid var(--border); padding-top: var(--space-3); }
  </style>
</head>
<body>
  <header class="app-header">
    <div class="app-title"><a href="index.html" style="color:inherit;text-decoration:none;">← Zurück zur Präsentation</a></div>
    <div class="app-toggles">
      <button class="toggle" data-mode="theme" data-value="light" title="Hell"></button>
      <button class="toggle" data-mode="theme" data-value="dark" title="Dunkel"></button>
    </div>
  </header>
  <main class="notes-page">
    <h1>Meine Notizen</h1>
    <div class="notes-toolbar">
      <span class="notes-count"><span id="count">0</span> Reflexionen</span>
      <button id="export-md" class="btn btn-primary">Als Markdown herunterladen</button>
    </div>
    <div id="notes-list"></div>
    <p class="notes-footer">Diese Notizen liegen ausschließlich in deinem Browser. Browser-Cache leeren = Notizen weg. Lade sie regelmäßig herunter, wenn du sie behalten willst.</p>
  </main>
  <script type="module">
    import { Storage } from './lib/storage.js';
    import { ModeManager } from './lib/mode.js';
    import { Exercises } from './lib/exercises.js';
    import { icon } from './lib/icons.js';
    import { renderNotesMarkdown, downloadMarkdown } from './lib/notes-export.js';

    const storage = new Storage('srege-praesentation-v1');
    const mode = new ModeManager(storage);
    const exercises = new Exercises(storage);

    document.querySelector('[data-mode="theme"][data-value="light"]').innerHTML = icon('sun');
    document.querySelector('[data-mode="theme"][data-value="dark"]').innerHTML = icon('moon');
    document.querySelectorAll('.toggle').forEach(btn => {
      btn.addEventListener('click', () => mode.set(btn.dataset.mode, btn.dataset.value));
    });

    const notes = exercises.allReflections();
    document.getElementById('count').textContent = notes.length;

    const list = document.getElementById('notes-list');
    if (notes.length === 0) {
      list.innerHTML = '<p class="notes-empty">Noch keine Reflexionsantworten. Beantworte eine Reflexionsübung in der Präsentation — sie landet hier.</p>';
    } else {
      for (const n of notes) {
        const date = new Date(n.ts).toISOString().slice(0, 10);
        list.insertAdjacentHTML('beforeend', `
          <article class="note-item">
            <div class="note-meta">${n.chapter} · Übung ${n.ex} · ${date}</div>
            <div class="note-answer">${escapeHtml(n.antwort)}</div>
            <div class="note-actions">
              <button class="btn" data-delete="${n.chapter}/${n.ex}">Löschen</button>
            </div>
          </article>`);
      }
    }

    document.getElementById('export-md').addEventListener('click', () => {
      downloadMarkdown('meine-notizen.md', renderNotesMarkdown(notes));
    });

    list.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-delete]');
      if (!btn) return;
      const [chapter, ex] = btn.dataset.delete.split('/');
      exercises.deleteReflection(chapter, ex);
      btn.closest('.note-item').remove();
      const remaining = exercises.allReflections().length;
      document.getElementById('count').textContent = remaining;
    });

    function escapeHtml(s) {
      const div = document.createElement('div');
      div.textContent = s;
      return div.innerHTML;
    }
  </script>
</body>
</html>
```

- [ ] **Step 2:** Browser-Test: nach einer Reflexion in `index.html` erscheint die Notiz auf `meine-notizen.html`. Download-Button generiert valide Markdown-Datei. Löschen entfernt die Notiz und decrementiert den Counter.

- [ ] **Step 3:** Commit `feat: meine-notizen sammelseite mit md-export`.

### Task 6.3: Counter-Badge in der Präsentation aktualisieren

**Files:** Modify `claude-praesentation/app.js`

Bereits in Task 5.4 angelegt (`updateNotesCount()`). Sicherstellen, dass es bei jeder Reflexions-Änderung gerufen wird.

- [ ] **Step 1:** Code-Review — `updateNotesCount` wird in `input`-Handler aufgerufen. ✓
- [ ] **Step 2:** Browser-Test: Counter neben „Meine Notizen"-Link aktualisiert sich live beim Tippen.
- [ ] **Step 3:** Commit (falls Änderungen): `fix: notes-count live update`.

## Phase 7 — Concept-Explainer

**Gemeinsames Muster:** Jeder Explainer ist eine eigenständige `explainer/<id>.html`-Datei, die `../tokens.css` und `../app.css` importiert. Header mit „← Zurück zur Präsentation" und Theme-Toggle. Inhalt in `.notes-page`-artigem Container (max-width 760px). Eigenes `<script type="module">` für Interaktion. Jeder Explainer ist offline + standalone funktionsfähig (Test: in leeres Verzeichnis kopieren mit `tokens.css`+`app.css`+`lib/`).

### Task 7.1: Explainer A — Context Window Simulator

**Files:** Create: `claude-praesentation/explainer/a-context-window.html`

Die komplexeste Interaktion. Eingabefeld füllt einen Token-Budget-Balken live, drei Pflege-Buttons modifizieren den State.

- [ ] **Step 1: HTML-Skelett**

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Context Window & Pflege — Explainer A</title>
  <link rel="stylesheet" href="../tokens.css">
  <link rel="stylesheet" href="../app.css">
  <style>
    .explainer-page { max-width: 760px; margin: 0 auto; padding: var(--space-7); }
    .sim-input { width: 100%; padding: var(--space-3); border: 1px solid var(--border); border-radius: var(--radius-md); font-family: var(--font-sans); font-size: 14px; background: var(--bg-card); color: var(--text-primary); }
    .sim-bar { display: flex; height: 22px; border-radius: var(--radius-sm); overflow: hidden; margin: var(--space-3) 0; }
    .sim-segment { background: var(--accent); transition: width 0.3s, opacity 0.3s; min-width: 1px; }
    .sim-segment.dropped { background: var(--text-tertiary); opacity: 0.4; text-decoration: line-through; }
    .sim-buttons { display: flex; gap: var(--space-2); margin-top: var(--space-4); }
    .sim-stats { display: flex; gap: var(--space-3); font-size: 12px; color: var(--text-tertiary); }
    .sim-msglist { margin-top: var(--space-4); }
    .sim-msg { padding: 6px 10px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); margin-bottom: 4px; font-size: 12px; color: var(--text-primary); }
    .sim-msg.dropped { opacity: 0.4; text-decoration: line-through; }
  </style>
</head>
<body>
  <header class="app-header">
    <div class="app-title"><a href="../index.html" style="color:inherit;text-decoration:none;">← Zurück zur Präsentation</a></div>
  </header>
  <main class="explainer-page">
    <div class="chapter-label">Concept-Explainer A</div>
    <h2>Context Window & Pflege-Strategien</h2>
    <p class="pull-quote">Tipp etwas ein und beobachte den Balken. Probier dann die drei Pflege-Strategien.</p>

    <input class="sim-input" id="sim-input" placeholder="Tippe eine Nachricht ...">

    <div class="sim-stats">
      <span><span id="msg-count">0</span> Nachrichten</span>
      <span><span id="token-used">0</span> / <span id="token-max">12000</span> Tokens</span>
      <span id="dropped-info"></span>
    </div>
    <div class="sim-bar" id="sim-bar"></div>

    <div class="sim-buttons">
      <button class="btn" id="btn-reset">↺ Reset</button>
      <button class="btn" id="btn-summarize">∑ Summarize</button>
      <button class="btn btn-primary" id="btn-progressive">⤴ Progressive</button>
    </div>

    <div class="sim-msglist" id="sim-msglist"></div>
  </main>
  <script type="module" src="./a-context-window.js"></script>
</body>
</html>
```

- [ ] **Step 2: `explainer/a-context-window.js` schreiben** (Simulator-Logik):

```javascript
const MAX_TOKENS = 12000;
const TOKEN_PER_MSG = 800; // Schätzwert pro Message
let messages = []; // [{ text, tokens, dropped? }]

const input = document.getElementById('sim-input');
const bar = document.getElementById('sim-bar');
const msgList = document.getElementById('sim-msglist');

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && input.value.trim()) {
    messages.push({ text: input.value.trim(), tokens: TOKEN_PER_MSG });
    input.value = '';
    enforceLimit();
    render();
  }
});

document.getElementById('btn-reset').addEventListener('click', () => {
  messages = [];
  render();
});

document.getElementById('btn-summarize').addEventListener('click', () => {
  const old = messages.filter(m => !m.dropped).slice(0, 3);
  if (old.length < 2) return;
  messages = [{ text: `[Zusammenfassung der ersten ${old.length} Nachrichten]`, tokens: TOKEN_PER_MSG, summary: true }]
    .concat(messages.slice(3));
  render();
});

document.getElementById('btn-progressive').addEventListener('click', () => {
  // Markiere alle außer den letzten 5 als "archiviert" (sichtbar, aber nicht im aktiven Budget)
  messages = messages.map((m, i, arr) => ({ ...m, archived: i < arr.length - 5 }));
  render();
});

function enforceLimit() {
  let total = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].archived || messages[i].dropped) continue;
    total += messages[i].tokens;
    if (total > MAX_TOKENS) messages[i].dropped = true;
  }
}

function render() {
  enforceLimit();
  const active = messages.filter(m => !m.dropped && !m.archived);
  const used = active.reduce((s, m) => s + m.tokens, 0);
  document.getElementById('msg-count').textContent = active.length;
  document.getElementById('token-used').textContent = used;
  const droppedCount = messages.filter(m => m.dropped).length;
  document.getElementById('dropped-info').textContent = droppedCount ? `${droppedCount} verloren` : '';

  // Bar
  const segments = messages.slice().reverse().map(m => {
    const w = (m.tokens / MAX_TOKENS) * 100;
    return `<div class="sim-segment ${m.dropped ? 'dropped' : ''}" style="width:${w}%"></div>`;
  }).join('');
  bar.innerHTML = segments;

  // Liste
  msgList.innerHTML = messages.map((m, i) => {
    const cls = [m.dropped && 'dropped', m.archived && 'dropped', m.summary && 'summary'].filter(Boolean).join(' ');
    return `<div class="sim-msg ${cls}">${i + 1}. ${m.text}</div>`;
  }).join('');
}

render();
```

- [ ] **Step 3:** Browser-Test: 16 Nachrichten eintippen, Balken füllt sich, älteste werden durchgestrichen. „Summarize" komprimiert die drei ältesten in eine Zusammenfassungs-Message.

- [ ] **Step 4:** Commit `feat(explainer): a context window simulator`.

### Task 7.2: Explainer B — Chat vs. Project

**Files:** Create: `claude-praesentation/explainer/b-chat-vs-project.html`

- [ ] **Step 1:** HTML mit Toggle „Chat | Project" oben und einer Antwort-Card unten, die zwischen den beiden Antworten wechselt. Inhalt: dieselbe Frage (z.B. „Erstelle eine Aktennotiz zu X"), zwei vorberechnete Antworten. „Chat"-Antwort ist generisch, „Project"-Antwort folgt dem Hausstil-Glossar. Generisch — kein SEM-Bezug.
- [ ] **Step 2:** Logik: Toggle wechselt die sichtbare Antwort-Card via `hidden`-Attribut.
- [ ] **Step 3:** Browser-Test, Commit `feat(explainer): b chat vs project`.

### Task 7.3: Explainer C — Skills Progressive Disclosure

**Files:** Create: `claude-praesentation/explainer/c-skills-architektur.html`

- [ ] **Step 1:** Drei gestapelte „Ebenen"-Cards (YAML-Frontmatter / SKILL.md-Body / Verlinkte Dateien). Klick auf eine Ebene expandiert sie und zeigt Beispiel-Inhalt + Token-Counter („~50 Tokens" / „~2000 Tokens" / „bei Bedarf"). Andere Ebenen kollabieren.
- [ ] **Step 2:** Logik: Click-Handler mit `details`/`summary` oder eigener State. Token-Summe sichtbar oben.
- [ ] **Step 3:** Browser-Test, Commit `feat(explainer): c skills architektur`.

### Task 7.4: Explainer D — Skill-Ladder Selbsttest

**Files:** Create: `claude-praesentation/explainer/d-skill-ladder.html`

- [ ] **Step 1:** 5–7 Multiple-Choice-Fragen, jede mit 3 Antworten unterschiedlich gewichtet (Level 1–7). Inhaltlicher Vorschlag im Code: Fragen wie „Wie startest du normalerweise einen Chat?" / „Hast du eigene wiederverwendbare Prompts?" / „Hast du schon eine Custom Instruction geschrieben?" / „Nutzt du Datei-Uploads regelmäßig?" / „Hast du schon einen Skill gebaut?" / „Delegierst du Aufgaben an Claude Code Subagents?". Antworten geben Score-Punkte 0/1/2 etc.

```javascript
// Beispiel-Datenstruktur in d-skill-ladder.js
const FRAGEN = [
  {
    q: 'Wie startest du normalerweise einen Chat?',
    a: [
      { text: 'Ich tippe einfach drauflos und nehme die erste Antwort.', score: 0 },
      { text: 'Ich gebe Kontext mit und stelle Folgefragen.', score: 1 },
      { text: 'Ich nutze Custom Instructions oder Templates.', score: 2 }
    ]
  },
  // ... weitere Fragen
];

const LEVELS = [
  { min: 0, max: 2, label: 'Level 1 — Prompter', next: 'Probier es mit gezieltem Follow-up ...' },
  { min: 3, max: 5, label: 'Level 2 — Conversationalist', next: 'Probier System-Prompts ...' },
  // ...
];
```

- [ ] **Step 2:** Logik: Fragen werden sequentiell gerendert, am Ende Score → Level-Lookup + Empfehlung für nächsten Schritt.
- [ ] **Step 3:** Browser-Test, Commit `feat(explainer): d skill-ladder selbsttest`.

### Task 7.5: Explainer E — Phasen-Timeline

**Files:** Create: `claude-praesentation/explainer/e-phasen.html`

- [ ] **Step 1:** Horizontale Timeline mit 5 Phasen (2022/2023/2024/2025/heute). Klick auf eine Phase öffnet ein Detail-Panel mit Beispiel-Prompt für diese Phase und kurzer Erklärung der neuen Fähigkeit. „Wer heute einsteigt, springt direkt in Phase 5" als Schlusspointe unten.
- [ ] **Step 2:** Logik: einfacher Click-Handler mit Show/Hide.
- [ ] **Step 3:** Commit `feat(explainer): e phasen timeline`.

### Task 7.6: Explainer F — Bund Erlaubt/Verboten

**Files:** Create: `claude-praesentation/explainer/f-bund-erlaubt.html`

- [ ] **Step 1:** Liste von ~10 generischen Aufgaben (Beispiel: „Internen Sitzungsbericht zusammenfassen", „Externes Schreiben formulieren", „Strukturierungshilfe für ein Konzept", „Personendaten verarbeiten", „Bilder für Präsentation generieren", „Klassifizierte Information analysieren"). Jede Aufgabe hat Ampel grün/gelb/rot + Begründung. Filter-Toggles oben: „Nur erlaubt zeigen" / „Nur verboten zeigen".
- [ ] **Step 2:** Logik: Filter-Buttons schalten Sichtbarkeit der Listenelemente.
- [ ] **Step 3:** Commit `feat(explainer): f bund erlaubt/verboten`.

### Task 7.7: Explainer G — Modellwahl-Decision-Tree

**Files:** Create: `claude-praesentation/explainer/g-modellwahl.html`

- [ ] **Step 1:** Zwei Fragen sequentiell: „Wie wichtig ist Geschwindigkeit (langsam OK / mittel / sehr schnell)?" → „Wie komplex ist die Aufgabe (einfach / mittel / sehr komplex)?". Antwortmatrix mappt auf Haiku / Sonnet / Opus mit Begründung.

```javascript
const MATRIX = {
  'schnell-einfach': { model: 'Haiku', reason: 'Schnellste Antworten, günstigster Preis. Ideal für Zusammenfassungen und einfache Abfragen.' },
  'mittel-mittel': { model: 'Sonnet', reason: 'Bester Kompromiss aus Qualität und Tempo. Standard für die meisten Aufgaben.' },
  'langsam-komplex': { model: 'Opus', reason: 'Höchste Intelligenz. Für anspruchsvolle Analysen, Forschung, mehrstufige Aufgaben.' },
  // ... alle Kombinationen
};
```

- [ ] **Step 2:** Logik: Frage 1 → Klick auf Antwort blendet Frage 2 ein → Klick auf Antwort 2 zeigt Empfehlung.
- [ ] **Step 3:** Commit `feat(explainer): g modellwahl decision tree`.

## Phase 8 — Verifikation

### Task 8.1: Cross-Browser-Smoke-Test

- [ ] **Step 1:** `index.html` in Chrome, Firefox und Safari öffnen.
- [ ] **Step 2:** Pro Browser eine vollständige Durchklick-Runde:
  - Slide-Modus mit Pfeiltasten durch alle Folien
  - Wechsel auf Lesen-Modus, TOC klickbar, Scroll-Spy markiert
  - Theme-Toggle hell/dunkel — kein Stilbruch
  - LLM-Toggle an, alle Tabs durchklicken, Sync funktioniert über Folien
  - Übungs-Toggle an, eine Reflexion ausfüllen, ein Quiz beantworten, einen Prompt kopieren
  - `meine-notizen.html` öffnen, Markdown herunterladen — Datei valide
  - Alle 7 Explainer einzeln öffnen, je eine Interaktion testen
- [ ] **Step 3:** Bei jedem Fehler: Issue notieren, fixen oder als Risiko festhalten.
- [ ] **Step 4:** Console-Errors-Liste: muss leer sein.
- [ ] **Step 5:** Commit etwaiger Fixes `fix: cross-browser smoke fixes`.

### Task 8.2: Dark-Mode-QA-Pass

- [ ] **Step 1:** Theme manuell auf Dunkel setzen.
- [ ] **Step 2:** Durch alle Folien klicken — Kontrast prüfen (Text ≥ 4.5:1 gegen Hintergrund, geprüft via Browser-DevTools Contrast-Checker).
- [ ] **Step 3:** Alle Explainer im Dark-Mode prüfen.
- [ ] **Step 4:** Spezielle Aufmerksamkeit: Coral-Akzent muss auch in Dunkel lesbar bleiben (Hell-Coral `#e8a07c` ist hier eingestellt). Progressbars, Choice-Buttons, Code-Blöcke checken.
- [ ] **Step 5:** Bei Issues: `tokens.css` justieren, Commit `fix: dark-mode kontrast-justierungen`.

### Task 8.3: LocalStorage-Persistenz-Test

- [ ] **Step 1:** Eine Reflexion ausfüllen, zwei Quiz beantworten, Theme auf dunkel stellen, LLM-Tabs aktivieren.
- [ ] **Step 2:** Browser komplett neu starten, `index.html` öffnen.
- [ ] **Step 3:** Erwartet: alle Modi-Toggles im selben Zustand, Reflexion noch da, Quiz-Versuche persistent.
- [ ] **Step 4:** `meine-notizen.html` öffnen — Notiz noch da, Counter korrekt.
- [ ] **Step 5:** Markdown-Export laden, Inhalt prüfen, Notiz löschen — verifizieren dass sie auch in `index.html` weg ist.

### Task 8.4: Standalone-Test der Concept-Explainer

- [ ] **Step 1:** Pro Explainer: Datei + `tokens.css` + `app.css` + nötige `lib/`-Module in leeres Verzeichnis kopieren.
- [ ] **Step 2:** Datei dort öffnen — muss ohne weitere Dateien funktionieren.
- [ ] **Step 3:** Erwartet: keine 404-Errors in der Konsole, alle Interaktionen funktional.
- [ ] **Step 4:** Falls ein Explainer Dateien außerhalb seines Scopes braucht, refactorn — er muss selbsttragend sein.

### Task 8.5: Probe-Schulung mit Test-Personen (optional, nice-to-have)

- [ ] **Step 1:** Eine Test-Session mit drei Personen unterschiedlicher AI-Affinität (Claude-Nutzer, ChatGPT-Nutzer, Neuling).
- [ ] **Step 2:** Sessions strukturiert: 20 Min Selbststudium der v2-Version, 10 Min Feedback.
- [ ] **Step 3:** Show-Stopper notieren, in Issue-Liste übernehmen.
- [ ] **Step 4:** Bei substanziellen Mängeln: Issue-fokussierte zusätzliche Tasks ableiten, ggf. Plan-Update.

---

## Self-Review (durchgeführt)

**Spec-Coverage:** Alle 11 Abschnitte des Specs sind durch Tasks abgedeckt — Architektur (Phase 0–3), visuelles System (Phase 1), Inhalt v1 (Phase 4), v2-Modi (Phase 5), Schlüssel-Visualisierungen (Phase 4 für Hauptfolie Context, Phase 7 für Explainer), Übungen (Phase 5), Tech-Stack (Phase 0), Verifikation (Phase 8).

**Placeholders:** Im Phase-3-bis-8-Bereich sind einige Tasks (4.1–4.3, 4.5–4.7, 7.2–7.7) bewusst weniger ausführlich als 4.4 und 7.1 — dort werden Patterns/Beispiele angegeben statt vollständigem Code, weil die Tasks im Wesentlichen Markup-Wiederholungen sind und der Engineer das Pattern aus den ausführlichen Beispielen extrapolieren kann. Keine echten „TBD"/„TODO"-Marker.

**Konsistenz:** Methoden-Signaturen sind konsistent (`Storage.set/get/remove/keysWithPrefix`, `ModeManager.get/set/toggle/on`, `Exercises.saveReflection/getReflection/deleteReflection/countReflections/allReflections/recordQuizAttempt/getQuizAttempts`, `renderNotesMarkdown/downloadMarkdown`, `icon/ICONS`). Storage-Keys-Namespace `srege-praesentation-v1.*` einheitlich. Theme-Werte `auto|light|dark` einheitlich.

**Ambiguität:** Wo die Spec offene Punkte hatte (z.B. konkrete Übungstexte, Coral-Wert), wird im Plan auf Spec-Verweise gesetzt (§6.4) oder Default-Werte genutzt — keine versteckten Annahmen.

---

## Hinweis zu Plan-Granularität

Tasks 4.1–4.3, 4.5–4.7 und 7.2–7.7 sind absichtlich knapper gehalten als 4.4 und 7.1. Begründung: Sie folgen wiederkehrenden Markup-Mustern, die in den ausführlichen Tasks demonstriert wurden. Wenn beim Implementieren ein Pattern doch unklar wird, sollte der Engineer den ausführlichen Task als Schablone nutzen oder den Plan ergänzen.

Bei Bedarf kann ich jeden dieser Tasks vor der Implementation einzeln auf das Detailniveau von 4.4 und 7.1 anheben — sag Bescheid.

