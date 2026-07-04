/**
 * Sync choices[0] with answer for every Jeopardy clue (lifeline uses index 0).
 * Run: npx tsx scripts/fix-jeopardy-choices.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JEOPARDY_TOPICS } from '../src/data/jeopardy/index.ts';

const TOPICS_DIR = join(dirname(fileURLToPath(import.meta.url)), '../src/data/jeopardy/topics');

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replace choices[0] on a line that matches this exact question + answer pair. */
function fixChoicesInFile(filePath, question, answer, oldFirst, newFirst) {
  if (oldFirst === newFirst) return false;
  let text = readFileSync(filePath, 'utf8');
  const qEsc = escapeRegex(question);
  const aEsc = escapeRegex(answer);
  const oldEsc = escapeRegex(oldFirst);
  const pattern = new RegExp(
    `(question: '${qEsc}', answer: '${aEsc}', choices: \\[')${oldEsc}('(?:, [^\\]]+){2}\\])`,
  );
  if (!pattern.test(text)) {
    console.warn('No match:', filePath, question.slice(0, 50));
    return false;
  }
  text = text.replace(pattern, `$1${newFirst.replace(/\\/g, '\\\\').replace(/\$/g, '$$')}$2`);
  writeFileSync(filePath, text);
  return true;
}

let fixed = 0;
for (const topic of JEOPARDY_TOPICS) {
  const filePath = join(TOPICS_DIR, `${topic.id}.ts`);
  for (const q of topic.questions) {
    if (!q.choices || q.choices[0] === q.answer) continue;
    if (fixChoicesInFile(filePath, q.question, q.answer, q.choices[0], q.answer)) {
      fixed += 1;
    }
  }
}
console.log(`Fixed ${fixed} choice mismatches.`);
