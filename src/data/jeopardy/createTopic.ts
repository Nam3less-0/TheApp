import type { Choices, Choices3, Difficulty, QuestionBank, TopicData } from './types';
import { assertAnswerNotInQuestion } from './validateQuestion';

const LEVELS: Difficulty[] = [1, 2, 3, 4, 5];
const QUESTIONS_PER_LEVEL = 20;
const RIDDLES_TOPIC_ID = 'riddles';
const WHAT_CHOICES_COUNT = 4;

const FALLBACK_DISTRACTORS = ['None of these', 'All of the above', 'Not applicable'];

function normalizeChoice(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Pick a fourth distractor from sibling answers in the same difficulty band. */
function pickFourthDistractor(
  answer: string,
  choices: Choices3,
  siblings: { answer: string }[],
): string {
  const seen = new Set([answer, ...choices].map(normalizeChoice));

  for (const sibling of siblings) {
    const key = normalizeChoice(sibling.answer);
    if (!key || seen.has(key)) continue;
    return sibling.answer;
  }

  for (const fallback of FALLBACK_DISTRACTORS) {
    const key = normalizeChoice(fallback);
    if (!seen.has(key)) return fallback;
  }

  return 'None of these';
}

function expandChoices(
  topicId: string,
  answer: string,
  choices: Choices3,
  siblings: { answer: string }[],
): Choices {
  if (topicId === RIDDLES_TOPIC_ID) return choices;

  const fourth = pickFourthDistractor(answer, choices, siblings);
  return [choices[0], choices[1], choices[2], fourth];
}

export function createTopic(
  id: string,
  name: string,
  bank: QuestionBank,
): TopicData {
  const expectedCount = id === RIDDLES_TOPIC_ID ? 3 : WHAT_CHOICES_COUNT;

  const questions = LEVELS.flatMap((difficulty) => {
    const entries = bank[difficulty];
    if (entries.length !== QUESTIONS_PER_LEVEL) {
      throw new Error(
        `Topic "${id}" difficulty ${difficulty} has ${entries.length} questions; expected ${QUESTIONS_PER_LEVEL}.`,
      );
    }
    return entries.map(({ question, answer, choices }) => {
      if (!choices || choices.length !== 3) {
        throw new Error(
          `Topic "${id}" difficulty ${difficulty} clue "${question.slice(0, 40)}…" is missing 3 choices.`,
        );
      }
      if (choices[0] !== answer) {
        throw new Error(
          `Topic "${id}" difficulty ${difficulty}: choices[0] must match answer for "${question.slice(0, 40)}…".`,
        );
      }
      if (new Set(choices.map((c) => c.toLowerCase())).size !== 3) {
        throw new Error(
          `Topic "${id}" difficulty ${difficulty}: choices must be distinct for "${question.slice(0, 40)}…".`,
        );
      }

      const expanded = expandChoices(id, answer, choices, entries);
      if (new Set(expanded.map((c) => c.toLowerCase())).size !== expectedCount) {
        throw new Error(
          `Topic "${id}" difficulty ${difficulty}: choices must be distinct for "${question.slice(0, 40)}…".`,
        );
      }

      assertAnswerNotInQuestion(id, difficulty, question, answer);

      return { difficulty, question, answer, choices: expanded };
    });
  });

  return { id, name, questions };
}
