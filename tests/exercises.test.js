// tests/exercises.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { Exercises } from '../lib/exercises.js';
import { Storage } from '../lib/storage.js';

describe('Exercises', () => {
  let ex, storage;
  beforeEach(() => {
    localStorage.clear();
    storage = new Storage('test');
    ex = new Exercises(storage);
  });

  it('speichert eine reflexionsantwort', () => {
    ex.saveReflection('kap1', 'ueb1', 'Meine Antwort');
    expect(ex.getReflection('kap1', 'ueb1').antwort).toBe('Meine Antwort');
  });

  it('zählt antworten', () => {
    ex.saveReflection('k1', 'u1', 'a');
    ex.saveReflection('k1', 'u2', 'b');
    ex.saveReflection('k2', 'u1', 'c');
    expect(ex.countReflections()).toBe(3);
  });

  it('sammelt alle reflexionen sortiert nach kapitel', () => {
    ex.saveReflection('k2', 'u1', 'c');
    ex.saveReflection('k1', 'u1', 'a');
    const all = ex.allReflections();
    expect(all.map(r => r.chapter)).toEqual(['k1', 'k2']);
  });

  it('löscht eine reflexion', () => {
    ex.saveReflection('k1', 'u1', 'a');
    ex.deleteReflection('k1', 'u1');
    expect(ex.getReflection('k1', 'u1')).toBeNull();
  });

  it('persistiert quiz-versuche', () => {
    ex.recordQuizAttempt('k1', 'u1', { choice: 'b', correct: false });
    ex.recordQuizAttempt('k1', 'u1', { choice: 'c', correct: true });
    expect(ex.getQuizAttempts('k1', 'u1').length).toBe(2);
  });
});
