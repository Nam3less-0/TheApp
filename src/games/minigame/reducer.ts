import type { MinigameAction, MinigameSession } from './types';
import { ROUND_ENGINES, TOTAL_ROUNDS } from './engines';
import { createFixedPlayers, pickRandom, shuffle } from './utils';

export const initialMinigameState: MinigameSession = {
  phase: 'lobby',
  players: createFixedPlayers(),
  roundIndex: -1,
  saboteurId: '',
  roundState: null,
  revealOrder: [],
  revealIndex: 0,
  lastOutcome: null,
  history: [],
};

function startRound(state: MinigameSession, roundIndex: number): MinigameSession {
  const engine = ROUND_ENGINES[roundIndex];
  const saboteurId = pickRandom(state.players).id;
  const roundState = engine.createRound(state.players, saboteurId);
  return {
    ...state,
    phase: 'manual',
    roundIndex,
    saboteurId,
    roundState,
    revealOrder: [],
    revealIndex: 0,
    lastOutcome: null,
  };
}

export function minigameReducer(state: MinigameSession, action: MinigameAction): MinigameSession {
  switch (action.type) {
    case 'START': {
      return startRound(state, 0);
    }

    case 'BEGIN_ROUND': {
      if (state.phase !== 'manual') return state;
      return {
        ...state,
        phase: 'reveal',
        revealOrder: shuffle(state.players.map((p) => p.id)),
        revealIndex: 0,
      };
    }

    case 'ADVANCE_REVEAL': {
      if (state.phase !== 'reveal') return state;
      const next = state.revealIndex + 1;
      if (next < state.revealOrder.length) {
        return { ...state, revealIndex: next };
      }
      return { ...state, phase: 'play' };
    }

    case 'RESOLVE_ROUND': {
      if (state.phase !== 'play') return state;
      const engine = ROUND_ENGINES[state.roundIndex];
      const { buildersWon } = action.outcome;
      const deltas: Record<string, number> = {};
      if (buildersWon) {
        for (const p of state.players) {
          if (p.id !== state.saboteurId) deltas[p.id] = 1;
        }
      } else {
        deltas[state.saboteurId] = 2;
      }
      const players = state.players.map((p) => (deltas[p.id] ? { ...p, score: p.score + deltas[p.id] } : p));
      return {
        ...state,
        players,
        phase: 'result',
        lastOutcome: action.outcome,
        history: [
          ...state.history,
          {
            roundId: engine.id,
            roundTitle: engine.title,
            glyph: engine.glyph,
            saboteurId: state.saboteurId,
            buildersWon,
            summary: action.outcome.summary,
            deltas,
          },
        ],
      };
    }

    case 'NEXT_ROUND': {
      if (state.phase !== 'result') return state;
      const nextIndex = state.roundIndex + 1;
      if (nextIndex >= TOTAL_ROUNDS) {
        return { ...state, phase: 'final' };
      }
      return startRound(state, nextIndex);
    }

    case 'RESTART': {
      return { ...initialMinigameState, players: createFixedPlayers() };
    }

    default:
      return state;
  }
}
