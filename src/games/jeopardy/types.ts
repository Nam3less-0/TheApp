import type { Difficulty } from '../../data/jeopardy-questions';

export type { Difficulty };

/** Per-player lifelines for a game. */
export interface Lifelines {
  /** Remaining Phone a Friend uses (starts at 2). */
  phoneAFriend: number;
  /** Remaining What Choices uses (starts at 2). */
  whatChoices: number;
  /** Snipe — one use per game; `true` means still available. */
  snipe: boolean;
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
  /** Multiple-choice options; index 0 is the correct one (3 for riddles, 4 otherwise). */
  choices: [string, string, string] | [string, string, string, string];
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
  /** True when another player sniped this clue before it was answered. */
  sniped: boolean;
}

export type JeopardyPhase =
  | 'setup'
  | 'topic-preview'
  | 'board'
  | 'question'
  | 'answer'
  | 'final';

export interface JeopardySession {
  players: Player[];
  columns: BoardColumn[];
  cells: BoardCell[];
  phase: JeopardyPhase;
  /** Players locked in during setup, before the board is built. */
  pendingPlayers: Player[];
  /** Six topics chosen during the preview step (before clues are drawn). */
  previewColumns: BoardColumn[];
  /** Topic ids excluded from preview rerolls for this game setup. */
  blacklistedTopicIds: string[];
  /** Topic ids already surfaced in preview this setup (lowers reroll weight). */
  previewSessionTopicIds: string[];
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
  /** True when a Snipe lifeline stole the current clue from the picker. */
  sniped: boolean;
  /** Turn returns here after a sniped clue resolves; null when not sniped. */
  snipedFromPlayerIndex: number | null;
  /** $200 / $400 values already picked during the active player's current turn. */
  turnPickedValues: number[];
}

export type JeopardyAction =
  | { type: 'PLAYERS_READY'; players: Player[] }
  | { type: 'BACK_TO_SETUP' }
  | { type: 'REROLL_TOPICS' }
  | { type: 'BLACKLIST_TOPIC'; topicId: string }
  | { type: 'UNBLACKLIST_TOPIC'; topicId: string }
  | { type: 'CONFIRM_TOPICS' }
  | { type: 'SELECT_CELL'; cellId: string }
  | { type: 'REVEAL_ANSWER' }
  | { type: 'RESOLVE'; correct: boolean }
  | { type: 'USE_WHAT_CHOICES' }
  | { type: 'USE_PHONE_A_FRIEND'; helperId: string }
  | { type: 'USE_SNIPE'; playerId: string }
  | { type: 'PLAY_AGAIN' };
