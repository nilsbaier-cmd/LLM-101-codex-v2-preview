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

await mkdir(outDir, { recursive: true });
await listen();

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();

try {
  for (const target of VISUAL_QA_TARGETS) {
    const context = await browser.newContext({ viewport: target.viewport });
    await context.addInitScript(({ theme }) => {
      localStorage.setItem('llm-101-codex-v2-preview.mode.theme', JSON.stringify(theme));
      localStorage.setItem('llm-101-codex-v2-preview.mode.exercises', JSON.stringify(true));
      localStorage.setItem('llm-101-codex-v2-preview.mode.llm', JSON.stringify(true));
    }, { theme: target.theme });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${port}/${target.url}`, { waitUntil: 'networkidle' });
    if (target.action?.startsWith('click:')) {
      await page.click(target.action.slice('click:'.length));
    }
    const screenshotPath = join(outDir, fileName(target));
    await page.screenshot({ path: screenshotPath, fullPage: false });
    await context.close();
    console.log(`✓ ${target.id}: ${pathToFileURL(screenshotPath).href}`);
  }
} finally {
  await browser.close();
  await close();
}
