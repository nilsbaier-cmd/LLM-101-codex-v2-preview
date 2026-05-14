// lib/exercises.js — Reflexion + Quiz Persistenz
export class Exercises {
  constructor(storage) { this.storage = storage; }

  #refKey(chapter, ex) { return `notiz.${chapter}.${ex}`; }
  #quizKey(chapter, ex) { return `quiz.${chapter}.${ex}.attempts`; }

  saveReflection(chapter, ex, text) {
    this.storage.set(this.#refKey(chapter, ex), {
      chapter, ex, antwort: text, ts: Date.now()
    });
  }

  getReflection(chapter, ex) {
    return this.storage.get(this.#refKey(chapter, ex));
  }

  deleteReflection(chapter, ex) {
    this.storage.remove(this.#refKey(chapter, ex));
  }

  countReflections() {
    return this.storage.keysWithPrefix('notiz.').length;
  }

  allReflections() {
    return this.storage.keysWithPrefix('notiz.')
      .map(k => this.storage.get(k))
      .filter(Boolean)
      .sort((a, b) => a.chapter.localeCompare(b.chapter) || a.ex.localeCompare(b.ex));
  }

  recordQuizAttempt(chapter, ex, attempt) {
    const key = this.#quizKey(chapter, ex);
    const all = this.storage.get(key) || [];
    all.push({ ...attempt, ts: Date.now() });
    this.storage.set(key, all);
  }

  getQuizAttempts(chapter, ex) {
    return this.storage.get(this.#quizKey(chapter, ex)) || [];
  }
}
