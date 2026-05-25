# LLM-101 · Codex v2 — Design-Spezifikation

**Stand:** 2026-05-25  
**Branch:** `redesign/codex-v2`  
**Status:** Source of truth für den aktuellen Codex-v2-Preview-Stand

Dieses Dokument beschreibt den aktuellen 35-Folien-Deck-Stand. Historische 30-Folien-Planung, X-Ray-Prototypen und Paket-D1/D2/D3-Migrationsannahmen sind nicht mehr der aktive Arbeitsplan.

## Aktives Modell

- `index.html` enthält 35 Folien in 7 Kapiteln.
- Jede Folie ist ein `<section class="slide codex">` mit `data-slide-id`, `data-chapter` und `data-folio`.
- Hash-Routing nutzt `#{slideId}`, z.B. `#usecase-5`.
- Der globale Preview-Namespace ist `llm-101-codex-v2-preview`.
- Der Palette-Switcher bleibt im Preview für Design-Exploration verfügbar. Kurs- oder kundenspezifische Exporte dürfen ihn ausblenden.
- `docs/codex-mockup-reference.html` ist eine visuelle Referenz für Codex-DNA, nicht das Live-Inventar und nicht die aktuelle Folienzählung.

## Aktuelles Folieninventar

| Folio | data-slide-id | Chapter | Titel |
| --- | --- | --- | --- |
| 01 | `einstieg-1` | `einstieg` | Sprachmodelle, erklärt |
| 02 | `einstieg-2` | `einstieg` | Drei Jahre KI-Evolution — von Halluzination zu Integration |
| 03 | `einstieg-3` | `einstieg` | Von der Suchmaschinen-Logik zum Platform Architect |
| 04 | `grundlagen-1` | `grundlagen` | Ein LLM berechnet Fortsetzung, nicht Wahrheit |
| 05 | `einstieg-4` | `einstieg` | Zwölf Stationen — von mentalem Modell bis Agentik |
| 06 | `verwaltung-1` | `verwaltung` | Verantwortungsvolle KI-Nutzung ist kein Ausnahmefall |
| 07 | `verwaltung-2` | `verwaltung` | Kompetenzen aufbauen, Vertrauen verdienen, Effizienz steigern |
| 08 | `verwaltung-3` | `verwaltung` | Was darf KI vorbereiten — und wo ziehst du die Grenze? |
| 09 | `verwaltung-4` | `verwaltung` | Eine sichere Aufgabe wählen, bevor der erste Prompt entsteht |
| 10 | `claude-1` | `claude` | Opus, Sonnet, Haiku — und ihre Gegenstücke bei GPT und Gemini |
| 11 | `claude-2` | `claude` | Websuche, Artifacts, Projekte — was jede Plattform anders nennt |
| 12 | `claude-3` | `claude` | Persönlichkeit, Memory, Datenschutz — was jede Plattform speichert |
| 13 | `claude-3b` | `claude` | Prompt, Instructions, Memory, Project oder Skill? |
| 14 | `claude-4` | `claude` | Sidebar, Eingabefeld, Modellwahl — was wo klickt |
| 15 | `claude-5` | `claude` | Free, Pro, Max — und was die führenden Anbieter dafür verlangen |
| 16 | `context-1` | `context` | Context Window — zwei Strategien, sichtbar unterschiedliche Antworten. |
| 17 | `context-2` | `context` | Wie pflegt man das Context Window? Reset, Summarize, Progressive. |
| 18 | `context-quiz` | `context` | Was passiert, wenn das Context Window voll ist? |
| 19 | `usecase-1` | `usecases` | Sparringpartner — Annahmen prüfen, statt bestätigen lassen. |
| 20 | `usecase-2` | `usecases` | Ghostwriter — Erstentwurf in deinem Ton, statt leeres Blatt. |
| 21 | `usecase-3` | `usecases` | Data Analyst — Muster sichtbar machen, statt im Sheet suchen. |
| 22 | `usecase-lab` | `usecases` | Übungs-Labor: eigener Use Case ausprobieren. |
| 23 | `usecase-4` | `usecases` | Prompt wird Produkt — sechs Bausteine, sichtbar im Output. |
| 24 | `usecase-5` | `usecases` | Mehr Kontext ist nicht automatisch besser — Relevanz wird verdünnt. |
| 25 | `usecase-6` | `usecases` | Output prüfen: Annahmen markieren |
| 26 | `usecase-7` | `usecases` | Behörden-Use-Case-Bank |
| 27 | `usecase-8` | `usecases` | Vorher / Nachher — Muster erkennen ist schneller als Regeln lernen. |
| 28 | `skills-1` | `skills` | Was ist ein Skill? |
| 29 | `skills-2` | `skills` | Skill-Lifecycle |
| 30 | `skills-3` | `skills` | Demo Time! |
| 31 | `next-1` | `next-level` | Team-Repo als zentrale Wissensbasis |
| 32 | `next-2` | `next-level` | GitHub 101 |
| 33 | `next-3` | `next-level` | LLM überall |
| 34 | `next-5` | `next-level` | Chat, Project oder Codex? |
| 35 | `next-4` | `next-level` | Monday Morning Kit |

## Komponenten und Interaktionen

- `usecase-4` ist die Prompt-wird-Produkt-Folie. Interaktive Bausteine hängen an `[data-prompt-product]`.
- `usecase-5` ist die Context-Rot-Folie. Sie erklärt, dass mehr Kontext die Verlässlichkeit verdünnen kann; visuelle QA muss Chart, Textkarten und Footer ohne Überlappung prüfen.
- `context-1`, `context-2` und `context-quiz` bilden den Context-Window-Lernblock.
- `next-5` ist die Codex-Brücke; `next-4` ist der finale Transferanker.
- Sichtbare Folien-Footer müssen ihre Totals entweder dynamisch aus der echten Slide-Liste rendern oder mit der aktuellen Folienzahl übereinstimmen.

## Release- und QA-Erwartung

Vor Release müssen diese Gates bewusst bewertet werden:

```bash
npm test
npm run qa:redesign
npm run visual:qa
```

`npm test` ist der harte automatisierte Integritätsanker. `qa:redesign` und `visual:qa` bleiben Teil des Release-Gates, können aber in diesem Zwischenstand baseline-failing sein, bis die separaten Layout-/Target-Tasks abgeschlossen sind. Failing Baselines müssen im Release-QA-Dokument ehrlich markiert werden.

## Gestaltungsleitlinien

- Form erklärt Inhalt: Codex-DNA, klare Folienrahmen, sichtbarer Lernpfad-Fortschritt.
- Fokus auf Kerninhalt: keine doppelte Trainer-Navigation im Slide-Körper.
- Globale Toolbar bleibt global: Vortrag/Lesen, Theme, LLM-Tabs, Übungen, Lernpfad und Cockpit gehören in den Header.
- Palette-Switcher ist ein Preview-Werkzeug, kein zwingendes Kurs-UI.
- Context Rot ersetzt die frühere X-Ray-Erzählung als aktive usecase-5-Anforderung.
