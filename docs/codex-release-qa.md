# LLM-101 · Codex v2 — Release QA

**Branch:** `redesign/codex-v2`  
**Reviewed commit:** `b51f7ea` oder neuer  
**Deck-Stand:** 35 Folien in 7 Kapiteln  
**Automatisierte Testbasis:** Review-Baseline 31 Test-Files / 145 Tests; aktueller Stand 31 Test-Files / 156 Tests.  
**Stand:** 2026-05-25

Diese Datei ist der aktuelle Release-Gate-Überblick für den Codex-v2-Preview. Sie ersetzt ältere Paket-H-Notizen mit 30er-Zählung.

## Release Gates

| Gate | Erwartung | Aktueller Status |
| --- | --- | --- |
| `npm test` | Vollständige Vitest-Suite läuft grün. | PASS, 31 Test-Files / 156 Tests. |
| `npm run qa:redesign` | Redesign-, Layout- und Transfer-Checks laufen ohne neue Regressionen. | PASS, 5 Viewports mit je 58 geprüften Zuständen. |
| `npm run visual:qa` | Playwright-Screenshots werden erzeugt und die Zielzustände stimmen visuell. | PASS, alle Visual-QA-Targets erzeugt und stichprobenweise geprüft. |
| `npm audit --audit-level=moderate` | Keine undokumentierten moderaten Findings. | FAIL mit dokumentiertem dev-only Vitest/Vite/esbuild-Residual. |

`qa:redesign` und `visual:qa` waren in der Review-Baseline failing. Beide Gates sind nach dem Truth-Refresh repariert.

## Finaler Lauf vom 25.05.2026

- `npm test`: PASS, 31 Test-Files / 156 Tests.
- `npm run qa:redesign`: PASS für `desktop-720`, `desktop-768`, `wide-phone`, `phone-390`, `phone-375`.
- `npm run visual:qa`: PASS; Screenshots für Cover, Timeline final, Governance final, Settings, Prompt Product, Context Rot, Skill Anatomy, LLM überall final, Ghostwriter 375px, Lernpfad-Panel, Trainer-Cockpit und Dark Models erzeugt.
- `npm audit --audit-level=moderate`: FAIL; verbleibende Findings betreffen dev-only Tooling (`vitest`/`vite`/`esbuild`) und brauchen ein separates Force-Upgrade.
- GitHub-Pages-Workflow: installiert Chromium mit Playwright und führt `npm test`, `npm run qa:redesign` und `npm run visual:qa` vor dem Artifact-Upload aus.

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

## Screenshot-Skim

- Timeline final, Governance final, Settings, Prompt Product, Context Rot, Skill Anatomy und LLM überall final zeigen sichtbare Footer und keine abgeschnittenen Inhalte.
- Ghostwriter bei 375px zeigt keine horizontale Overflow-Situation; die Tabs umbrechen kontrolliert.
- Visual-QA blockt Service Worker, damit der Update-Banner nicht in Release-Screenshots hineinragt. Der Banner selbst bleibt fixed, kompakt und layout-neutral.
- Lernpfad-Panel und Trainer-Cockpit öffnen ohne die aktive Folie unkontrolliert zu verschieben.

## Bekannte Restpunkte

- `npm audit fix` aktualisiert `ws` auf `8.21.0`. `npm audit --audit-level=moderate` meldet danach weiterhin moderate Findings in dev-only Tooling (`vitest`/`vite`/`esbuild`). Der ausgelieferte GitHub-Pages-Preview ist statisches HTML/CSS/JS und enthält keinen Dev-Server; ein Force-Upgrade auf Vitest/Vite 4.x bleibt separat zu planen.
- `docs/codex-mockup-reference.html` enthält weiterhin historische Mockup-Zustände und ist nur visuelle Referenz, nicht Live-Inventar.

## Release-Empfehlung

Aus QA-Sicht ist die Codex-v2-Preview wieder releasefähig, mit dem dokumentierten dev-only Audit-Residual als separates Dependency-Upgrade-Thema.
