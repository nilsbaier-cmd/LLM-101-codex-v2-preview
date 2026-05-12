// app.js — Haupteinstieg
import { Storage } from './lib/storage.js';
import { ModeManager } from './lib/mode.js';
import { icon } from './lib/icons.js';

const NS = 'srege-praesentation-v1';
const storage = new Storage(NS);
const mode = new ModeManager(storage);

// Theme-Buttons mit Icons befüllen
document.querySelector('[data-mode="theme"][data-value="light"]').innerHTML = icon('sun');
document.querySelector('[data-mode="theme"][data-value="dark"]').innerHTML = icon('moon');

// Toggle-Verkabelung
document.querySelectorAll('.toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const modeKey = btn.dataset.mode;
    if (btn.dataset.toggle !== undefined) {
      mode.toggle(modeKey);
    } else {
      mode.set(modeKey, btn.dataset.value);
    }
    refreshToggleStates();
  });
});

function refreshToggleStates() {
  document.querySelectorAll('.toggle').forEach(btn => {
    const key = btn.dataset.mode;
    const val = btn.dataset.value;
    const current = mode.get(key);
    if (btn.dataset.toggle !== undefined) {
      btn.classList.toggle('active', current === true);
    } else {
      btn.classList.toggle('active', current === val);
    }
  });
  document.body.dataset.layout = mode.get('layout');
  document.body.dataset.llm = mode.get('llm') ? 'on' : 'off';
  document.body.dataset.exercises = mode.get('exercises') ? 'on' : 'off';
}

refreshToggleStates();
