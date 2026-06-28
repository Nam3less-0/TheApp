import type { Difficulty } from '../../data/jeopardy-questions';

export type { Difficulty };

/** Each lifeline can be used once per game; `true` means still available. */
export interface Lifelines {
  phoneAFriend: boolean;
  whatChoices: boolean;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  correct: number;
  missed: number;
  /** Number of double-trouble cards answered correctly. */
  doublesHit: number;
  lifelines: Lifelines;
}

export interface BoardColumn {
  id: string;
  name: string;
}

export interface BoardCell {
  id: string;
  /** Index of the column (topic) this cell belongs to, 0-5. */
  columnIndex: number;
  difficulty: Difficulty;
  /** Base point value for the cell (200…1000). */
  value: number;
  question: string;
  answer: string;
  /** Three multiple-choice options; index 0 is the correct one. */
  choices: [string, string, string];
  isDouble: boolean;
  used: boolean;
}

export interface AnswerRecord {
  cellId: string;
  topicName: string;
  question: string;
  answer: string;
  value: number;
  isDouble: boolean;
  playerId: string;
  correct: boolean;
  /** Points actually awarded to the active player (0 when wrong). */
  awarded: number;
  /** Helper id when Phone a Friend was used on this clue. */
  helperId: string | null;
}

export type JeopardyPhase = 'setup' | 'board' | 'question' | 'answer' | 'final';

export interface JeopardySession {
  players: Player[];
  columns: BoardColumn[];
  cells: BoardCell[];
  phase: JeopardyPhase;
  currentPlayerIndex: number;
  activeCellId: string | null;
  questionsAnswered: number;
  history: AnswerRecord[];
  /**
   * Shuffled multiple-choice options shown for the current clue once the
   * "What Choices" lifeline is used; null when not active.
   */
  revealedChoices: string[] | null;
  /** Helper player chosen via "Phone a Friend" for the current clue; null otherwise. */
  phoneFriendId: string | null;
}

export type JeopardyAction =
  | { type: 'START_GAME'; players: Player[] }
  | { type: 'SELECT_CELL'; cellId: string }
  | { type: 'REVEAL_ANSWER' }
  | { type: 'RESOLVE'; correct: boolean }
  | { type: 'USE_WHAT_CHOICES' }
  | { type: 'USE_PHONE_A_FRIEND'; helperId: string }
  | { type: 'PLAY_AGAIN' };
