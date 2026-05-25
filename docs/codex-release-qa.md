# LLM-101 · Codex v2 — Release QA

**Branch:** `redesign/codex-v2`  
**Reviewed commit:** `b51f7ea` oder neuer  
**Deck-Stand:** 35 Folien in 7 Kapiteln  
**Automatisierte Testbasis:** Review-Baseline 31 Test-Files / 145 Tests; aktuelle Suite wächst mit den Truth-Refresh-Regressionstests.  
**Stand:** 2026-05-25

Diese Datei ist der aktuelle Release-Gate-Überblick für den Codex-v2-Preview. Sie ersetzt ältere Paket-H-Notizen mit 30er-Zählung.

## Release Gates

| Gate | Erwartung | Aktueller Status |
| --- | --- | --- |
| `npm test` | Vollständige Vitest-Suite läuft grün. | Muss vor Release grün sein. |
| `npm run qa:redesign` | Redesign-, Layout- und Transfer-Checks laufen ohne neue Regressionen. | Baseline-failing, bis die offenen Layout-/Target-Tasks abgeschlossen sind. |
| `npm run visual:qa` | Playwright-Screenshots werden erzeugt und die Zielzustände stimmen visuell. | Baseline-failing, bis die offenen Visual-QA-Targets aktualisiert sind. |

Wenn `qa:redesign` oder `visual:qa` wegen bekannter Baseline-Probleme fallen, ist das kein stiller Pass. Der konkrete Failure gehört in den Release-Bericht und muss durch die nachfolgenden Layout-/Target-Tasks geschlossen werden.

## Manuelle Checks

- `index.html` lokal über HTTP öffnen; Console und Network auf Errors, Warnings und 404er prüfen.
- Header-Controls prüfen: Vortrag/Lesen, Light/Dark/Auto, LLM-Tabs, Übungen, Lernpfad und Trainer-Cockpit.
- Palette-Switcher im Preview prüfen; für Kurs-Exports bestätigen, dass er bei Bedarf ausgeblendet werden kann.
- Hash-Routing für Kernfolien prüfen: `#einstieg-1`, `#context-1`, `#usecase-4`, `#usecase-5`, `#next-5`, `#next-4`.
- Context Rot auf `usecase-5` prüfen: Chart, Erklärungskarten und Footer dürfen sich auf Desktop und Mobile nicht überlappen.
- Mobile 375px und 390px prüfen: keine horizontale Scrollbar, Toolbar wrappt sauber, Footer bleibt lesbar.
- Print-Preview A4 quer prüfen: 35 Folien lesbar, Navigation ausgeblendet, keine abgeschnittenen Token-Pills.
- Reduced Motion prüfen: Animationen und Caret-Effekte dürfen nicht irritierend blinken.
- Volatile Folien prüfen: `data-volatile="true"` und `data-checked` sind sichtbar über `.slide-stand`.
- Trainer-Cockpit mit `?trainer=1` prüfen: Notizen, Fallbacks und Demo-Prompts passen zur aktiven Folie.

## Bekannte Restpunkte

- `qa:redesign` und `visual:qa` sind Release-Gates, aber derzeit ehrlich als baseline-failing zu behandeln, bis die separaten Layout- und Target-Aufgaben gelöst sind.
- `npm audit fix` aktualisiert `ws` auf `8.21.0`. `npm audit --audit-level=moderate` meldet danach weiterhin moderate Findings in dev-only Tooling (`vitest`/`vite`/`esbuild`). Der ausgelieferte GitHub-Pages-Preview ist statisches HTML/CSS/JS und enthält keinen Dev-Server; ein Force-Upgrade auf Vitest/Vite 4.x bleibt separat zu planen.
- `docs/codex-mockup-reference.html` enthält weiterhin historische Mockup-Zustände und ist nur visuelle Referenz, nicht Live-Inventar.

## Release-Empfehlung

Release erst empfehlen, wenn `npm test` grün ist, die beiden QA-Baselines entweder repariert oder explizit im Release-Bericht akzeptiert sind, und die manuellen Checks für den Ziel-Workshop durchgeklickt wurden.
