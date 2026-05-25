import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');
const app = read('app.js');
const css = read('presentation.css');
const appCss = read('app.css');
const tokens = read('tokens.css');
const qa = read('scripts/redesign-qa.mjs');
const pkg = JSON.parse(read('package.json'));

describe('codex v2 slide navigation and layout safeguards', () => {
  it('keeps codex slides in the legacy absolute slide frame', () => {
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\.codex\s*{[^}]*position:\s*absolute;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\.codex\s*{[^}]*height:\s*100%;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\.codex\s*{[^}]*min-height:\s*0;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\.codex\s*{[^}]*pointer-events:\s*none;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\.codex\.is-active\s*{[^}]*pointer-events:\s*auto;/s);
  });

  it('prevents hidden step content from intercepting navigation clicks', () => {
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\[data-stepped\] \[data-step\]\s*{[^}]*display:\s*none;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\[data-stepped\] \[data-step\]\s*{[^}]*visibility:\s*hidden;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\[data-stepped\] \[data-step\]\s*{[^}]*pointer-events:\s*none;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\[data-stepped\] \[data-step\]\.is-revealed\s*{[^}]*display:\s*revert;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\[data-stepped\] \[data-step\]\.is-revealed\s*{[^}]*visibility:\s*visible;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide\[data-stepped\] \[data-step\]\.is-revealed\s*{[^}]*pointer-events:\s*auto;/s);
  });

  it('routes the visible slide footer controls through the same navigation logic', () => {
    expect(app).toContain(".slide-nav.prev, .slide-nav.next");
    expect(app).toContain("if (href && !href.startsWith('#')) return;");
    expect(app).toMatch(/classList\.contains\('next'\)[\s\S]*goNext\(\)/);
    expect(app).toMatch(/else goPrev\(\)/);
  });

  it('turns the slide folio into a quick table-of-contents menu', () => {
    const html = read('index.html');
    expect(html).toContain('id="quick-nav-popover"');
    expect(app).toContain('quick-nav-trigger');
    expect(app).toContain('function renderQuickNav()');
    expect(app).toContain('data-quick-slide');
    expect(app).toContain('setQuickNavOpen(open)');
    expect(css).toContain('.quick-nav-popover');
    expect(css).toContain('.quick-nav-item.is-current');
  });

  it('keeps slide-mode controls singular and applies body fitting', () => {
    expect(css).toMatch(/body\[data-layout="slide"\] \.app-controls\s*{[^}]*display:\s*none;/s);
    expect(css).toContain('.slide-body-fit');
    expect(app).toContain('initSlideBodyFitWrappers');
    expect(app).toContain('queueSlideBodyFit');
  });

  it('preserves the current slide when switching between presentation and reading mode', () => {
    expect(app).toContain('function scrollActiveSlideIntoReadingView(idx = currentIdx)');
    expect(app).toContain('const targetIdx = currentIdx');
    expect(app).toContain("deck.scrollTo({ top: Math.max(0, top), behavior: 'auto' })");
    expect(app).toMatch(/if \(idx >= 0\) currentIdx = idx;/);
    expect(app).toMatch(/if \(key === 'layout'\)[\s\S]*requestAnimationFrame\(\(\) => {[\s\S]*showSlide\(targetIdx\);[\s\S]*scrollActiveSlideIntoReadingView\(targetIdx\);/);
  });

  it('keeps reading mode slides inside the deck column instead of clipping under the toc', () => {
    expect(css).toMatch(/body\[data-layout="scroll"\] \.app-main\s*{[^}]*min-width:\s*0;/s);
    expect(css).toMatch(/body\[data-layout="scroll"\] \.app-deck\s*{[^}]*min-width:\s*0;/s);
    expect(css).toMatch(/body\[data-layout="scroll"\] \.slide\s*{[^}]*width:\s*100%;/s);
    expect(css).toMatch(/body\[data-layout="scroll"\] \.slide\s*{[^}]*max-width:\s*min\(960px,\s*100%\);/s);
    expect(css).toMatch(/body\[data-layout="scroll"\] \.slide\.codex,\s*\.slide\.codex\[data-layout="scroll"\]\s*{[^}]*width:\s*100%;/s);
    expect(css).toMatch(/\.slide\.codex,\s*body\[data-layout="scroll"\] \.slide\.codex\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\);/s);
    expect(css).toMatch(/\.slide-body\s*{[^}]*box-sizing:\s*border-box;[^}]*width:\s*100%;[^}]*max-width:\s*100%;/s);
    expect(css).toMatch(/\.slide-body-fit\s*{[^}]*box-sizing:\s*border-box;[^}]*width:\s*100%;[^}]*max-width:\s*100%;/s);
  });

  it('sizes the slide stage from the measured header height on wrapped phone toolbars', () => {
    expect(css).toContain('var(--app-viewport-height, 100vh)');
    expect(css).toContain('var(--app-viewport-height, 100svh)');
    expect(css).toContain('var(--app-header-height, 60px)');
    expect(css).toContain('var(--app-header-height, 96px)');
    expect(css).toContain('var(--app-header-height, 118px)');
    expect(app).toContain('function updateAppShellMetrics()');
    expect(app).toContain('--app-header-height');
    expect(app).toContain('--app-viewport-height');
    expect(app).toContain('window.visualViewport?.height');
    expect(app).toContain("window.visualViewport?.addEventListener('resize', refreshViewportFit)");
    expect(app).toContain('new ResizeObserver');
    expect(app).toContain('updateAppShellMetrics();\nif (!jumpToHash()) showSlide(0);');
  });

  it('keeps lime actions readable in light and dark mode', () => {
    expect(tokens).toContain('--accent: #8ea500');
    expect(tokens).toContain('--text-on-accent: #111400');
    expect(appCss).toMatch(/\.btn\.btn-primary\s*{[^}]*color:\s*var\(--text-on-accent\)/s);
    expect(appCss).toMatch(/\.code-block \.copy-btn\s*{[^}]*color:\s*var\(--text-on-accent\)/s);
    expect(css).toMatch(/\.pp-mode\.active\s*{[^}]*color:\s*var\(--text-on-accent\)/s);
    expect(css).toMatch(/\.xray-mode\.active\s*{[^}]*color:\s*var\(--text-on-accent\)/s);
  });

  it('removes permanent stand stamps and keeps exercise durations inside mobile cards', () => {
    expect(css).toMatch(/\.slide-stand\s*{[^}]*display:\s*none;/s);
    expect(css).toMatch(/@media \(max-width: 820px\)\s*{[\s\S]*body\[data-layout="slide"\] \.ex-header[\s\S]*grid-template-columns:\s*1fr;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.ex-duration\s*{[^}]*justify-self:\s*start;[^}]*max-width:\s*100%;/s);
  });

  it('keeps phone slide mode readable with a local body scroller instead of page scroll', () => {
    expect(css).toMatch(/@media \(max-width: 820px\)\s*{[\s\S]*body\[data-layout="slide"\] \.slide\.codex \.slide-body\s*{[^}]*overflow-y:\s*auto;/s);
    expect(css).toContain('.slide-body.is-overflowing');
    expect(css).toContain('overscroll-behavior: contain');
  });

  it('uses compact iPhone slide chrome without clipped ladder or hidden footer metadata', () => {
    expect(appCss).toMatch(/@media \(max-width: 820px\)\s*{[\s\S]*body\[data-layout="slide"\] \.app-header\s*{[^}]*flex-wrap:\s*nowrap;/s);
    expect(appCss).toMatch(/@media \(max-width: 820px\)\s*{[\s\S]*body\[data-layout="slide"\] \.app-toggles\s*{[^}]*overflow-x:\s*auto;/s);
    expect(css).toMatch(/@media \(max-width: 820px\)\s*{[\s\S]*body\[data-layout="slide"\] \[data-slide-id="einstieg-3"\] \.ladder-list\s*{[^}]*display:\s*flex;/s);
    expect(css).toMatch(/@media \(max-width: 820px\)\s*{[\s\S]*body\[data-layout="slide"\] \.slide-foot\s*{[^}]*grid-template-columns:\s*auto minmax\(0,\s*1fr\) auto;/s);
    expect(css).toMatch(/body\[data-layout="slide"\] \.slide-path,\s*body\[data-layout="slide"\] \.slide-step,\s*body\[data-layout="slide"\] \.slide-progress-sep\s*{[^}]*display:\s*none;/s);
    expect(qa).toContain('horizontalOffenders');
  });

  it('isolates preview browser state from the main course URL', () => {
    const notes = read('meine-notizen.html');
    const explainer = read('explainer/a-context-window.html');
    const handout = read('handout.html');
    const quellen = read('quellen-refresh.html');
    const sw = read('sw.js');
    expect(app).toContain("const NS = 'llm-101-codex-v2-preview'");
    expect(notes).toContain("new Storage('llm-101-codex-v2-preview')");
    expect(explainer).toContain("new Storage('llm-101-codex-v2-preview')");
    expect(handout).toContain("new ModeManager(new Storage('llm-101-codex-v2-preview'))");
    expect(quellen).toContain("new ModeManager(new Storage('llm-101-codex-v2-preview'))");
    expect(sw).toContain("const CACHE_PREFIX = 'llm-101-codex-v2-preview-offline-'");
  });

  it('exposes a reproducible browser QA command for the redesign branch', () => {
    expect(pkg.scripts['qa:redesign']).toBe('node scripts/redesign-qa.mjs');
    expect(qa).toContain('nextHref');
    expect(qa).toContain("!state.nextHref.startsWith('#')");
  });

  it('supports stepped and delayed visual QA targets', () => {
    const visualQa = read('scripts/visual-qa.mjs');
    const targets = read('lib/visual-qa-targets.js');
    expect(visualQa).toContain('target.steps');
    expect(visualQa).toContain('target.waitAfterActionMs');
    expect(targets).toContain('steps: 6');
    expect(targets).toContain('width: 375');
  });

  it('checks a 375px phone viewport in redesign QA', () => {
    expect(qa).toContain("{ name: 'phone-375', width: 375, height: 667 }");
  });

  it('prints actionable redesign QA failures without hiding most slide ids', () => {
    expect(qa).toContain('issueSummary');
    expect(qa).toContain('JSON.stringify(issueSummary');
  });
});
