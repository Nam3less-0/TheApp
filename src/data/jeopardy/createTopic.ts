import type { Difficulty, QuestionBank, TopicData } from './types';

const LEVELS: Difficulty[] = [1, 2, 3, 4, 5];
const QUESTIONS_PER_LEVEL = 10;

export function createTopic(
  id: string,
  name: string,
  bank: QuestionBank,
): TopicData {
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
      return { difficulty, question, answer, choices };
    });
  });

  return { id, name, questions };
}
