export interface CodewordEntry {
  id: string;
  word: string;
}

export type TeamCardWords = [
  CodewordEntry,
  CodewordEntry,
  CodewordEntry,
  CodewordEntry,
];

export interface TeamCard {
  // index 0 = digit 1, index 1 = digit 2, etc.
  words: TeamCardWords;
}

export type CodeTriple = [number, number, number];

export type OurOutcome = 'correct' | 'wrong' | 'pending';
export type InterceptOutcome = 'intercepted' | 'missed';

export interface RoundLogEntry {
  round: number;
  code: CodeTriple; // only ever shown on this team's own device
  hints: [string, string, string];
  outcome: OurOutcome; // did OUR team decode OUR OWN code correctly
}

export interface InterceptLogEntry {
  round: number;
  hintsHeard: [string, string, string]; // one hint per code digit, in order spoken
  actualCode: CodeTriple; // the real code, recorded after the other team reveals it
  outcome: InterceptOutcome; // did WE correctly call it before they revealed it
}

export type GameStatus = 'in-progress' | 'won' | 'lost';
export type CodewordPhase = 'setup' | 'playing' | 'over';

export interface CodewordState {
  phase: CodewordPhase;
  teamCard: TeamCard | null;
  ourMisses: number; // 0–2, hitting 2 = loss
  ourIntercepts: number; // 0–2, hitting 2 = win
  ourTurnLog: RoundLogEntry[];
  interceptLog: InterceptLogEntry[];
  currentRound: number;
  gameStatus: GameStatus;
}

export type CodewordAction =
  | { type: 'START_GAME'; card: TeamCard }
  | {
      type: 'LOG_OUR_TURN';
      code: CodeTriple;
      hints: [string, string, string];
      outcome: 'correct' | 'wrong';
      skipScore?: boolean;
    }
  | {
      type: 'LOG_INTERCEPT';
      hintsHeard: [string, string, string];
      actualCode: CodeTriple;
      outcome: 'intercepted' | 'missed';
      skipScore?: boolean;
    }
  | { type: 'NEW_GAME'; card: TeamCard }
  | { type: 'PREPARE_REMATCH'; card: TeamCard }
  | { type: 'RESET' }
  | {
      type: 'SYNC_STATE';
      payload: Pick<
        CodewordState,
        'phase' | 'teamCard' | 'ourMisses' | 'ourIntercepts' | 'currentRound' | 'gameStatus'
      >;
    };
