export interface WordBucket {
  id: string;
  /** Four closely related words. One is the majority word each round. */
  words: string[];
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export type RoundOutcome = 'caught' | 'evaded';

/**
 * `standard` — everyone gets a word; the imposter's differs from the majority's.
 * `blank` — the majority share one word; the imposter is only told they're the
 * imposter (no word) and can earn a redemption guess if caught.
 */
export type RoundMode = 'standard' | 'blank';

export interface RoundRecord {
  round: number;
  bucket: WordBucket;
  mode: RoundMode;
  imposterWord: string;
  majorityWord: string;
  imposterPlayerId: string;
  votedPlayerId: string | null;
  outcome: RoundOutcome;
  /** Word the caught blank-round imposter guessed during redemption, if any. */
  redemptionGuess: string | null;
  /** Whether that redemption guess matched the majority word. */
  redemptionCorrect: boolean;
}

export type ImposterPhase =
  | 'setup'
  | 'reveal'
  | 'discuss'
  | 'vote'
  | 'redeem'
  | 'result'
  | 'final';

export interface ImposterSession {
  players: Player[];
  totalRounds: number;
  currentRound: number;
  remainingBuckets: WordBucket[];
  currentBucket: WordBucket;
  currentMode: RoundMode;
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
  | { type: 'MARK_REVEAL_READY'; playerId: string; playerIds: string[] }
  | { type: 'GO_TO_VOTE' }
  | { type: 'SELECT_VOTE'; playerId: string }
  | { type: 'REVEAL_IMPOSTER' }
  | { type: 'SUBMIT_REDEMPTION'; word: string }
  | { type: 'NEXT_ROUND' }
  | { type: 'PLAY_AGAIN' }
  | { type: 'SYNC_STATE'; payload: ImposterSession }
  | { type: 'RESET' };
