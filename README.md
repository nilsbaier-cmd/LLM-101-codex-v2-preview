# LLM 101 — Interaktive Präsentation

Hybrid Slide/Scroll-Präsentation als Einführung in Large Language Models mit konkreten Beispielen aus Claude, ChatGPT und Gemini. Statisches HTML/CSS/JS, kein Build-Step, self-hosted Fonts, DSGVO-konform.

## Inhalt

- `index.html` — Hauptpräsentation, 35 Folien in 7 Kapiteln, Vortrags- und Lesemodus, Hell/Dunkel/Auto-Theme, optional LLM-agnostische Tabs (Claude, ChatGPT und Gemini) und Übungen
- `meine-notizen.html` — Sammelseite für eigene Reflexionsantworten mit Markdown-Export
- `handout.html` — druckbarer One-Pager für Teilnehmende
- `trainer-export.html` — Moderationsblatt mit Abläufen, Fallbacks, Demo-Checklisten und Prompts
- `quellen-refresh.html` — Wartungsseite für volatile Quellen und Faktenchecks
- `design-variants.html` — zwei isolierte Look-&-Feel-Studien mit je fünf Beispiel-Folien, Light/Dark und bestehenden Fonts
- Lernpfad-Kompass — direkt in `index.html`, lokal gespeicherter Fortschritt für Einsteiger-, Praxis-, Power-User- und Governance-Pfad
- Trainer-Cockpit — aktivierbar über `index.html?trainer=1`, mit Ablaufvarianten, Sprecherhinweisen, Fallbacks und Demo-Prompts
- AI-Bridge-Integration — gezielt über Mentalmodell, Promptathon Mini, Kontextarchitektur, Annahmenprüfung, Use-Case-Bank und Monday Morning Kit integriert. LLM 101 bleibt kein generischer Promptathon, sondern ein verwaltungsnahes Workflow-Lernsystem.
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

Trainer-Ansicht:

```bash
http://localhost:8765/index.html?trainer=1
```

## Offline & Quellenstand

- `manifest.webmanifest` und `sw.js` machen die Präsentation nach dem ersten Laden offline-fähig. Der Service Worker funktioniert über HTTP(S), nicht direkt über `file://`.
- Für ZIP-Nutzung: Repo/Ordner vollständig mit `index.html`, `meine-notizen.html`, `app.js`, `lib/`, `explainer/`, `assets/`, CSS-Dateien, `manifest.webmanifest` und `sw.js` ausliefern; lokal per HTTP-Server öffnen.
- Für PDF/Deck-Handout: `index.html` im Browser öffnen und Drucken → Ziel „Als PDF sichern" wählen. `print.css` erzeugt 16:9-Seiten, zeigt alle Step-Reveals und blendet Navigations-UI aus.
- Für den kompakten One-Pager: `handout.html` öffnen und drucken.
- Volatile Folien sind im HTML mit `data-volatile="true"` und `data-checked` markiert. Stand der Anbieter- und Governance-Quellen: 16.05.2026.
- Offizielle Check-Links: [Claude-Pläne](https://support.claude.com/en/articles/11049762-choosing-a-claude-plan), [ChatGPT-Pläne](https://chatgpt.com/pricing/), [Gemini-Pläne](https://gemini.google/subscriptions/), [BK Kompetenznetzwerk KI](https://www.bk.admin.ch/bk/de/home/digitale-transformation-ikt-lenkung/kuenstliche_intelligenz/kinetzwerk.html), [SB021 KI-Teilstrategie](https://www.bk.admin.ch/bk/de/home/digitale-transformation-ikt-lenkung/vorgaben/sb021-strategie-einsatz-von-ki-systemen-in-der-bundesverwaltung.html).

## Entwicklung

```bash
npm install   # Dev-Tools installieren (Vitest + Playwright)
npm test      # Tests laufen lassen
npm run visual:qa  # QA-Screenshots in .visual-qa/ erzeugen
```

Auslieferung bleibt build-frei. `node_modules/` und `tests/` sind Dev-Artefakte.

## Deployment

- GitHub Pages wird über `.github/workflows/pages.yml` ausgeliefert, nicht mehr über den Legacy-Branch-Build.
- Der Workflow nutzt Node 24 (`FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true`, `node-version: 24`) und aktuelle first-party Actions.
- Vor dem Upload läuft `npm test`; veröffentlicht wird nur das statische Paket in `_site/` mit HTML, CSS, JS, `assets/`, `lib/`, `explainer/`, Manifest und README.

## Visuelle QA

- `lib/visual-qa-targets.js` definiert die wichtigsten Prüfansichten für manuelle oder browsergestützte Sichtkontrolle: Cover, X-Ray, Prompt-Labor auf Phone, Output-Qualitätscheck, Mini-Fallbibliothek, Vorher/Nachher, Codex-Brücke, Handout, Quellencheck, Trainer-Cockpit, Lernpfad-Panel und Dark Mode.
- `npm run visual:qa` startet lokal einen Server, öffnet alle Targets mit Playwright und schreibt Screenshots nach `.visual-qa/`. Beim ersten Mal ggf. `npx playwright install chromium` ausführen.
- Vor wichtigen Workshops: lokalen Server starten, die Targets nacheinander öffnen und auf Überlappungen, Lesbarkeit, Kontrast und den jeweils erwarteten Interaktionszustand prüfen.
- Safari/iPad-Härtung ist im CSS berücksichtigt (`100svh`, `-webkit-fill-available`, Text-Size-Adjust). Vor produktiven iPad-Workshops trotzdem einmal auf dem Zielgerät testen.

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
