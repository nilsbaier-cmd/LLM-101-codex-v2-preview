# LLM-101 · Codex Redesign — Design-Spezifikation

**Version:** 1.2
**Stand:** 2026-05-16
**Branch:** `redesign/codex-v2`
**Status:** Draft — bereit für Subagent-Implementation

**v1.2 Changelog (gegenüber v1.1):**
- §3.2: Attribut-Namen an Realität angepasst — Slide nutzt `data-slide-id` (nicht `data-slide`); `id` ist gleich `data-slide-id` (nicht `slide-{id}`-prefixed); Hash-Format ist `#{slideId}` (nicht `#slide-{slideId}`).
- §6.3: Footer-Navigation-`href` auf echtes Hash-Format korrigiert.
- §11-D1/D2/D3: alle Folien-Tabellen anhand `grep`-verifizierter Realität neu geschrieben — interaktive Komponenten korrekt zugeordnet (`[data-prompt-product]` auf usecase-4, `[data-context-xray]` auf usecase-5), Quiz-Annahme entfernt (existieren als Markup nicht, nur Reflexionsboxen).
- §3.2: `data-stepped` Slides dokumentiert (einstieg-2, einstieg-3, verwaltung-1, verwaltung-2, next-2, next-3).

**v1.1 Changelog (gegenüber v1.0):**
- §4.1: Sprite ist bereits als `docs/codex-sprite.svg` im Repo; Paket A kopiert nur.
- §4.3: `.ic`-Helper-Class explizit Paket B zugeordnet.
- §4.5 (NEU): `renderIcon()` API-Vertrag mit JSDoc.
- §2.1.2: `--bg-card` Dark fest auf `#1a1a1d`.
- §11-D: aufgeteilt in D1 (Slides 01–11) + D2 (Slides 12–22) + D3 (Slides 23–30) mit harten Folien-Listen.
- §11-H: Acceptance-Checkliste mit 10 konkreten Prüfpunkten + `docs/codex-release-qa.md` als Deliverable.
- §11.X: Merge-Strategie für D1/D2/D3 explizit.

---

## 0. Wie diese Spec gelesen wird

Dieses Dokument ist die **alleinige Quelle der Wahrheit** für das Codex-Redesign. Jeder Subagent erhält die Spec plus ein konkretes **Paket** (siehe §11). Subagents sollen **keine Annahmen** treffen, die nicht hier dokumentiert sind — wenn etwas fehlt, soll der Subagent in seinem Bericht eine **„Open Decision"** ausweisen, statt selbständig eine Richtung zu wählen.

Konventionen:

- **MUST / SHOULD / MAY** im RFC-2119-Sinn.
- CSS-Variablen-Namen: `--name` exakt wie geschrieben.
- Selektoren in `code`-Spans, neue Selektoren mit `*` markiert.
- Dateipfade sind **relativ zum Repo-Root** (`/tmp/LLM-101` bzw. `LLM-101/`).
- „Codex-DNA" verweist auf das verabschiedete Mockup unter `Resources/design-mockups/variant-codex-v2.html` (im Workstation-Vault, nicht im Repo).

---

## 1. Übersicht & Ziele

### 1.1 Was wird redesignt

- Alle 30 Folien in `index.html` (7 Kapitel).
- Die 7 Explainer-Seiten in `explainer/*.html`.
- Die Utility-Seiten: `handout.html`, `meine-notizen.html`, `trainer-export.html`, `quellen-refresh.html`, `style-preview.html`.
- Der globale Header (`.app-header`) inkl. Toolbar.
- Die Side-Panels (Lernpfad-Panel, Trainer-Panel).
- Print-Layout (`print.css`).

### 1.2 Was bleibt unverändert (funktional)

- LocalStorage-Namespace `llm-101-v1.*` und alle Keys.
- Mode-System (Layout, Theme, LLM-Tabs, Exercises) — DOM-Anker und Events bleiben kompatibel.
- Hash-Routing (`#slide-{slideId}`).
- Lernpfad-Datenstrukturen in `lib/learning-paths.js` (Pfade, Trainer-Varianten).
- Service Worker (`sw.js`) — nur Cache-Version-Bump.
- Test-Verhalten: alle 27 Tests MUSS grün bleiben (Selektoren ggf. anpassen, Verhalten nicht).

### 1.3 Migration vs. Re-Build

**Migration**, kein Re-Build. Existierende Klassen-Namen bleiben dort wo möglich, neue Klassen werden **additiv** ergänzt. Token-Werte werden in `tokens.css` ersetzt — die Variablen-Namen bleiben gleich, damit verteilte Verwendungen weiterfunktionieren.

### 1.4 Leitlinien (verabschiedet)

1. **Form erklärt Inhalt** — Token-Pillen, Manuskript-DNA, Lernpfad-Fortschritt sichtbar im Footer.
2. **Fokus auf Kerninhalt** — Titel (Kicker+Lede) in einer Zeile, kein Trainer-Margin im Slide.
3. **Globale Toolbar bleibt global** — kein Dupliziieren der Schulungs-Controls pro Folie. Pro-Slide-Header zeigt nur Crumb + Stand-Stamp.
4. **Icons als Bedeutungsträger** — konsistent für Kapitel-Anker, Status, Token-Typen, Navigation.
5. **Konsistente Acid+Cobalt-Akzentlogik** — Acid für aktiv/hervorgehoben, Cobalt für Verweise/Cites, Crimson für Warnungen, Mint für Erfolg/Done.

---

## 2. Design-Tokens

### 2.1 Farb-Palette

In `tokens.css` ersetzen. Variablen-Namen bleiben **rückwärtskompatibel**, Werte werden migriert.

#### 2.1.1 Light (`:root`)

| Variable | Wert | Verwendung |
|---|---|---|
| `--bg-base` | `#fafaf6` | Body / Paper-Hintergrund |
| `--bg-card` | `#ffffff` | Card-Fläche (war white, bleibt) |
| `--bg-tint` | `#f3f2ec` | Header-Strip, Footer-Strip, Toolbar-Hover |
| `--border` | `#0a0a0c1c` | Standard-Trennlinie (subtle) |
| `--border-soft` * | `#0a0a0c10` | Sehr leichte Trennung |
| `--text-primary` | `#0a0a0c` | Haupttext, Headlines |
| `--text-secondary` | `#44464b` | Body-Text, Beschreibungen |
| `--text-tertiary` | `#8c8e96` | Labels, Mute, Hint |
| `--accent` | `#c5e818` | **NEU: Acid-Lime** (war `#cc785c` Clay) |
| `--accent-soft` | `#d4f52640` | Glow / Token-Background |
| `--accent-strong` | `#758c00` | Acid-Deep (Text auf hell) |
| `--cobalt` * | `#1f3df0` | Cites, Links, Verweise |
| `--cobalt-soft` * | `#1f3df012` | Cobalt-Background |
| `--crimson` * | `#c4304a` | Errata, Warn (Headline-Level) |
| `--signal` * | `#16a674` | Done/Published/OK |
| `--warn` * | `#d68410` | Prüfen/Caution |
| `--success` | `#16a674` | Map auf `--signal` (war `#5fb37e`) |
| `--success-soft` | `#16a67414` | (entsprechend) |

#### 2.1.2 Dark (`:root[data-theme="dark"]` + `@media (prefers-color-scheme: dark)`)

| Variable | Wert |
|---|---|
| `--bg-base` | `#0c0c0e` |
| `--bg-card` | `#1a1a1d` |
| `--bg-tint` | `#131316` |
| `--border` | `#f0eee61c` |
| `--border-soft` | `#f0eee610` |
| `--text-primary` | `#f0eee6` |
| `--text-secondary` | `#b4b4ba` |
| `--text-tertiary` | `#6e6e76` |
| `--accent` | `#d4f526` |
| `--accent-soft` | `#d4f5263a` |
| `--accent-strong` | `#b8d800` |
| `--cobalt` | `#7f95ff` |
| `--cobalt-soft` | `#7f95ff18` |
| `--crimson` | `#e8627c` |
| `--signal` | `#56d6a8` |
| `--warn` | `#f0b54a` |

**Auto-Theme:** Wenn `data-theme` weder `light` noch `dark` ist, MUSS `@media (prefers-color-scheme)` greifen.

### 2.2 Typografie

- **Sans:** `Hanken Grotesk` (bleibt). Self-hosted aus `assets/fonts/`.
- **Mono:** `JetBrains Mono` (bleibt). Self-hosted.
- **Font-Feature-Settings:** `"ss01" 1, "cv11" 1` — alternate-letters für Hanken (sieht moderner aus).

Skalen (in `tokens.css` als CSS-Variablen — **NEU**):

| Variable | Wert | Verwendung |
|---|---|---|
| `--fs-display` * | `clamp(48px, 6.4vw, 96px)` | Cover h1 |
| `--fs-lede` * | `clamp(22px, 2.4vw, 32px)` | Slide-Lede (war 64px) |
| `--fs-h3` * | `clamp(20px, 2.2vw, 28px)` | Card-Headlines |
| `--fs-body` * | `clamp(15px, 1.3vw, 17px)` | Body-Text |
| `--fs-small` * | `12px` | Caption |
| `--fs-mono-label` * | `11px` | Kicker, Mono-Labels |
| `--fs-mono-tiny` * | `10px` | Footer-Meta |

Tracking:

- Display: `-0.035em`
- Lede: `-0.02em`
- Body: `0`
- Mono-Labels: `0.22em` (uppercase)
- Mono-Tiny: `0.14em`

### 2.3 Spacing (bleibt)

`--space-1` (4) bis `--space-7` (44) — unverändert.

### 2.4 Radius

**WICHTIG:** Codex-DNA verlangt zurückhaltendere Radien als das Original. Migration:

| Variable | Alt | Neu |
|---|---|---|
| `--radius-sm` | 4 | **2** |
| `--radius-md` | 6 | **3** |
| `--radius-lg` | 10 | **6** |
| `--radius-xl` | 14 | **10** |

Token-Pillen behalten `999px` (vollrund).

### 2.5 Schatten

| Variable | Light | Dark |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | `0 1px 2px rgba(0,0,0,0.3)` |
| `--shadow-md` | `0 1px 3px rgba(0,0,0,0.06), 0 4px 14px rgba(0,0,0,0.05)` | `0 1px 3px rgba(0,0,0,0.4), 0 4px 14px rgba(0,0,0,0.3)` |
| `--shadow-page` * | `0 1px 0 rgba(0,0,0,0.04), 0 24px 70px rgba(0,0,0,0.08)` | `0 1px 0 rgba(0,0,0,0.5), 0 24px 70px rgba(0,0,0,0.5)` |

### 2.6 Motion

| Variable | Wert |
|---|---|
| `--duration-fast` * | `120ms` |
| `--duration-base` * | `200ms` |
| `--duration-slow` * | `320ms` |
| `--ease-out` * | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| `--ease-in-out` * | `cubic-bezier(0.65, 0, 0.35, 1)` |

`@media (prefers-reduced-motion: reduce)` MUSS alle Animationen auf `0.01ms` reduzieren.

---

## 3. Komponenten-Inventar

Jede Komponente ist als **Mini-Spec** dokumentiert: HTML-Struktur, CSS-Klassen, Variants, Acceptance Criteria.

### 3.1 Global Header (`.app-header`)

**Datei:** `app.css` (existierende Klasse, wird visuell überarbeitet)

**Struktur (Markup im `index.html`):**

```html
<header class="app-header" role="banner">
  <div class="app-brand">
    <span class="app-brand-id">LLM-101</span>
    <span class="app-brand-meta">Run · Edition · Status</span>
  </div>
  <nav class="app-toggles" aria-label="Schulungs-Steuerung">
    <!-- Layout group -->
    <div class="toggle-group">
      <button class="toggle" data-mode="layout" data-value="slide" aria-pressed="true">Vortrag</button>
      <button class="toggle" data-mode="layout" data-value="scroll">Lesen</button>
    </div>
    <span class="toggle-divider" aria-hidden="true"></span>
    <!-- Theme group -->
    <div class="toggle-group">
      <button class="toggle toggle-icon" data-mode="theme" data-value="light" aria-label="Light"><svg class="ic"><use href="#i-sun"/></svg></button>
      <button class="toggle toggle-icon" data-mode="theme" data-value="dark" aria-label="Dark"><svg class="ic"><use href="#i-moon"/></svg></button>
      <button class="toggle" data-mode="theme" data-value="auto">Auto</button>
    </div>
    <span class="toggle-divider" aria-hidden="true"></span>
    <!-- Content groups -->
    <div class="toggle-group">
      <button class="toggle" data-mode="llm" data-toggle aria-pressed="false">LLM-Tabs</button>
      <button class="toggle" data-mode="exercises" data-toggle aria-pressed="false">Übungen</button>
    </div>
    <span class="toggle-divider" aria-hidden="true"></span>
    <!-- Utilities -->
    <div class="toggle-group">
      <button class="toggle utility-toggle" id="path-toggle" aria-expanded="false" aria-controls="path-panel">Lernpfad</button>
      <button class="toggle utility-toggle trainer-only" id="trainer-toggle" aria-expanded="false" aria-controls="trainer-panel">Cockpit</button>
    </div>
  </nav>
</header>
```

**Visuell:**

- Position: sticky top, `z-index: 50`, `padding: 12px clamp(20px, 4vw, 56px)`.
- Background: `color-mix(in srgb, var(--bg-base) 90%, transparent)` + `backdrop-filter: blur(20px)`.
- Border-bottom: `1px solid var(--border)`.
- `.app-brand-id` MUSS als „mono-badge" gerendert werden: `background: var(--text-primary); color: var(--bg-base); padding: 5px 9px; border-radius: 3px;`. Vor dem Text steht `▸ ` in `--accent`.
- `.toggle` Default: `font-family: var(--font-sans); font-size: 13px; font-weight: 500; color: var(--text-secondary); padding: 6px 12px; border-radius: 6px; border: 1px solid transparent; background: transparent;`.
- `.toggle:hover`: `color: var(--text-primary); background: var(--bg-card); border-color: var(--border);`.
- `.toggle[aria-pressed="true"]`, `.toggle.is-active`, und themen-spezifische Active-States (`[data-theme="light"] .toggle[data-mode="theme"][data-value="light"]` etc.):
  - `background: var(--accent-soft); border-color: color-mix(in srgb, var(--accent) 60%, transparent); color: var(--text-primary); font-weight: 600;`
- `.toggle-icon`: `padding: 6px 8px`. SVG `width: 15px; height: 15px;`.
- `.toggle-divider`: `display: inline-block; width: 1px; height: 18px; background: var(--border); margin: 0 8px;`.

**Acceptance Criteria:**

- `tests/mode.test.js` weiterhin grün.
- `tests/accessibility.test.js` weiterhin grün (`aria-pressed`, `aria-label`, `aria-expanded`).
- Theme-Active-State sichtbar pro selected value.
- Mobile (`< 720px`): Toolbar wrappt unter die `.app-brand`, einzeilig oder mehrzeilig — keine horizontale Scroll-Bar.

### 3.2 Slide-Frame (`.slide`)

**Datei:** `presentation.css`.

**Marker-Klasse (MUST, entschieden in Paket C):** Der Codex-Slide-Frame ist an `.slide.codex` gebunden, NICHT an `.slide` allein. Hintergrund: in `redesign/codex-v2` koexistieren während der schrittweisen Migration alte (`<section class="slide">`) und neue Codex-Slides — der `.codex`-Modifier verhindert, dass noch nicht migrierte Slides versehentlich vom neuen Frame-CSS getroffen werden. Paket D1/D2/D3 MUSS bei jeder migrierten Slide `class="slide codex"` setzen.

**Struktur:**

```html
<section class="slide codex"
         id="{slideId}"
         data-slide-id="{slideId}"
         data-chapter="{chapter}"
         data-folio="{NN}"
         data-stepped
         data-volatile="true"
         data-checked="2026-05-16">
  <div class="slide-head">
    <div class="slide-crumb">
      <span class="slide-crumb-icon"><svg class="ic lg"><use href="#i-{chapterIcon}"/></svg></span>
      <span class="slide-crumb-chap">{Kapitel-Name}</span>
      <span class="slide-crumb-sep"><svg class="ic sm"><use href="#i-chevron-right"/></svg></span>
      <span class="slide-crumb-topic">{Unterthema}</span>
    </div>
    <!-- Stable: bookmark-Icon, nur Datum -->
    <span class="slide-stand">
      <svg class="ic sm"><use href="#i-bookmark"/></svg>
      Stand 16.05.26
    </span>
    <!-- Volatile-Variante (data-volatile="true" auf Slide): warn-Icon + " · zu prüfen" -->
    <span class="slide-stand" data-volatile="true">
      <svg class="ic sm"><use href="#i-alert-triangle"/></svg>
      Stand 16.05.26 · zu prüfen
    </span>
  </div>
  <div class="slide-body">
    {Inhalt}
  </div>
  <div class="slide-foot">
    <a class="slide-nav prev" href="#{prevSlideId}">
      <svg class="ic"><use href="#i-arrow-left"/></svg> zurück
    </a>
    <div class="slide-progress">
      <span class="slide-folio"><svg class="ic"><use href="#i-bookmark"/></svg> Folie <b>{NN} / 30</b></span>
      <span class="slide-progress-sep" aria-hidden="true"></span>
      <span class="slide-path"><svg class="ic"><use href="#i-route"/></svg> Lernpfad <b>{Pfad-Name}</b></span>
      <span class="slide-progress-sep" aria-hidden="true"></span>
      <span class="slide-step">
        <span class="path-dots" aria-hidden="true"><i class="done"></i><i class="here"></i><i></i><i></i></span>
        Schritt <b>{n} von {m}</b>
      </span>
    </div>
    <a class="slide-nav next" href="#{nextSlideId}">
      weiter <svg class="ic"><use href="#i-arrow-right"/></svg>
    </a>
  </div>
</section>
```

**Attribut-Konventionen (MUST):**

- `data-slide-id="{slideId}"` — der **echte** Identifier (z.B. `einstieg-1`, `usecase-4`). Verifizierbar in `tests/*` (z.B. `tests/prompt-product.test.js` queryt `[data-slide-id="usecase-4"]`).
- `id="{slideId}"` — gleicher Wert wie `data-slide-id`, KEIN `slide-`-Prefix. `app.js` setzt diesen automatisch falls leer (Zeile 695: `if (s.dataset.slideId && !s.id) s.id = s.dataset.slideId;`).
- Hash-Routing: `#einstieg-1`, NICHT `#slide-einstieg-1`.
- `data-chapter`: existiert bereits, bleibt.
- `data-folio="NN"`: **NEU** — zweistellige Folio-Nr (01–30) manuell gepflegt, deterministisch.
- `data-stepped`: existiert auf den 6 stepped Folien (einstieg-2, einstieg-3, verwaltung-1, verwaltung-2, next-2, next-3) — MUSS erhalten bleiben.
- `data-volatile="true"` + `data-checked="2026-05-16"`: existiert auf 5 Folien (verwaltung-1, verwaltung-2, claude-1, claude-5, next-3) — MUSS erhalten bleiben.

**Visuell:**

- `.slide`: `background: var(--bg-card); border: 1px solid var(--border); box-shadow: var(--shadow-page); border-radius: var(--radius-md);` (3px — bewusst kantig). In `[data-layout="slide"]`: `aspect-ratio: 16/9; min-height: 620px;` mit `display: grid; grid-template-rows: auto 1fr auto;`. In `[data-layout="scroll"]`: kein aspect-ratio, natural-flow.
- `.slide-head`: `display: grid; grid-template-columns: 1fr auto; align-items: center; padding: 16px clamp(28px, 3.4vw, 48px); border-bottom: 1px solid var(--border); background: var(--bg-tint);`.
- `.slide-crumb-icon`: 32×32 grid-cell, `border: 1px solid var(--border); border-radius: 6px; background: var(--bg-card);`.
- `.slide-crumb-chap`: `font-family: var(--font-mono); font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: var(--text-secondary);`.
- `.slide-crumb-topic`: `font-size: 16px; font-weight: 700; letter-spacing: -0.012em; color: var(--text-primary);`.
- `.slide-stand`: `padding: 5px 10px; border: 1px solid var(--border); background: var(--bg-card); font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-secondary);`. **Volatile-Variante:** Wenn das umgebende `<section class="slide codex">` das Attribut `data-volatile="true"` trägt, MUSS der zugehörige `.slide-stand` auch `data-volatile="true"` bekommen. CSS-Effekt: `box-shadow: inset 0 0 0 1px var(--warn);`. Inhalt der Volatile-Variante: Warn-Icon (`#i-alert-triangle`) statt Bookmark + Suffix `" · zu prüfen"` hinter dem Datum. Wording-Festlegung des Trainers — kein anderes Wording verwenden.
- `.slide-body`: `padding: clamp(32px, 4.4vw, 64px) clamp(36px, 4.4vw, 72px); display: flex; flex-direction: column; gap: 24px;`.
- `.slide-foot`: `display: grid; grid-template-columns: auto 1fr auto; gap: 24px; padding: 12px clamp(28px, 3vw, 48px); border-top: 1px solid var(--border); background: var(--bg-tint);`.
- `.slide-nav`: `display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-primary); font-family: var(--font-mono); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; border-radius: 3px;`. Hover: `border-color: var(--text-primary);`.
- `.slide-progress`: justified center, `font-family: var(--font-mono); font-size: 11px; color: var(--text-tertiary); display: flex; align-items: center; gap: 22px; flex-wrap: wrap;`.
- `.path-dots i`: `width: 16px; height: 4px; border-radius: 2px; background: var(--border);`. `.done`: `background: var(--signal);`. `.here`: `background: var(--accent); box-shadow: 0 0 0 2px var(--accent-soft);`.

**Chapter-Icon-Mapping:**

| Chapter-Slug | Icon | Lable |
|---|---|---|
| `einstieg` | `i-bookmark` | Einstieg |
| `verwaltung` | `i-shield-check` | Verwaltung & KI |
| `claude` | `i-message-square` | LLM-Tools 101 |
| `context` | `i-eye` | Kontext & Pflege |
| `usecases` | `i-sparkles` | Use Cases & Prompt-Labor |
| `skills` | `i-layers` | Skills & Vertiefung |
| `next-level` | `i-route` | Transfer & Next Level |

### 3.3 Title-Row (`.title-row`) — NEU

**Verwendung:** In jeder Inhaltsfolie als oberster Block im `.slide-body` (außer Cover).

**Struktur:**

```html
<div class="title-row">
  <span class="kicker"><svg class="ic sm"><use href="#i-{topicIcon}"/></svg> {Eyebrow}</span>
  <h2 class="lede">{Headline} <em>{italic-highlight}</em></h2>
</div>
```

**CSS:**

```css
.title-row {
  display: grid;
  grid-template-columns: minmax(0, auto) 1fr;
  gap: clamp(20px, 3vw, 40px);
  align-items: baseline;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}
.title-row .kicker {
  font-family: var(--font-mono);
  font-size: var(--fs-mono-label);
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  display: inline-flex; align-items: center; gap: 8px;
  white-space: nowrap;
}
.title-row h2.lede {
  font-size: var(--fs-lede);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
  max-width: 36ch;
  color: var(--text-primary);
}
.title-row h2.lede em {
  font-style: italic; font-weight: 400; color: var(--text-secondary);
}
```

**Acceptance:** Kicker und Lede MUSS auf einer Baseline stehen. Lede MUSS auf Mobile (`< 720px`) unter Kicker brechen (Stack).

### 3.4 Token-Pill (`.tok`)

**Inline-Komponente** zum Hervorheben von Schlüsselbegriffen.

```html
<span class="tok"><svg class="ic"><use href="#i-zap"/></svg>Begriff</span>
<span class="tok tok-cobalt"><svg class="ic"><use href="#i-bookmark"/></svg>Verweis</span>
<span class="tok tok-warn"><svg class="ic"><use href="#i-alert-triangle"/></svg>Tabu</span>
```

**CSS:** wie im Mockup. Varianten via Modifier (`.tok-cobalt`, `.tok-warn`).

**Acceptance:** Hover hebt Background auf `var(--accent)` (oder entsprechend bei Modifier). Icon MUSS inside dem Padding sitzen, Gap 4px.

### 3.5 Cover-Komponente (`.slide.codex.cover`)

**Hinweis (Paket C resolved):** Die existierende Klasse `.lead` in `presentation.css` (Skills-Section, font-size 17px) bleibt unangetastet. Der Cover-Lead-Paragraph nutzt stattdessen `.cover-lead` (clamp 18px–23px). Bei der Slide-Migration MUSS für den Cover-Lead `<p class="cover-lead">` verwendet werden, NICHT `<p class="lead">`.

**Cover-Colophon-Pattern (revidiert nach User-Review):** Drei generische Felder, keine Mockup-Seal:

```html
<!-- Cover-Colophon: drei generische Felder, pro Kurs anpassen -->
<div class="cover-colophon">
  <div><svg class="ic"><use href="#i-bookmark"/></svg><b>Nils Baier</b><span>Trainer</span></div>
  <div><svg class="ic"><use href="#i-shield-check"/></svg><b>[Team]</b><span>[Organisation]</span></div>
  <div><svg class="ic"><use href="#i-bookmark"/></svg><b>16.05.2026</b><span>Kursdatum</span></div>
</div>
```

- **Kein `.cover-seal`** (entfernt — war Mockup-Dekoration ohne funktionalen Wert).
- **`.cover-colophon` ist 3-spaltig** (`grid-template-columns: repeat(3, auto) 1fr` mit füllendem letzten Track).
- Inhalte sind Platzhalter im Master. Pro Kurs editiert der Trainer drei Werte:
  - Spalte 1: Trainer-Name (Vor- + Nachname)
  - Spalte 2: Team (oben) + Organisation/Behörde (unten)
  - Spalte 3: Kursdatum (oben) + Label „Kursdatum" (unten)
- HTML-Kommentar `<!-- Cover-Colophon: drei generische Felder, pro Kurs anpassen -->` direkt vor dem Block MUSS erhalten bleiben, damit der Bearbeitungs-Hotspot auffindbar bleibt.

**Sonderfall.** Statt `.title-row` → `.cover-display`.

```html
<section class="slide codex cover" id="einstieg-1" data-slide-id="einstieg-1" data-chapter="einstieg" data-folio="01">
  <div class="slide-head">...</div>
  <div class="slide-body">
    <span class="kicker kicker-accent"><svg class="ic sm"><use href="#i-sparkles"/></svg> {Eyebrow}</span>
    <h1 class="display">
      {Titel} <em>{italic-highlight}</em><span class="caret" aria-hidden="true"></span>
    </h1>
    <p class="cover-lead">{Lead-Paragraph mit <span class="tok">Tokens</span>}</p>
    <!-- Cover-Colophon: drei generische Felder, pro Kurs anpassen -->
    <div class="cover-colophon">
      <div><svg class="ic"><use href="#i-bookmark"/></svg><b>Nils Baier</b><span>Trainer</span></div>
      <div><svg class="ic"><use href="#i-shield-check"/></svg><b>[Team]</b><span>[Organisation]</span></div>
      <div><svg class="ic"><use href="#i-bookmark"/></svg><b>16.05.2026</b><span>Kursdatum</span></div>
    </div>
  </div>
  <div class="slide-foot">...</div>
</section>
```

**CSS:** `h1.display` mit `var(--fs-display)`, `font-weight: 800; letter-spacing: -0.035em; line-height: 0.92;`. `.caret`: 0.5em × 0.85em, `background: var(--accent)`, `animation: blink 1.05s steps(2) infinite;`. Bei `prefers-reduced-motion`: animation off, opacity 0.5.

### 3.6 Existierende Komponenten — Migration

Diese Klassen existieren bereits in `presentation.css`. Sie werden **visuell** auf Codex umgestellt; HTML-Struktur und JS bleiben kompatibel.

| Klasse | Wo verwendet | Migration |
|---|---|---|
| `.timeline` | einstieg-2 (5 Phasen) | Karten als `var(--bg-tint)`-Container, jede Phase mit `i-zap`-Icon und Mono-Datum-Label. Linie zwischen Karten via `::before` mit `linear-gradient(90deg, var(--signal), var(--accent), var(--cobalt))`. |
| `.ladder-list` | einstieg-3, skill-ladder | Migrate zu Codex-Ledger-Layout (siehe v2-Mockup Slide 5: 5-Spalten-Tabelle mit Status-Pills). |
| `.phase-card` | data-stepped | `border: 1px solid var(--border); border-radius: var(--radius-md);`. Active-State (`data-step="N"` aktiv): `border-left: 3px solid var(--accent); background: var(--accent-soft);`. |
| `.policy-card` | verwaltung-1, verwaltung-2 | Migrate zu `.ampel-card`-Logik aus v2-Mockup: 3 Karten OK/Warn/Stop mit Pill-Status (siehe §3.7). |
| `.context-xray` | context-2 | Migrate zu „Conversation-Tape"-Layout aus v2-Mockup Slide 3 (Zeilennummern, Token-Pills, dropped tokens). |
| `.cover-stage` | einstieg-1 | Wird zur `.cover-display` (siehe §3.5). |
| `.icon-cloud`, `.icon-cloud-item` | mehrere | Visuell als Token-Pill-Cluster (`.tok`) statt fly-in. Animationen entfernen oder auf `prefers-reduced-motion`-safe machen. |
| `.agenda-list` | einstieg-4 | 2-Spalten-Grid, jede Zeile mit Chapter-Icon, Folio-Range, Kapitel-Titel, geschätzter Dauer. |
| `.ladder-item` | mehrere | Migrate zu `.ledger .row` aus Mockup. |
| `.before-after-grid` | usecase-* | 2-Spalten-Compare-Layout wie `.compare` aus v2-Mockup Slide 2. |
| `.case-library-grid` | usecase-* | 3-Spalten-Karten-Grid mit Codex-Card-Styling. |
| `[data-prompt-product]` | usecase-lab | Headline + 2-Spalten-Compare, Output-Box mit Mono-Font und `.tok`-Highlighting. |
| `[data-context-xray]` | context-2 | Siehe `.context .convo` aus v2-Mockup. |
| `[data-llm-tabs]` / `.llm-tabs-nav` | mehrere | Tab-Nav als Codex-Pills: aktive Tab `background: var(--accent-soft); border-color: var(--accent);`. Tab-Content in `.tab-panel`-Container mit `border: 1px solid var(--border); border-radius: var(--radius-md);`. |
| `[data-exercise]` / `.ex-reflection-prompt` | mehrere | Eigene Komponente „Übungsbox" mit `border-left: 3px solid var(--cobalt); background: var(--cobalt-soft);` und Mono-Label „ÜBUNG · {Nr}". |
| `.quiz-wrapper`, `.quiz-choice` | mehrere | Choice-Buttons als Codex-Toggles, korrekt = `border-color: var(--signal); background: rgba(22,166,116,0.06);`, falsch = `border-color: var(--crimson); background: rgba(196,48,74,0.06);`. |
| `.pull-quote` | mehrere | Großes Zitat mit `border-left: 4px solid var(--accent);` und `i-quote`-Icon links oben. |

### 3.7 Status-Cards (`.status-card`) — Renamed `.policy-card`

Verwendet in Datenampel-Folien (verwaltung-1, verwaltung-2). Drei Varianten via Modifier.

```html
<article class="status-card status-ok">
  <div class="status-card-head">
    <b><svg class="ic"><use href="#i-globe"/></svg> § 1 · Öffentlich</b>
    <span class="status-pill"><svg class="ic sm"><use href="#i-check"/></svg> FREI</span>
  </div>
  <h3>{Headline}</h3>
  <div class="status-card-desc">{Beschreibung}</div>
  <ul class="status-card-list">
    <li><svg class="ic"><use href="#i-check"/></svg>{Listenpunkt}</li>
  </ul>
  <span class="status-card-cite"><svg class="ic sm"><use href="#i-bookmark"/></svg> vgl. SB021 Art. 4 (a)</span>
</article>
```

Modifier: `.status-ok` → `--signal`; `.status-warn` → `--warn`; `.status-stop` → `--crimson`. Pill-Background MUSS dem Modifier folgen.

### 3.8 Side-Panels (Lernpfad + Trainer)

**Existierende:** `.side-panel`, `.path-panel`, `.trainer-panel`.

**Migration:**

- Position: `position: fixed; right: 0; top: 0; bottom: 0; width: min(420px, 100%);`
- `background: var(--bg-card); border-left: 1px solid var(--border); box-shadow: -16px 0 60px rgba(0,0,0,0.08);`
- Header im Panel: Mono-Label oben links, Close-Button oben rechts (mit `i-x` Icon).
- Body: padding, scrollable.
- Transition: `transform 200ms var(--ease-out);` zwischen `translateX(0)` und `translateX(100%)`.
- `[aria-hidden="true"]` → `transform: translateX(100%); pointer-events: none;`

### 3.9 Footer-Callout (`.callout`) — NEU

Verwendet für Faustregel-Boxen unter Inhalt.

```html
<aside class="callout">
  <span class="callout-icon"><svg class="ic lg"><use href="#i-quote"/></svg></span>
  <p><b>Faustregel — </b>{Text}</p>
  <a class="callout-action" href="#">{CTA} <svg class="ic"><use href="#i-arrow-right"/></svg></a>
</aside>
```

CSS: `display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: center; padding: 14px 20px; background: var(--bg-tint); border: 1px solid var(--border);`.

---

## 4. Icon-Set

### 4.1 Datei

**Spec-Asset vorhanden:** `docs/codex-sprite.svg` enthält bereits alle 41 Icons als `<symbol>` (28 neu + 11 Bestands-Icons aus `lib/icons.js`). Paket A MUSS dieses File **nach `assets/icons.svg` kopieren** (oder verschieben) und nicht neu erstellen.

**Sprite-Einbindung (MUST):** Inline-Include über `lib/icons-sprite.js` (NEU). Dieses Modul wird in `app.js` möglichst früh (vor allem anderen UI) als ES-Modul importiert und fügt das Sprite-Markup als erstes Kind ins `<body>` ein:

```js
// lib/icons-sprite.js
const SPRITE_URL = new URL('../assets/icons.svg', import.meta.url);
export async function initSprite() {
  if (document.getElementById('codex-icon-sprite')) return;
  const res = await fetch(SPRITE_URL);
  const text = await res.text();
  const wrapper = document.createElement('div');
  wrapper.id = 'codex-icon-sprite';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  wrapper.innerHTML = text;
  document.body.prepend(wrapper);
}
```

Referenz im DOM: `<svg class="ic"><use href="#i-NAME"/></svg>` (relative href, weil Sprite inline ist).

### 4.1.1 Fallback ohne JS

Für `noscript`/Server-Rendering-Tests MUSS die Sprite-Datei zusätzlich per direktem `<svg><use href="assets/icons.svg#i-NAME"/></svg>` ladbar sein (gleiche IDs, gleiche viewBox). Service Worker MUSS `assets/icons.svg` in den Pre-Cache aufnehmen.

### 4.2 Icon-Liste (MUST)

Lucide-Stil, viewBox 24×24, fill="none", stroke="currentColor", stroke-width 1.6, stroke-linecap round, stroke-linejoin round.

```
i-arrow-left, i-arrow-right, i-chevron-right, i-check, i-x,
i-sun, i-moon, i-bookmark, i-book-open, i-book, i-compass, i-route,
i-shield, i-shield-check, i-sparkles, i-eye, i-layers,
i-globe, i-lock, i-alert-triangle, i-octagon, i-circle-help, i-circle-dashed,
i-edit, i-quote, i-zap, i-play, i-message-square, i-list, i-target
```

Alle SVG-Pfade sind im Mockup `Resources/design-mockups/variant-codex-v2.html` vorhanden — kopierbar.

### 4.3 Helper-Class (gehört zu Paket B)

Die Helper-Class `.ic` wird in `app.css` definiert (Teil von Paket B — Chrome). Paket A liefert Sprite und JS-Loader; Paket B macht die CSS-Helper:

```css
.ic { width: 16px; height: 16px; flex-shrink: 0; stroke: currentColor; fill: none; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; vertical-align: -3px; }
.ic.sm { width: 12px; height: 12px; vertical-align: -2px; stroke-width: 1.8; }
.ic.lg { width: 20px; height: 20px; vertical-align: -4px; }
.ic.xl { width: 28px; height: 28px; vertical-align: -6px; stroke-width: 1.4; }
```

### 4.4 Migration der existierenden `lib/icons.js`

Existierende Icons (brain, code, file-text, lightbulb, search, database, workflow, git-branch, package, play-circle, messages-square) sind **bereits im `docs/codex-sprite.svg` enthalten** und werden somit zu `assets/icons.svg` mitkopiert. Test `tests/icons.test.js` MUSS grün bleiben.

### 4.5 `renderIcon()` API-Vertrag

`lib/icons.js` exportiert weiterhin `renderIcon(name, attrs = {})`. **Vertrag (MUST):**

```js
/**
 * Rendert ein Icon als SVG-Element via Sprite-Reference.
 * @param {string} name - Symbol-Name OHNE Präfix, z.B. 'sun', 'check'.
 *                        Die Funktion fügt 'i-' selbst hinzu.
 * @param {Object} attrs - Optionale HTML-Attribute, die auf das <svg>-Element
 *                          gesetzt werden. Behandelte Keys:
 *                          - class: Default 'ic'. Wenn gegeben, wird angehängt
 *                            (NICHT überschrieben), damit '.ic' immer drin ist.
 *                          - aria-label: setzt zusätzlich role="img" auf SVG
 *                            und entfernt aria-hidden.
 *                          - title: rendert als <title>-Child für Tooltip.
 *                          - Alle anderen: direkt als Attribut auf SVG.
 *                          Wenn weder aria-label noch title gegeben: SVG bekommt
 *                          aria-hidden="true".
 * @returns {SVGElement}
 *
 * @example
 *   renderIcon('sun')
 *   // <svg class="ic" aria-hidden="true"><use href="#i-sun"/></svg>
 *
 *   renderIcon('check', { 'aria-label': 'Erledigt' })
 *   // <svg class="ic" role="img" aria-label="Erledigt"><use href="#i-check"/></svg>
 *
 *   renderIcon('zap', { class: 'ic lg' })
 *   // <svg class="ic lg" aria-hidden="true"><use href="#i-zap"/></svg>
 */
```

Wenn `name` nicht im Sprite existiert: `console.warn` + leeres `<svg>` zurückgeben (für Test-Stabilität).

---

## 5. Mode-System Integration

### 5.1 Layout (Vortrag/Lesen)

- DOM: `body[data-layout="slide"]` vs. `body[data-layout="scroll"]`.
- Slide-Verhalten:
  - `slide`: `.slide` ist `aspect-ratio: 16/9`; nur eine sichtbar (per Hash-Routing); andere `display: none`.
  - `scroll`: alle `.slide` natural flow, keine aspect-ratio, page-break-friendly.
- Footer-Navigation: in `slide`-Mode aktiv (vor/zurück); in `scroll`-Mode visuell sichtbar, aber Buttons funktionieren als Anker (`href="#slide-{nextId}"`).

### 5.2 Theme

- `data-theme="light"` / `data-theme="dark"` auf `<html>`.
- Toolbar-Active-State wie in §3.1.
- Auto-Mode: `data-theme=""` oder Attribut entfernt, `@media (prefers-color-scheme)` wirkt.

### 5.3 LLM-Tabs

- Wenn `mode.llm = true`: `body[data-llm="on"]`. CSS: `[data-llm-tabs] { display: block; }`. Wenn `off`: nur erster Tab sichtbar (default Claude).
- Tabs-Nav als Codex-Toggle-Group.

### 5.4 Übungen

- Wenn `mode.exercises = true`: `body[data-exercises="on"]`. Übungs-Komponenten (`.ex-reflection-prompt`, `.quiz-wrapper`) sichtbar.
- Wenn `off`: `display: none`.

### 5.5 Trainer-Mode

- URL-Param `?trainer=1` → `body[data-trainer="on"]`.
- `.trainer-only` Elemente erst dann sichtbar.
- Trainer-Panel-Toggle in der Header-Toolbar sichtbar.

---

## 6. Lernpfad-Footer-Integration

### 6.1 Datenmodell

`lib/learning-paths.js` exportiert bereits `LEARNING_PATHS`. **NEU** (zusätzliche Funktion):

```js
/**
 * Gibt für eine Slide-ID den aktiven Lernpfad zurück und die Position darin.
 * @param {string} slideId — z.B. 'usecase-lab'
 * @param {string} pathId — z.B. 'praxis' (default: aus localStorage oder 'praxis')
 * @returns {{ pathId, pathLabel, step, total } | null}
 */
export function getPathProgress(slideId, pathId);
```

### 6.2 Persistierung

- LocalStorage-Key (**NEU**): `llm-101-v1.path.active` — Wert: pathId (`einsteiger`, `praxis`, `power-user`, `governance`).
- Default beim ersten Seitenaufruf: `praxis`.

### 6.3 Rendering

`app.js` ruft beim Slide-Wechsel `renderSlideFooter(slideId)` auf, die das `.slide-progress` füllt:

```html
<span class="slide-folio">...{folio} / 30</span>
<span class="slide-path">Lernpfad <b>{pathLabel}</b></span>
<span class="slide-step">
  <span class="path-dots">{step-1 done dots, here, remaining empty}</span>
  Schritt <b>{step} von {total}</b>
</span>
```

Wenn `slideId` nicht im aktiven Pfad enthalten ist:

- `.slide-path` zeigt: „Lernpfad **(nicht im Pfad)**"
- `.slide-step` zeigt: stattdessen Kapitel-Position (z.B. „Kapitel 3 von 7")
- `.path-dots` bleibt leer

Cover-Folie zeigt immer `Lernpfad Übersicht`.

### 6.4 Tests

- **NEU:** `tests/path-footer.test.js` — testet `getPathProgress()` für Edge-Cases (nicht-im-Pfad, Cover, erste/letzte Station).

---

## 7. Trainer-Cockpit Integration

### 7.1 Bleibt funktional unverändert

- URL-Param `?trainer=1`.
- Panel `#trainer-panel` mit Body-Content aus `lib/learning-paths.js`.

### 7.2 Visuelle Migration

- Panel-Styling nach §3.8.
- Cockpit-Body als Codex-Sektionen:
  - „Aktive Variante" — Mono-Label oben + Codex-Card mit Kicker+Lede.
  - „Checkpoints" — Liste mit Time-Range-Mono-Stamps links + Beschreibung.
  - „Probe Cues" — Token-Pill-Liste, `.tok-cobalt`.
  - „Demo-Checklist" — Checkbox-Liste mit `i-check` Icons.

### 7.3 Trainer-Annotation in Slides (optional)

**NEU:** Pro Slide kann ein Trainer-Hint via Markup gezeigt werden, **nur** wenn `body[data-trainer="on"]`:

```html
<aside class="trainer-hint trainer-only" hidden>
  <span class="trainer-hint-label"><svg class="ic sm"><use href="#i-target"/></svg> Trainer · 3 min</span>
  <p>{Hint-Text}</p>
</aside>
```

CSS: nicht im normalen Flow, sondern als floating box am unteren Rand (über der Footer-Leiste). `body[data-trainer="on"] .trainer-hint { display: block; }`.

---

## 8. Print & Handout

### 8.1 print.css Updates

- Alle Codex-Tokens MUSS auch im Print gelten — der Print-User sieht Text in `--text-primary`, Borders in `--border` etc.
- `body[data-layout]` ignoriert im Print → alle Slides als sequenz, page-break vor jedem `.slide`.
- `.app-header`, `.app-toc`, `.side-panel` → `display: none;`.
- `.slide-foot .slide-nav` → `display: none;` (keine Navigation auf Papier).
- `.slide-foot .slide-progress` → bleibt sichtbar (als Stand-Hinweis).
- `.slide-head .slide-stand` mit `data-volatile="true"` MUSS sichtbar bleiben als Warnung.
- `@page { margin: 1.5cm; size: A4 landscape; }` für Slide-Optik.

### 8.2 Handout.html

- Layout: portrait, 1 Folie pro Seite oder 2 (auf Wunsch). Spec: **1 pro Seite**.
- Kein Footer-Nav.
- Stand-Stamp und Folio im Header bleiben.

### 8.3 Acceptance

`tests/print.test.js` weiterhin grün — neue Assertions für Codex-Tokens hinzufügen.

---

## 9. Accessibility

- WCAG 2.1 AA — gilt für alle Komponenten.
- **Kontrast:** Acid-Lime `#c5e818` auf `#fafaf6` hat Kontrastverhältnis 1.4 (zu niedrig für Text). → Acid-Lime **nur als Background** oder als großer Display-Glyph; **nicht für Text-Body**. Text auf Acid-Glow-Background: nutze `--text-primary` (schwarz) — Kontrast > 7:1. Acid-Deep `#758c00` für Text-Labels auf Paper: Kontrast 4.6 — passt für Mono-Label.
- **Cobalt `#1f3df0`** auf Paper: Kontrast 7.4 — passt für Links.
- **Crimson `#c4304a`** auf Paper: Kontrast 5.8 — passt.
- **Focus-States:** alle interaktiven Elemente MUSS `:focus-visible` mit `outline: 2px solid var(--cobalt); outline-offset: 2px;` haben.
- **Tastatur-Navigation:** Toolbar-Toggles, Slide-Nav-Buttons, Tab-Navigation MÜSSEN per Tab erreichbar sein.
- **Screen-Reader:** Alle Icons mit `aria-hidden="true"`, semantisch wichtige Elemente mit `aria-label` oder Text.
- **Reduced Motion:** Alle Animationen (Caret, Tab-Transitions, Panel-Slide-In) MÜSSEN bei `prefers-reduced-motion: reduce` deaktiviert sein.

`tests/accessibility.test.js` MUSS weiter grün sein.

---

## 10. Datei-Architektur & Migrationsplan

### 10.1 Dateien (mit Änderungsumfang)

| Datei | Änderung | Größenordnung |
|---|---|---|
| `tokens.css` | Token-Werte ersetzen (Werte, nicht Namen) | ~60 Zeilen ändern |
| `app.css` | Header-Toolbar, Panels, Buttons, Code-Blocks | ~250 Zeilen ändern |
| `presentation.css` | Slide-Frame neu, Title-Row neu, alle existierenden Komponenten migrieren | ~1500 Zeilen ändern |
| `print.css` | Page-Breaks, Tokens, Header/Footer-Anpassung | ~60 Zeilen ändern |
| `design-variants.css` | **Löschen** — wird durch finale Codex-CSS überflüssig | -620 Zeilen |
| `assets/icons.svg` | **NEU** SVG-Sprite | +200 Zeilen |
| `lib/icons.js` | Refactor: `renderIcon()` rendert jetzt `<svg><use>` | ~50 Zeilen |
| `lib/learning-paths.js` | NEU: `getPathProgress(slideId, pathId)` | +30 Zeilen |
| `lib/icons-sprite.js` | **NEU** (optional) Sprite-Loader | +20 Zeilen |
| `app.js` | Sprite-Init, Footer-Rendering, Mode-Active-States | ~80 Zeilen |
| `index.html` | Jede Slide bekommt neuen Frame (Head/Body/Foot), Crumb, Title-Row für Lede-Slides, Footer-Markup | ~600 Zeilen ändern |
| `handout.html` | Header/Footer-Anpassung | ~30 Zeilen |
| `trainer-export.html` | Codex-Styling | ~50 Zeilen |
| `meine-notizen.html` | Codex-Styling | ~50 Zeilen |
| `quellen-refresh.html` | Codex-Styling | ~30 Zeilen |
| `style-preview.html` | Komplett neu als Codex-Component-Library | ~400 Zeilen |
| `explainer/*.html` (×7) | Codex-Frame, Title-Row, Tokens | je ~80 Zeilen |
| `sw.js` | Cache-Version-Bump | 1 Zeile |
| `tests/path-footer.test.js` | **NEU** | +50 Zeilen |

### 10.2 Migrationsreihenfolge

1. **Tokens** zuerst (tokens.css). Verifizieren: existierende Folien laden, sehen anders aus, aber kein Crash.
2. **Sprite + Icons** parallel.
3. **app.css / Header / Panels**. Verifizieren: Toolbar funktional, Theme-Toggle wirkt.
4. **presentation.css Slide-Frame + Title-Row + Token-Pill**. Auf style-preview.html testbar machen.
5. **index.html Slide-für-Slide Migration**.
6. **explainer/ Migration**.
7. **handout / trainer-export / meine-notizen / quellen-refresh / style-preview**.
8. **print.css**.
9. **Lernpfad-Footer-Integration** (lib + app.js).
10. **Tests anpassen + neue Tests**.
11. **Final QA** (visual:qa npm script).

---

## 11. Subagent-Pakete

Jedes Paket ist eine **eigenständige Aufgabe** für einen frischen Subagent (general-purpose oder refactoring-specialist). Subagent erhält:

- **Prompt:** Aufgaben-Brief + Acceptance Criteria + Test-Command.
- **Spec-Pfad:** `docs/codex-design-spec.md` (diese Datei).
- **Branch:** `redesign/codex-v2` (bereits eingerichtet).

Die Pakete sind so geschnitten, dass max. 2 parallel laufen können (Token-Layer ist Voraussetzung für alles).

### Paket A · Token-Layer + Icon-Sprite (**Foundation**)

**Dateien:** `tokens.css`, `assets/icons.svg` (kopieren), `lib/icons.js` (refactor), `lib/icons-sprite.js` (neu).

**Aufgaben:**

1. `tokens.css` gemäß §2.1 / §2.2 / §2.4 / §2.5 / §2.6 aktualisieren. Variablen-Namen beibehalten, **NEUE** Variablen hinzufügen (`--cobalt`, `--cobalt-soft`, `--crimson`, `--signal`, `--warn`, `--border-soft`, `--fs-display`, `--fs-lede`, `--fs-h3`, `--fs-body`, `--fs-small`, `--fs-mono-label`, `--fs-mono-tiny`, `--duration-fast`, `--duration-base`, `--duration-slow`, `--ease-out`, `--ease-in-out`, `--shadow-page`).
2. **Sprite kopieren:** `cp docs/codex-sprite.svg assets/icons.svg` (Spec-Asset → Production-Asset). KEIN Neuschreiben — die 41 Symbole sind bereits final.
3. `lib/icons.js`: `renderIcon(name, attrs)`-Vertrag gemäß §4.5 implementieren. Existierende API-Aufrufer (in app.js, ggf. presentation-Komponenten) MÜSSEN weiterhin funktionieren — bei Verhaltensänderungen alte Aufrufstellen identifizieren und anpassen.
4. **`lib/icons-sprite.js` (NEU):** Implementiere `initSprite()` gemäß §4.1. In `app.js` als erstes nach dem Modul-Import aufrufen (vor allen anderen Initialisierungen).
5. Tests: `tests/icons.test.js` MUSS weiter grün — falls Test-Erwartungen vom alten mask-image-Verhalten ausgehen, in diesem Paket Test mitziehen (siehe §12.3-Regel).

**Acceptance Criteria:**

- `npm test -- tokens icons` läuft.
- `index.html` lädt im Browser, zeigt fundamentale Codex-Tokens (Hintergrund, Schrift, Borders).
- Sprite ist im DOM verfügbar (`document.querySelector('symbol#i-sun')` returns element).

**Test-Command für Subagent:**
```bash
cd /tmp/LLM-101 && npm test -- icons mode
```

### Paket B · Global Header + Toolbar + Side-Panels (**Chrome**)

**Dateien:** `app.css`, `index.html` (Header-Block), `app.js` (Toolbar-Wiring).

**Voraussetzung:** Paket A fertig.

**Aufgaben:**

1. `.app-header` und `.app-toggles` nach §3.1 stylen.
2. Markup in `index.html` Header-Block anpassen (Toggle-Gruppen mit Dividers, Icons für Theme).
3. Side-Panels (`.path-panel`, `.trainer-panel`) nach §3.8 stylen.
4. `app.js`: Toolbar-Active-State-Logik prüfen — Theme-Active-State per CSS-Attribut-Selektor (existiert evtl. schon, sonst hinzufügen).

**Acceptance Criteria:**

- `tests/mode.test.js`, `tests/accessibility.test.js`, `tests/trainer-cockpit.test.js`, `tests/learning-paths-ui.test.js` grün.
- Visuell: Toolbar entspricht Mockup `variant-codex-v2.html` (auf der Inhaltsfolie 2 — Anatomie).
- Panel-Open/Close-Animation respektiert `prefers-reduced-motion`.

### Paket C · Slide-Frame Component Library (**Atoms**)

**Dateien:** `presentation.css` (Slide-Frame, Title-Row, Kicker, Token-Pill, Callout, Status-Card, Cover-Display), `style-preview.html` (komplett neu als Library), `lib/icons-sprite.js`.

**Voraussetzung:** Paket A fertig.

**Aufgaben:**

1. `.slide`, `.slide-head`, `.slide-crumb*`, `.slide-stand`, `.slide-body`, `.slide-foot`, `.slide-nav`, `.slide-progress`, `.path-dots i` nach §3.2 stylen.
2. `.title-row`, `.kicker`, `.lede`, `.display`, `.lead` nach §3.3 + §3.5.
3. `.tok`, `.tok-cobalt`, `.tok-warn` nach §3.4.
4. `.callout` nach §3.9.
5. `.status-card` (replace `.policy-card`-Styling, alte Klasse als Alias behalten) nach §3.7.
6. **`style-preview.html` komplett neu**: zeigt alle Komponenten in Light + Dark.

**Acceptance Criteria:**

- `style-preview.html` lädt und zeigt alle Komponenten ohne Layout-Brüche.
- Codex-DNA visuell deckungsgleich mit `variant-codex-v2.html`.
- Komponenten responsive (Test bei 375px, 768px, 1280px).

### Paket D · index.html Slide-Migration (**Content**)

**Voraussetzung:** Paket A + B + C fertig.

**Aufteilung in drei Sub-Pakete** — jedes ist eigenständig dispatchbar, da Folien-Migrationen pro Slide unabhängig sind. Jeder Subagent erhält **nur seinen Bereich** plus die gemeinsame Spec.

#### Paket D1 · Slides 01–11 (Kapitel `einstieg` + `verwaltung` + `claude`)

**Datei:** `index.html` (Slides mit `data-slide-id` aus Liste unten).

**Folien (11) — verifiziert gegen `index.html`:**

| Folio | data-slide-id | Chapter | Titel (kurz) | Bestehende Komponenten | Flags |
|---|---|---|---|---|---|
| 01 | `einstieg-1` | einstieg | LLM 101 (Cover) | — | nutzt `.cover` statt `.title-row` (§3.5) |
| 02 | `einstieg-2` | einstieg | Die fünf Phasen der KI-Nutzung | `.timeline` | `data-stepped` |
| 03 | `einstieg-3` | einstieg | 7-Level Skill-Ladder | `.ladder-list` | `data-stepped` |
| 04 | `einstieg-4` | einstieg | Agenda | `.agenda-list` | — |
| 05 | `verwaltung-1` | verwaltung | Was sagt die Verwaltung zu KI? | `.policy-card` | `data-stepped` + `data-volatile="true"` + `data-checked="2026-05-16"` |
| 06 | `verwaltung-2` | verwaltung | Von Warnlogik zu Nutzungskompetenz | `[data-exercise]` | `data-stepped` + `data-volatile="true"` + `data-checked="2026-05-16"` |
| 07 | `claude-1` | claude | Modellfamilien verstehen | `[data-llm-tabs]` + `[data-exercise]` | `data-volatile="true"` + `data-checked="2026-05-16"` |
| 08 | `claude-2` | claude | Chat-Optionen | `[data-llm-tabs]` | — |
| 09 | `claude-3` | claude | Einstellungen | `[data-llm-tabs]` | — |
| 10 | `claude-4` | claude | Menü & Navigation | — | — |
| 11 | `claude-5` | claude | Abos & Preise | `[data-llm-tabs]` | `data-volatile="true"` + `data-checked="2026-05-16"` |

**Aufgaben:**

1. Jede der 11 Folien auf Frame-Struktur §3.2 bringen: `data-slide`, `data-chapter`, `data-folio` setzen.
2. `.slide-head` mit Crumb (Chapter-Icon aus §3.2-Mapping + Kapitel-Name + Topic) + `.slide-stand`.
3. `.slide-body` mit `.title-row` (außer Cover) → Kicker + Lede, dann Inhalts-Komponenten.
4. `.slide-foot` mit `.slide-nav` (prev/next) und leerem `.slide-progress` (wird in Paket E gefüllt).
5. Volatile-Stamps gemäß §3.2.

**Acceptance Criteria:**

- `npm test -- deck-integrity volatile-facts responsive-css` grün.
- Slides navigieren via Hash (`#slide-einstieg-1` → `#slide-claude-5`).
- Visual: Slide 01 (Cover) entspricht Mockup-Slide 1; Slide 05/06 (Datenampel) Mockup-Slide 4.

#### Paket D2 · Slides 12–22 (Kapitel `context` + `usecases`)

**Folien (11) — verifiziert gegen `index.html` und Tests:**

| Folio | data-slide-id | Chapter | Titel (kurz) | Bestehende Komponenten | Flags |
|---|---|---|---|---|---|
| 12 | `context-1` | context | Context Window | — | — |
| 13 | `context-2` | context | Wie pflegt man das Context Window? | `[data-exercise]` | — |
| 14 | `usecase-1` | usecases | Use Case — Sparringpartner | — | — |
| 15 | `usecase-2` | usecases | Use Case — Ghostwriter | — | — |
| 16 | `usecase-3` | usecases | Use Case — Data Analyst | — | — |
| 17 | `usecase-lab` | usecases | Übungs-Labor — eigener Use Case | `[data-exercise]` (Prompt-Lab) | — |
| 18 | `usecase-4` | usecases | **Prompt wird Produkt** | `[data-prompt-product]` + `[data-prompt-product-mode]` (×2) | — |
| 19 | `usecase-5` | usecases | **Context Window X-Ray** | `[data-context-xray]` + `[data-context-xray-mode]` (×2) | — |
| 20 | `usecase-6` | usecases | Output prüfen | `[data-exercise]` | — |
| 21 | `usecase-7` | usecases | Mini-Fallbibliothek | `.case-library-grid` | — |
| 22 | `usecase-8` | usecases | Vorher / Nachher | `.before-after-grid` | — |

**Kritische Aufgaben:**

1. **`usecase-4` (Prompt wird Produkt):** `[data-prompt-product]` und beide `[data-prompt-product-mode]` MÜSSEN funktional bleiben. JS-Init in `app.js` (`initPromptProduct`) bindet diese — nicht umbenennen. Visual: Anatomie-Block + Output-Preview als `.compare`-Layout aus Mockup (siehe §3.6 → before-after-grid Migration anwenden).
2. **`usecase-5` (Context Window X-Ray):** `[data-context-xray]` mit beiden `[data-context-xray-mode]` MUSS funktional bleiben. JS-Init `initContextXray`. Visual: Migration zu „Conversation-Tape"-Layout aus Mockup Slide 3.
3. **`usecase-lab` (Prompt-Lab):** Interaktive Lernstation — Test `tests/prompt-lab.test.js` MUSS grün bleiben. Editor und Submission-Logik nicht ändern.

**Acceptance Criteria:**

- `npm test -- prompt-product prompt-lab context-xray output-quality-and-cases exercises deck-integrity responsive-css` exit code 0.
- Live im Browser:
  - `#usecase-4` → Weak/Strong-Toggle schaltet Output-Preview.
  - `#usecase-5` → Clean/Noisy-Toggle schaltet Stack-Visualisierung.
  - `#usecase-lab` → Prompt-Editor reagiert, Persist via `lib/exercises.js`.

#### Paket D3 · Slides 23–30 (Kapitel `skills` + `next-level`)

**Folien (8) — verifiziert gegen `index.html`:**

| Folio | data-slide-id | Chapter | Titel (kurz) | Bestehende Komponenten | Flags |
|---|---|---|---|---|---|
| 23 | `skills-1` | skills | Was ist ein Skill? | `[data-llm-tabs]` | — |
| 24 | `skills-2` | skills | Skill-Lifecycle | — | — |
| 25 | `skills-3` | skills | Demo Time! | `[data-exercise]` | — |
| 26 | `next-1` | next-level | Team-Repo als zentrale Wissensbasis | — | — |
| 27 | `next-2` | next-level | GitHub 101 | — | `data-stepped` |
| 28 | `next-3` | next-level | LLM überall | `[data-llm-tabs]` | `data-stepped` + `data-volatile="true"` + `data-checked="2026-05-16"` |
| 29 | `next-5` | next-level | Chat, Project oder Codex? | — | — |
| 30 | `next-4` | next-level | Dein nächster Schritt | — | Letzte Slide |

**Reihenfolge im DOM:** Folio 29 = `next-5`, Folio 30 = `next-4` (reordered — `next-4` ist Abschluss-Anker).

**Acceptance Criteria:**

- `npm test -- transfer-and-visual-qa workshop-readiness deck-integrity volatile-facts responsive-css` exit code 0.
- Letzte Slide (`next-4`): `.slide-nav.next` zeigt Link zum Notizen-Export (`meine-notizen.html`) ODER ist visuell deaktiviert (`aria-disabled="true"`).

### Paket E · Lernpfad-Footer-Logik (**Logic**)

**Dateien:** `lib/learning-paths.js` (Erweiterung), `app.js` (Footer-Render), `tests/path-footer.test.js` (neu).

**Voraussetzung:** Paket D fertig (oder mindestens 1 Slide migriert).

**Aufgaben:**

1. `getPathProgress(slideId, pathId)` implementieren (siehe §6.1).
2. `app.js`: Beim Hash-Wechsel `renderSlideFooter(slideId)` aufrufen.
3. Default-Path-Persistierung in LocalStorage (`path.active`).
4. Path-Switcher in Lernpfad-Panel: Klick auf Pfad → `localStorage.path.active = pfadId`, alle Slide-Footer neu rendern.
5. Neuer Test `tests/path-footer.test.js`: Pfad-Step für je 1 Slide aller 4 Pfade, Edge-Cases (Cover, nicht-im-Pfad, erste/letzte Station).

**Acceptance Criteria:**

- `tests/path-footer.test.js` grün.
- `tests/learning-paths-ui.test.js` weiter grün.
- Wechsel im Lernpfad-Panel aktualisiert sofort den Footer.

### Paket F · Explainer + Utility-Pages (**Outliers**)

**Dateien:** `explainer/*.html` (×7), `handout.html`, `trainer-export.html`, `meine-notizen.html`, `quellen-refresh.html`.

**Voraussetzung:** Paket A + B + C fertig.

**Aufgaben:**

1. Jede Explainer-Seite auf Slide-Frame bringen (eigene `.slide` oder vereinfacht: `<article class="explainer-frame">`). Header mit Crumb („Explainer · {Titel}"), Body mit Codex-Komponenten, Footer mit `?back={slideId}` Link als `.slide-nav`.
2. `handout.html`: Schlanke Variante des Slide-Frames für Print.
3. `trainer-export.html`, `meine-notizen.html`, `quellen-refresh.html`: Codex-Styling, Mono-Tables, etc.

**Acceptance Criteria:**

- Alle Explainer laden, Rückkehr-Link funktioniert.
- `tests/transfer-and-visual-qa.test.js`, `tests/notes-export.test.js`, `tests/governance-content.test.js` grün.

### Paket G · Print/Handout-Adaption (**Print**)

**Dateien:** `print.css`.

**Voraussetzung:** Paket A + C + D fertig.

**Aufgaben:**

1. `print.css` gemäß §8 aktualisieren.
2. Sicherstellen: page-breaks, hidden controls, sichtbare Folio + Stand.

**Acceptance Criteria:**

- `tests/print.test.js` grün, erweitert um Codex-spezifische Assertions.
- Manuelle Verifikation: `index.html` → Print Preview → A4 landscape mit Slide-Optik.

### Paket H · Final QA + Service-Worker-Bump (**Release**)

**Dateien:** `sw.js`, `tests/*.test.js` (Anpassungen), `lib/visual-qa-targets.js` (Anpassungen).

**Voraussetzung:** Alle anderen Pakete fertig.

**Aufgaben:**

1. `sw.js`: Cache-Version-String bumpen.
2. `lib/visual-qa-targets.js`: Selektoren aktualisieren falls geändert.
3. `npm test` — alle 27+1 Tests MUSS grün sein.
4. `npm run visual:qa` — Screenshots prüfen.
5. Commit + Push auf `redesign/codex-v2`.

**Acceptance Criteria — harte Checkliste:**

- `npm test` exit code 0.
- `npm run visual:qa` exit code 0; `.visual-qa/` enthält Screenshots für alle Targets aus `lib/visual-qa-targets.js`.
- **Manuelle Visual-QA-Checkliste** (Subagent durchläuft + dokumentiert pro Punkt OK/FAIL mit Screenshot-Datei):
  1. `index.html` lädt ohne Console-Errors (DevTools-Network-Tab + Console clean).
  2. Theme-Toggle funktioniert auf allen drei Werten (light, dark, auto) — visuell sichtbar an `.slide` Hintergrund.
  3. Layout-Toggle (Vortrag/Lesen) wechselt zwischen Single-Slide und Scroll-Layout.
  4. Hash-Routing: `index.html#slide-usecase-lab` lädt direkt diese Folie.
  5. Lernpfad-Panel öffnet, alle vier Pfade sind klickbar, Wechsel aktualisiert `.slide-progress`.
  6. `index.html?trainer=1` zeigt Trainer-Toggle in Header; Panel öffnet mit Cockpit-Inhalt.
  7. Volatile-Folien zeigen `.slide-stand` mit `data-checked`-Datum.
  8. Print-Preview (Chrome): A4 landscape, alle 30 Folien lesbar, keine abgeschnittenen Token-Pills.
  9. Reduced-Motion: in macOS-Settings „Bewegung reduzieren" aktiviert → Caret blinkt nicht.
  10. Mobile 375px (DevTools): keine horizontale Scroll-Bar, Toolbar wrappt sauber.

Subagent dokumentiert die Checkliste in `docs/codex-release-qa.md` (NEU), die als Teil des PRs committed wird.

### 11.X Reihenfolge & Parallelität

```
Paket A (Foundation)
   ├──> Paket B (Chrome) ──┐
   ├──> Paket C (Atoms) ───┤
   │                        ├──> Paket D1 (Slides 01–11) ──┐
   │                        ├──> Paket D2 (Slides 12–22) ──┤
   │                        ├──> Paket D3 (Slides 23–30) ──┤
   │                        │                              ├──> Paket E (Logic)
   │                        │                              └──> Paket F (Outliers)
   │                        └──> Paket G (Print)
   └────────────────────────────────────────────────────────────> Paket H (Release)
```

- **Paket A** zuerst (alleine, blockt alles).
- **Paket B + C** parallel nach A.
- **Paket D1 + D2 + D3** parallel nach B+C — sie ändern verschiedene Slide-Blöcke in `index.html` (Merge-Konflikt-Risiko: niedrig, da Slide-Blöcke disjunkt; trotzdem im Sub-Branch arbeiten und sauber mergen).
- **Paket E + F + G** parallel nach D.
- **Paket H** zuletzt.

**Merge-Strategie für D1/D2/D3:** Jedes Sub-Paket arbeitet auf einem feature-branch `redesign/codex-v2-d1` etc., öffnet PR gegen `redesign/codex-v2`. Reihenfolge der Merges: D1 → D2 → D3 (Konflikt-Wahrscheinlichkeit niedrig, aber so deterministisch).

---

## 12. Test-Strategie & Gates

### 12.1 Vor jedem Subagent-Start

```bash
cd /tmp/LLM-101 && git status   # working tree clean?
cd /tmp/LLM-101 && npm test     # alle Tests grün? (Baseline)
```

### 12.2 Nach jedem Subagent

```bash
cd /tmp/LLM-101 && npm test           # Acceptance-Tests des Pakets grün?
cd /tmp/LLM-101 && git diff --stat    # Touchierte Dateien plausibel?
```

### 12.3 Wenn ein Test rot wird

Subagent darf den Test NICHT „grün-fixen" durch Anpassung der Erwartung, sondern MUSS:

1. Prüfen, ob das Verhalten gewollt geändert wurde (gemäß Spec).
2. Wenn ja: Test-Erwartung anpassen + im Bericht dokumentieren.
3. Wenn nein: Bug beheben, Test bleibt unverändert.

### 12.4 Final Acceptance (vor Merge)

- `npm test` → 0 failures.
- `npm run visual:qa` → Screenshots manuell geprüft.
- `index.html` öffnen, alle 4 Lernpfade per Panel durchklicken — Footer-Progress korrekt.
- `?trainer=1` öffnen, Cockpit-Panel öffnet, alle 3 Trainer-Varianten zeigen Inhalt.
- Print Preview im Browser: A4 landscape, alle 30 Folien lesbar, kein abgeschnittener Inhalt.

---

## 13. Bekannte Risiken & Open Decisions

### 13.1 Risiken

| Risiko | Mitigation |
|---|---|
| `presentation.css` ist 2881 Zeilen — Migration kann inkonsistent werden | Paket C macht erst Component-Library in `style-preview.html`, dann werden Inhalts-Pakete daran ausgerichtet |
| LLM-Tabs sind in vielen Folien — Sync-Gruppen müssen weiter funktionieren | `tests/tabs.test.js` als Gate |
| Service Worker cached alte Assets — Nach Deploy sehen User altes Design | `sw.js` Cache-Version-Bump in Paket H |
| Acid-Lime ist visuell auffällig — kann bei manchen Folien zu dominant sein | In Paket D pro Slide-Typ Acid-Verwendung dosieren; Faustregel: max. 3 Token-Pills pro sichtbarer Folien-Hälfte |
| Print-Layout zeigt Acid-Background u.U. nicht (Browser-Setting „Backgrounds nicht drucken") | `print.css`: `print-color-adjust: exact; -webkit-print-color-adjust: exact;` auf relevanten Elementen |

### 13.2 Open Decisions (zur Spec-Review)

1. **Folio-Counter Mapping:** Soll Folio aus `data-folio="NN"` HTML-Attribut kommen (manuell gepflegt) oder zur Laufzeit aus DOM-Order berechnet werden? **Spec-Default:** HTML-Attribut (manuell, deterministisch, Tests können prüfen).
2. **Caret-Animation auf Cover:** Soll der blinkende Caret nur im `data-layout="slide"` aktiv sein, oder auch im `scroll`-Mode? **Spec-Default:** nur slide-Mode.
3. **Trainer-Hint pro Slide:** Soll dies Phase 1 sein oder „nice-to-have"? **Spec-Default:** Phase 1 inkludiert (Paket D), aber Markup ist optional pro Slide.
4. **Path-Switcher UI:** Wo? Im Header-Toolbar (`Lernpfad`-Button öffnet Panel mit 4 Pfaden) oder als separater Dropdown? **Spec-Default:** Panel (existiert bereits, nur visuell migrieren).
5. **`design-variants.html` + `design-variants.css`:** Löschen oder behalten? **Spec-Default:** löschen (durch finales Codex obsolet); Path: Mockups bleiben im Workstation-Vault als Archiv.

---

## Anhang A · Mockup-Referenz

Die Codex-DNA liegt als **Spec-Asset im Repo** unter `docs/codex-mockup-reference.html` (selfcontained HTML, Inline-CSS, alle 5 Mockup-Folien: Cover, Anatomie, Context-Window-X-Ray, Datenampel, Skill-Ladder).

Bei Implementations-Zweifeln: dort nachschlagen, Pixel-genau übernehmen. Im Browser öffnen:

```bash
open /tmp/LLM-101/docs/codex-mockup-reference.html
```

Layout-Slide-Zuordnung Mockup → Schulungs-Folien:

| Mockup-Slide | Layout-Pattern | Anwendung in Schulung |
|---|---|---|
| Cover | `.cover` mit `h1.display` + Caret + Colophon | `einstieg-1` |
| Anatomie | `.compare` 2-Spalten + `.ledger` 6-Spalten | `usecase-4` (Prompt wird Produkt), `claude-2` (Chat vs. Project) |
| Context Window X-Ray | `.convo` mit Token-Tape, Signal-Pills | `usecase-5` |
| Datenampel | `.status-card` (×3) + `.callout` Faustregel | `verwaltung-1`, `verwaltung-2` |
| Skill-Ladder | `.ledger` 5-Spalten + `.errata` | `einstieg-3` |

## Anhang B · Inventar-Kurzform

- **30 Folien** in 7 Kapiteln: `einstieg` (4), `verwaltung` (2), `claude` (5), `context` (2), `usecases` (9), `skills` (3), `next-level` (5).
- **5 CSS-Dateien**: tokens, app, presentation, print, design-variants (zu löschen).
- **8 JS-Module** in `lib/` + `app.js` + `sw.js`.
- **27 Tests** in `tests/`.
- **7 Explainer** in `explainer/`.
- **6 Utility-HTMLs** im Root.

---

## Anhang D · Decision Log (wird im Verlauf gepflegt)

Resolutionen aus den Implementations-Paketen, die für Folgepakete relevant sind.

### Aus Paket A (Commit `07a8204`)

- **Icon-API: zwei Funktionen koexistieren.** `renderIcon(name, attrs)` (neu, sprite-basiert, §4.5-Vertrag) und `icon(name)` (Legacy, mask-image-basiert) leben parallel in `lib/icons.js`. Begründung: `tests/icons.test.js` validiert die alte API; ein hartes Replace hätte 7 Explainer-HTML + `app.js`-Theme-Buttons + den Test selbst gebrochen.
  - **Konsequenz für Paket B/C:** Verwende ausschließlich `renderIcon()` für neue Aufrufer. Bestehende `[data-icon]`-Markup-Stellen bleiben unangetastet, bis sie im Zuge der jeweiligen Folien-/Komponenten-Migration ohnehin neu geschrieben werden.
  - **Konsequenz für Paket D1–D3:** Beim Slide-Refactor `[data-icon]` durch `<svg class="ic"><use href="#i-NAME"/></svg>` ersetzen. Wenn alle Aufrufer migriert sind: in Paket H die Legacy-`icon()`/`ICONS`-Map entfernen (separater Cleanup-Commit).
- **`renderIcon()` setzt `xlink:href` zusätzlich zu `href`** für jsdom-Kompatibilität (ältere Versionen kennen nur `xlink:href`). Tests, die `<use>.href` strict prüfen, müssen `getAttribute('href')` und/oder `getAttributeNS(XLINK, 'href')` akzeptieren.
- **`initSprite()` ist async/fire-and-forget** in `app.js`. Race-Window: `<use href="#i-NAME"/>`-Verweise vor Sprite-Load resultieren in leerem SVG (kein Error). Für Komponenten, die direkt nach Modul-Boot rendern: `await initSprite()` vor erstem `renderIcon`-Burst empfohlen.

### Aus Paket B (Commit `f4474f3`)

- **`.app-title` als zweite Klasse auf `.app-brand-id`** beibehalten, weil `tests/llm-framing.test.js` `.app-title === "LLM 101"` queryt. Paket H darf die Doppelklasse aufräumen, sobald der Test mitumgestellt wird.
- **`.app-brand-meta`-Span** (Run · Edition · Status) ist in §3.1 markup-mäßig vorgesehen und CSS-stylebar, aber in `index.html` noch leer. Inhalts-Entscheidung delegiert an Paket D1 oder H: z.B. „Run 03 · 2026-05 · live".
- **`.is-open` und `aria-hidden="false"` koexistieren** auf Panels — beide gültig im neuen CSS. `app.js` setzt `.is-open` weiterhin per `setPanelOpen`. Aufräumen (eine von beiden Konventionen) gehört in Paket H.
- **Neuer Mobile-Breakpoint `@media (max-width: 720px)`** für Toolbar-Wrap. Falls Paket C/D eigene 720er-Breakpoints einführen: kohärent halten.

### Aus User-Review nach Paket C (Commit folgt unten)

- **Cover-Seal entfernt.** `.cover-seal` (LLM-Glyph im Kreis mit „v2.4 · ed."-Caption) war Mockup-Dekoration — wird ersatzlos gestrichen. CSS aus `presentation.css` entfernt, HTML-Markup aus style-preview.html und Spec §3.5 entfernt.
- **Cover-Colophon auf 3 generische Felder gekürzt.** Trainer-Name · [Team]/[Organisation] · [Datum]/Kursdatum. Run-Spalte entfällt. Trainer editiert pro Kurs drei Werte; HTML-Kommentar markiert den Hotspot.
- **Volatile-Label final: „zu prüfen".** Statt „flüchtig" oder „veränderlich". Wording-Festlegung des Trainers — Paket D1/D2/D3 MUSS exakt diesen String setzen, kein Synonym.

### Aus Paket D1 (Commit `b9869c9`) + D2 (`2ec8ef4`) + D3 (`4c5cc23`) + Konsolidierung

- **`data-volatile="true"` nur auf `<section class="slide codex">`, NICHT auf `.slide-stand`-Span.** Begründung: `tests/volatile-facts.test.js` querte ursprünglich `[data-volatile="true"]` global und erwartete `data-slide-id` auf jedem Treffer. D3 löste das durch Weglassen am Span, D1 hatte zunächst beide gesetzt + Test verengt. Bei der Konsolidierung wurde D3's Markup-Lösung übernommen (Spans verlieren das Attribut); der defensiv verengte Test (`section.slide[data-volatile="true"]`) bleibt drin als Schutz vor zukünftigen Regressions. **Konsequenz für Paket E/F/H:** CSS-Effekt greift via Descendant-Selektor `.slide.codex[data-volatile="true"] .slide-stand`. Wenn neue Selektoren auf `.slide-stand[data-volatile]` zielen sollen, müssen sie auf die Ancestor-Property gehen.
- **Test-Selektoren modernisiert** in `tests/llm-framing.test.js` und `tests/volatile-facts.test.js`: alte Markup-Selektoren (`.chapter-label`, `.cover-title`, `.cover-subtitle`) durch Codex-Selektoren ersetzt (`.slide-crumb-chap`, `h1.display`, `.cover-lead`). Spec §12.3 erlaubt dies bei gewolltem Verhaltens-Wechsel.
- **`output-quality-and-cases.test.js` Constraint:** Tests erwarten `h2`-Text strikt „Output prüfen" / „Mini-Fallbibliothek". D2 verlagerte den Untertitel in den Kicker (statt `h2 + em`-Suffix), damit die Test-Assertions greifen. Paket H darf die Tests lockern, um die volle Codex-DNA (Lede mit `<em>`-Highlight) wiederherzustellen.
- **`[data-prompt-product]` `.pp-chip`-Bausteine bleiben:** D2 hat die 6 Anatomie-Chips in `usecase-4` NICHT zu `.tok` umgebaut, weil `app.js`/`initPromptProduct` an `.pp-chip` mit eigenem Farb-Mapping hängt. Ein späterer Cleanup (Paket H) könnte die Logik portieren.
- **Conversation-Tape für `usecase-5` aufgeschoben:** Aktuelles `.xray-stack`/`.xray-window`-Markup hat semantische Reichhaltigkeit (Signal-Diagnose, States), die das Mockup-Tape nicht hat. D2 hat das Markup unverändert gelassen; ein visueller Upgrade auf Tape-Optik wäre eigener Cleanup-Lauf.
- **`.slide-progress`-Stub variiert zwischen D-Paketen:** D1 hat Platzhalter (`Lernpfad —`), D2 ähnlich, D3 nur `.slide-folio`. Paket E MUSS `renderSlideFooter()` so bauen, dass es das vorhandene Markup *ergänzt/ersetzt* (nicht voraussetzt). Empfehlung: vor Paket E einmal die 30 Slides auf ein einheitliches Stub-Muster bringen.
- **`<div class="slide-inner">`-Wrapper entfernt** in D2-Slides (12–22). Paket G (Print) MUSS prüfen, ob `print.css` auf `.slide-inner` zielt; falls ja: anpassen oder Wrapper wiederherstellen.
- **`next-4` Abschluss-Folie:** `.slide-nav.next` zeigt auf `meine-notizen.html` (D3-Entscheidung). Paket F (Outliers) sollte den Rückweg `?back=next-4` in `meine-notizen.html` ergänzen.

### Aus Paket C (Commit `ebb88d0`)

- **`.slide.codex` Marker-Klasse:** Der neue Frame ist an `.slide.codex` gebunden, NICHT an `.slide` allein. In §3.2 dokumentiert. Paket D1–D3 MUSS `class="slide codex"` setzen.
- **`.cover-lead` statt `.lead`** für den Cover-Paragraph. Begründung: bestehende `.lead`-Klasse (Skills-Section, 17px) bleibt funktional, neue Codex-Lead-Größe hängt an `.cover-lead`. In §3.5 dokumentiert.
- **`.policy-card` bleibt als-is** in `presentation.css`. `.status-card` ist eigene Komponente. Paket D1 migriert das Markup der Datenampel-Folien von `.policy-card` zu `.status-card`-Trio.
- **Zwei Mobile-Breakpoints:** Title-Row stack bei 720px, Slide-Frame aspect-ratio bei 980px aufgehoben. Konsistent; falls Paket D Anpassungen braucht, beide synchron halten.
- **`color-mix()`-Verwendung in `.tok`, `.callout-action`, `.status-pill`-Modifiern** — Chrome 111+, Safari 16.4+, Firefox 113+. Behörden-Workshops auf älteren Browsern können degraden. Paket H sollte Browser-Versions-Spec im README ergänzen.

---

**Ende der Spec.**
