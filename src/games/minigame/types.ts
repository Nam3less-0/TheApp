import type { ComponentType } from 'react';

export interface Player {
  id: string;
  name: string;
  score: number;
}

/** Result of one complete mini-game, expressed as per-player point deltas. */
export interface GameOutcome {
  /** Points earned this game, keyed by player id. Missing = 0. */
  deltas: Record<string, number>;
  /** Big line on the result screen, e.g. "The Saboteur got away with it". */
  headline: string;
  /** One-sentence explanation of what happened. */
  summary: string;
  /** Optional extra detail rows shown under the summary. */
  details?: string[];
}

export interface GameProps {
  players: Player[];
  onResolve: (outcome: GameOutcome) => void;
}

export interface GameManual {
  premise: string;
  /** Bullet rules. */
  howToPlay: string[];
  /** How points are awarded. */
  scoring: string[];
}

export interface MinigameEngine {
  id: string;
  title: string;
  tagline: string;
  accent: string;
  glyph: string;
  manual: GameManual;
  Play: ComponentType<GameProps>;
}

export type MinigamePhase = 'lobby' | 'manual' | 'play' | 'result' | 'final';

export interface GameHistoryEntry {
  gameId: string;
  gameTitle: string;
  glyph: string;
  headline: string;
  summary: string;
  deltas: Record<string, number>;
}

export interface MinigameSession {
  phase: MinigamePhase;
  players: Player[];
  gameIndex: number;
  lastOutcome: GameOutcome | null;
  history: GameHistoryEntry[];
}

export type MinigameAction =
  | { type: 'START' }
  | { type: 'BEGIN_GAME' }
  | { type: 'RESOLVE_GAME'; outcome: GameOutcome }
  | { type: 'NEXT_GAME' }
  | { type: 'RESTART' };
