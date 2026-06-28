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
    return entries.map(({ question, answer, choices }) => ({
      difficulty,
      question,
      answer,
      choices,
    }));
  });

  return { id, name, questions };
}
