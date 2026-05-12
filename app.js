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

// Slide-Navigation
const slides = () => Array.from(document.querySelectorAll('.app-deck .slide'));
let currentIdx = 0;

function showSlide(idx) {
  const list = slides();
  if (idx < 0 || idx >= list.length) return;
  list.forEach((s, i) => s.classList.toggle('is-active', i === idx));
  currentIdx = idx;
  document.getElementById('current').textContent = idx + 1;
  document.getElementById('total').textContent = list.length;
}

document.getElementById('prev-slide').addEventListener('click', () => showSlide(currentIdx - 1));
document.getElementById('next-slide').addEventListener('click', () => showSlide(currentIdx + 1));

document.addEventListener('keydown', (e) => {
  if (mode.get('layout') !== 'slide') return;
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); showSlide(currentIdx + 1); }
  if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   { e.preventDefault(); showSlide(currentIdx - 1); }
});

mode.on('change', ({ key }) => {
  if (key === 'layout') showSlide(currentIdx);
});

showSlide(0);

// TOC im Scroll-Modus aus den Folien generieren
function rebuildTOC() {
  const toc = document.querySelector('.app-toc');
  const list = slides();
  const ol = document.createElement('ol');
  list.forEach((slide) => {
    const id = slide.dataset.slideId || '';
    const label = slide.querySelector('h1, h2, h3')?.textContent
                || slide.querySelector('.chapter-label')?.textContent
                || `Folie ${id}`;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = label;
    a.dataset.slideId = id;
    li.appendChild(a);
    ol.appendChild(li);
  });
  toc.innerHTML = '';
  toc.appendChild(ol);
}

// Scroll-Spy: markiere aktive Sektion im TOC
function setupScrollSpy() {
  const obs = new IntersectionObserver((entries) => {
    if (mode.get('layout') !== 'scroll') return;
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const id = entry.target.dataset.slideId;
        document.querySelectorAll('.app-toc a').forEach(a => {
          a.classList.toggle('is-current', a.dataset.slideId === id);
        });
      }
    }
  }, { threshold: 0.4 });
  slides().forEach(s => obs.observe(s));
}

rebuildTOC();
setupScrollSpy();

// IDs als Anker setzen für Hash-Navigation
slides().forEach(s => {
  if (s.dataset.slideId && !s.id) s.id = s.dataset.slideId;
});
