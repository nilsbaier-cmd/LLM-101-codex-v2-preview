# LLM 101 — Interaktive Präsentation

Hybrid Slide/Scroll-Präsentation als Einführung in Large Language Models am Beispiel von Claude. Statisches HTML/CSS/JS, kein Build-Step, self-hosted Fonts, DSGVO-konform.

## Inhalt

- `index.html` — Hauptpräsentation, 22 Folien in 7 Kapiteln, Vortrags- und Lesemodus, Hell/Dunkel/Auto-Theme, optional LLM-agnostische Tabs (Claude / ChatGPT / Gemini) und Übungen
- `meine-notizen.html` — Sammelseite für eigene Reflexionsantworten mit Markdown-Export
- `explainer/*.html` — Sieben standalone Concept-Explainer (A–G):
  - A — Context Window Simulator
  - B — Chat vs. Project
  - C — Skill-Architektur (Progressive Disclosure)
  - D — Skill-Ladder Selbsttest
  - E — Fünf Phasen der KI-Nutzung
  - F — Verwaltung & KI (erlaubt / bedingt / verboten)
  - G — Welches Modell für deine Aufgabe?

## Lokal starten

ES-Module funktionieren nicht über `file://` — du brauchst einen lokalen HTTP-Server:

```bash
cd claude-praesentation
python3 -m http.server 8765
# dann http://localhost:8765 im Browser öffnen
```

## Entwicklung

```bash
npm install   # Vitest installieren (nur für Unit-Tests)
npm test      # Tests laufen lassen
```

Auslieferung bleibt build-frei. `node_modules/` und `tests/` sind Dev-Artefakte.

## Architektur

- **Vanilla JS, ES-Module** — kein Bundler
- **Design-Tokens** in `tokens.css`, Komponenten in `app.css` + `presentation.css`
- **Lib-Module** unter `lib/` (Storage, ModeManager, Icons, Tabs, Exercises, Notes-Export)
- **LocalStorage-Namespace** `llm-101-v1.*`
- **Hash-Routing** für direkte Folien-Verlinkung (`#einstieg-3`)
- **Self-hosted Fonts** in `assets/fonts/` (Hanken Grotesk, JetBrains Mono — latin + latin-ext)

## Hintergrund

Spec und Implementation-Plan unter [`docs/superpowers/`](docs/superpowers/) — historische Artefakte aus der Bauphase.

## Lizenz

Inhalte und Code zur freien Nutzung und Adaption für eigene Schulungs-Kontexte.
