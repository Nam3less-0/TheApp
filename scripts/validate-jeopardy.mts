/**
 * Validates every registered Jeopardy topic:
 * - importing the index runs each topic's `createTopic`, which throws on
 *   bad counts, missing/duplicate choices, wrong choices[0], or answer leaks.
 * - this script additionally asserts the choice count per topic and reports totals.
 *
 * Run with: npx tsx scripts/validate-jeopardy.mts
 * Validate a single topic file: npx tsx src/data/jeopardy/topics/<name>.ts
 */
import { JEOPARDY_TOPICS } from '../src/data/jeopardy/index';

const RIDDLES_TOPIC_ID = 'riddles';

let totalQuestions = 0;
const problems: string[] = [];

for (const topic of JEOPARDY_TOPICS) {
  const expected = topic.id === RIDDLES_TOPIC_ID ? 3 : 4;

  if (topic.questions.length !== 100) {
    problems.push(`${topic.id}: ${topic.questions.length} questions (expected 100).`);
  }

  for (const q of topic.questions) {
    totalQuestions++;
    const label = `${topic.id} [L${q.difficulty}] "${q.question.slice(0, 45)}…"`;

    if (q.choices.length !== expected) {
      problems.push(`${label}: ${q.choices.length} choices (expected ${expected}).`);
    }
    if (q.choices[0] !== q.answer) {
      problems.push(`${label}: choices[0] (${q.choices[0]}) !== answer (${q.answer}).`);
    }
    const unique = new Set(q.choices.map((c) => c.toLowerCase()));
    if (unique.size !== q.choices.length) {
      problems.push(`${label}: duplicate choices -> ${JSON.stringify(q.choices)}.`);
    }
  }
}

if (problems.length > 0) {
  console.error(`FAILED: ${problems.length} problem(s) found:\n` + problems.join('\n'));
  process.exit(1);
}

console.log(
  `OK: ${JEOPARDY_TOPICS.length} topics, ${totalQuestions} questions — all choice sets valid.`,
);
