// tests/storage.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { Storage } from '../lib/storage.js';

describe('Storage', () => {
  const NS = 'llm-101-v1';
  let storage;

  beforeEach(() => {
    localStorage.clear();
    storage = new Storage(NS);
  });

  it('schreibt und liest einen string-wert', () => {
    storage.set('mode.theme', 'dark');
    expect(storage.get('mode.theme')).toBe('dark');
  });

  it('schreibt und liest ein objekt', () => {
    storage.set('notiz.kapitel1.uebung1', { antwort: 'Test', ts: 12345 });
    expect(storage.get('notiz.kapitel1.uebung1')).toEqual({ antwort: 'Test', ts: 12345 });
  });

  it('gibt null zurück, wenn schlüssel nicht existiert', () => {
    expect(storage.get('does-not-exist')).toBeNull();
  });

  it('listet alle keys mit gegebenem präfix', () => {
    storage.set('notiz.k1.u1', 'a');
    storage.set('notiz.k2.u1', 'b');
    storage.set('mode.theme', 'dark');
    const keys = storage.keysWithPrefix('notiz.');
    expect(keys.sort()).toEqual(['notiz.k1.u1', 'notiz.k2.u1']);
  });

  it('löscht einen schlüssel', () => {
    storage.set('mode.theme', 'dark');
    storage.remove('mode.theme');
    expect(storage.get('mode.theme')).toBeNull();
  });

  it('namespaced unterschiedliche storages voneinander', () => {
    const s2 = new Storage('andere-app');
    storage.set('x', '1');
    s2.set('x', '2');
    expect(storage.get('x')).toBe('1');
    expect(s2.get('x')).toBe('2');
  });
});
