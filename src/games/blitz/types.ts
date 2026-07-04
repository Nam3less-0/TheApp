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
}

export type BlitzPhase = 'setup' | 'prompt' | 'result' | 'final';

export interface BlitzSession {
  players: Player[];
  targetScore: number;
  round: number;
  remainingQuestions: BlitzQuestion[];
  currentPlayerId: string;
  currentQuestion: BlitzQuestion | null;
  phase: BlitzPhase;
  history: RoundRecord[];
}

export type BlitzAction =
  | { type: 'START_GAME'; players: Player[] }
  | { type: 'SUCCESS' }
  | { type: 'TIMEOUT' }
  | { type: 'CONTINUE' }
  | { type: 'PLAY_AGAIN' };
