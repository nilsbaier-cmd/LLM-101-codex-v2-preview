export const VISUAL_QA_TARGETS = [
  {
    id: 'cover-desktop',
    url: 'index.html#einstieg-1',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Cover, Header, Navigation und Icon-Cloud prüfen.'
  },
  {
    id: 'xray-noisy-desktop',
    url: 'index.html#usecase-5',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    action: 'click:[data-context-xray-mode="noisy"]',
    note: 'Überfüllter X-Ray-Zustand muss klar anders aussehen als sauberer Kontext.'
  },
  {
    id: 'prompt-lab-phone',
    url: 'index.html#usecase-lab',
    viewport: { width: 390, height: 844 },
    theme: 'light',
    note: 'Übungs-Labor auf Phone: keine Überlappungen, Textarea erreichbar.'
  },
  {
    id: 'quality-check-phone',
    url: 'index.html#usecase-6',
    viewport: { width: 390, height: 844 },
    theme: 'light',
    note: 'Output-Qualitätscheck passt mobil in die Folie und bleibt als Übung lesbar.'
  },
  {
    id: 'case-library-desktop',
    url: 'index.html#usecase-7',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Mini-Fallbibliothek zeigt sechs Karten ohne visuelle Überladung.'
  },
  {
    id: 'before-after-desktop',
    url: 'index.html#usecase-8',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Vorher/Nachher-Galerie zeigt die drei Prompt-Paare ohne gedrängten Eindruck.'
  },
  {
    id: 'codex-bridge-desktop',
    url: 'index.html#next-5',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Chat-Project-Codex-Brücke erklärt die Oberflächenwahl klar und ruhig.'
  },
  {
    id: 'handout-print',
    url: 'handout.html',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Handout ist als One-Pager scanbar und drucknah strukturiert.'
  },
  {
    id: 'sources-refresh',
    url: 'quellen-refresh.html',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Quellencheck-Seite zeigt volatile Folien und Quellen übersichtlich.'
  },
  {
    id: 'trainer-cockpit',
    url: 'index.html?trainer=1#usecase-4',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Cockpit ist offen, Foliennotiz passt zur aktiven Folie, Demo-Prompt sichtbar.'
  },
  {
    id: 'learning-path-panel',
    url: 'index.html#einstieg-1',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    action: 'click:#path-toggle',
    note: 'Lernpfad-Panel zeigt alle vier Pfade und bleibt lesbar.'
  },
  {
    id: 'dark-models',
    url: 'index.html#claude-1',
    viewport: { width: 1280, height: 720 },
    theme: 'dark',
    note: 'Modellkarten, Quellenleiste und Quiz-Kontraste im Dark Mode prüfen.'
  }
];
