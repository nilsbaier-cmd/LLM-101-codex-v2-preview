export const VISUAL_QA_TARGETS = [
  {
    id: 'cover-desktop',
    url: 'index.html#einstieg-1',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Cover, Header, Navigation und Icon-Cloud prüfen.'
  },
  {
    id: 'mental-model-desktop',
    url: 'index.html#grundlagen-1',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Prediction-, Temperatur- und Annahmenkarten bleiben ruhig lesbar.'
  },
  {
    id: 'promptathon-desktop',
    url: 'index.html#verwaltung-4',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Promptathon Mini zeigt Schritte, sichere Startfälle und Notizfeld ohne Überladung.'
  },
  {
    id: 'context-architecture-desktop',
    url: 'index.html#claude-3b',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Prompt, Instructions, Memory, Project und Skill sind als Entscheidungshilfe scanbar.'
  },
  {
    id: 'context-rot-desktop',
    url: 'index.html#usecase-5',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Context Rot chart and explanatory cards must fit without overlap or clipped footer.'
  },
  {
    id: 'timeline-final-desktop',
    url: 'index.html#einstieg-2',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    steps: 6,
    note: 'Final reveal state of the five-phase timeline must not clip the pull quote or footer.'
  },
  {
    id: 'governance-traffic-light-desktop',
    url: 'index.html#verwaltung-1',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Governance traffic-light slide must fit without body overflow.'
  },
  {
    id: 'settings-desktop',
    url: 'index.html#claude-3',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Settings and persistence cards must not be clipped at the footer.'
  },
  {
    id: 'prompt-product-desktop',
    url: 'index.html#usecase-4',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Prompt wird Produkt must show controls, prompt, preview and footer without clipping.'
  },
  {
    id: 'skill-anatomy-desktop',
    url: 'index.html#skills-1',
    viewport: { width: 1366, height: 768 },
    theme: 'light',
    note: 'Skill anatomy must remain readable with LLM tabs enabled.'
  },
  {
    id: 'llm-everywhere-final-desktop',
    url: 'index.html#next-3',
    viewport: { width: 1366, height: 768 },
    theme: 'light',
    steps: 5,
    note: 'Final reveal state of LLM überall must fit with stable footer navigation.'
  },
  {
    id: 'ghostwriter-phone-375',
    url: 'index.html#usecase-2',
    viewport: { width: 375, height: 667 },
    theme: 'light',
    note: 'Ghostwriter mobile tabs must not create horizontal overflow.'
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
    note: 'Behörden-Use-Case-Bank zeigt zwölf Karten mit Tool-Level und Risikoampel ohne visuelle Überladung.'
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
    url: 'index.html?trainer=1#verwaltung-4',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    note: 'Cockpit ist offen, Promptathon-Mini-Notiz passt zur aktiven Folie, Demo-Prompt sichtbar.'
  },
  {
    id: 'learning-path-panel',
    url: 'index.html#einstieg-1',
    viewport: { width: 1280, height: 720 },
    theme: 'light',
    action: 'click:#path-toggle',
    waitAfterActionMs: 300,
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
