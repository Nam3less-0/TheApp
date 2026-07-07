/** Topics where the answer may intentionally appear in the clue text. */
export const ANSWER_LEAK_EXEMPT_TOPIC_IDS = new Set(['finish-the-quote']);

export function normalizeQuestionText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Compare against the answer text before any parenthetical gloss. */
export function answerCore(answer: string): string {
  return answer.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
}

export function answerAppearsInQuestion(question: string, answer: string): boolean {
  const normalizedQuestion = normalizeQuestionText(question);
  const normalizedAnswer = normalizeQuestionText(answerCore(answer));
  if (!normalizedAnswer) return false;

  const words = normalizedAnswer.split(' ').filter(Boolean);
  if (words.length === 1) {
    const word = words[0];
    if (word.length < 3) return false;
    return new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(
      normalizedQuestion,
    );
  }

  const pattern = words
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('\\s+');
  return new RegExp(`\\b${pattern}\\b`).test(normalizedQuestion);
}

export function assertAnswerNotInQuestion(
  topicId: string,
  difficulty: number,
  question: string,
  answer: string,
): void {
  if (ANSWER_LEAK_EXEMPT_TOPIC_IDS.has(topicId)) return;
  if (answerAppearsInQuestion(question, answer)) {
    throw new Error(
      `Topic "${topicId}" difficulty ${difficulty}: answer "${answer}" appears in the question "${question.slice(0, 60)}…".`,
    );
  }
}
