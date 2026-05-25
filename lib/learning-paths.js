export const LEARNING_PATHS = [
  {
    id: 'einsteiger',
    title: 'Einsteiger',
    duration: '30 min',
    description: 'Grundbegriffe, sichere Nutzung und erste eigene Prompts.',
    stations: ['einstieg-1', 'einstieg-2', 'einstieg-3', 'grundlagen-1', 'verwaltung-1', 'verwaltung-4', 'claude-1', 'claude-3b', 'context-1', 'usecase-lab', 'usecase-6', 'usecase-8', 'next-4']
  },
  {
    id: 'praxis',
    title: 'Praxis',
    duration: '45 min',
    description: 'Vom eigenen Arbeitsfall zum brauchbaren Prompt und Ergebnis.',
    stations: ['verwaltung-2', 'verwaltung-3', 'verwaltung-4', 'claude-2', 'claude-3b', 'context-1', 'context-2', 'context-quiz', 'usecase-4', 'usecase-5', 'usecase-lab', 'usecase-6', 'usecase-7', 'usecase-8', 'skills-3', 'next-4']
  },
  {
    id: 'power-user',
    title: 'Power User',
    duration: '45 min',
    description: 'Projects, Skills, GitHub und Workflow-Denken für fortgeschrittene Nutzung.',
    stations: ['claude-3', 'claude-3b', 'claude-4', 'usecase-7', 'skills-1', 'skills-2', 'skills-3', 'next-2', 'next-3', 'next-5', 'next-4']
  },
  {
    id: 'governance',
    title: 'Führung & Governance',
    duration: '38 min',
    description: 'Nutzungskompetenz, Grenzen, Verantwortung und Rollout-Fragen.',
    stations: ['grundlagen-1', 'verwaltung-1', 'verwaltung-2', 'verwaltung-3', 'verwaltung-4', 'claude-5', 'context-1', 'usecase-1', 'usecase-6', 'usecase-7', 'next-1', 'next-3', 'next-5', 'next-4']
  }
];

export const TRAINER_VARIANTS = [
  {
    id: '60',
    label: '60 min',
    checkpoints: [
      '0-5: Warum LLM 101, Erwartungen klären',
      '5-15: Mentalmodell, Verwaltung & sichere Nutzung',
      '15-30: Modellwahl, Kontextarchitektur, Context Window',
      '30-45: Promptathon Mini oder Context Rot live diskutieren',
      '45-55: Skills/GitHub als Ausblick',
      '55-60: Nächster persönlicher Use Case'
    ],
    demoChecklist: [
      'Lernpfad öffnen und Einsteiger oder Governance wählen',
      'Grundlagen-1 in zwei Minuten als “Fortsetzung, nicht Wahrheit” rahmen',
      'Context Rot nur zeigen, wenn Gruppe Context-Probleme kennt',
      'Zum Schluss next-4 als Transferanker öffnen'
    ],
    probeCues: [
      'Bei Folie verwaltung-4 eine sichere Startaufgabe formulieren lassen',
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
      '10-30: Mentalmodell, Governance und Modellwahl',
      '30-55: Context Window + Context Rot',
      '55-80: Promptathon Mini, Dot Voting, Prompt-Labor mit eigenen Aufgaben',
      '80-105: Skills und Live-Demo',
      '105-120: Transfer, Risiken, nächste Schritte'
    ],
    demoChecklist: [
      'Prompt wird Produkt live oder mit eingebauter Preview zeigen',
      'Context Rot sauber/überfüllt vergleichen und Gruppe Unterschiede benennen lassen',
      'Dot Voting: drei risikoarme Startfälle priorisieren lassen',
      'Prompt-Labor mindestens 10 Minuten ruhig arbeiten lassen',
      'Abschlussfolie next-4 als Monday Morning Kit nutzen'
    ],
    probeCues: [
      'Nach Prompt wird Produkt 30 Sekunden still lesen lassen',
      'Bei Output prüfen freiwillig eine Freigabenotiz aus der Gruppe diskutieren',
      'Bei der Use-Case-Bank die Gruppe Chat, Project oder Codex wählen lassen',
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
      '55-90: Promptathon Mini, Dot Voting und Prompt-Labor mit Review-Runde',
      '90-130: Skills, Projects, GitHub/Codex',
      '130-160: Eigene Mini-Workflows bauen',
      '160-180: Lessons Learned, Adoption, Follow-up'
    ],
    demoChecklist: [
      'Vorab Demo-Daten und Fallback-Prompts öffnen',
      'Skills-Demo mit sichtbarem Zwischenschritt führen',
      'Use-Case-Bank als Dot-Voting-Fläche nutzen: geeignet, bedingt, tabu',
      'Teilnehmende einen eigenen Mini-Workflow formulieren lassen',
      'Follow-up: Monday Morning Kit plus ein Team-Artefakt oder Repo-Pilot vereinbaren'
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
  'einstieg-2': {
    timing: '3 min',
    focus: 'Phasen-Timeline als Adoption-Frame nutzen: Die Gruppe steigt nicht bei ChatGPT 2022 ein, sondern bei integrierten Workflows.',
    notes: ['Die fünf Phasen nicht als Produktgeschichte erzählen, sondern als wachsenden Handlungsspielraum.', 'Bei Phase 5 kurz stoppen: Was wird dadurch in euren Abläufen erstmals realistisch?', 'Die Schlussbotschaft nutzen, um Druck rauszunehmen: niemand muss drei Jahre nachholen.'],
    fallback: 'Wenn Zeit knapp ist: nur Phase 1 und Phase 5 kontrastieren und dann zur Skill-Ladder springen.',
    prompt: ''
  },
  'einstieg-3': {
    timing: '4 min',
    focus: 'Skill-Ladder zur Selbstverortung nutzen, ohne die Gruppe in Anfänger und Profis aufzuteilen.',
    notes: ['Kurz markieren: Level 1 bis 3 sind solide Nutzung, Level 4 bis 7 sind Workflow- und Systemdenken.', 'Teilnehmende innerlich einordnen lassen, nicht öffentlich abfragen.', 'Zielbild ruhig halten: ein Level höher reicht als Lernziel.'],
    fallback: 'Wenn die Folie zu dicht wirkt: nur Level 1, 3 und 4 erklären und den Explainer als Take-away nennen.',
    prompt: 'Hilf mir, meine aktuelle LLM-Nutzung auf einer Skill-Ladder einzuordnen. Stelle mir zuerst fünf kurze Fragen zu Aufgaben, Kontext, Tools und Wiederverwendung.'
  },
  'grundlagen-1': {
    timing: '4 min',
    focus: 'Prediction-Mentalmodell setzen: LLMs liefern plausible Fortsetzung, keine eingebaute Wahrheit.',
    notes: ['Mit dem Satz “Der Bericht ist …” starten und die Wahrscheinlichkeitslogik erklären.', 'Temperatur nicht technisch vertiefen; als Variantenraum für unterschiedliche Arbeitsphasen rahmen.', 'Am Ende klar sagen: fehlender Kontext erzeugt plausible Defaults und damit Prüfpflicht.'],
    fallback: 'Wenn Zeit knapp: nur “Fortsetzung, nicht Wahrheit” plus “fehlender Kontext wird ergänzt” mitnehmen.',
    prompt: ''
  },
  'verwaltung-1': {
    timing: '4 min',
    focus: 'Governance als Nutzungskompetenz rahmen, nicht als Verbotsschild.',
    notes: ['Die drei Chips laut lesen: Kompetenzen, Vertrauen, Effizienz.', 'Keine Einzelfallberatung simulieren; auf Datenklassifikation und Toolrahmen verweisen.'],
    fallback: 'Bei heiklen Fragen: “Das ist ein Fall für interne Vorgaben/KI-Anlaufstelle, aber das Entscheidungsmuster bleibt gleich.”',
    prompt: ''
  },
  'verwaltung-3': {
    timing: '3 min',
    focus: 'Teilnehmende übersetzen die Datenampel in eine eigene Aufgabe-Grenze-Regel.',
    notes: ['Erst eine harmlose öffentliche Aufgabe nennen lassen.', 'Dann bewusst fragen, welche Information vor KI-Nutzung entfernt oder anonymisiert werden müsste.'],
    fallback: 'Wenn niemand ein Beispiel nennen will: Sitzungsprotokoll, Medienmitteilung oder Präsentationsentwurf als neutrales Beispiel anbieten.',
    prompt: ''
  },
  'verwaltung-4': {
    timing: '10 min',
    focus: 'Promptathon Mini: erst sichere Aufgabe wählen, dann prompten.',
    notes: ['Nicht mit Prompt-Formulierungen beginnen; zuerst Daten- und Verantwortungsgrenze prüfen.', 'Für Dot Voting die drei Startfälle sammeln und mit Klebepunkten oder Handzeichen priorisieren.', 'Am Schluss eine Annahme markieren lassen, die das Modell sonst erfinden könnte.'],
    fallback: 'Wenn Zeit knapp: nur eine sichere Startaufgabe auswählen und den Prompt als Hausaufgabe mitgeben.',
    prompt: 'Hilf mir, diese risikoarme Aufgabe als sicheren LLM-Arbeitsauftrag zu formulieren. Aufgabe: [einfügen]. Frage zuerst nach Ziel, Kontext, Grenzen und Outputformat.'
  },
  'claude-1': {
    timing: '5 min',
    focus: 'Modellwahl als Kosten-Nutzen-Entscheid erklären.',
    notes: ['Nicht Modellnamen auswendig lernen lassen.', 'Faustregel: klein genug für die Aufgabe, stark genug für das Risiko.'],
    fallback: 'Wenn Produktnamen abweichen: auf Familienlogik wechseln.',
    prompt: 'Erkläre mir für diese Aufgabe, ob ich ein schnelles, ein Standard- oder ein starkes Reasoning-Modell brauche. Aufgabe: [kurz beschreiben].'
  },
  'claude-3b': {
    timing: '5 min',
    focus: 'Kontextarchitektur: was gehört in Prompt, Instructions, Memory, Project oder Skill.',
    notes: ['Memory als persönliche stabile Präferenz erklären, Project als arbeitsbezogenen Kontext.', 'Bei sensiblen Beispielen sofort auf “nicht speichern” und freigegebenen Toolrahmen verweisen.', 'Brücke zu Skills legen: wiederholbare Abläufe gehören nicht in jeden Einzelprompt.'],
    fallback: 'Wenn Plattformfunktionen variieren: Ebenenlogik erklären statt Produktmenüs zeigen.',
    prompt: 'Ordne diese Information der richtigen Ebene zu: Prompt, Instructions, Memory, Project oder Skill. Information: [einfügen]. Begründe kurz mit Lebensdauer und Risiko.'
  },
  'context-1': {
    timing: '6 min',
    focus: 'Context Window als Arbeitsgedächtnis erklären.',
    notes: ['Die Konsequenz betonen: schlechte Antworten sind oft schlechtes Kontextmanagement.', 'Explainer A nur öffnen, wenn genug Zeit bleibt.'],
    fallback: 'Wenn die Gruppe müde ist: mit der Analogie “voller Schreibtisch” arbeiten.',
    prompt: ''
  },
  'context-quiz': {
    timing: '3 min',
    focus: 'Kurzer Verständnischeck: Context Window ist nicht nur Länge, sondern Aufmerksamkeit auf relevante Informationen.',
    notes: ['Die Frage erst still lesen lassen.', 'Bei falschen Antworten nicht korrigierend dozieren, sondern fragen: Welche Information wäre für das Modell wirklich handlungsrelevant?', 'Danach direkt zu Use Cases wechseln, damit es praktisch bleibt.'],
    fallback: 'Wenn keine Interaktion passt: Antwort laut begründen und die Prüffrage als Merksatz mitgeben.',
    prompt: 'Prüfe diesen Prompt auf Context-Probleme. Was ist relevant, was ist Rauschen, was fehlt? Prompt: [einfügen].'
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
    focus: 'Context Rot sichtbar machen: langer Kontext senkt Verlaesslichkeit, wenn Relevanz durch Rauschen verdünnt wird.',
    notes: ['Nicht technisch in Token-Details verlieren.', 'Frage an Gruppe: Was würdet ihr weglassen, was neu bündeln?', 'Gegenmittel betonen: vor wichtigen Outputs Ziel, Annahmen und Tabus neu zusammenfassen.'],
    fallback: 'Wenn Animation nicht gezeigt wird: sauberer Kontext vs. überfüllter Kontext verbal vergleichen.',
    prompt: 'Fasse diesen langen Chat als frischen Arbeitskontext zusammen. Trenne Ziel, relevante Fakten, offene Annahmen, Tabus und nächste Aufgabe: [Chat oder Notizen einfügen].'
  },
  'usecase-6': {
    timing: '7 min',
    focus: 'Output-Kritik trainieren: glatte Sprache ist noch keine Qualität, unmarkierte Annahmen sind der Risikohebel.',
    notes: ['Antwort A zuerst attraktiv wirken lassen.', 'Dann alle impliziten Annahmen markieren lassen: Datenbasis, Rechtsstand, Verbindlichkeit, Verantwortung.', 'Antwort B als prüfbare Arbeitsgrundlage rahmen, nicht als perfekte Wahrheit.'],
    fallback: 'Wenn Zeit knapp: nur “Welche Annahme steckt darin?” fragen und bei Verantwortung hängen bleiben.',
    prompt: 'Prüfe diese KI-Antwort kritisch. Nenne: Fakten, die verifiziert werden müssen; Daten- oder Compliance-Risiken; unklare Annahmen; eine sichere nächste Version. Antwort: [einfügen].'
  },
  'usecase-7': {
    timing: '5 min',
    focus: 'Teilnehmende wählen einen Startfall und unterscheiden Chat, Project, Codex sowie Risikoampel.',
    notes: ['Nicht jede Karte ausdiskutieren.', 'Dot Voting nutzen: drei Fälle wählen, dann je einmal Tool-Level und Prüfpflicht benennen.', 'Eine grüne, eine gelbe und eine rote Karte laut kontrastieren.'],
    fallback: 'Wenn Zeit knapp: Use-Case-Bank als Take-away markieren und zu next-4 springen.',
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
  'skills-2': {
    timing: '6 min',
    focus: 'Skill-Lifecycle als Qualitätsloop erklären: aus einer wiederkehrenden Aufgabe wird ein wartbarer Ablauf.',
    notes: ['Nicht nur “Skill bauen” sagen, sondern die Schleife betonen: beobachten, formulieren, testen, verbessern.', 'Eine typische Kursaufgabe nennen, etwa Feedback auswerten oder Handout erzeugen.', 'Fragen: Woran merkt ihr, dass sich ein Skill lohnt?'],
    fallback: 'Wenn die Gruppe noch nicht bei Skills ist: Lifecycle als normale Prozessdokumentation erklären.',
    prompt: 'Entwirf einen einfachen Lifecycle für diese wiederkehrende Aufgabe. Enthalten: Auslöser, Input, Schritte, Qualitätscheck und Verbesserung nach Feedback. Aufgabe: [einfügen].'
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
    notes: ['Keine Tool-Schlacht führen.', 'Mit einer konkreten nächsten Handlung schliessen.'],
    fallback: 'Wenn Zeit knapp: “Wählt eine Aufgabe für nächste Woche und testet den passenden Pfad.”',
    prompt: ''
  },
  'next-1': {
    timing: '5 min',
    focus: 'Team-Repo als geteiltes Arbeitsgedächtnis rahmen: Skills, Kontext und Vorlagen werden versioniert statt mündlich weitergereicht.',
    notes: ['Den Nutzen zuerst nennen: Konsistenz, Wiederverwendung, nachvollziehbare Änderungen.', 'Git nicht als Hürde verkaufen; Repository als gemeinsamer Ordner mit Verlauf erklären.', 'Eine kleine Pilotidee nennen: ein Prompt-Template oder eine Checkliste.'],
    fallback: 'Wenn GitHub abschreckt: beim Bild “gemeinsamer Ordner mit Änderungsverlauf” bleiben.',
    prompt: 'Hilf mir, ein kleines Team-Repo für LLM-Material zu strukturieren. Zielgruppe: [Team]. Inhalte: [Skills, Vorlagen, Prompts, Kontext].'
  },
  'next-2': {
    timing: '4 min',
    focus: 'GitHub 101 auf die minimale Arbeitslogik reduzieren: Branch, Pull Request, Review, Merge.',
    notes: ['Nicht in Git-Befehle abgleiten.', 'Die Grafik als Ablauf lesen lassen: Änderung entsteht getrennt, wird geprüft, danach übernommen.', 'Brücke zu Governance: Review ist kein Bremsklotz, sondern Qualitäts- und Vertrauensmechanismus.'],
    fallback: 'Wenn GitHub nicht relevant ist: nur das Prinzip “Änderung getrennt vorbereiten, prüfen, übernehmen” mitnehmen.',
    prompt: 'Erkläre einer nicht-technischen Person den Ablauf Branch, Pull Request, Review und Merge anhand dieses Vorhabens: [kurz beschreiben].'
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
    focus: 'Transfer sichern: Monday Morning Kit statt guter Vorsätze.',
    notes: ['Drei Startaufgaben nennen: Text kürzen, Sitzung vorbereiten, Risiken sammeln.', 'Prompt-Check und Output-Prüfung als zwei kleine Rituale rahmen.', 'Teilnehmende eine konkrete Montagsaufgabe in ihre Notizen schreiben lassen.'],
    fallback: 'Wenn die Zeit um ist: nur den Satz “Montag: eine Aufgabe, ein Prompt-Check, eine Output-Prüfung” stehen lassen.',
    prompt: 'Hilf mir, für die nächste Woche ein kleines LLM-Experiment zu planen. Aufgabe: [einfügen]. Beachte Datenklassifikation, Prüfaufwand und ein klares Erfolgskriterium.'
  }
};
