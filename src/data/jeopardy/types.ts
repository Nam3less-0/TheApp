export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface RawQuestion {
  difficulty: Difficulty;
  question: string;
  answer: string;
}

export interface TopicData {
  id: string;
  name: string;
  questions: RawQuestion[];
}

export type QuestionBank = Record<
  Difficulty,
  { question: string; answer: string }[]
>;
