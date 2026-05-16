import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, relative } from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT || 8781);
const viewports = [
  { name: 'desktop-720', width: 1280, height: 720 },
  { name: 'desktop-768', width: 1366, height: 768 },
  { name: 'phone', width: 390, height: 844 }
];

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json'
};

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    console.error('Playwright ist nicht installiert. Einmal ausfuehren: npm install && npx playwright install chromium');
    process.exit(1);
  }
}

function safePath(url) {
  const parsed = new URL(url, `http://127.0.0.1:${port}`);
  const pathname = parsed.pathname === '/' ? '/index.html' : parsed.pathname;
  const full = normalize(join(root, decodeURIComponent(pathname)));
  if (relative(root, full).startsWith('..')) return null;
  return full;
}

const server = createServer(async (req, res) => {
  try {
    const full = safePath(req.url || '/');
    if (!full) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    const body = await readFile(full);
    res.writeHead(200, { 'content-type': types[extname(full)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

const listen = () => new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
const close = () => new Promise(resolve => server.close(resolve));

function compactIssue(issue) {
  return Object.fromEntries(Object.entries(issue).filter(([, value]) => value !== undefined));
}

async function inspectState(page) {
  return page.evaluate(() => {
    const slide = document.querySelector('.slide.is-active');
    const body = slide?.querySelector('.slide-body');
    const fit = body?.querySelector(':scope > .slide-body-fit');
    const next = slide?.querySelector('.slide-nav.next');
    const rect = (el) => {
      const r = el?.getBoundingClientRect();
      return r ? { top: r.top, bottom: r.bottom, height: r.height } : null;
    };

    return {
      id: slide?.dataset.slideId,
      step: slide?.dataset.stepCurrent || '0',
      nextDisabled: next?.getAttribute('aria-disabled'),
      bodyRect: rect(body),
      fitRect: rect(fit),
      scale: body ? getComputedStyle(body).getPropertyValue('--slide-fit-scale').trim() : '',
      hiddenHit: [...document.querySelectorAll('.slide[data-stepped] [data-step]:not(.is-revealed)')]
        .some(el => getComputedStyle(el).pointerEvents !== 'none'),
      externalControls: getComputedStyle(document.querySelector('.app-controls')).display,
      bodyOverflow: getComputedStyle(document.body).overflow
    };
  });
}

await listen();
const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
let failed = false;

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, serviceWorkers: 'block' });
    const page = await context.newPage();
    const issues = [];
    const seen = new Set();

    page.on('pageerror', err => issues.push({ issue: 'pageerror', message: err.message }));
    page.on('console', msg => {
      if (msg.type() === 'error') issues.push({ issue: 'console-error', message: msg.text() });
    });

    await page.goto(`http://127.0.0.1:${port}/index.html?qa=${Date.now()}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.setItem('llm-101-v1:layout', 'slide'));
    await page.reload({ waitUntil: 'networkidle' });

    for (let i = 0; i < 220; i += 1) {
      await page.waitForTimeout(35);
      const state = await inspectState(page);
      seen.add(`${state.id}:${state.step}`);

      if (state.hiddenHit) issues.push({ issue: 'hidden step can receive clicks', id: state.id, step: state.step });
      if (state.externalControls !== 'none') issues.push({ issue: 'external controls visible', id: state.id });
      if (state.bodyOverflow !== 'hidden') issues.push({ issue: 'body can scroll in slide mode', id: state.id });
      if (state.fitRect && state.bodyRect && state.fitRect.bottom > state.bodyRect.bottom + 4) {
        issues.push({
          issue: 'slide body overflow',
          id: state.id,
          step: state.step,
          scale: state.scale,
          excess: Number((state.fitRect.bottom - state.bodyRect.bottom).toFixed(1))
        });
      }

      if (state.nextDisabled === 'true') break;

      try {
        await page.locator('.slide.is-active .slide-nav.next').click({ timeout: 1000 });
      } catch (error) {
        issues.push({ issue: 'next click failed', id: state.id, step: state.step, message: error.message.slice(0, 240) });
        break;
      }
    }

    await context.close();

    if (issues.length) {
      failed = true;
      console.error(`x ${viewport.name}: ${issues.length} issue(s), ${seen.size} states checked`);
      console.error(JSON.stringify(issues.slice(0, 12).map(compactIssue), null, 2));
    } else {
      console.log(`ok ${viewport.name}: ${seen.size} states checked`);
    }
  }
} finally {
  await browser.close();
  await close();
}

if (failed) process.exit(1);
