import type { BlitzQuestion } from '../../data/blitz-questions';

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface RoundRecord {
  round: number;
  playerId: string;
  category: string;
  prompt: string;
  seconds: number;
  success: boolean;
  rerolled: boolean;
  /** Set when another player stole the point after a timeout. */
  stolenBy?: string;
}

export type BlitzPhase = 'setup' | 'ban' | 'prompt' | 'steal' | 'result' | 'final';

export interface BlitzSession {
  players: Player[];
  round: number;
  remainingQuestions: BlitzQuestion[];
  currentPlayerId: string;
  currentQuestion: BlitzQuestion | null;
  /** True while the timer is frozen for an off-app "is this fair?" discussion. */
  paused: boolean;
  /** Each round grants exactly one skip, usable by whoever's turn it is. */
  rerollUsedThisRound: boolean;
  /** Category ids removed from the pool during the ban phase. */
  bannedCategoryIds: string[];
  /** Which player is currently choosing bans. */
  banPickerIndex: number;
  /** Whoever gets the chance to steal after a timeout. */
  stealPlayerId: string | null;
  phase: BlitzPhase;
  history: RoundRecord[];
}

export type BlitzAction =
  | { type: 'OPEN_BAN_PHASE'; players: Player[] }
  | { type: 'TOGGLE_BAN'; categoryId: string }
  | { type: 'CONFIRM_BANS' }
  | { type: 'START_GAME' }
  | { type: 'SUCCESS' }
  | { type: 'TIMEOUT' }
  | { type: 'STEAL_SUCCESS' }
  | { type: 'STEAL_FAIL' }
  | { type: 'CONTINUE' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'REROLL' }
  | { type: 'PLAY_AGAIN' };
