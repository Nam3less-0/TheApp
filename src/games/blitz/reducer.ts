import type { BlitzAction, BlitzSession, RoundRecord } from './types';
import {
  TOTAL_ROUNDS,
  BANS_PER_PLAYER,
  buildQuestionPool,
  drawQuestion,
  nextPlayerAfter,
  pickRandomPlayer,
} from './utils';

export const initialBlitzState: BlitzSession = {
  players: [],
  totalRounds: TOTAL_ROUNDS,
  round: 0,
  remainingQuestions: [],
  currentPlayerId: '',
  currentQuestion: null,
  paused: false,
  rerollUsedThisRound: false,
  bannedCategoryIds: [],
  banPickerIndex: 0,
  stealPlayerId: null,
  phase: 'setup',
  history: [],
};

function recordFor(state: BlitzSession, success: boolean, stolenBy?: string): RoundRecord {
  return {
    round: state.round,
    playerId: state.currentPlayerId,
    category: state.currentQuestion!.category,
    prompt: state.currentQuestion!.prompt,
    seconds: state.currentQuestion!.seconds,
    success,
    rerolled: state.rerollUsedThisRound,
    stolenBy,
  };
}

/** Advance to the next round, or finish if we've hit the round cap. */
function advance(state: BlitzSession, history: RoundRecord[]): BlitzSession {
  if (state.round >= state.totalRounds) {
    return { ...state, phase: 'final', history, stealPlayerId: null };
  }
  const draw = drawQuestion(state.remainingQuestions, state.bannedCategoryIds);
  return {
    ...state,
    round: state.round + 1,
    remainingQuestions: draw.remaining,
    currentPlayerId: pickRandomPlayer(state.players),
    currentQuestion: draw.question,
    paused: false,
    rerollUsedThisRound: false,
    stealPlayerId: null,
    phase: 'prompt',
    history,
  };
}

export function blitzReducer(state: BlitzSession, action: BlitzAction): BlitzSession {
  switch (action.type) {
    case 'OPEN_BAN_PHASE': {
      return {
        ...initialBlitzState,
        players: action.players.map((p) => ({ ...p, score: 0 })),
        phase: 'ban',
        banPickerIndex: 0,
        bannedCategoryIds: [],
      };
    }

    case 'TOGGLE_BAN': {
      if (state.phase !== 'ban') return state;
      const already = state.bannedCategoryIds.includes(action.categoryId);
      if (already) {
        return {
          ...state,
          bannedCategoryIds: state.bannedCategoryIds.filter((id) => id !== action.categoryId),
        };
      }
      // Cap total bans so the pool can't be gutted.
      const maxBans = state.players.length * BANS_PER_PLAYER;
      if (state.bannedCategoryIds.length >= maxBans) return state;
      return { ...state, bannedCategoryIds: [...state.bannedCategoryIds, action.categoryId] };
    }

    case 'CONFIRM_BANS': {
      if (state.phase !== 'ban') return state;
      if (state.banPickerIndex + 1 < state.players.length) {
        return { ...state, banPickerIndex: state.banPickerIndex + 1 };
      }
      // Last player done — start the game.
      const pool = buildQuestionPool(state.bannedCategoryIds);
      const draw = drawQuestion(pool, state.bannedCategoryIds);
      return {
        ...state,
        round: 1,
        remainingQuestions: draw.remaining,
        currentPlayerId: pickRandomPlayer(state.players),
        currentQuestion: draw.question,
        paused: false,
        rerollUsedThisRound: false,
        phase: 'prompt',
        history: [],
      };
    }

    case 'START_GAME': {
      // Kept for compatibility: skip bans entirely and go straight in.
      const pool = buildQuestionPool([]);
      const draw = drawQuestion(pool, []);
      return {
        ...state,
        round: 1,
        remainingQuestions: draw.remaining,
        currentPlayerId: pickRandomPlayer(state.players),
        currentQuestion: draw.question,
        paused: false,
        rerollUsedThisRound: false,
        phase: 'prompt',
        history: [],
      };
    }

    // Active player beat the clock — they score, next round.
    case 'SUCCESS': {
      if (state.phase !== 'prompt' || !state.currentQuestion) return state;
      const players = state.players.map((p) =>
        p.id === state.currentPlayerId ? { ...p, score: p.score + 1 } : p,
      );
      return advance({ ...state, players }, [...state.history, recordFor(state, true)]);
    }

    // Clock ran out — the next player gets a short window to steal it.
    case 'TIMEOUT': {
      if (state.phase !== 'prompt' || !state.currentQuestion || state.paused) return state;
      return {
        ...state,
        phase: 'steal',
        stealPlayerId: nextPlayerAfter(state.players, state.currentPlayerId),
      };
    }

    // Steal landed: the stealer takes the point instead.
    case 'STEAL_SUCCESS': {
      if (state.phase !== 'steal' || !state.stealPlayerId || !state.currentQuestion) return state;
      const stealerId = state.stealPlayerId;
      const players = state.players.map((p) =>
        p.id === stealerId ? { ...p, score: p.score + 1 } : p,
      );
      return {
        ...state,
        players,
        phase: 'result',
        history: [...state.history, recordFor(state, false, stealerId)],
      };
    }

    // Nobody got it — no points at all this round.
    case 'STEAL_FAIL': {
      if (state.phase !== 'steal' || !state.currentQuestion) return state;
      return {
        ...state,
        phase: 'result',
        history: [...state.history, recordFor(state, false)],
      };
    }

    case 'TOGGLE_PAUSE': {
      if (state.phase !== 'prompt') return state;
      return { ...state, paused: !state.paused };
    }

    // One free skip per round for whoever's turn it is. The skipped question is
    // dropped for the rest of the session so it can't resurface.
    case 'REROLL': {
      if (state.phase !== 'prompt' || !state.currentQuestion || state.rerollUsedThisRound) return state;
      const draw = drawQuestion(state.remainingQuestions, state.bannedCategoryIds);
      return {
        ...state,
        remainingQuestions: draw.remaining,
        currentQuestion: draw.question,
        rerollUsedThisRound: true,
        paused: false,
      };
    }

    case 'CONTINUE': {
      if (state.phase !== 'result') return state;
      return advance(state, state.history);
    }

    case 'PLAY_AGAIN': {
      return {
        ...initialBlitzState,
        players: state.players.map((p) => ({ ...p, score: 0 })),
      };
    }

    default:
      return state;
  }
}
