import type { BlitzQuestion } from '../../data/blitz-questions';

export interface Player {
  id: string;
  name: string;
  score: number;
  rerollsLeft: number;
}

export interface RoundRecord {
  round: number;
  playerId: string;
  category: string;
  prompt: string;
  seconds: number;
  success: boolean;
}

export type BlitzPhase = 'setup' | 'prompt' | 'result' | 'final';

export interface BlitzSession {
  players: Player[];
  targetScore: number;
  round: number;
  remainingQuestions: BlitzQuestion[];
  currentPlayerId: string;
  currentQuestion: BlitzQuestion | null;
  /** True while the timer is frozen for an off-app "is this fair?" discussion. */
  paused: boolean;
  phase: BlitzPhase;
  history: RoundRecord[];
}

export type BlitzAction =
  | { type: 'START_GAME'; players: Player[] }
  | { type: 'SUCCESS' }
  | { type: 'TIMEOUT' }
  | { type: 'CONTINUE' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'REROLL' }
  | { type: 'PLAY_AGAIN' };
