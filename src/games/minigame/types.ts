import type { ComponentType } from 'react';

export interface Player {
  id: string;
  name: string;
  score: number;
}

export type Role = 'SABOTEUR' | 'BUILDER';

export interface Briefing {
  role: Role;
  headline: string;
  detail?: string;
}

export interface RoundOutcome {
  buildersWon: boolean;
  /** Short human-readable line describing what happened, shown on the result screen. */
  summary: string;
}

export interface PlayProps<TRoundState> {
  roundState: TRoundState;
  players: Player[];
  saboteurId: string;
  onResolve: (outcome: RoundOutcome) => void;
}

export interface RoundManual {
  premise: string;
  builderGoal: string;
  saboteurGoal: string;
  howToPlay: string[];
}

export interface RoundEngine<TRoundState = unknown> {
  id: string;
  title: string;
  tagline: string;
  /** Hex accent used for this round's chrome. */
  accent: string;
  /** Small glyph shown in recap chips / manual header. */
  glyph: string;
  manual: RoundManual;
  createRound: (players: Player[], saboteurId: string) => TRoundState;
  briefing: (playerId: string, roundState: TRoundState, saboteurId: string) => Briefing;
  Play: ComponentType<PlayProps<TRoundState>>;
}

export type MinigamePhase = 'lobby' | 'manual' | 'reveal' | 'play' | 'result' | 'final';

export interface RoundHistoryEntry {
  roundId: string;
  roundTitle: string;
  glyph: string;
  saboteurId: string;
  buildersWon: boolean;
  summary: string;
  deltas: Record<string, number>;
}

export interface MinigameSession {
  phase: MinigamePhase;
  players: Player[];
  roundIndex: number;
  saboteurId: string;
  roundState: unknown;
  revealOrder: string[];
  revealIndex: number;
  lastOutcome: RoundOutcome | null;
  history: RoundHistoryEntry[];
}

export type MinigameAction =
  | { type: 'START' }
  | { type: 'BEGIN_ROUND' }
  | { type: 'ADVANCE_REVEAL' }
  | { type: 'RESOLVE_ROUND'; outcome: RoundOutcome }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESTART' };
