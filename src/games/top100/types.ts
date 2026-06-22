export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface RankedItem {
  rank: number;
  name: string;
}

export interface Category {
  id: string;
  title: string;
  items: RankedItem[];
}

export interface ClaimedItem {
  rank: number;
  claimedBy: string;
}

export type Round = 1 | 2 | 3;

export type GameMode = 'full' | 'single';

export type GamePhase = 'setup' | 'playing' | 'turn-recap' | 'handoff' | 'final';

export interface RevealMessage {
  type: 'correct' | 'wrong';
  playerId: string;
  itemName?: string;
  rank?: number;
  points: number;
}

export interface GameSession {
  phase: GamePhase;
  players: Player[];
  gameMode: GameMode;
  startingDealerIndex: number;
  dealerSessionIndex: number;
  usedCategoryIds: string[];
  currentCategory: Category;
  claimedThisTurn: ClaimedItem[];
  round: Round;
  turnOrder: string[];
  turnIndex: number;
  reveal: RevealMessage | null;
}

export type Top100Action =
  | {
      type: 'START_GAME';
      players: Player[];
      categoryId: string;
      dealerId: string;
      gameMode: GameMode;
    }
  | { type: 'RESOLVE_CORRECT'; rank: number }
  | { type: 'RESOLVE_WRONG' }
  | { type: 'DISMISS_REVEAL' }
  | { type: 'CONTINUE_FROM_RECAP' }
  | { type: 'CONFIRM_HANDOFF'; categoryId: string }
  | { type: 'PLAY_AGAIN' };

export interface Top100State {
  phase: GamePhase;
  players: Player[];
  gameMode: GameMode;
  startingDealerIndex: number;
  dealerSessionIndex: number;
  usedCategoryIds: string[];
  currentCategory: Category | null;
  claimedThisTurn: ClaimedItem[];
  round: Round;
  turnOrder: string[];
  turnIndex: number;
  reveal: RevealMessage | null;
}
