# LLM-101 · Build-Spec — Farbvarianten „Cobalt" & „Clay"

> **Für den Bau-Agenten.** Diese Spec ist self-contained. Sie beschreibt, wie zwei
> zusätzliche Farbpaletten (Cobalt, Clay) in die bestehende Präsentation integriert werden —
> als orthogonale `data-palette`-Achse neben dem bestehenden Light/Dark-Theme.
> Kontext-Analyse: siehe [`farbvarianten-spec.md`](./farbvarianten-spec.md).
> Branch: `redesign/codex-v2`. Stand: 2026-05-23.

---

## 1. Ziel & Scope

Zwei neue Paletten, auswählbar im Toolbar, persistent pro Nutzer. **Layout, Komponenten,
Inhalt, Typografie, Radien, Schatten, Motion bleiben unverändert** — es wird ausschliesslich
ein Satz Farb-Tokens getauscht.

- **Nicht-Ziele:** Kein neues Komponenten-Markup, keine Layoutänderung, kein Refactoring von
  `presentation.css` jenseits der Token-Definitionen.
- **Default bleibt intern `codex`, im UI aber „Lime" (Acid-Lime).** Die neuen Paletten sind
  additiv; ohne Auswahl ändert sich nichts.

---

## 2. Funktionsprinzip (warum das so einfach ist)

Das gesamte Farbsystem lebt in `tokens.css` als CSS-Custom-Properties. `presentation.css`
und alle Slides lesen nur diese Variablen — praktisch keine hartcodierten Farben. Eine
Variante ist daher ein reiner **Token-Override**.

CSS-Custom-Properties kaskadieren **pro Property**: Ein Palette-Block muss nur die Tokens
deklarieren, die sich ändern. Alles Nicht-Deklarierte erbt weiter vom Codex-Basissatz.
→ **Die funktionalen Farben (`--crimson`, `--signal`, `--warn`, `--success*`) werden NICHT
überschrieben.** Sie bleiben über alle Paletten identisch (Rot = Stop, Grün = OK, Amber =
Prüfen). Das hält die Statusampel, Quiz-Validierung etc. semantisch konsistent und vermeidet
Kontrast-Regressionen. Eine Palette unterscheidet sich nur in **Marken-Akzent + Neutral-
Temperatur + Link-Ton**.

### 2.1 Achsen-Design

`data-palette` liegt auf `:root` (`<html>`), **additiv** zu `data-theme`:

| Zustand | Selektor der greift |
|---|---|
| codex + light | `:root` (Basis) |
| codex + dark | `:root[data-theme="dark"]` (Basis) |
| codex + auto + OS-dark | `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` (Basis) |
| **X + light** | `:root[data-palette="X"]` |
| **X + dark** | `:root[data-palette="X"][data-theme="dark"]` |
| **X + auto + OS-dark** | `@media (prefers-color-scheme: dark) :root[data-palette="X"]:not([data-theme="light"])` |

**Spezifitäts-Hinweis (wichtig, nicht wegoptimieren):** Pro Palette sind **drei** Blöcke
nötig. Der reine `[data-palette="X"]`-Block (Spezifität 0,2,0) reicht NICHT für den Dark-Fall,
weil der Codex-Dark-Block (`[data-theme="dark"]`, ebenfalls 0,2,0) bei gleicher Spezifität via
Quellreihenfolge gewinnen würde. Erst die kombinierten Selektoren (0,3,0) setzen sich durch.
Block 2 und 3 sind inhaltsgleich (genau wie Codex es für Dark macht).

`palette = 'codex'` ⇒ **kein** `data-palette`-Attribut (Basis-Tokens greifen). Nur `cobalt`
und `clay` erzeugen ein Attribut.

---

## 3. Integration

### 3.1 `tokens.css` — neue Blöcke

Direkt **nach** dem bestehenden `@media (prefers-color-scheme: dark)`-Block (aktuell ~Z. 265)
einfügen, **vor** dem `prefers-reduced-motion`-Block. Reihenfolge der Paletten egal.

```css
/* ===================== PALETTE · COBALT (Enterprise / neutral-seriös) ===================== */
:root[data-palette="cobalt"] {
  --bg-base:#f7f8fb; --bg-card:#ffffff; --bg-tint:#eef1f7;
  --border:#0a0e1a1c; --border-soft:#0a0e1a0e;
  --text-primary:#0b1020; --text-secondary:#3c4356; --text-tertiary:#818796;
  --accent:#1f3df0; --accent-soft:#1f3df014; --accent-strong:#1733c0; --text-on-accent:#ffffff;
  --cobalt:#0c7d7d; --cobalt-soft:#0c7d7d14;
}
:root[data-palette="cobalt"][data-theme="dark"] {
  --bg-base:#0a0c12; --bg-card:#14171f; --bg-tint:#11141b;
  --border:#dfe6f51c; --border-soft:#dfe6f510;
  --text-primary:#eef1f8; --text-secondary:#aab2c4; --text-tertiary:#6b7282;
  --accent:#6f86ff; --accent-soft:#6f86ff22; --accent-strong:#93a6ff; --text-on-accent:#08101f;
  --cobalt:#4fd0c4; --cobalt-soft:#4fd0c418;
}
@media (prefers-color-scheme: dark) {
  :root[data-palette="cobalt"]:not([data-theme="light"]) {
    --bg-base:#0a0c12; --bg-card:#14171f; --bg-tint:#11141b;
    --border:#dfe6f51c; --border-soft:#dfe6f510;
    --text-primary:#eef1f8; --text-secondary:#aab2c4; --text-tertiary:#6b7282;
    --accent:#6f86ff; --accent-soft:#6f86ff22; --accent-strong:#93a6ff; --text-on-accent:#08101f;
    --cobalt:#4fd0c4; --cobalt-soft:#4fd0c418;
  }
}

/* ===================== PALETTE · CLAY (KMU / AI-Fluency, warm-editorial) ===================== */
:root[data-palette="clay"] {
  --bg-base:#f7f3ee; --bg-card:#fffdfa; --bg-tint:#efe8df;
  --border:#2a201a1c; --border-soft:#2a201a0e;
  --text-primary:#1d150f; --text-secondary:#5a4f45; --text-tertiary:#948578;
  --accent:#cc785c; --accent-soft:#cc785c1f; --accent-strong:#a85638; --text-on-accent:#2b1409;
  --cobalt:#2a7d6d; --cobalt-soft:#2a7d6d14;
}
:root[data-palette="clay"][data-theme="dark"] {
  --bg-base:#16110d; --bg-card:#221b15; --bg-tint:#1c1610;
  --border:#f4ece21c; --border-soft:#f4ece210;
  --text-primary:#f4ece2; --text-secondary:#c0b1a2; --text-tertiary:#7f7163;
  --accent:#e0926f; --accent-soft:#e0926f22; --accent-strong:#ecaa8b; --text-on-accent:#1d0f08;
  --cobalt:#5fc0ac; --cobalt-soft:#5fc0ac18;
}
@media (prefers-color-scheme: dark) {
  :root[data-palette="clay"]:not([data-theme="light"]) {
    --bg-base:#16110d; --bg-card:#221b15; --bg-tint:#1c1610;
    --border:#f4ece21c; --border-soft:#f4ece210;
    --text-primary:#f4ece2; --text-secondary:#c0b1a2; --text-tertiary:#7f7163;
    --accent:#e0926f; --accent-soft:#e0926f22; --accent-strong:#ecaa8b; --text-on-accent:#1d0f08;
    --cobalt:#5fc0ac; --cobalt-soft:#5fc0ac18;
  }
}
```

### 3.2 `lib/mode.js` — Palette als vierter Mode

```js
const DEFAULTS = {
  layout: 'slide', theme: 'auto', llm: false, exercises: false,
  palette: 'codex',                       // NEU: 'codex' | 'cobalt' | 'clay'
};
const VALIDATORS = {
  // …bestehende…
  palette: (v) => v === 'codex' || v === 'cobalt' || v === 'clay',   // NEU
};
```

Im Konstruktor nach `this.#applyTheme();` ergänzen: `this.#applyPalette();`
In `set()` analog zum Theme: `if (key === 'palette') this.#applyPalette();`
Neue private Methode (spiegelt `#applyTheme`):

```js
#applyPalette() {
  const p = this.state.palette;
  if (p === 'codex') {
    document.documentElement.removeAttribute('data-palette');
  } else {
    document.documentElement.dataset.palette = p;
  }
}
```

Persistenz, Validierung und das `change`-Event laufen über die bestehende `set()`-Mechanik —
kein Zusatzcode nötig. `Storage` speichert automatisch als `mode.palette`.

### 3.3 `index.html` — Toolbar-Toggle-Gruppe

Analog zur Theme-Gruppe (aktuell ~Z. 29–31) eine zweite Gruppe einfügen. Der generische
Handler in `app.js` (Z. 272–296) verarbeitet jede `.toggle[data-mode]`-Gruppe **automatisch**
(setzt `mode`, synct `aria-pressed`) — **kein neues JS in `app.js` nötig.**

```html
<div class="toggle-group palette-toggle-group" role="group" aria-label="Farbvariante">
  <button class="toggle toggle-icon palette-toggle" data-mode="palette" data-value="codex" title="Lime" aria-label="Palette Lime" aria-pressed="false"><span class="palette-dot palette-dot-lime" aria-hidden="true"></span></button>
  <button class="toggle toggle-icon palette-toggle" data-mode="palette" data-value="clay" title="Clay" aria-label="Palette Clay" aria-pressed="false"><span class="palette-dot palette-dot-clay" aria-hidden="true"></span></button>
  <button class="toggle toggle-icon palette-toggle" data-mode="palette" data-value="cobalt" title="Cobalt" aria-label="Palette Cobalt" aria-pressed="false"><span class="palette-dot palette-dot-cobalt" aria-hidden="true"></span></button>
</div>
```

Mini-CSS für den Punkt gehört in `app.css`, weil die Toolbar globaler App-Shell-Code ist.
Keine Inline-Farben ins Markup schreiben; die Swatches bekommen Klassen
`.palette-dot-lime`, `.palette-dot-clay`, `.palette-dot-cobalt`.

> Hinweis: `app.js` Z. 62–63 setzt aktuell explizit Sun/Moon-Icons für die Theme-Buttons.
> Für die Palette-Buttons reicht der farbige Punkt; **keine** analoge Icon-Injection nötig.

---

## 4. Token-Tabellen (maßgeblich)

Werte identisch zu §3.1 — hier mit Verwendungszweck. Produktions-Tokennamen.

### 4.1 Cobalt

| Token | Light | Dark | Wirkt auf |
|---|---|---|---|
| `--bg-base` | `#f7f8fb` | `#0a0c12` | Body / Paper (kühl) |
| `--bg-card` | `#ffffff` | `#14171f` | Karten, Slide-Fläche |
| `--bg-tint` | `#eef1f7` | `#11141b` | Header-/Footer-Strip, Callout, Hover |
| `--border` | `#0a0e1a1c` | `#dfe6f51c` | Trennlinien |
| `--border-soft` | `#0a0e1a0e` | `#dfe6f510` | leichte Trennung |
| `--text-primary` | `#0b1020` | `#eef1f8` | Headlines, Haupttext |
| `--text-secondary` | `#3c4356` | `#aab2c4` | Body |
| `--text-tertiary` | `#818796` | `#6b7282` | Labels, Mute |
| `--accent` | `#1f3df0` | `#6f86ff` | **Marke:** Caret, Kicker-Akzent, aktive Tabs, Token-Pill-Glow, Pull-Quote-Border, aktiver Phase-Rand, Timeline-Mitte |
| `--accent-soft` | `#1f3df014` | `#6f86ff22` | Token-Background, aktive-Tab-Fläche |
| `--accent-strong` | `#1733c0` | `#93a6ff` | Akzent als **Text** (Kicker, aktive Tab-Beschriftung, Crumb-Chapter) |
| `--text-on-accent` | `#ffffff` | `#08101f` | Text auf Akzentfläche (Token-Pill-Hover) |
| `--cobalt` | `#0c7d7d` | `#4fd0c4` | **Verweise/Links/Cites**, Übungsbox-Border, `.tok-cobalt` (Teal, klar von Marke getrennt) |
| `--cobalt-soft` | `#0c7d7d14` | `#4fd0c418` | Übungsbox-Fläche, `.tok-cobalt`-Background |

### 4.2 Clay

| Token | Light | Dark | Wirkt auf |
|---|---|---|---|
| `--bg-base` | `#f7f3ee` | `#16110d` | Body / Paper (creme/warm) |
| `--bg-card` | `#fffdfa` | `#221b15` | Karten, Slide-Fläche |
| `--bg-tint` | `#efe8df` | `#1c1610` | Header-/Footer-Strip, Callout, Hover |
| `--border` | `#2a201a1c` | `#f4ece21c` | Trennlinien |
| `--border-soft` | `#2a201a0e` | `#f4ece210` | leichte Trennung |
| `--text-primary` | `#1d150f` | `#f4ece2` | Headlines, Haupttext |
| `--text-secondary` | `#5a4f45` | `#c0b1a2` | Body |
| `--text-tertiary` | `#948578` | `#7f7163` | Labels, Mute |
| `--accent` | `#cc785c` | `#e0926f` | **Marke:** wie Cobalt (Caret, Kicker, aktive Tabs, …) |
| `--accent-soft` | `#cc785c1f` | `#e0926f22` | Token-Background, aktive-Tab-Fläche |
| `--accent-strong` | `#a85638` | `#ecaa8b` | Akzent als **Text** |
| `--text-on-accent` | `#2b1409` | `#1d0f08` | Text auf Akzentfläche — **dunkel, NICHT weiss** (s. §5) |
| `--cobalt` | `#2a7d6d` | `#5fc0ac` | **Verweise/Links/Cites** (warmes Teal) |
| `--cobalt-soft` | `#2a7d6d14` | `#5fc0ac18` | Übungsbox-Fläche, `.tok-cobalt`-Background |

### 4.3 Geerbt (NICHT überschreiben — bleibt Codex)

| Token | Light | Dark | Rolle |
|---|---|---|---|
| `--crimson` | `#c4304a` | `#e8627c` | Stop / Errata / falsche Antwort |
| `--signal` / `--success` | `#16a674` | `#56d6a8` | OK / Done / richtige Antwort |
| `--success-soft` | `#16a67414` | `#56d6a814` | OK-Background |
| `--warn` | `#d68410` | `#f0b54a` | Prüfen / Caution |

---

## 5. Kontrast / Accessibility (AA, geprüft)

Diese Paare wurden gegen WCAG 2.1 AA (4.5:1 Normaltext) geprüft und sind in §3.1/§4 bereits
korrigiert eingearbeitet:

- **Cobalt-Link** `#0c7d7d` auf `#ffffff` ≈ **5.0:1** ✓ (das ungesättigtere `#0f8a8a` aus der
  Preview lag bei 4.2:1 → bewusst nachgedunkelt; Hue praktisch identisch).
- **Clay-Link** `#2a7d6d` auf `#fffdfa` ≈ **5.0:1** ✓ (analog nachgedunkelt).
- **Clay `--text-on-accent` ist dunkel (`#2b1409`), nicht weiss.** Weiss auf Clay `#cc785c`
  ergibt nur **3.3:1** (Fail). Dunkler Text auf Clay ≈ **6.3:1** ✓. Cobalt-Akzent ist dunkel
  genug für weissen On-Accent-Text (`#1f3df0` ≈ 7:1 ✓).
- `--accent-strong` ist in beiden Light-Paletten der **Text-taugliche** Akzentton
  (Cobalt `#1733c0` ≈ 8:1, Clay `#a85638` ≈ 5.2:1). Der reine `--accent` ist für Flächen/
  Borders/Caret gedacht, **nicht** für kleinen Text.

**Pflicht beim Bau:** Nach Integration für jede Palette × {light, dark} mindestens prüfen:
Kicker, Body-Text, Status-Pills, Token-Pill-Hover, Cite-Links, Quiz-Choices. Kein
Token-Paar darf unter 4.5:1 fallen (3:1 für ≥24px/Bold-Grosstext).

---

## 6. Acceptance-Kriterien

1. Toolbar zeigt drei Palette-Buttons; Auswahl wechselt die Farben sofort, ohne Reload.
2. Auswahl überlebt Reload (persistiert als `mode.palette`).
3. Palette **und** Theme sind unabhängig kombinierbar — alle 3×3 Kombinationen
   (codex/cobalt/clay × auto/light/dark) rendern korrekt, inкл. OS-Auto-Dark.
4. Kein `data-palette`-Attribut (codex) ⇒ exakt der heutige Zustand, pixelidentisch.
5. Funktionale Farben (Stop/OK/Prüfen) sehen in allen Paletten gleich aus.
6. Keine hartcodierte Komponentenfarbe wurde eingeführt; produktive Farbwirkung kommt aus
   Tokens in `tokens.css`. Ausnahme: die drei reinen Toolbar-Swatch-Farben in `app.css`, die
   keine Komponenten einfärben, sondern die Palettenauswahl sichtbar machen.
7. Print/Handout (`print.css`) unverändert lauffähig (nutzt eigene Tokens; Palette-Achse
   muss dort nicht greifen — Default Codex genügt, sofern kein Regressionsfehler).

### 6.1 Tests

- Bestehende Suite grün halten: `npm test` (vitest) — insb. `tests/deck-integrity.test.js`,
  `tests/codex-v2-polish.test.js`, `tests/volatile-facts.test.js`.
- **Neuer Test** (`tests/palette-variants.test.js`): (a) `ModeManager` akzeptiert nur
  `codex|cobalt|clay` und persistiert; (b) `#applyPalette` setzt/entfernt `data-palette`
  korrekt (codex ⇒ kein Attribut); (c) für jede Palette sind in `tokens.css` `--accent`, `--cobalt`,
  `--bg-base`, `--text-on-accent` in Light **und** Dark deklariert.
- Service-Worker-Cache-Version (`sw.js`) bumpen, da `tokens.css`/`app`/`index.html` ändern.

---

## 7. Was NICHT angefasst wird

- `presentation.css`-Komponenten.
- Slide-Markup in `index.html` (außer der Toolbar-Toggle-Gruppe).
- `--crimson` / `--signal` / `--warn` / `--success*` (bleiben Codex).
- Typografie, `--radius-*`, `--space-*`, `--shadow-*`, Motion-Tokens.
- `app.js`-Logik (der generische `data-mode`-Handler reicht).
- Die Standalone-Datei `farbvarianten-preview.html` (Explorations-Artefakt, nicht Teil des Builds).
```
