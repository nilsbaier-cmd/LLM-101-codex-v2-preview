// tests/mode.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { ModeManager } from '../lib/mode.js';
import { Storage } from '../lib/storage.js';

describe('ModeManager', () => {
  let mode;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = '';
    document.documentElement.removeAttribute('data-palette');
    mode = new ModeManager(new Storage('llm-101-test'));
  });

  it('default-zustand: slide-mode, theme auto, palette codex, llm off, exercises off', () => {
    expect(mode.get('layout')).toBe('slide');
    expect(mode.get('theme')).toBe('auto');
    expect(mode.get('palette')).toBe('codex');
    expect(mode.get('llm')).toBe(false);
    expect(mode.get('exercises')).toBe(false);
    expect(document.documentElement.hasAttribute('data-palette')).toBe(false);
  });

  it('setzt einen mode und persistiert', () => {
    mode.set('theme', 'dark');
    expect(mode.get('theme')).toBe('dark');
    const mode2 = new ModeManager(new Storage('llm-101-test'));
    expect(mode2.get('theme')).toBe('dark');
  });

  it('setzt data-theme auf root bei theme-änderung', () => {
    mode.set('theme', 'dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    mode.set('theme', 'light');
    expect(document.documentElement.dataset.theme).toBe('light');
    mode.set('theme', 'auto');
    expect(document.documentElement.dataset.theme).toBe('');
  });

  it('setzt und entfernt data-palette auf root bei palette-änderung', () => {
    mode.set('palette', 'cobalt');
    expect(mode.get('palette')).toBe('cobalt');
    expect(document.documentElement.dataset.palette).toBe('cobalt');
    mode.set('palette', 'clay');
    expect(document.documentElement.dataset.palette).toBe('clay');
    mode.set('palette', 'codex');
    expect(document.documentElement.hasAttribute('data-palette')).toBe(false);
  });

  it('persistiert die palette unabhängig vom theme', () => {
    mode.set('theme', 'dark');
    mode.set('palette', 'clay');
    const mode2 = new ModeManager(new Storage('llm-101-test'));
    expect(mode2.get('theme')).toBe('dark');
    expect(mode2.get('palette')).toBe('clay');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.dataset.palette).toBe('clay');
  });

  it('emittet change-event mit mode-key und neuem wert', () => {
    let called = null;
    mode.on('change', (e) => { called = e; });
    mode.set('llm', true);
    expect(called).toEqual({ key: 'llm', value: true });
  });

  it('toggle invertiert boolean-modi', () => {
    mode.toggle('exercises');
    expect(mode.get('exercises')).toBe(true);
    mode.toggle('exercises');
    expect(mode.get('exercises')).toBe(false);
  });

  it('on() gibt unsubscribe-funktion zurück, die den listener entfernt', () => {
    let callCount = 0;
    const off = mode.on('change', () => { callCount++; });
    mode.set('llm', true);
    expect(callCount).toBe(1);
    off();
    mode.set('llm', false);
    expect(callCount).toBe(1); // listener wurde entfernt, kein weiterer call
  });

  it('set() ignoriert ungültige werte und behält den vorigen state', () => {
    const warn = console.warn;
    console.warn = () => {};
    try {
      mode.set('theme', 'dark');
      const result = mode.set('theme', 'darkk');
      expect(result).toBe(false);
      expect(mode.get('theme')).toBe('dark');
      expect(mode.set('palette', 'purple')).toBe(false);
      expect(mode.get('palette')).toBe('codex');
      expect(mode.set('llm', 'nope')).toBe(false);
      expect(mode.get('llm')).toBe(false);
      expect(mode.set('unbekannt', 'irgendwas')).toBe(false);
    } finally {
      console.warn = warn;
    }
  });

  it('beim laden: ungültiger stored-value fällt auf default zurück', () => {
    const storage = new Storage('llm-101-test');
    storage.set('mode.theme', 'cyberpunk');
    storage.set('mode.palette', 'neon');
    const m = new ModeManager(storage);
    expect(m.get('theme')).toBe('auto');
    expect(m.get('palette')).toBe('codex');
  });
});
