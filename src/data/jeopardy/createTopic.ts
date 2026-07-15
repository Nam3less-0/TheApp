import type { Difficulty, QuestionBank, TopicData } from './types';
import { assertAnswerNotInQuestion } from './validateQuestion';

const LEVELS: Difficulty[] = [1, 2, 3, 4, 5];
const QUESTIONS_PER_LEVEL = 20;
const RIDDLES_TOPIC_ID = 'riddles';
const STANDARD_CHOICES_COUNT = 4;
const RIDDLES_CHOICES_COUNT = 3;

export function createTopic(
  id: string,
  name: string,
  bank: QuestionBank,
): TopicData {
  const expectedCount =
    id === RIDDLES_TOPIC_ID ? RIDDLES_CHOICES_COUNT : STANDARD_CHOICES_COUNT;

  const questions = LEVELS.flatMap((difficulty) => {
    const entries = bank[difficulty];
    if (entries.length !== QUESTIONS_PER_LEVEL) {
      throw new Error(
        `Topic "${id}" difficulty ${difficulty} has ${entries.length} questions; expected ${QUESTIONS_PER_LEVEL}.`,
      );
    }
    return entries.map(({ question, answer, choices }) => {
      if (!choices || choices.length !== expectedCount) {
        throw new Error(
          `Topic "${id}" difficulty ${difficulty} clue "${question.slice(0, 40)}…" must have exactly ${expectedCount} choices.`,
        );
      }
      if (choices[0] !== answer) {
        throw new Error(
          `Topic "${id}" difficulty ${difficulty}: choices[0] must match answer for "${question.slice(0, 40)}…".`,
        );
      }
      if (new Set(choices.map((c) => c.toLowerCase())).size !== expectedCount) {
        throw new Error(
          `Topic "${id}" difficulty ${difficulty}: choices must be distinct for "${question.slice(0, 40)}…".`,
        );
      }

      assertAnswerNotInQuestion(id, difficulty, question, answer);

      return { difficulty, question, answer, choices };
    });
  });

  return { id, name, questions };
}
