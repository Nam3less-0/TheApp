export type {
  QuestionOption,
  QuestionSet,
  RankBucket,
  SetLabel,
  Topic,
} from '../../data/house-of-cards/types';

export { RANK_COUNT, SET_COUNT, SET_LABELS } from '../../data/house-of-cards/types';

export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type TeamId = 'a' | 'b';

export interface CardState {
  suit: Suit;
  /** Display rank: 'A','2'..'10','J','Q','K'. */
  rank: string;
  /** 1–13, also the point value gained/lost. */
  value: number;
  topicId: string;
  topicName: string;
  setLabel: string;
  question: string;
  answer: string;
  used: boolean;
  result: 'correct' | 'incorrect' | null;
}

export type Phase = 'setup' | 'categories' | 'board' | 'question' | 'reveal' | 'gameover';

export type WinReason =
  | 'threshold_win'
  | 'threshold_loss'
  | 'exhausted_higher_score'
  | 'exhausted_tie'
  | null;

export interface SuitTopic {
  id: string;
  name: string;
  setLabel: string;
}

export type { LockedSuitAssignment } from './deck';

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
  /** Suits pinned during category preview; reroll only replaces open suits. */
  lockedSuits: Record<Suit, boolean>;
  /** Question sets to commit when categories are confirmed. */
  pendingSetCommits: Array<{ topicId: string; setIndex: number }>;
  winner: TeamId | null;
  winReason: WinReason;
}

export type HouseOfCardsAction =
  | { type: 'START_GAME'; teamAName: string; teamBName: string }
  | { type: 'REROLL_CATEGORIES' }
  | { type: 'TOGGLE_LOCK_SUIT'; suit: Suit }
  | { type: 'CONFIRM_CATEGORIES' }
  | { type: 'PICK_CARD'; index: number }
  | { type: 'REVEAL' }
  | { type: 'JUDGE'; correct: boolean }
  | { type: 'PUT_BACK' }
  | { type: 'RESET' };
