export interface QuestionOption {
  id: string;
  question: string;
  answer: string;
}

/** One complete Ace–King question line (13 ranks). */
export type RankBucket = Record<number, QuestionOption>;

export const RANK_COUNT = 13;
export const SET_COUNT = 5;

/** Card-themed labels for the five question sets (Ace → King progression). */
export const SET_LABELS = ['Ace', 'Three', 'Seven', 'Ten', 'King'] as const;
export type SetLabel = (typeof SET_LABELS)[number];

export interface QuestionSet {
  label: SetLabel;
  ranks: RankBucket;
}

export interface Topic {
  id: string;
  name: string;
  sets: QuestionSet[];
}
