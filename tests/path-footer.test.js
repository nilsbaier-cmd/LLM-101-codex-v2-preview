import { describe, it, expect } from 'vitest';
import { LEARNING_PATHS, getPathProgress } from '../lib/learning-paths.js';

// Tests für Paket E · Lernpfad-Footer-Logik (Spec §6.4).
// Validiert die Pfad-Position-Berechnung für alle 4 Pfade,
// Edge-Cases (Cover, nicht-im-Pfad, erste/letzte Station) und Default-Verhalten.

describe('getPathProgress() · Pfad-Position', () => {
  it('liefert step/total/pathLabel für eine Slide aus jedem der 4 Pfade', () => {
    // Einsteiger · 10 Stationen, einstieg-3 ist Position 3.
    const einsteiger = getPathProgress('einstieg-3', 'einsteiger');
    expect(einsteiger).toEqual({
      pathId: 'einsteiger',
      pathLabel: 'Einsteiger',
      step: 3,
      total: 10,
      inPath: true
    });

    // Praxis · 12 Stationen, usecase-lab ist Position 7.
    const praxis = getPathProgress('usecase-lab', 'praxis');
    expect(praxis.pathId).toBe('praxis');
    expect(praxis.pathLabel).toBe('Praxis');
    expect(praxis.step).toBe(7);
    expect(praxis.total).toBe(12);
    expect(praxis.inPath).toBe(true);

    // Power User · skills-2 ist Position 5.
    const power = getPathProgress('skills-2', 'power-user');
    expect(power.pathId).toBe('power-user');
    expect(power.pathLabel).toBe('Power User');
    expect(power.step).toBe(5);
    expect(power.total).toBe(10);
    expect(power.inPath).toBe(true);

    // Governance · context-1 ist Position 4.
    const gov = getPathProgress('context-1', 'governance');
    expect(gov.pathId).toBe('governance');
    expect(gov.pathLabel).toBe('Führung & Governance');
    expect(gov.step).toBe(4);
    expect(gov.total).toBe(11);
    expect(gov.inPath).toBe(true);
  });

  it('markiert Slides, die nicht im Pfad sind, mit inPath=false', () => {
    // skills-1 gehört zu power-user, nicht zu einsteiger.
    const result = getPathProgress('skills-1', 'einsteiger');
    expect(result.inPath).toBe(false);
    expect(result.step).toBeNull();
    expect(result.total).toBeNull();
    expect(result.pathLabel).toBe('Einsteiger');
  });

  it('behandelt die Cover-Slide einstieg-1 korrekt', () => {
    // Cover steht im Einsteiger-Pfad als Position 1.
    const einsteiger = getPathProgress('einstieg-1', 'einsteiger');
    expect(einsteiger.inPath).toBe(true);
    expect(einsteiger.step).toBe(1);
    expect(einsteiger.total).toBe(10);

    // Cover ist NICHT im Praxis-Pfad → inPath=false.
    const praxis = getPathProgress('einstieg-1', 'praxis');
    expect(praxis.inPath).toBe(false);
    expect(praxis.step).toBeNull();
  });

  it('letzte Slide eines Pfads hat step === total', () => {
    // next-4 ist die letzte Station in ALLEN 4 Pfaden.
    for (const path of LEARNING_PATHS) {
      const result = getPathProgress('next-4', path.id);
      expect(result.inPath).toBe(true);
      expect(result.step).toBe(result.total);
      expect(result.step).toBe(path.stations.length);
    }
  });

  it('erste Slide eines Pfads hat step === 1', () => {
    for (const path of LEARNING_PATHS) {
      const firstId = path.stations[0];
      const result = getPathProgress(firstId, path.id);
      expect(result.inPath).toBe(true);
      expect(result.step).toBe(1);
    }
  });

  it('gibt null zurück für unbekannte Pfad-ID', () => {
    expect(getPathProgress('einstieg-1', 'nope')).toBeNull();
  });

  it('default-Pfad ist "praxis"', () => {
    const explicit = getPathProgress('usecase-lab', 'praxis');
    const implicit = getPathProgress('usecase-lab');
    expect(implicit).toEqual(explicit);
  });
});
