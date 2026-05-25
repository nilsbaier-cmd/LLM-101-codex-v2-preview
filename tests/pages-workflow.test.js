import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const workflow = readFileSync(join(process.cwd(), '.github/workflows/pages.yml'), 'utf8');

describe('GitHub Pages workflow', () => {
  it('opts JavaScript actions into Node 24 and runs tests before deployment', () => {
    expect(workflow).toContain('FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true');
    expect(workflow).toContain('node-version: 24');
    expect(workflow).toContain('run: npm test');
    expect(workflow.indexOf('Run tests')).toBeLessThan(workflow.indexOf('Upload Pages artifact'));
  });

  it('runs browser QA gates before uploading the Pages artifact', () => {
    expect(workflow).toContain('npx playwright install --with-deps chromium');
    expect(workflow).toContain('run: npm run qa:redesign');
    expect(workflow).toContain('run: npm run visual:qa');
    expect(workflow.indexOf('Run redesign browser QA')).toBeLessThan(workflow.indexOf('Upload Pages artifact'));
    expect(workflow.indexOf('Run visual QA')).toBeLessThan(workflow.indexOf('Upload Pages artifact'));
  });

  it('uses Node 24 compatible first-party actions', () => {
    expect(workflow).toContain('actions/checkout@v6.0.2');
    expect(workflow).toContain('actions/setup-node@v6.4.0');
    expect(workflow).toContain('actions/configure-pages@v6.0.0');
    expect(workflow).toContain('actions/upload-pages-artifact@v5.0.0');
    expect(workflow).toContain('actions/deploy-pages@v5.0.0');
  });

  it('publishes only the static presentation surface', () => {
    expect(workflow).toContain('mkdir -p _site');
    expect(workflow).toContain("--include='assets/***'");
    expect(workflow).toContain("--include='explainer/***'");
    expect(workflow).toContain("--include='lib/***'");
    expect(workflow).toContain("--exclude='*'");
    expect(workflow).toContain('touch _site/.nojekyll');
  });
});
