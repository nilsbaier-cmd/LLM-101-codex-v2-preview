import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');

describe('learning stations', () => {
  document.body.innerHTML = html;

  it('keeps every exercise structured for self-study', () => {
    const exercises = [...document.querySelectorAll('.exercise')];

    expect(exercises).toHaveLength(6);
    exercises.forEach((exercise) => {
      expect(exercise.hasAttribute('data-learning-station')).toBe(true);
      expect(exercise.querySelector('.ex-objective')?.textContent?.trim().length).toBeGreaterThan(20);
      expect(exercise.querySelector('.ex-duration')?.textContent).toMatch(/\d+\s?min/i);
      expect(exercise.querySelectorAll('.ex-steps li').length).toBeGreaterThanOrEqual(2);
      expect(exercise.querySelector('.ex-expected')?.textContent?.trim().length).toBeGreaterThan(20);
      expect(exercise.querySelector('.ex-reflection')?.textContent?.trim().length).toBeGreaterThan(20);
    });
  });
});
