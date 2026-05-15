// app.js — Haupteinstieg
import { Storage } from './lib/storage.js?v=2026-05-15f';
import { ModeManager } from './lib/mode.js?v=2026-05-15f';
import { icon } from './lib/icons.js?v=2026-05-15f';
import { initTabs } from './lib/tabs.js?v=2026-05-15f';
import { Exercises } from './lib/exercises.js?v=2026-05-15f';

const NS = 'llm-101-v1';
const storage = new Storage(NS);
const mode = new ModeManager(storage);
const exercises = new Exercises(storage);

// Theme-Buttons mit Icons befüllen
document.querySelector('[data-mode="theme"][data-value="light"]').innerHTML = icon('sun');
document.querySelector('[data-mode="theme"][data-value="dark"]').innerHTML = icon('moon');

// Inline-Icon-Auflösung für Folien-Markup
document.querySelectorAll('[data-icon]').forEach(el => {
  el.innerHTML = icon(el.dataset.icon);
});

// LLM-Tabs initialisieren (nach Icon-Resolver, vor TOC-Aufbau)
initTabs(document.body);

// Übungs-Komponenten initialisieren
function initExercises(root = document) {
  // Reflexionen: Restore + onInput-Save
  root.querySelectorAll('.exercise.reflection textarea').forEach(ta => {
    const ex = ta.closest('.exercise');
    const chapter = ex.dataset.chapter;
    const exId = ex.dataset.exercise;
    const existing = exercises.getReflection(chapter, exId);
    if (existing) ta.value = existing.antwort;
    ta.addEventListener('input', () => {
      exercises.saveReflection(chapter, exId, ta.value);
      updateNotesCount();
    });
  });

  // Copy-Buttons
  root.querySelectorAll('.code-block .copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.parentElement.textContent.replace(/^Kopieren\s*/, '').trim();
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = '✓ Kopiert';
        setTimeout(() => btn.textContent = 'Kopieren', 1500);
      } catch (e) {
        btn.textContent = '✗ Fehler';
        setTimeout(() => btn.textContent = 'Kopieren', 1500);
      }
    });
  });

  // Quiz-Choices
  root.querySelectorAll('.quiz-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      const ex = btn.closest('.exercise');
      const correct = btn.dataset.correct === 'true';
      btn.classList.add(correct ? 'is-correct' : 'is-wrong');
      ex.querySelectorAll('.quiz-choice').forEach(b => b.disabled = true);
      const fb = ex.querySelector('.quiz-feedback');
      const feedback = correct
        ? (ex.dataset.feedback || '✓ Korrekt.')
        : '✗ Falsche Antwort. Schau dir die richtige Auflösung an (grün markiert).';
      if (!correct) {
        const right = ex.querySelector('.quiz-choice[data-correct="true"]');
        if (right) right.classList.add('is-correct');
      }
      fb.textContent = feedback;
      fb.classList.toggle('is-wrong', !correct);
      fb.hidden = false;
      exercises.recordQuizAttempt(ex.dataset.chapter, ex.dataset.exercise, {
        choice: btn.textContent.trim(),
        correct
      });
    });
  });

  updateNotesCount();
}

function updateNotesCount() {
  const n = exercises.countReflections();
  document.querySelectorAll('.ex-notes-count').forEach(el => el.textContent = n);
}

initExercises();

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
    const pressed = btn.dataset.toggle !== undefined ? current === true : current === val;
    btn.classList.toggle('active', pressed);
    btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
  });
  document.body.dataset.layout = mode.get('layout');
  document.body.dataset.llm = mode.get('llm') ? 'on' : 'off';
  document.body.dataset.exercises = mode.get('exercises') ? 'on' : 'off';
}

refreshToggleStates();

// Slide-Navigation
const slides = () => Array.from(document.querySelectorAll('.app-deck .slide'));
let currentIdx = 0;

function getMaxStep(slide) {
  const nums = Array.from(slide.querySelectorAll('[data-step]'))
    .map(el => parseInt(el.dataset.step, 10))
    .filter(n => !isNaN(n));
  return nums.length ? Math.max(...nums) : 0;
}

function getRevealedCount(slide) {
  return parseInt(slide.dataset.stepCurrent || '0', 10);
}

function setRevealedCount(slide, n) {
  slide.dataset.stepCurrent = n;
  slide.querySelectorAll('[data-step]').forEach(el => {
    const stepN = parseInt(el.dataset.step, 10);
    el.classList.toggle('is-revealed', !isNaN(stepN) && stepN <= n);
  });
}

function resetSteps(slide) { setRevealedCount(slide, 0); }
function revealAllSteps(slide) { setRevealedCount(slide, getMaxStep(slide)); }

function showSlide(idx) {
  const list = slides();
  if (idx < 0 || idx >= list.length) return;
  const goingForward = idx > currentIdx;
  list.forEach((s, i) => s.classList.toggle('is-active', i === idx));
  const newSlide = list[idx];
  if (newSlide?.hasAttribute('data-stepped')) {
    if (goingForward) resetSteps(newSlide);
    else revealAllSteps(newSlide);
  }
  currentIdx = idx;
  document.getElementById('current').textContent = idx + 1;
  document.getElementById('total').textContent = list.length;
}

function goNext() {
  if (mode.get('layout') === 'slide') {
    const cur = slides()[currentIdx];
    if (cur?.hasAttribute('data-stepped')) {
      const max = getMaxStep(cur);
      const rev = getRevealedCount(cur);
      if (rev < max) { setRevealedCount(cur, rev + 1); return; }
    }
  }
  showSlide(currentIdx + 1);
}

function goPrev() {
  if (mode.get('layout') === 'slide') {
    const cur = slides()[currentIdx];
    if (cur?.hasAttribute('data-stepped')) {
      const rev = getRevealedCount(cur);
      if (rev > 0) { setRevealedCount(cur, rev - 1); return; }
    }
  }
  showSlide(currentIdx - 1);
}

document.getElementById('prev-slide').addEventListener('click', goPrev);
document.getElementById('next-slide').addEventListener('click', goNext);

document.addEventListener('keydown', (e) => {
  if (mode.get('layout') !== 'slide') return;
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); goNext(); }
  if (e.key === 'ArrowLeft'  || e.key === 'PageUp') { e.preventDefault(); goPrev(); }
});

mode.on('change', ({ key }) => {
  if (key === 'layout') showSlide(currentIdx);
});

// Hash-Navigation: bei Page-Load oder Hash-Wechsel zur Folie mit data-slide-id springen
function jumpToHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return false;
  const list = slides();
  const idx = list.findIndex(s => s.dataset.slideId === hash);
  if (idx >= 0) { showSlide(idx); return true; }
  return false;
}

window.addEventListener('hashchange', jumpToHash);

if (!jumpToHash()) showSlide(0);

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
