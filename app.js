// app.js — Haupteinstieg
import { Storage } from './lib/storage.js?v=2026-05-18-codex-v2l';
import { ModeManager } from './lib/mode.js?v=2026-05-23-palette-variants';
import { icon } from './lib/icons.js?v=2026-05-18-codex-v2l';
import { initSprite } from './lib/icons-sprite.js?v=2026-05-18-codex-v2l';
import { initTabs } from './lib/tabs.js?v=2026-05-18-codex-v2l';
import { Exercises } from './lib/exercises.js?v=2026-05-18-codex-v2l';
import { LEARNING_PATHS, TRAINER_NOTES, TRAINER_VARIANTS, getPathProgress } from './lib/learning-paths.js?v=2026-05-18-codex-v2l';

// Codex-Sprite so früh wie möglich inlined, damit nachgelagerte renderIcon()-
// Aufrufe und <use href="#i-NAME"/>-Referenzen sofort auflösen. Fire-and-forget:
// die alte icon()-API funktioniert auch ohne Sprite (sie inline'd Pfade selbst).
initSprite();

const NS = 'llm-101-codex-v2-preview';
const storage = new Storage(NS);
const mode = new ModeManager(storage);
const exercises = new Exercises(storage);
const params = new URLSearchParams(window.location.search);
const trainerEnabled = params.get('trainer') === '1';
const updateBanner = document.getElementById('update-banner');
const updateReload = document.getElementById('update-reload');

if (trainerEnabled) document.body.dataset.trainer = 'on';

function showUpdateBanner() {
  if (!updateBanner) return;
  updateBanner.hidden = false;
}

updateReload?.addEventListener('click', () => window.location.reload());

function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || window.location.protocol === 'file:') return;
  let controllerChanged = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (controllerChanged) return;
    controllerChanged = true;
    showUpdateBanner();
  });
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' });
      if (registration.waiting && navigator.serviceWorker.controller) showUpdateBanner();
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateBanner();
          }
        });
      });
    } catch (error) {
      // Offline-Support ist optional; die Präsentation bleibt ohne Service Worker nutzbar.
    }
  });
}

registerServiceWorker();

// Theme-Buttons mit Icons befüllen
document.querySelector('[data-mode="theme"][data-value="light"]').innerHTML = icon('sun');
document.querySelector('[data-mode="theme"][data-value="dark"]').innerHTML = icon('moon');

// Inline-Icon-Auflösung für Folien-Markup
document.querySelectorAll('[data-icon]').forEach(el => {
  el.innerHTML = icon(el.dataset.icon);
});

// LLM-Tabs initialisieren (nach Icon-Resolver, vor TOC-Aufbau)
initTabs(document.body);

function initSlideBodyFitWrappers(root = document) {
  root.querySelectorAll('.slide.codex .slide-body').forEach(body => {
    if (body.firstElementChild?.classList.contains('slide-body-fit')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'slide-body-fit';
    while (body.firstChild) wrapper.appendChild(body.firstChild);
    body.appendChild(wrapper);
  });
}

function fitSlideBody(slide) {
  const body = slide?.querySelector('.slide-body');
  const wrapper = body?.querySelector(':scope > .slide-body-fit');
  if (!body || !wrapper) return;

  body.classList.remove('is-fit-scaled');
  body.classList.remove('is-overflowing');
  body.style.removeProperty('--slide-fit-scale');
  wrapper.style.removeProperty('width');
  if (mode.get('layout') !== 'slide') return;

  const style = getComputedStyle(body);
  const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  const available = body.clientHeight - paddingY;
  const wrapperTop = wrapper.getBoundingClientRect().top;
  const visibleBottom = [...wrapper.querySelectorAll('*')].reduce((bottom, el) => {
    if (el.closest('[data-step]:not(.is-revealed)')) return bottom;
    const elStyle = getComputedStyle(el);
    if (elStyle.display === 'none' || elStyle.visibility === 'hidden') return bottom;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return bottom;
    return Math.max(bottom, rect.bottom - wrapperTop);
  }, 0);
  const fullStepLayout = body.dataset.fitFull === 'true';
  const needed = fullStepLayout
    ? Math.max(visibleBottom, wrapper.scrollHeight)
    : Math.max(visibleBottom, wrapper.firstElementChild ? 1 : wrapper.scrollHeight);
  if (!available || !needed || needed <= available) return;

  const canScale = window.matchMedia('(min-width: 821px)').matches;
  const minScale = parseFloat(body.dataset.minFitScale || '0.88');
  const fitBuffer = parseFloat(body.dataset.fitBuffer || '24');
  const scale = Math.max(minScale, Math.min(1, (available - fitBuffer) / needed));
  if (canScale && scale < 1 && needed * scale <= available + 1) {
    body.style.setProperty('--slide-fit-scale', scale.toFixed(3));
    wrapper.style.width = `${100 / scale}%`;
    body.classList.add('is-fit-scaled');
    return;
  }

  body.classList.add('is-overflowing');
}

function fitVisibleSlide() {
  fitSlideBody(slides()[currentIdx]);
}

function queueSlideBodyFit(slide) {
  requestAnimationFrame(() => fitSlideBody(slide));
}

initSlideBodyFitWrappers();

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

function initPromptProduct(root = document) {
  root.querySelectorAll('[data-prompt-product]').forEach(demo => {
    const output = demo.querySelector('.pp-output');
    const views = demo.querySelectorAll('[data-prompt-view]');

    function setMode(modeName) {
      demo.querySelectorAll('[data-prompt-product-mode]').forEach(btn => {
        const active = btn.dataset.promptProductMode === modeName;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      demo.querySelectorAll('[data-prompt-anatomy]').forEach(el => {
        el.hidden = modeName !== 'strong';
      });
      views.forEach(view => {
        const active = view.dataset.promptView === modeName;
        view.hidden = !active;
        view.classList.toggle('is-active', active);
      });
      const outputAttr = modeName === 'strong' ? 'data-output-strong' : 'data-output-weak';
      if (output) output.textContent = output.getAttribute(outputAttr) || '';
    }

    demo.querySelectorAll('[data-prompt-product-mode]').forEach(btn => {
      btn.addEventListener('click', () => setMode(btn.dataset.promptProductMode));
    });

    setMode('weak');
  });
}

initPromptProduct();

function initContextXray(root = document) {
  root.querySelectorAll('[data-context-xray]').forEach(demo => {
    const result = demo.querySelector('[data-xray-result]');
    const stacks = demo.querySelectorAll('[data-xray-stack]');
    const windows = demo.querySelectorAll('[data-xray-window]');

    function setMode(modeName) {
      demo.dataset.xrayMode = modeName;
      demo.querySelectorAll('[data-context-xray-mode]').forEach(btn => {
        const active = btn.dataset.contextXrayMode === modeName;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      stacks.forEach(stack => {
        const active = stack.dataset.xrayStack === modeName;
        stack.hidden = !active;
        stack.classList.toggle('is-active', active);
      });
      windows.forEach(windowEl => {
        const active = windowEl.dataset.xrayWindow === modeName;
        windowEl.hidden = !active;
        windowEl.classList.toggle('is-active', active);
      });
      const resultAttr = modeName === 'noisy' ? 'data-result-noisy' : 'data-result-clean';
      if (result) result.textContent = result.getAttribute(resultAttr) || '';
    }

    demo.querySelectorAll('[data-context-xray-mode]').forEach(btn => {
      btn.addEventListener('click', () => setMode(btn.dataset.contextXrayMode));
    });

    setMode('clean');
  });
}

initContextXray();

// Toggle-Verkabelung
document.querySelectorAll('.toggle[data-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    const modeKey = btn.dataset.mode;
    if (btn.dataset.toggle !== undefined) {
      mode.toggle(modeKey);
    } else {
      mode.set(modeKey, btn.dataset.value);
    }
    refreshToggleStates();
    requestAnimationFrame(fitVisibleSlide);
  });
});

function refreshToggleStates() {
  document.querySelectorAll('.toggle[data-mode]').forEach(btn => {
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
const slideTotal = () => slides().length;
let currentIdx = 0;
const appHeader = document.querySelector('.app-header');

function updateAppShellMetrics() {
  const viewportHeight = Math.floor(
    window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight
  );
  document.documentElement.style.setProperty('--app-viewport-height', `${viewportHeight}px`);

  if (appHeader) {
    const height = Math.ceil(appHeader.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--app-header-height', `${height}px`);
  }
}

function refreshViewportFit() {
  updateAppShellMetrics();
  fitVisibleSlide();
}

if ('ResizeObserver' in window && appHeader) {
  const headerObserver = new ResizeObserver(refreshViewportFit);
  headerObserver.observe(appHeader);
}

const pathPanel = document.getElementById('path-panel');
const pathToggle = document.getElementById('path-toggle');
const pathClose = document.getElementById('path-close');
const pathPanelBody = document.getElementById('path-panel-body');
const pathStatus = document.getElementById('path-status');
const trainerPanel = document.getElementById('trainer-panel');
const trainerToggle = document.getElementById('trainer-toggle');
const trainerClose = document.getElementById('trainer-close');
const trainerPanelBody = document.getElementById('trainer-panel-body');
const chapterProgress = document.getElementById('chapter-progress');
const quickNavPopover = document.getElementById('quick-nav-popover');
const quickNavList = document.getElementById('quick-nav-list');
const quickNavClose = document.getElementById('quick-nav-close');

function normalizePathState(raw) {
  const state = raw && typeof raw === 'object' ? raw : {};
  return {
    activePathId: state.activePathId || null,
    completed: state.completed && typeof state.completed === 'object' ? state.completed : {}
  };
}

let pathState = normalizePathState(storage.get('learningPaths'));

function savePathState() {
  storage.set('learningPaths', pathState);
}

// Spec §6.2 — Active-Path-Persistierung (separater Key vom Fortschritt).
// First-Run: kein aktiver Pfad, bis der User bewusst einen auswählt.
function loadActiveFooterPath() {
  const raw = storage.get('path.active');
  if (typeof raw === 'string' && LEARNING_PATHS.some(p => p.id === raw)) return raw;
  return null;
}
let activeFooterPathId = pathState.activePathId || loadActiveFooterPath();
function setActiveFooterPath(pathId) {
  if (pathId !== null && !LEARNING_PATHS.some(p => p.id === pathId)) return;
  activeFooterPathId = pathId;
  if (pathId) storage.set('path.active', pathId);
  else storage.remove('path.active');
}

function pathById(id) {
  return LEARNING_PATHS.find(path => path.id === id) || null;
}

function slideById(id) {
  return slides().find(slide => slide.dataset.slideId === id) || null;
}

function slideTitle(id) {
  const slide = slideById(id);
  return slide?.querySelector('h1, h2, h3')?.textContent?.trim() || id;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function completedFor(pathId) {
  return new Set(pathState.completed[pathId] || []);
}

function setCompleted(pathId, set) {
  pathState.completed[pathId] = Array.from(set);
  savePathState();
}

function pathProgress(path) {
  const completed = completedFor(path.id);
  const done = path.stations.filter(id => completed.has(id)).length;
  return { done, total: path.stations.length, pct: Math.round((done / path.stations.length) * 100) };
}

function navigateToSlide(id) {
  const idx = slides().findIndex(slide => slide.dataset.slideId === id);
  if (idx < 0) return;
  showSlide(idx);
  history.replaceState(null, '', `#${id}`);
}

function setPanelOpen(panel, button, open) {
  if (!panel || !button) return;
  panel.classList.toggle('is-open', open);
  panel.setAttribute('aria-hidden', open ? 'false' : 'true');
  button.classList.toggle('active', open);
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function renderPathPanel() {
  if (!pathPanelBody) return;
  const activePath = pathById(pathState.activePathId);
  const activeSlideId = slides()[currentIdx]?.dataset.slideId;

  const cards = LEARNING_PATHS.map(path => {
    const progress = pathProgress(path);
    const active = path.id === pathState.activePathId;
    return `
      <article class="path-card ${active ? 'is-active' : ''}">
        <div class="path-card-top">
          <div>
            <h3>${escapeHtml(path.title)}</h3>
            <p>${escapeHtml(path.description)}</p>
          </div>
          <span class="path-duration">${escapeHtml(path.duration)}</span>
        </div>
        <div class="path-progress" aria-label="${escapeHtml(path.title)} Fortschritt ${progress.done} von ${progress.total}">
          <span style="width: ${progress.pct}%"></span>
        </div>
        <div class="path-card-bottom">
          <span>${progress.done}/${progress.total} Stationen</span>
          <button class="btn ${active ? '' : 'btn-primary'}" data-path-start="${escapeHtml(path.id)}" type="button">${active ? 'Aktiv' : progress.done ? 'Fortsetzen' : 'Starten'}</button>
        </div>
      </article>
    `;
  }).join('');

  const activeDetail = activePath ? renderActivePath(activePath, activeSlideId) : `
    <section class="panel-section">
      <h3>Wähle einen Pfad</h3>
      <p>Du kannst mehrere Pfade nacheinander absolvieren. Dein Fortschritt bleibt nur in diesem Browser gespeichert.</p>
    </section>
  `;

  pathPanelBody.innerHTML = `
    <section class="path-grid">${cards}</section>
    ${activeDetail}
  `;

  pathPanelBody.querySelectorAll('[data-path-start]').forEach(btn => {
    btn.addEventListener('click', () => startPath(btn.dataset.pathStart));
  });
  pathPanelBody.querySelectorAll('[data-path-station]').forEach(btn => {
    btn.addEventListener('click', () => navigateToSlide(btn.dataset.pathStation));
  });
  pathPanelBody.querySelector('[data-path-next]')?.addEventListener('click', (e) => {
    navigateToSlide(e.currentTarget.dataset.pathNext);
  });
  pathPanelBody.querySelector('[data-path-reset]')?.addEventListener('click', (e) => {
    const pathId = e.currentTarget.dataset.pathReset;
    pathState.completed[pathId] = [];
    savePathState();
    renderPathPanel();
    updatePathStatus();
  });
  pathPanelBody.querySelector('[data-path-pause]')?.addEventListener('click', () => {
    pathState.activePathId = null;
    savePathState();
    setActiveFooterPath(null);
    renderPathPanel();
    updatePathStatus();
    refreshAllSlideFooters();
  });
  pathPanelBody.querySelector('[data-path-reset-all]')?.addEventListener('click', () => {
    if (!window.confirm('Alle Lernpfad-Fortschritte in diesem Browser zurücksetzen?')) return;
    pathState = normalizePathState(null);
    savePathState();
    setActiveFooterPath(null);
    renderPathPanel();
    updatePathStatus();
    refreshAllSlideFooters();
  });
}

function renderActivePath(path, activeSlideId) {
  const completed = completedFor(path.id);
  const nextId = path.stations.find(id => !completed.has(id)) || path.stations[path.stations.length - 1];
  const progress = pathProgress(path);
  const stations = path.stations.map(id => {
    const done = completed.has(id);
    const current = activeSlideId === id;
    return `
      <button class="path-station ${done ? 'is-done' : ''} ${current ? 'is-current' : ''}" data-path-station="${escapeHtml(id)}" type="button">
        <span>${done ? '✓' : current ? '→' : '·'}</span>
        <strong>${escapeHtml(slideTitle(id))}</strong>
      </button>
    `;
  }).join('');

  return `
    <section class="panel-section active-path">
      <div class="active-path-head">
        <div>
          <h3>${escapeHtml(path.title)}</h3>
          <p>${progress.done}/${progress.total} Stationen abgeschlossen</p>
        </div>
        <button class="btn btn-primary" data-path-next="${escapeHtml(nextId)}" type="button">${progress.done === progress.total ? 'Nochmal ansehen' : 'Nächste Station'}</button>
      </div>
      <div class="path-stations">${stations}</div>
      <div class="path-management">
        <button class="btn btn-ghost panel-reset" data-path-pause type="button">Aktiven Pfad pausieren</button>
        <button class="btn btn-ghost panel-reset" data-path-reset="${escapeHtml(path.id)}" type="button">Diesen Fortschritt zurücksetzen</button>
        <button class="btn btn-ghost panel-reset" data-path-reset-all type="button">Alle Fortschritte zurücksetzen</button>
      </div>
    </section>
  `;
}

function startPath(pathId) {
  const path = pathById(pathId);
  if (!path) return;
  pathState.activePathId = path.id;
  if (!Array.isArray(pathState.completed[path.id])) pathState.completed[path.id] = [];
  savePathState();
  // Spec §6.2 — Aktiven Footer-Pfad synchron mitführen.
  setActiveFooterPath(path.id);
  mode.set('llm', true);
  mode.set('exercises', true);
  refreshToggleStates();
  markActivePathSlide(slides()[currentIdx]);
  navigateToSlide(path.stations.find(id => !completedFor(path.id).has(id)) || path.stations[0]);
  renderPathPanel();
  updatePathStatus();
  // Alle sichtbaren (und nicht-sichtbaren) Footer neu rendern, damit der
  // Pfad-Switch sofort durchschlägt.
  refreshAllSlideFooters();
}

function markActivePathSlide(slide) {
  const path = pathById(pathState.activePathId);
  const id = slide?.dataset.slideId;
  if (!path || !id || !path.stations.includes(id)) return;
  const completed = completedFor(path.id);
  if (!completed.has(id)) {
    completed.add(id);
    setCompleted(path.id, completed);
  }
}

function updatePathStatus() {
  if (!pathStatus) return;
  const path = pathById(pathState.activePathId);
  if (!path) {
    pathStatus.hidden = true;
    return;
  }
  const progress = pathProgress(path);
  pathStatus.textContent = `${path.title}: ${progress.done}/${progress.total}`;
  pathStatus.hidden = false;
}

// Spec §6.3 — Slide-Footer-Rendering.
// Setzt `.slide-progress` einer Slide komplett neu (robust gegen variierende Stubs
// aus den D-Paketen). Markup-Pattern:
//   <button class="slide-status slide-folio quick-nav-trigger">Folie <b>{folio} / {total}</b></button>
//   <span class="slide-status slide-path">Lernpfad <b>{pathLabel}</b></span>
//   <span class="slide-status slide-step">Schnitt <b>{n} von {m}</b> + Mini-Bar</span>
// Cover (`einstieg-1`) → Lernpfad „Übersicht", kein Schritt.
// Slide ausserhalb des Pfads → nur aktiver Lernpfad, kein Schritt.
function renderSlideFooter(slideId) {
  if (!slideId) return;
  const slide = slideById(slideId);
  if (!slide) return;
  const progress = slide.querySelector('.slide-foot .slide-progress');
  if (!progress) return;

  const folio = slide.dataset.folio || '';
  const isCover = slideId === 'einstieg-1';
  const activePath = pathById(activeFooterPathId);
  const info = activePath && !isCover ? getPathProgress(slideId, activeFooterPathId) : null;

  let pathLabel;
  let stepHtml = '';
  let pathHtml = '';
  if (!activePath || isCover) {
    pathLabel = '';
  } else if (!info || !info.inPath) {
    pathLabel = activePath.title;
  } else {
    pathLabel = info.pathLabel;
    const pct = Math.max(0, Math.min(100, Math.round((info.step / info.total) * 100)));
    stepHtml = `<span class="slide-status slide-step" style="--path-progress:${pct}%">` +
      `<span class="slide-status-text">Schnitt <b>${info.step} von ${info.total}</b></span>` +
      `<span class="path-mini-bar" aria-hidden="true"><i></i></span>` +
      `</span>`;
  }
  if (pathLabel) {
    pathHtml = `<span class="slide-status slide-path"><svg class="ic" aria-hidden="true"><use href="#i-route"/></svg><span>Lernpfad</span> <b>${escapeHtml(pathLabel)}</b></span>`;
  }

  const total = slideTotal();
  progress.innerHTML =
    `<button class="slide-status slide-folio quick-nav-trigger" type="button" aria-haspopup="dialog" aria-expanded="${quickNavPopover?.getAttribute('aria-hidden') === 'false' ? 'true' : 'false'}"><svg class="ic" aria-hidden="true"><use href="#i-bookmark"/></svg><span>Folie</span> <b>${escapeHtml(folio)} / ${total}</b></button>` +
    pathHtml +
    stepHtml;
}

function refreshAllSlideFooters() {
  slides().forEach(slide => renderSlideFooter(slide.dataset.slideId));
}

function renderQuickNav() {
  if (!quickNavList) return;
  quickNavList.innerHTML = slides().map((slide, idx) => {
    const id = slide.dataset.slideId || '';
    const folio = slide.dataset.folio || String(idx + 1).padStart(2, '0');
    const title = slideTitle(id);
    const current = idx === currentIdx;
    return `<button class="quick-nav-item${current ? ' is-current' : ''}" type="button" data-quick-slide="${escapeHtml(id)}" ${current ? 'aria-current="page"' : ''}>` +
      `<span>${escapeHtml(folio)}</span>` +
      `<b>${escapeHtml(title)}</b>` +
    `</button>`;
  }).join('');
}

function setQuickNavOpen(open) {
  if (!quickNavPopover) return;
  quickNavPopover.setAttribute('aria-hidden', open ? 'false' : 'true');
  document.querySelectorAll('.quick-nav-trigger').forEach(trigger => {
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  if (open) {
    renderQuickNav();
    requestAnimationFrame(() => {
      quickNavList?.querySelector('.quick-nav-item.is-current')?.scrollIntoView({ block: 'nearest' });
    });
  }
}

function updateQuickNavCurrent() {
  if (!quickNavList) return;
  quickNavList.querySelectorAll('[data-quick-slide]').forEach(item => {
    const current = item.dataset.quickSlide === slides()[currentIdx]?.dataset.slideId;
    item.classList.toggle('is-current', current);
    if (current) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
  document.querySelectorAll('.quick-nav-trigger').forEach(trigger => {
    trigger.setAttribute('aria-expanded', quickNavPopover?.getAttribute('aria-hidden') === 'false' ? 'true' : 'false');
  });
}

function updateChapterProgress(slide) {
  if (!chapterProgress) return;
  const chapter = slide?.dataset.chapter || '';
  chapterProgress.querySelectorAll('[data-progress-chapter]').forEach(item => {
    item.classList.toggle('is-active', item.dataset.progressChapter === chapter);
  });
}

function copyText(text, button) {
  if (!text) return;
  navigator.clipboard?.writeText(text).then(() => {
    const original = button.textContent;
    button.textContent = 'Kopiert';
    setTimeout(() => { button.textContent = original; }, 1400);
  }).catch(() => {
    button.textContent = 'Nicht kopiert';
  });
}

let trainerVariantId = storage.get('trainer.variant') || '120';

function renderTrainerPanel(slide = slides()[currentIdx]) {
  if (!trainerEnabled || !trainerPanelBody) return;
  const slideId = slide?.dataset.slideId || '';
  const title = slideTitle(slideId);
  const note = TRAINER_NOTES[slideId] || {
    timing: 'frei',
    focus: 'Keine spezifische Trainer-Notiz. Kurz halten und zur nächsten Kernstation führen.',
    notes: ['Bei Bedarf Lernpfad öffnen und passende Station markieren.'],
    fallback: 'Folie überspringen, wenn sie für die Gruppe nicht relevant ist.',
    prompt: ''
  };
  const variant = TRAINER_VARIANTS.find(item => item.id === trainerVariantId) || TRAINER_VARIANTS[1];

  trainerPanelBody.innerHTML = `
    <section class="trainer-variant-switch" aria-label="Workshop-Länge">
      ${TRAINER_VARIANTS.map(item => `<button class="btn ${item.id === variant.id ? 'btn-primary' : ''}" data-trainer-variant="${escapeHtml(item.id)}" type="button">${escapeHtml(item.label)}</button>`).join('')}
    </section>
    <section class="panel-section trainer-current">
      <div class="trainer-meta">
        <span>${escapeHtml(note.timing)}</span>
        <span>${escapeHtml(slideId)}</span>
      </div>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(note.focus)}</p>
      <ul>
        ${note.notes.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
      <div class="trainer-fallback"><strong>Fallback:</strong> ${escapeHtml(note.fallback)}</div>
      ${note.prompt ? `<button class="btn btn-primary" data-trainer-copy="${escapeHtml(note.prompt)}" type="button">Demo-Prompt kopieren</button>` : ''}
    </section>
    <section class="panel-section trainer-timeline">
      <h3>Ablauf ${escapeHtml(variant.label)}</h3>
      <ol>
        ${variant.checkpoints.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
      </ol>
    </section>
    <section class="panel-section trainer-demo-checklist">
      <h3>Demo-Checkliste</h3>
      <ul>
        ${variant.demoChecklist.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </section>
    <section class="panel-section trainer-probe-cues">
      <h3>Probe-Modus</h3>
      <ol>
        ${variant.probeCues.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
      </ol>
    </section>
  `;

  trainerPanelBody.querySelectorAll('[data-trainer-variant]').forEach(btn => {
    btn.addEventListener('click', () => {
      trainerVariantId = btn.dataset.trainerVariant;
      storage.set('trainer.variant', trainerVariantId);
      renderTrainerPanel(slides()[currentIdx]);
    });
  });
  trainerPanelBody.querySelector('[data-trainer-copy]')?.addEventListener('click', (e) => {
    copyText(e.currentTarget.dataset.trainerCopy, e.currentTarget);
  });
}

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
  queueSlideBodyFit(slide);
}

function resetSteps(slide) { setRevealedCount(slide, 0); }
function revealAllSteps(slide) { setRevealedCount(slide, getMaxStep(slide)); }

const LLM_TAB_SEQUENCE = ['claude', 'chatgpt', 'gemini'];

function activeTabName(slide) {
  return slide?.querySelector('[data-llm-tabs] [data-tab].active')?.dataset.tab || LLM_TAB_SEQUENCE[0];
}

function setLlmTab(slide, tabName) {
  slide?.querySelector(`[data-llm-tabs] [data-tab="${tabName}"]`)?.click();
}

function moveLlmTab(slide, direction) {
  if (!mode.get('llm')) return false;
  const group = slide?.querySelector('[data-llm-tabs]');
  if (!group) return false;
  const current = activeTabName(slide);
  const index = LLM_TAB_SEQUENCE.indexOf(current);
  if (index < 0) return false;
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= LLM_TAB_SEQUENCE.length) return false;
  group.querySelector(`[data-tab="${LLM_TAB_SEQUENCE[nextIndex]}"]`)?.click();
  queueSlideBodyFit(slide);
  return true;
}

function showSlide(idx) {
  const list = slides();
  if (idx < 0 || idx >= list.length) return;
  const goingForward = idx > currentIdx;
  list.forEach((s, i) => {
    const active = i === idx;
    s.classList.toggle('is-active', active);
    s.setAttribute('aria-hidden', active ? 'false' : 'true');
  });
  const newSlide = list[idx];
  if (newSlide?.hasAttribute('data-stepped')) {
    if (goingForward) resetSteps(newSlide);
    else revealAllSteps(newSlide);
  }
  currentIdx = idx;
  if (mode.get('layout') === 'slide' && mode.get('llm') && newSlide?.querySelector('[data-llm-tabs]')) {
    setLlmTab(newSlide, goingForward ? LLM_TAB_SEQUENCE[0] : LLM_TAB_SEQUENCE[LLM_TAB_SEQUENCE.length - 1]);
  }
  document.getElementById('current').textContent = idx + 1;
  document.getElementById('total').textContent = list.length;
  updateTOCCurrent(newSlide?.dataset.slideId);
  updateChapterProgress(newSlide);
  markActivePathSlide(newSlide);
  renderSlideFooter(newSlide?.dataset.slideId);
  renderPathPanel();
  updatePathStatus();
  renderTrainerPanel(newSlide);
  updateQuickNavCurrent();
  queueSlideBodyFit(newSlide);
}

function scrollActiveSlideIntoReadingView(idx = currentIdx) {
  if (mode.get('layout') !== 'scroll') return;
  const slide = slides()[idx];
  if (!slide) return;
  const deck = document.querySelector('.app-deck');
  if (!deck) return;
  const alignSlide = (attempt = 0) => {
    const slideRect = slide.getBoundingClientRect();
    const deckRect = deck.getBoundingClientRect();
    const top = slideRect.top - deckRect.top + deck.scrollTop;
    deck.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
    if (attempt < 20 && Math.abs(slideRect.top - deckRect.top) > 2) {
      setTimeout(() => alignSlide(attempt + 1), 50);
    }
  };
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      alignSlide();
    });
  });
}

function goNext() {
  if (mode.get('layout') === 'slide') {
    const cur = slides()[currentIdx];
    if (cur?.hasAttribute('data-stepped')) {
      const max = getMaxStep(cur);
      const rev = getRevealedCount(cur);
      if (rev < max) { setRevealedCount(cur, rev + 1); return; }
    }
    if (moveLlmTab(cur, 1)) return;
  }
  showSlide(currentIdx + 1);
}

function goPrev() {
  if (mode.get('layout') === 'slide') {
    const cur = slides()[currentIdx];
    if (moveLlmTab(cur, -1)) return;
    if (cur?.hasAttribute('data-stepped')) {
      const rev = getRevealedCount(cur);
      if (rev > 0) { setRevealedCount(cur, rev - 1); return; }
    }
  }
  showSlide(currentIdx - 1);
}

document.getElementById('prev-slide').addEventListener('click', goPrev);
document.getElementById('next-slide').addEventListener('click', goNext);

document.addEventListener('click', (e) => {
  const quickTrigger = e.target.closest('.quick-nav-trigger');
  if (quickTrigger && mode.get('layout') === 'slide') {
    e.preventDefault();
    const open = quickNavPopover?.getAttribute('aria-hidden') !== 'false';
    setQuickNavOpen(open);
    return;
  }

  const quickItem = e.target.closest('[data-quick-slide]');
  if (quickItem) {
    e.preventDefault();
    const idx = slides().findIndex(slide => slide.dataset.slideId === quickItem.dataset.quickSlide);
    if (idx >= 0) showSlide(idx);
    setQuickNavOpen(false);
    return;
  }

  if (e.target.closest('#quick-nav-close')) {
    e.preventDefault();
    setQuickNavOpen(false);
    return;
  }

  const quickCard = e.target.closest('.quick-nav-card');
  if (quickNavPopover?.getAttribute('aria-hidden') === 'false' && !quickCard) {
    setQuickNavOpen(false);
  }

  const nav = e.target.closest('.slide-nav.prev, .slide-nav.next');
  if (!nav || mode.get('layout') !== 'slide') return;
  const href = nav.getAttribute('href') || '';
  if (href && !href.startsWith('#')) return;
  e.preventDefault();
  if (nav.getAttribute('aria-disabled') === 'true') return;
  if (nav.classList.contains('next')) goNext();
  else goPrev();
});

document.addEventListener('keydown', (e) => {
  if (mode.get('layout') !== 'slide') return;
  if (e.defaultPrevented) return;
  const tag = e.target.tagName;
  const isLlmTabControl = e.target.closest?.('[data-llm-tabs]');
  if ((['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT', 'A'].includes(tag) && !isLlmTabControl) || e.target.isContentEditable) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); goNext(); }
  if (e.key === 'ArrowLeft'  || e.key === 'PageUp') { e.preventDefault(); goPrev(); }
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  setQuickNavOpen(false);
  setPanelOpen(pathPanel, pathToggle, false);
  setPanelOpen(trainerPanel, trainerToggle, false);
});

mode.on('change', ({ key }) => {
  if (key === 'layout') {
    const targetIdx = currentIdx;
    setQuickNavOpen(false);
    requestAnimationFrame(() => {
      showSlide(targetIdx);
      scrollActiveSlideIntoReadingView(targetIdx);
    });
  }
});

window.addEventListener('resize', refreshViewportFit);
window.visualViewport?.addEventListener('resize', refreshViewportFit);
window.visualViewport?.addEventListener('scroll', refreshViewportFit);

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

updateAppShellMetrics();
if (!jumpToHash()) showSlide(0);
// Initial alle Slide-Footer normieren (D-Pakete hinterliessen variierende Stubs).
refreshAllSlideFooters();

pathToggle?.addEventListener('click', () => {
  const open = pathPanel?.getAttribute('aria-hidden') !== 'false';
  setPanelOpen(pathPanel, pathToggle, open);
  if (open) setPanelOpen(trainerPanel, trainerToggle, false);
});
pathClose?.addEventListener('click', () => setPanelOpen(pathPanel, pathToggle, false));
trainerToggle?.addEventListener('click', () => {
  const open = trainerPanel?.getAttribute('aria-hidden') !== 'false';
  setPanelOpen(trainerPanel, trainerToggle, open);
  if (open) setPanelOpen(pathPanel, pathToggle, false);
});
trainerClose?.addEventListener('click', () => setPanelOpen(trainerPanel, trainerToggle, false));

renderPathPanel();
updatePathStatus();
renderTrainerPanel(slides()[currentIdx]);
if (trainerEnabled) setPanelOpen(trainerPanel, trainerToggle, true);

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
    a.setAttribute('aria-label', `Zu Folie: ${label}`);
    li.appendChild(a);
    ol.appendChild(li);
  });
  toc.innerHTML = '';
  toc.appendChild(ol);
  updateTOCCurrent(slides()[currentIdx]?.dataset.slideId);
}

function updateTOCCurrent(slideId) {
  document.querySelectorAll('.app-toc a').forEach(a => {
    const current = a.dataset.slideId === slideId;
    a.classList.toggle('is-current', current);
    if (current) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

// Scroll-Spy: markiere aktive Sektion im TOC
function setupScrollSpy() {
  const obs = new IntersectionObserver((entries) => {
    if (mode.get('layout') !== 'scroll') return;
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const id = entry.target.dataset.slideId;
        const idx = slides().findIndex(slide => slide.dataset.slideId === id);
        if (idx >= 0) currentIdx = idx;
        updateTOCCurrent(id);
      }
    }
  }, { threshold: 0.4 });
  slides().forEach(s => obs.observe(s));
}

rebuildTOC();
document.querySelector('.slide-counter')?.setAttribute('aria-live', 'polite');
document.querySelector('.slide-counter')?.setAttribute('aria-label', 'Aktuelle Folie');
setupScrollSpy();

// IDs als Anker setzen für Hash-Navigation
slides().forEach(s => {
  if (s.dataset.slideId && !s.id) s.id = s.dataset.slideId;
});
