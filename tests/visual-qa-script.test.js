import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');
const pkg = JSON.parse(read('package.json'));

describe('visual QA script', () => {
  const script = read('scripts/visual-qa.mjs');

  it('is exposed through npm and uses the shared target manifest', () => {
    expect(pkg.scripts['visual:qa']).toBe('node scripts/visual-qa.mjs');
    expect(existsSync(join(process.cwd(), 'scripts/visual-qa.mjs'))).toBe(true);
    expect(script).toContain("from '../lib/visual-qa-targets.js'");
    expect(script).toContain('.visual-qa');
  });

  it('documents the optional Playwright browser setup instead of failing silently', () => {
    expect(pkg.devDependencies.playwright).toBeTruthy();
    expect(script).toContain('npx playwright install chromium');
    expect(script).toContain('chromium.launch');
  });
});
