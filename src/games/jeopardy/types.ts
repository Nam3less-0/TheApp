import type { Difficulty } from '../../data/jeopardy-questions';

export type { Difficulty };

export interface Player {
  id: string;
  name: string;
  score: number;
  correct: number;
  missed: number;
  /** Number of double-trouble cards answered correctly. */
  doublesHit: number;
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
  /** Points actually awarded (doubled when applicable, 0 when wrong). */
  awarded: number;
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
  totalQuestions: number;
  history: AnswerRecord[];
}

export type JeopardyAction =
  | { type: 'START_GAME'; players: Player[] }
  | { type: 'SELECT_CELL'; cellId: string }
  | { type: 'REVEAL_ANSWER' }
  | { type: 'RESOLVE'; correct: boolean }
  | { type: 'PLAY_AGAIN' };
