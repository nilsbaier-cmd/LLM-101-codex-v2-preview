---
title: Interaktive HTML-Präsentation Claude-Einführung — Design-Spec
created: 2026-05-12
status: draft
workstation: Claude-Schulung SREGE
---

# Interaktive HTML-Präsentation Claude-Einführung

Design-Dokument für die Überführung der bestehenden 1h-PowerPoint-Präsentation in eine interaktive, browserbasierte Lernumgebung mit zwei Modi (v1 Claude-fokussiert / v2 LLM-agnostisch mit Übungen) und sieben standalone Concept-Explainern.

## 1. Ziel & Kontext

Die bestehende SREGE-Einführung in Claude (25 Folien, 1h, PowerPoint, CD Bund) hat in Live-Workshops bewiesen, dass sie die Inhalte trägt — aber drei Schwächen sind aufgefallen:

- **Visualisierungen statisch.** Insbesondere das Context-Window-Konzept und die „progressive declaration" landen nicht so, wie Nils sie meint. Die aktuellen Folien zeigen Mechanik (Token-Bars, Aging) statt Konsequenz (was geht schief?).
- **Nur Claude-Sicht.** ChatGPT- und Gemini-Nutzer fühlen sich in der Präsentation nicht angesprochen — limitiert die Weiterverwendbarkeit ausserhalb von Claude-affinen Settings.
- **Keine Selbststudien-Tauglichkeit.** Die Folien sind für Live-Vortrag gemacht, nicht zum Vorab-Teilen oder Nachschlagen.

Das Projekt löst alle drei Schwächen in einer Codebasis: ein interaktiver HTML-Build, zwei Modi, sieben extrahierbare Explainer. Die generische Variante ohne SREGE/SEM-Bezüge macht das Material auch ausserhalb des SEM einsetzbar.

## 2. Architektur-Entscheidungen

Die zentralen Strukturentscheidungen aus dem Brainstorming:

- **Eine Codebasis, drei Outputs.** v1 ist die Vollpräsentation, v2 ist v1 mit zwei aktivierten Modi-Toggles (LLM-agnostisch + Übungen), Concept-Explainer sind aus v1-Folien extrahierte Single-Pages. Keine Doppelpflege.
- **Hybrid Slide/Scroll.** Ein Toggle oben rechts schaltet zwischen `Vortrag` (ein Konzept pro Bildschirm, Pfeiltasten-Navigation) und `Lesen` (lange scrollbare Seite mit Sticky-TOC). Beide Modi teilen dasselbe Markup.
- **Static HTML, kein Build-Step.** Vanilla HTML/CSS/JS, eine `index.html` pro Präsentation, eine `tokens.css` mit dem Design-System, ein `app.js` für Toggles und Interaktion. Concept-Explainer sind eigenständige HTML-Dateien, die `tokens.css` importieren. Output: per E-Mail/USB teilbare Dateien, läuft offline.
- **Persistenz lokal.** Reflexionsantworten der Teilnehmer landen im `localStorage` ihres Browsers, geschlüsselt nach Kapitel + Übungs-ID. Kein Server, kein Login, keine DSGVO-Hürde. Export als Markdown möglich.

## 3. Visuelles System

Anthropic-inspiriert, mit eigenem Akzent.

**Farbpalette**

| Token | Hell | Dunkel |
|---|---|---|
| `--bg-base` | `#fafaf7` | `#141413` |
| `--bg-card` | `#ffffff` | `#1f1d1b` |
| `--bg-tint` | `#faf7f0` | `#1a1817` |
| `--border` | `#e8e3d4` | `#2e2a26` |
| `--text-primary` | `#1a1817` | `#f5f1e9` |
| `--text-secondary` | `#6e6860` | `#a8a298` |
| `--text-tertiary` | `#8a847a` | `#8a847a` |
| `--accent` | `#cc785c` | `#e8a07c` |
| `--accent-soft` | `rgba(204,120,92,0.08)` | `rgba(232,160,124,0.12)` |
| `--success` | `#5fb37e` | `#86efac` |

**Typografie**

Hanken Grotesk (Google Fonts), Variable, Weights 400/500/600/700. Fallback `system-ui, sans-serif`. JetBrains Mono für Code-Blöcke.

Hierarchie:
- Kapitelüberschrift: 10px uppercase, letter-spacing 2px, Coral, weight 600
- Headline: 30px, weight 600, letter-spacing -0.025em
- Pull-Quote: 13px, italic, `--text-secondary`
- Body: 13–14px, weight 400, line-height 1.5
- Stat-Label: 10px, weight 500, letter-spacing 0.3px
- Stat-Wert: 22px, weight 600

**Icons**

Lucide-Style SVG Line-Icons, stroke-width 1.75, Coral als Standardfarbe, 14px Standard-Größe. Inline mit Body-Text. Keine Emojis im UI.

**Hell/Dunkel**

Beide Modi werden gleichwertig gepflegt. Default: `prefers-color-scheme` aus dem OS. Toggle oben rechts erlaubt manuelle Wahl, speichert in `localStorage`.

## 4. Inhalt & Struktur

### v1 — Kapitelstruktur (1h Vortragsmaterial)

Sieben Kapitel, ungefähr 22 Folien (gegenüber 25 in der bestehenden PowerPoint — die drei Context-Window-Folien werden zu einer konsolidiert):

1. **Einstieg & Standort** — Ecosystem-Cover, Phasen der KI-Nutzung, Skill-Ladder, Bill-Gates-Quote, Agenda
2. **Bund & KI** — 7 Leitlinien, Merkblatt, kritische Einordnung der Mythen
3. **Claude 101** — Modelle, Chat-Optionen, Einstellungen, Menü, Abos
4. **Context & Pflege** *(redesignt)* — Konsequenz-Vergleich (siehe §5.1), Pflege-Strategien
5. **Use Cases** — Sparringpartner, Ghostwriter, Data Analyst
6. **Skills** — Was, Architektur, Lifecycle, Demo
7. **Next Level** — Team-Repo, GitHub 101, Claude Code, Cowork

Genaue Slide-zu-Konzept-Mapping wird im Implementation-Plan ausdetailliert.

### v2 — Modi auf demselben Material

Zwei Toggle-Schalter oben rechts, beide unabhängig:

- **`LLM-Modus`** Tab-Switch auf den 4–6 Kernfolien (Modelle, Chat-Optionen, Skills, Pflege, plus zwei weitere). Tabs: `Claude · ChatGPT · Gemini`. Klick tauscht Screenshots, Begriffe und herstellerspezifische Details. Die konzeptionelle Erzählung bleibt identisch. Zweck: Teilnehmer sehen Claude im Vergleich, nicht als Werbeveranstaltung.
- **`Übungen`** Blendet eingebettete Übungsblöcke (siehe §6) ein/aus. Im Workshop-Modus aus, im Vorab/Selbststudium-Modus an.

Beide Toggles speichern ihren Zustand in `localStorage`.

### Concept-Explainer (sieben Standalone-Seiten)

Aus v1 extrahiert, jeweils als eigenständige HTML-Datei. Diese können einzeln per Mail/Link vor oder nach dem Workshop geteilt werden. Sie laden `tokens.css` und folgen demselben visuellen System.

| ID | Titel | Interaktion |
|---|---|---|
| A | Context Window & Pflege-Strategien | Live-Token-Budget-Simulator, drei Pflege-Buttons (Reset/Summarize/Progressive) |
| B | Chat vs. Project | Side-by-Side Toggle, identische Aufgabe, zwei Antworten |
| C | Skills — Progressive Disclosure | Drei-Ebenen-Architektur, Klick auf Ebene zeigt Inhalt + Token-Counter |
| D | Skill-Ladder Selbsttest | 5–7 Fragen, Score, Level-Reveal mit nächstem Schritt |
| E | Phasen der KI-Nutzung | Horizontale Timeline, Klick auf Phase zeigt Beispielprompt |
| F | Bund & KI — Erlaubt/Verboten | Aufgabenliste mit Ampel-Logik, Filter-Toggles |
| G | Welches Modell wählen? | Mini-Decision-Tree, 2–3 Fragen, Empfehlungs-Output |

## 5. Schlüssel-Visualisierungen

### 5.1 Context-Window-Hauptfolie (Konsequenz-Vergleich)

Die zentrale Redesign-Folie. Statt Token-Mechanik wird die Konsequenz gezeigt: zwei parallele Chat-Verläufe nebeneinander, gleiche Aufgabe, eine Frage am Ende. Links (alles auf einmal): Antwort ist falsch oder erfunden, weil relevante Info „rausgefallen" ist. Rechts (progressiv): Antwort ist korrekt.

Aufbau:
- Zwei Spalten mit gleicher Struktur
- Pro Spalte: Label, Liste der Kontext-Bestandteile mit Mengenangaben, Trennlinie, gemeinsame Frage, Antwort (rot/grün eingefärbt)
- Inhaltselemente verwenden Lucide-Line-Icons (Paperclip für Anhänge, File-Text für Anweisungen, Message-Square für Verlauf)
- Hinweis-Box am Folienende: „Wie pflegt man das? → Concept-Explainer A"

### 5.2 Context-Window Concept-Explainer (interaktive Mechanik)

Eigenständige Single-Page. Eingabefeld oben („Tippe eine Nachricht ..."). Beim Tippen füllt sich ein gestaffelter Token-Budget-Balken live. Bei Auslastung > 100% werden älteste Nachrichten visuell durchgestrichen.

Drei Pflege-Buttons unter dem Balken:
- `↺ Reset` — leert den Verlauf, Balken auf 0
- `∑ Summarize` — ersetzt älteste 3 Nachrichten durch eine kompakte Zusammenfassung
- `⤴ Progressive` — markiert nur die letzten N Nachrichten als „aktiv", ältere kommen in einen separaten Speicher (sichtbar, aber nicht im aktiven Budget)

Zweck: die Mechanik wird ausprobiert, nicht nur erklärt.

### 5.3 Skill-Architektur Concept-Explainer

Die drei progressiv geladenen Ebenen (YAML-Frontmatter → SKILL.md-Body → verlinkte Dateien) als anklickbares Stack-Diagramm. Klick auf Ebene 1 zeigt was im System-Prompt landet (~50 Tokens). Klick auf Ebene 2 zeigt den geladenen Body (~2000 Tokens). Klick auf Ebene 3 zeigt nachgeladene Dateien (variable Tokens). Token-Counter zählt live mit. Erklärt, warum Skills günstiger sind als „alles immer mitgeben".

### 5.4 Skill-Ladder-Selbsttest

5–7 Multiple-Choice-Fragen über das Nutzungsverhalten („Wie startest du normalerweise einen Chat?", „Hast du Custom Instructions geschrieben?", „Nutzt du wiederverwendbare Prompts?"). Antwortmuster mappt auf einen Level (Prompter → Workflow Designer). Output: „Du bist auf Level 3. Der nächste Sprung ist ..." mit konkreter Handlungsempfehlung.

## 6. Übungen (nur in v2-Modus sichtbar)

Drei Typen, eine pro Kapitel, insgesamt 7 Übungen.

### 6.1 Typ 1 — Reflexion

Kurze Frage am Kapitelende, `<textarea>` für freie Antwort, kein Multiple-Choice. Verknüpft Konzept mit eigenem Arbeitsalltag (Kolbsches Erfahrungslernen). Antwort wird in `localStorage` gespeichert.

**Persistenz-Design:**
- Speicherschlüssel: `srege-praesentation-v1.notiz.{kapitel-id}.{uebungs-id}`
- Antwort bleibt erhalten, solange Browser-Cache nicht gelöscht wird
- Zentrale **„Meine Notizen"-Seite** (eigene HTML-Datei `meine-notizen.html`) sammelt alle Antworten chronologisch, zeigt Kapitel + Frage + Antwort
- Counter neben der Übung („Meine Notizen (3)") zeigt, wie viele Reflexionen bereits beantwortet sind
- **Markdown-Export** als Download-Button auf der Notizen-Seite — Teilnehmer kann seine Lernspur in Obsidian/Word/Project mitnehmen
- Footer-Hinweis: „Browser-Cache wird gelöscht? Lade deine Notizen vorher herunter."

### 6.2 Typ 2 — Hands-on

Kopierbare Prompt-Vorlage. Bei Übungen, die Kontext-Effekte zeigen (z.B. Chat vs. Project), kommen **zwei Copy-Blöcke**: einer für den Prompt, einer für ein generisches Hausstil-Glossar zum Ausprobieren. „Was du erwarten kannst"-Hinweis darunter, damit auch Teilnehmer, die die Übung überspringen, den Lerneffekt mitnehmen.

### 6.3 Typ 3 — Mini-Quiz

3–4 Antwort-Buttons, sofortiges Feedback richtig/falsch mit 1-Satz-Begründung. **Kein Cross-Quiz-Score** — jedes Quiz steht für sich. Adressiert typische Misconceptions (z.B. „Was passiert wenn Context Window voll ist?").

### 6.4 Verteilung über Kapitel

| Kapitel | Übungstyp |
|---|---|
| Bund & KI | Reflexion |
| Claude 101 (Modelle) | Mini-Quiz |
| Context & Pflege | Mini-Quiz |
| Use Cases | Reflexion |
| Skills | Hands-on |
| Skill-Ladder *(Standalone-Explainer D)* | Reflexion |
| Chat vs. Project *(Standalone-Explainer B)* | Hands-on |

## 7. Tech-Stack & File-Struktur

Vanilla HTML/CSS/JS, kein Build, keine npm-Abhängigkeiten. Externe Ressourcen: Google Fonts (Hanken Grotesk, JetBrains Mono).

```
claude-praesentation/
├── tokens.css              Design-System (Farben, Typo, Spacing)
├── app.css                 Layout + Komponenten-Styling
├── app.js                  Slide/Scroll-Toggle, Modi, LocalStorage, Quiz-Logik
├── index.html              Hauptpräsentation (v1 + v2 in einer Datei)
├── meine-notizen.html      Sammelseite für Reflexionsantworten
├── lib/
│   ├── lucide-icons.js     Inline-SVG-Helper für Line-Icons
│   └── markdown-export.js  Notizen → Markdown Download
└── explainer/
    ├── a-context-window.html
    ├── b-chat-vs-project.html
    ├── c-skills-architektur.html
    ├── d-skill-ladder.html
    ├── e-phasen.html
    ├── f-bund-erlaubt.html
    └── g-modellwahl.html
```

Alle Explainer-Dateien sind selbsttragend (importieren `../tokens.css` und `../app.css`, sonst keine Abhängigkeit zur Hauptpräsentation). Teilbar einzeln.

**State-Management:** alles in `localStorage`. Keys-Namespace: `srege-praesentation-v1.*`. Vier Buckets:
- `.mode.{slide-scroll|theme|llm|exercises}` — Modi und Theme-Wahl
- `.notiz.{kapitel}.{uebung}` — Reflexionsantworten
- `.quiz.{kapitel}.{uebung}.attempts` — Quiz-Versuche (optional, ohne Score-Aggregation)
- `.simulator.{explainer-id}.*` — Zustand interaktiver Explainer

## 8. Scope für initiale Lieferung

In Scope:
- Vollständige v1-Präsentation mit allen Kapiteln aus §4
- Slide/Scroll-Toggle + Hell/Dunkel-Toggle funktional
- v2-Modi (LLM-Tabs + Übungen-Toggle) funktional
- Alle sieben Concept-Explainer A–G
- Meine-Notizen-Seite mit Markdown-Export
- Hell- und Dunkelmodus durchgepflegt

Nicht in initialer Lieferung (verschoben):
- Animations-Politur (Übergänge, Mikro-Interaktionen)
- Mehrsprachigkeit (französisch/italienisch)
- A11y-Audit nach WCAG 2.1 AA — wird in Plan-Phase entschieden, ob Teil des Initial-Scopes
- Print-Stylesheet (PDF-Export aus Browser)

## 9. Verifikation

Die Lieferung gilt als fertig, wenn:
- Beide Modi auf einem Standardbrowser (Chrome, Firefox, Safari) ohne Console-Errors laufen
- LocalStorage-Persistenz nach Browser-Refresh erhalten bleibt
- Hell/Dunkel sauber umschaltet, kein Stil-Bruch
- Alle sieben Explainer als isolierte Dateien funktionieren (Test: einzelne Datei in ein leeres Verzeichnis kopieren + öffnen)
- Markdown-Export der Notizen valides Markdown produziert
- Eine Probe-Schulung mit drei Test-Personen (eine Claude-affin, eine ChatGPT-affin, eine Neuling) keine Show-Stopper findet

## 10. Risiken & Offene Punkte

- **localStorage-Volatilität.** Bei Browser-Cache-Clear gehen Notizen verloren. Wird im Footer transparent gemacht, Markdown-Export ist das Backup. Wenn das nicht reicht, müsste später ein Sync via z.B. WebDAV/IndexedDB+Export angedacht werden — nicht in initialer Lieferung.
- **Google-Fonts-Abhängigkeit.** Wenn die Präsentation offline läuft, fehlen die Schriften. Mitigation: Fonts selbst hosten (kleine Anpassung im Plan).
- **Bundes-Audience-Toleranz für Dark Mode.** Der dunkle Look ist zwar Anthropic-treu, aber im Beamer-Setup eines Verwaltungs-Sitzungsraums kann er ungewohnt wirken. Default-Mode für Workshops wird `light` sein, Theme-Toggle bleibt verfügbar.
- **v2-Übungen brauchen redaktionelle Arbeit.** Die konkreten Übungstexte (Reflexion-Fragen, Hands-on-Glossare, Quiz-Fragen) sind im Brainstorming nur exemplarisch festgehalten. Vor Auslieferung: alle 6–7 Übungen final formulieren und gegenlesen.
- **Aktualität der Anthropic-Coral-Werte.** `#cc785c` ist mein angenäherter Wert. Wenn Nils das echte Anthropic-Coral aus der Marken-Doku will, ist das eine kleine Anpassung.
- **Skill-Ladder-Mapping.** Die 5–7 Quiz-Fragen für Explainer D müssen sauber auf die 7 Levels mappen — das ist eine inhaltliche Arbeit, die in der Plan-Phase präzisiert wird.

## 11. Nächste Schritte

1. Nils gegenliest dieses Spec und bestätigt oder korrigiert
2. Nach Bestätigung: Implementation-Plan schreiben (mit konkreten Aufgaben, geordnet nach Abhängigkeit)
3. Implementation-Plan wird als zweites Dokument im selben Ordner abgelegt
