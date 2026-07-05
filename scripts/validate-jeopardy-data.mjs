/**
 * Validate Jeopardy question bank: 20 clues per difficulty per topic, each with
 * distinct lifeline choices (index 0 = correct answer). Non-riddle topics have
 * four options; riddles keep three.
 * Run: npx tsx scripts/validate-jeopardy-data.mjs
 */
import { JEOPARDY_TOPICS } from '../src/data/jeopardy/index.ts';

const LEVELS = [1, 2, 3, 4, 5];
const EXPECTED = 20;
const RIDDLES_TOPIC_ID = 'riddles';
let issues = 0;

for (const topic of JEOPARDY_TOPICS) {
  const expectedChoices = topic.id === RIDDLES_TOPIC_ID ? 3 : 4;

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
      if (!q.choices || q.choices.length !== expectedChoices) {
        console.error(
          `${topic.id} d${d}: expected ${expectedChoices} choices — ${q.question.slice(0, 50)}`,
        );
        issues += 1;
      } else if (q.choices[0] !== q.answer) {
        console.error(`${topic.id} d${d}: choices[0] ≠ answer — ${q.question.slice(0, 50)}`);
        issues += 1;
      } else if (new Set(q.choices.map((c) => c.toLowerCase())).size !== expectedChoices) {
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
