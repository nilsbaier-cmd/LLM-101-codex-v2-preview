// tests/mode.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { ModeManager } from '../lib/mode.js';
import { Storage } from '../lib/storage.js';

describe('ModeManager', () => {
  let mode;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = '';
    mode = new ModeManager(new Storage('srege-test'));
  });

  it('default-zustand: slide-mode, theme auto, llm off, exercises off', () => {
    expect(mode.get('layout')).toBe('slide');
    expect(mode.get('theme')).toBe('auto');
    expect(mode.get('llm')).toBe(false);
    expect(mode.get('exercises')).toBe(false);
  });

  it('setzt einen mode und persistiert', () => {
    mode.set('theme', 'dark');
    expect(mode.get('theme')).toBe('dark');
    const mode2 = new ModeManager(new Storage('srege-test'));
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
});
