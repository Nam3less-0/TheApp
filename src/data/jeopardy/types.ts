export type Difficulty = 1 | 2 | 3 | 4 | 5;

/**
 * Three multiple-choice options for the "What Choices" lifeline.
 * Index 0 is always the correct option; the other two are plausible distractors.
 */
export type Choices = [string, string, string];

export interface RawQuestion {
  difficulty: Difficulty;
  question: string;
  answer: string;
  /** Three multiple-choice options for the "What Choices" lifeline; index 0 is correct. */
  choices: Choices;
}

export interface TopicData {
  id: string;
  name: string;
  questions: RawQuestion[];
}

export type QuestionBank = Record<
  Difficulty,
  { question: string; answer: string; choices: Choices }[]
>;
