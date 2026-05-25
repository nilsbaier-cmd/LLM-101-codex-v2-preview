import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { extname, join, normalize, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { VISUAL_QA_TARGETS } from '../lib/visual-qa-targets.js';

const root = process.cwd();
const port = Number(process.env.PORT || 8780);
const outDir = join(root, '.visual-qa');

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
  } catch (error) {
    console.error('Playwright ist nicht installiert. Einmal ausführen: npm install --save-dev playwright && npx playwright install chromium');
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
  } catch (error) {
    res.writeHead(404);
    res.end('Not found');
  }
});

function listen() {
  return new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
}

function close() {
  return new Promise(resolve => server.close(resolve));
}

function fileName(target) {
  return `${target.id}-${target.viewport.width}x${target.viewport.height}.png`;
}

async function runTargetAction(page, target) {
  if (target.action?.startsWith('click:')) {
    const selector = target.action.slice('click:'.length);
    await page.click(selector, { timeout: target.actionTimeoutMs || 5000 });
  }

  if (Number.isInteger(target.steps) && target.steps > 0) {
    for (let i = 0; i < target.steps; i += 1) {
      await page.click('.slide.is-active .slide-nav.next', { timeout: target.actionTimeoutMs || 5000 });
      await page.waitForTimeout(target.stepDelayMs || 80);
    }
  }

  if (target.waitAfterActionMs) {
    await page.waitForTimeout(target.waitAfterActionMs);
  }
}

await mkdir(outDir, { recursive: true });
await listen();

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();

try {
  for (const target of VISUAL_QA_TARGETS) {
    const context = await browser.newContext({ viewport: target.viewport, serviceWorkers: 'block' });
    try {
      await context.addInitScript(({ theme }) => {
        localStorage.setItem('llm-101-codex-v2-preview.mode.theme', JSON.stringify(theme));
        localStorage.setItem('llm-101-codex-v2-preview.mode.exercises', JSON.stringify(true));
        localStorage.setItem('llm-101-codex-v2-preview.mode.llm', JSON.stringify(true));
      }, { theme: target.theme });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${port}/${target.url}`, { waitUntil: 'networkidle' });
      await runTargetAction(page, target);
      const screenshotPath = join(outDir, fileName(target));
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`✓ ${target.id}: ${pathToFileURL(screenshotPath).href}`);
    } catch (error) {
      console.error(`x ${target.id}: ${error.message}`);
      throw error;
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
  await close();
}
