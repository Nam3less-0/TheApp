/**
 * Validate Jeopardy question bank: 10 clues per difficulty per topic, each with
 * 3 distinct lifeline choices (index 0 = correct answer).
 * Run: npx tsx scripts/validate-jeopardy-data.mjs
 */
import { JEOPARDY_TOPICS } from '../src/data/jeopardy/index.ts';

const LEVELS = [1, 2, 3, 4, 5];
const EXPECTED = 10;
let issues = 0;

for (const topic of JEOPARDY_TOPICS) {
  for (const d of LEVELS) {
    const qs = topic.questions.filter((q) => q.difficulty === d);
    if (qs.length !== EXPECTED) {
      console.error(`${topic.id} d${d}: expected ${EXPECTED} clues, got ${qs.length}`);
      issues += 1;
    }
    const answers = qs.map((q) => q.answer.toLowerCase());
    if (new Set(answers).size !== answers.length) {
      console.error(`${topic.id} d${d}: duplicate answers within difficulty`);
      issues += 1;
    }
    for (const q of qs) {
      if (!q.choices || q.choices.length !== 3) {
        console.error(`${topic.id} d${d}: missing choices — ${q.question.slice(0, 50)}`);
        issues += 1;
      } else if (q.choices[0] !== q.answer) {
        console.error(`${topic.id} d${d}: choices[0] ≠ answer — ${q.question.slice(0, 50)}`);
        issues += 1;
      } else if (new Set(q.choices.map((c) => c.toLowerCase())).size !== 3) {
        console.error(`${topic.id} d${d}: duplicate choices — ${q.question.slice(0, 50)}`);
        issues += 1;
      }
    }
  }
}

const total = JEOPARDY_TOPICS.reduce((s, t) => s + t.questions.length, 0);
console.log(`Topics: ${JEOPARDY_TOPICS.length}`);
console.log(`Total clues: ${total} (${EXPECTED} per difficulty × 5 levels × ${JEOPARDY_TOPICS.length} topics)`);

if (issues === 0) {
  console.log('All checks passed.');
} else {
  console.error(`${issues} issue(s) found.`);
  process.exit(1);
}
