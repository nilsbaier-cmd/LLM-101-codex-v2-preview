# Claude-Einführung — Interaktive Präsentation

Hybrid Slide/Scroll-Präsentation für Claude-Einführungs-Workshops. Wird ausschließlich als statische HTML/CSS/JS-Dateien ausgeliefert — kein Build-Step.

## Stand

In Vorbereitung. Spec und Implementation-Plan sind unter `docs/superpowers/` abgelegt.

- [Design-Spec](docs/superpowers/specs/2026-05-12-srege-praesentation-design.md)
- [Implementation-Plan](docs/superpowers/plans/2026-05-12-srege-praesentation-implementation.md)

## Spätere Nutzung

`index.html` per Doppelklick öffnen — keine Server-Installation nötig.

- `index.html` — Hauptpräsentation (v1 Claude-fokussiert / v2 LLM-agnostisch + Übungen)
- `meine-notizen.html` — Sammelseite für Reflexionsantworten
- `explainer/*.html` — Sieben standalone Concept-Explainer (A–G)

## Entwicklung

```bash
npm install   # Vitest installieren (nur für Unit-Tests)
npm test      # Tests laufen lassen
```

Auslieferung bleibt build-frei. `node_modules/` und Tests sind Dev-Artefakte.
