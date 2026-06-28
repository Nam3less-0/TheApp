import type { BetCategory } from '../../data/bet-categories';

export interface Team {
  name: string;
  players: string[];
  bettorIndex: number;
  score: number;
}

export interface BetRound {
  roundIndex: number;
  category: BetCategory;
  bets: { teamIndex: number; amount: number }[];
  winningBet: { teamIndex: number; amount: number };
  activeTeamIndex: number;
  itemsNamed: number | null;
  won: boolean | null;
}

export type BetPhase = 'categories' | 'play';

export interface BetState {
  phase: BetPhase;
  teams: [Team, Team];
  rounds: BetRound[];
  currentRound: BetRound | null;
  drawnCategories: [BetCategory, BetCategory, BetCategory] | null;
  selectedCategoryIndex: 0 | 1 | 2 | null;
}

export type BetAction =
  | { type: 'DRAW_CATEGORIES' }
  | { type: 'SELECT_CATEGORY'; index: 0 | 1 | 2 }
  | { type: 'START_PLAY' }
  | { type: 'CANCEL_PLAY' }
  | { type: 'NEXT_ROUND' }
  | { type: 'SET_ROSTER'; teams: [string[], string[]] }
  | { type: 'RANDOMIZE_TEAMS' }
  | { type: 'RESET_GAME' };
