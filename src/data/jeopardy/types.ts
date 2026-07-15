export type Difficulty = 1 | 2 | 3 | 4 | 5;

/**
 * Multiple-choice options for the "What Choices" lifeline.
 * Index 0 is always the correct option; the rest are plausible distractors.
 * Non-riddle topics store exactly four hand-written options; riddles store three.
 */
export type Choices3 = [string, string, string];
export type Choices4 = [string, string, string, string];
export type Choices = Choices3 | Choices4;

export interface RawQuestion {
  difficulty: Difficulty;
  question: string;
  answer: string;
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
