// lib/notes-export.js — Reflexionsantworten zu Markdown
const CHAPTER_LABELS = {
  verwaltung: 'Verwaltung & KI',
  claude: 'Claude 101',
  context: 'Context',
  usecase: 'Use Cases',
  usecases: 'Use Cases',
  skills: 'Skills',
  ladder: 'Skill-Ladder',
  chat: 'Chat vs. Project',
  next: 'Next Level',
  einstieg: 'Einstieg'
};

const ANALYSIS_BUCKETS = [
  {
    id: 'experiments',
    title: 'Sichere erste Experimente',
    match: /(testen|experiment|aufgabe|use case|arbeitsfall|sitzung|text|status|update|prompt)/i
  },
  {
    id: 'risks',
    title: 'Offene Risiken',
    match: /(risiko|daten|person|klassifiziert|prüfen|verifizieren|freigabe|tabu|grenze)/i
  },
  {
    id: 'next',
    title: 'Nächste Schritte',
    match: /(nächste|woche|schritt|pilot|ausprobieren|notiere|umsetzen|follow-up)/i
  }
];

export function analyzeReflections(notes) {
  return ANALYSIS_BUCKETS.map(bucket => ({
    id: bucket.id,
    title: bucket.title,
    items: notes
      .filter(note => bucket.match.test(note.antwort || ''))
      .slice(0, 5)
  }));
}

export function renderNotesMarkdown(notes) {
  const lines = ['# Meine Notizen', '', '_Aus der Claude-Einführung exportiert._', ''];
  if (notes.length === 0) {
    lines.push('Noch keine Notizen.');
    return lines.join('\n');
  }
  const analysis = analyzeReflections(notes).filter(bucket => bucket.items.length);
  if (analysis.length) {
    lines.push('## Muster', '');
    for (const bucket of analysis) {
      lines.push(`### ${bucket.title}`, '');
      for (const note of bucket.items) {
        lines.push(`- ${note.antwort.replace(/\s+/g, ' ').trim().slice(0, 180)}`);
      }
      lines.push('');
    }
  }
  const byChapter = {};
  for (const n of notes) (byChapter[n.chapter] ??= []).push(n);
  for (const chapter of Object.keys(byChapter)) {
    const label = CHAPTER_LABELS[chapter] || chapter;
    lines.push(`## ${label}`, '');
    for (const n of byChapter[chapter]) {
      const date = new Date(n.ts).toISOString().slice(0, 10);
      lines.push(`### Übung ${n.ex} — ${date}`, '', n.antwort, '');
    }
  }
  return lines.join('\n');
}

export function downloadMarkdown(filename, content) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
