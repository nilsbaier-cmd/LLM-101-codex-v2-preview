export const LEARNING_PATHS = [
  {
    id: 'einsteiger',
    title: 'Einsteiger',
    duration: '30 min',
    description: 'Grundbegriffe, sichere Nutzung und erste eigene Prompts.',
    stations: ['einstieg-1', 'einstieg-2', 'einstieg-3', 'verwaltung-1', 'claude-1', 'context-1', 'usecase-lab', 'usecase-6', 'usecase-8', 'next-4']
  },
  {
    id: 'praxis',
    title: 'Praxis',
    duration: '45 min',
    description: 'Vom eigenen Arbeitsfall zum brauchbaren Prompt und Ergebnis.',
    stations: ['verwaltung-2', 'claude-2', 'context-1', 'context-2', 'usecase-4', 'usecase-5', 'usecase-lab', 'usecase-6', 'usecase-7', 'usecase-8', 'skills-3', 'next-4']
  },
  {
    id: 'power-user',
    title: 'Power User',
    duration: '45 min',
    description: 'Projects, Skills, GitHub und Workflow-Denken für fortgeschrittene Nutzung.',
    stations: ['claude-3', 'claude-4', 'usecase-7', 'skills-1', 'skills-2', 'skills-3', 'next-2', 'next-3', 'next-5', 'next-4']
  },
  {
    id: 'governance',
    title: 'Führung & Governance',
    duration: '38 min',
    description: 'Nutzungskompetenz, Grenzen, Verantwortung und Rollout-Fragen.',
    stations: ['verwaltung-1', 'verwaltung-2', 'claude-5', 'context-1', 'usecase-1', 'usecase-6', 'usecase-7', 'next-1', 'next-3', 'next-5', 'next-4']
  }
];

export const TRAINER_VARIANTS = [
  {
    id: '60',
    label: '60 min',
    checkpoints: [
      '0-5: Warum LLM 101, Erwartungen klären',
      '5-15: Verwaltung & sichere Nutzung',
      '15-30: Modellwahl, Context Window, Prompt wird Produkt',
      '30-45: Prompt-Labor oder X-Ray live diskutieren',
      '45-55: Skills/GitHub als Ausblick',
      '55-60: Nächster persönlicher Use Case'
    ],
    demoChecklist: [
      'Lernpfad öffnen und Einsteiger oder Governance wählen',
      'X-Ray nur zeigen, wenn Gruppe Context-Probleme kennt',
      'Zum Schluss next-4 als Transferanker öffnen'
    ],
    probeCues: [
      'Bei Folie usecase-6 eine Antwort bewusst hart prüfen lassen',
      'Eine Frage stellen, die keine Live-Demo braucht: “Was würdet ihr nie hochladen?”',
      'Falls Zeit kippt: Mini-Fallbibliothek oder Vorher/Nachher nur als Take-away zeigen'
    ]
  },
  {
    id: '120',
    label: '120 min',
    checkpoints: [
      '0-10: Einstieg und Skill-Ladder',
      '10-30: Governance und Modellwahl',
      '30-55: Context Window + X-Ray',
      '55-80: Prompt-Labor mit eigenen Aufgaben',
      '80-105: Skills und Live-Demo',
      '105-120: Transfer, Risiken, nächste Schritte'
    ],
    demoChecklist: [
      'Prompt wird Produkt live oder mit eingebauter Preview zeigen',
      'X-Ray sauber/überfüllt umschalten und Gruppe Unterschiede benennen lassen',
      'Prompt-Labor mindestens 10 Minuten ruhig arbeiten lassen',
      'Abschlussfolie next-4 mit 7-Tage-Experiment nutzen'
    ],
    probeCues: [
      'Nach Prompt wird Produkt 30 Sekunden still lesen lassen',
      'Bei Output prüfen freiwillig eine Freigabenotiz aus der Gruppe diskutieren',
      'Vor Skills kurz fragen: “Was davon wäre wiederkehrend genug für einen Workflow?”',
      'Bei next-5 klar entscheiden lassen: Chat, Project oder Codex?'
    ]
  },
  {
    id: '180',
    label: '180 min',
    checkpoints: [
      '0-20: Orientierung, Vorwissen, sichere Nutzung',
      '20-55: LLM-Tools 101 und Context-Grundlagen',
      '55-90: Prompt-Labor mit Review-Runde',
      '90-130: Skills, Projects, GitHub/Codex',
      '130-160: Eigene Mini-Workflows bauen',
      '160-180: Lessons Learned, Adoption, Follow-up'
    ],
    demoChecklist: [
      'Vorab Demo-Daten und Fallback-Prompts öffnen',
      'Skills-Demo mit sichtbarem Zwischenschritt führen',
      'Teilnehmende einen eigenen Mini-Workflow formulieren lassen',
      'Follow-up: ein Team-Artefakt oder Repo-Pilot vereinbaren'
    ],
    probeCues: [
      'Vor der Live-Demo Erfolg und Fallback laut definieren',
      'Nach jeder Übungsphase ein Muster sammeln, nicht Einzellösungen optimieren',
      'Am Ende verbindlich festhalten: ein Pilot, ein Artefakt, ein Folgetermin'
    ]
  }
];

/**
 * Gibt für eine Slide-ID den aktiven Lernpfad und die Position darin zurück.
 *
 * Spec §6.1/§6.3:
 * - Wenn `slideId` im Pfad `pathId` enthalten ist: { pathId, pathLabel, step, total }.
 * - Wenn `slideId` NICHT im Pfad: { pathId, pathLabel, step: null, total: null, inPath: false }.
 * - Wenn `pathId` unbekannt: `null`.
 *
 * @param {string} slideId — z.B. 'usecase-lab'
 * @param {string} [pathId] — z.B. 'praxis'. Default: 'praxis'.
 * @returns {{ pathId: string, pathLabel: string, step: number|null, total: number|null, inPath: boolean } | null}
 */
export function getPathProgress(slideId, pathId = 'praxis') {
  const path = LEARNING_PATHS.find(p => p.id === pathId);
  if (!path) return null;
  const idx = path.stations.indexOf(slideId);
  if (idx === -1) {
    return {
      pathId: path.id,
      pathLabel: path.title,
      step: null,
      total: null,
      inPath: false
    };
  }
  return {
    pathId: path.id,
    pathLabel: path.title,
    step: idx + 1,
    total: path.stations.length,
    inPath: true
  };
}

export const TRAINER_NOTES = {
  'einstieg-1': {
    timing: '1 min',
    focus: 'Rahmen setzen: keine Tool-Werbung, sondern LLM-Grundkompetenz.',
    notes: ['Kurz sagen, dass Claude, ChatGPT und Gemini Beispiele sind.', 'Versprechen: weniger Magie, mehr handwerkliche Sicherheit.'],
    fallback: 'Wenn wenig Zeit ist: direkt zu Verwaltung & KI springen.',
    prompt: ''
  },
  'verwaltung-1': {
    timing: '4 min',
    focus: 'Governance als Nutzungskompetenz rahmen, nicht als Verbotsschild.',
    notes: ['Die drei Chips laut lesen: Kompetenzen, Vertrauen, Effizienz.', 'Keine Einzelfallberatung simulieren; auf Datenklassifikation und Toolrahmen verweisen.'],
    fallback: 'Bei heiklen Fragen: “Das ist ein Fall für interne Vorgaben/KI-Anlaufstelle, aber das Entscheidungsmuster bleibt gleich.”',
    prompt: ''
  },
  'claude-1': {
    timing: '5 min',
    focus: 'Modellwahl als Kosten-Nutzen-Entscheid erklären.',
    notes: ['Nicht Modellnamen auswendig lernen lassen.', 'Faustregel: klein genug für die Aufgabe, stark genug für das Risiko.'],
    fallback: 'Wenn Produktnamen abweichen: auf Familienlogik wechseln.',
    prompt: 'Erkläre mir für diese Aufgabe, ob ich ein schnelles, ein Standard- oder ein starkes Reasoning-Modell brauche. Aufgabe: [kurz beschreiben].'
  },
  'context-1': {
    timing: '6 min',
    focus: 'Context Window als Arbeitsgedächtnis erklären.',
    notes: ['Die Konsequenz betonen: schlechte Antworten sind oft schlechtes Kontextmanagement.', 'Explainer A nur öffnen, wenn genug Zeit bleibt.'],
    fallback: 'Wenn die Gruppe müde ist: mit der Analogie “voller Schreibtisch” arbeiten.',
    prompt: ''
  },
  'usecase-4': {
    timing: '7 min',
    focus: 'Der Wow-Moment: Prompt wird Arbeitsauftrag.',
    notes: ['Erst schwachen Prompt zeigen, dann starken Auftrag.', 'Die farbigen Bausteine als Checkliste rahmen.'],
    fallback: 'Wenn Live-Copy nicht funktioniert: Prompt vorlesen und Output-Preview nutzen.',
    prompt: 'Baue aus meiner Rohidee einen präzisen Arbeitsauftrag mit Ziel, Kontext, Rolle, Constraints, Stil und Outputformat. Rohidee: [einfügen].'
  },
  'usecase-5': {
    timing: '5 min',
    focus: 'X-Ray: Kontextqualität sichtbar machen.',
    notes: ['Nicht technisch in Token-Details verlieren.', 'Frage an Gruppe: Was würdet ihr weglassen, was nachladen?'],
    fallback: 'Wenn Animation nicht gezeigt wird: sauberer Kontext vs. überfüllter Kontext verbal vergleichen.',
    prompt: ''
  },
  'usecase-6': {
    timing: '7 min',
    focus: 'Output-Kritik trainieren: glatte Sprache ist noch keine Qualität.',
    notes: ['Antwort A zuerst attraktiv wirken lassen.', 'Antwort B als prüfbare Arbeitsgrundlage rahmen, nicht als perfekte Wahrheit.'],
    fallback: 'Wenn Zeit knapp: nur die fünf Prüfkriterien nennen und bei “Verantwortung” hängen bleiben.',
    prompt: 'Prüfe diese KI-Antwort kritisch. Nenne: Fakten, die verifiziert werden müssen; Daten- oder Compliance-Risiken; unklare Annahmen; eine sichere nächste Version. Antwort: [einfügen].'
  },
  'usecase-7': {
    timing: '5 min',
    focus: 'Teilnehmende finden einen risikoarmen Startfall.',
    notes: ['Nicht jeden Fall ausdiskutieren.', 'Eine geeignete und eine ungeeignete Karte laut kontrastieren.'],
    fallback: 'Wenn Zeit knapp: Fallbibliothek als Take-away markieren und zu next-4 springen.',
    prompt: ''
  },
  'usecase-8': {
    timing: '4 min',
    focus: 'Musterlernen: bessere Prompts sind konkretere Arbeitsaufträge.',
    notes: ['Jeweils erst den schwachen Prompt lesen lassen.', 'Nicht alle Beispiele diskutieren; ein Muster genügt.'],
    fallback: 'Wenn Zeit knapp: nur das erste Vorher/Nachher-Paar zeigen.',
    prompt: ''
  },
  'usecase-lab': {
    timing: '12 min',
    focus: 'Teilnehmende machen aus einer echten Aufgabe einen ersten Prompt.',
    notes: ['Hier Tempo rausnehmen.', 'Nach 5 Minuten zwei Beispiele freiwillig diskutieren.'],
    fallback: 'Wenn niemand eine Aufgabe hat: Sitzungsprotokoll, E-Mail-Entwurf oder Konzeptskizze als Standardfall nehmen.',
    prompt: 'Ich möchte diese Aufgabe mit einem LLM vorbereiten: [Aufgabe]. Hilf mir, daraus einen sicheren, konkreten Prompt zu machen. Frage zuerst nach fehlendem Kontext.'
  },
  'skills-1': {
    timing: '8 min',
    focus: 'Skills als wiederverwendbare Arbeitsweise erklären.',
    notes: ['Nicht in Dateistruktur steckenbleiben.', 'Nutzen betonen: weniger Prompt-Wiederholung, mehr Prozessqualität.'],
    fallback: 'Wenn Codex/Skills noch fremd sind: mit “Checkliste plus Beispielmaterial” erklären.',
    prompt: ''
  },
  'skills-3': {
    timing: '10 min',
    focus: 'Live-Demo ehrlich führen: Problem → Skill → Wiederverwendung.',
    notes: ['Vor Demo kurz sagen, was Erfolg und was Fallback ist.', 'Fehlversuche nicht verstecken; daraus lernt die Gruppe.'],
    fallback: 'Fallback: Explainer B öffnen und Vorher/Nachher zeigen.',
    prompt: 'Erstelle einen Skill-Entwurf für diese wiederkehrende Aufgabe: [Aufgabe]. Enthalten: Zweck, wann nutzen, Schrittfolge, Qualitätskriterien.'
  },
  'next-3': {
    timing: '4 min',
    focus: 'Transfer: richtige Oberfläche für richtige Aufgabe wählen.',
    notes: ['Keine Tool-Schlacht führen.', 'Mit einer konkreten nächsten Handlung schließen.'],
    fallback: 'Wenn Zeit knapp: “Wählt eine Aufgabe für nächste Woche und testet den passenden Pfad.”',
    prompt: ''
  },
  'next-5': {
    timing: '5 min',
    focus: 'Brücke zu Codex: Oberfläche nach Aufgabe wählen.',
    notes: ['Chat nicht abwerten; es bleibt die richtige Wahl für kleine Fragen.', 'Codex als Workflow- und Datei-Arbeit rahmen, nicht als “noch ein Chat”.'],
    fallback: 'Wenn Codex nicht Thema ist: bei Chat vs. Project bleiben und Codex als Ausblick markieren.',
    prompt: ''
  },
  'next-4': {
    timing: '5 min',
    focus: 'Transfer sichern: eine kleine echte Aufgabe ist besser als zehn gute Vorsätze.',
    notes: ['7-Tage-Experiment laut ankündigen.', 'Teilnehmende eine konkrete Aufgabe in ihre Notizen schreiben lassen.'],
    fallback: 'Wenn die Zeit um ist: nur den Satz “eine Aufgabe, klein testen, bewusst prüfen” stehen lassen.',
    prompt: 'Hilf mir, für die nächste Woche ein kleines LLM-Experiment zu planen. Aufgabe: [einfügen]. Beachte Datenklassifikation, Prüfaufwand und ein klares Erfolgskriterium.'
  }
};
