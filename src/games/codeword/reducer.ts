import type { CodewordAction, CodewordState, GameStatus } from './types';
import { LOSE_THRESHOLD, WIN_THRESHOLD } from './utils';

export const initialCodewordState: CodewordState = {
  phase: 'setup',
  teamCard: null,
  ourMisses: 0,
  ourIntercepts: 0,
  ourTurnLog: [],
  interceptLog: [],
  currentRound: 1,
  gameStatus: 'in-progress',
};

function resolveStatus(misses: number, intercepts: number): GameStatus {
  if (intercepts >= WIN_THRESHOLD) return 'won';
  if (misses >= LOSE_THRESHOLD) return 'lost';
  return 'in-progress';
}

export function codewordReducer(
  state: CodewordState,
  action: CodewordAction,
): CodewordState {
  switch (action.type) {
    case 'START_GAME':
    case 'NEW_GAME': {
      return {
        ...initialCodewordState,
        phase: 'playing',
        teamCard: action.card,
      };
    }

    case 'LOG_OUR_TURN': {
      if (state.phase !== 'playing' && !action.skipScore) return state;

      const entry = {
        round: state.currentRound,
        code: action.code,
        hints: action.hints,
        outcome: action.outcome,
      };

      if (action.skipScore) {
        return {
          ...state,
          ourTurnLog: [...state.ourTurnLog, entry],
        };
      }

      const ourMisses =
        action.outcome === 'wrong' ? state.ourMisses + 1 : state.ourMisses;
      const gameStatus = resolveStatus(ourMisses, state.ourIntercepts);

      return {
        ...state,
        ourMisses,
        gameStatus,
        phase: gameStatus === 'in-progress' ? 'playing' : 'over',
        ourTurnLog: [...state.ourTurnLog, entry],
        currentRound: state.currentRound + 1,
      };
    }

    case 'LOG_INTERCEPT': {
      if (state.phase !== 'playing' && !action.skipScore) return state;

      const entry = {
        round: state.currentRound,
        hintsHeard: action.hintsHeard,
        actualCode: action.actualCode,
        outcome: action.outcome,
      };

      if (action.skipScore) {
        return {
          ...state,
          interceptLog: [...state.interceptLog, entry],
        };
      }

      const ourIntercepts =
        action.outcome === 'intercepted'
          ? state.ourIntercepts + 1
          : state.ourIntercepts;
      const gameStatus = resolveStatus(state.ourMisses, ourIntercepts);

      return {
        ...state,
        ourIntercepts,
        gameStatus,
        phase: gameStatus === 'in-progress' ? 'playing' : 'over',
        interceptLog: [...state.interceptLog, entry],
        currentRound: state.currentRound + 1,
      };
    }

    case 'PREPARE_REMATCH': {
      return {
        ...initialCodewordState,
        phase: 'setup',
        teamCard: action.card,
      };
    }

    case 'RESET':
      return initialCodewordState;

    case 'SYNC_STATE': {
      return {
        ...state,
        ...action.payload,
      };
    }

    default:
      return state;
  }
}
