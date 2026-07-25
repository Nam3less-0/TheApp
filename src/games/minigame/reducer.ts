import type { MinigameAction, MinigameSession } from './types';
import { MINIGAMES, TOTAL_GAMES } from './engines';
import { createFixedPlayers } from './utils';

export const initialMinigameState: MinigameSession = {
  phase: 'lobby',
  players: createFixedPlayers(),
  gameIndex: -1,
  lastOutcome: null,
  history: [],
};

export function minigameReducer(state: MinigameSession, action: MinigameAction): MinigameSession {
  switch (action.type) {
    case 'START': {
      return { ...state, phase: 'manual', gameIndex: 0, lastOutcome: null };
    }

    case 'BEGIN_GAME': {
      if (state.phase !== 'manual') return state;
      return { ...state, phase: 'play' };
    }

    case 'RESOLVE_GAME': {
      if (state.phase !== 'play') return state;
      const engine = MINIGAMES[state.gameIndex];
      const { deltas } = action.outcome;
      const players = state.players.map((p) =>
        deltas[p.id] ? { ...p, score: p.score + deltas[p.id] } : p,
      );
      return {
        ...state,
        players,
        phase: 'result',
        lastOutcome: action.outcome,
        history: [
          ...state.history,
          {
            gameId: engine.id,
            gameTitle: engine.title,
            glyph: engine.glyph,
            headline: action.outcome.headline,
            summary: action.outcome.summary,
            deltas,
          },
        ],
      };
    }

    case 'NEXT_GAME': {
      if (state.phase !== 'result') return state;
      const nextIndex = state.gameIndex + 1;
      if (nextIndex >= TOTAL_GAMES) {
        return { ...state, phase: 'final' };
      }
      return { ...state, phase: 'manual', gameIndex: nextIndex, lastOutcome: null };
    }

    case 'RESTART': {
      return { ...initialMinigameState, players: createFixedPlayers() };
    }

    default:
      return state;
  }
}
