export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type TeamId = 'a' | 'b';

export interface QuestionOption {
  id: string;
  question: string;
  answer: string;
}

export interface Topic {
  id: string;
  name: string;
  /**
   * Keyed by rank value 1–13 (Ace=1 … King=13). Each bucket holds MULTIPLE
   * question options so repeated plays don't always surface the same card.
   */
  difficulties: Record<number, QuestionOption[]>;
}

export interface CardState {
  suit: Suit;
  /** Display rank: 'A','2'..'10','J','Q','K'. */
  rank: string;
  /** 1–13, also the point value gained/lost. */
  value: number;
  topicId: string;
  topicName: string;
  question: string;
  answer: string;
  used: boolean;
  result: 'correct' | 'incorrect' | null;
}

export type Phase = 'setup' | 'board' | 'question' | 'reveal' | 'gameover';

export type WinReason =
  | 'threshold_win'
  | 'threshold_loss'
  | 'exhausted_higher_score'
  | 'exhausted_tie'
  | null;

export interface SuitTopic {
  id: string;
  name: string;
}

export interface HouseOfCardsState {
  phase: Phase;
  teamAName: string;
  teamBName: string;
  scoreA: number;
  scoreB: number;
  activeTeam: TeamId;
  deck: CardState[];
  activeCardIndex: number | null;
  suitTopicMap: Record<Suit, SuitTopic>;
  winner: TeamId | null;
  winReason: WinReason;
}

export type HouseOfCardsAction =
  | { type: 'START_GAME'; teamAName: string; teamBName: string }
  | { type: 'PICK_CARD'; index: number }
  | { type: 'REVEAL' }
  | { type: 'JUDGE'; correct: boolean }
  | { type: 'PUT_BACK' }
  | { type: 'RESET' };
