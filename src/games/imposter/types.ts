export interface WordPair {
  id: string;
  wordA: string;
  wordB: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export type RoundOutcome = 'caught' | 'evaded';

export interface RoundRecord {
  round: number;
  pair: WordPair;
  imposterWord: string;
  majorityWord: string;
  imposterPlayerId: string;
  votedPlayerId: string | null;
  outcome: RoundOutcome;
}

export type ImposterPhase =
  | 'setup'
  | 'reveal'
  | 'discuss'
  | 'vote'
  | 'result'
  | 'final';

export interface ImposterSession {
  players: Player[];
  totalRounds: number;
  currentRound: number;
  remainingPairs: WordPair[];
  currentPair: WordPair;
  currentImposterWord: string;
  currentMajorityWord: string;
  currentImposterPlayerId: string;
  revealOrder: string[];
  revealIndex: number;
  votedPlayerId: string | null;
  phase: ImposterPhase;
  history: RoundRecord[];
}

export type ImposterAction =
  | { type: 'START_GAME'; players: Player[]; totalRounds: number }
  | { type: 'ADVANCE_REVEAL' }
  | { type: 'GO_TO_VOTE' }
  | { type: 'SELECT_VOTE'; playerId: string }
  | { type: 'REVEAL_IMPOSTER' }
  | { type: 'NEXT_ROUND' }
  | { type: 'PLAY_AGAIN' };
