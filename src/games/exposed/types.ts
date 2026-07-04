export interface Player {
  id: string;
  name: string;
  score: number;
}

export type CoinOutcome = 'hidden' | 'revealed';

export interface RoundRecord {
  round: number;
  playerId: string;
  question: string;
  outcome: CoinOutcome;
  points: number;
}

export type ExposedPhase = 'setup' | 'question' | 'coinflip' | 'result' | 'final';

export interface ExposedSession {
  players: Player[];
  totalRounds: number;
  currentRound: number;
  remainingQuestions: string[];
  currentPlayerId: string;
  currentQuestion: string;
  currentOutcome: CoinOutcome | null;
  phase: ExposedPhase;
  history: RoundRecord[];
}

export type ExposedAction =
  | { type: 'START_GAME'; players: Player[] }
  | { type: 'ANSWERED' }
  | { type: 'COIN_SETTLED' }
  | { type: 'NEXT_ROUND' }
  | { type: 'PLAY_AGAIN' };
