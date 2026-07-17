import type { BlitzAction, BlitzSession, RoundRecord } from './types';
import { TARGET_SCORE, REROLLS_PER_PLAYER, buildQuestionPool, drawQuestion, pickRandomPlayer } from './utils';

export const initialBlitzState: BlitzSession = {
  players: [],
  targetScore: TARGET_SCORE,
  round: 0,
  remainingQuestions: [],
  currentPlayerId: '',
  currentQuestion: null,
  paused: false,
  phase: 'setup',
  history: [],
};

export function blitzReducer(state: BlitzSession, action: BlitzAction): BlitzSession {
  switch (action.type) {
    case 'START_GAME': {
      const players = action.players.map((p) => ({ ...p, score: 0, rerollsLeft: REROLLS_PER_PLAYER }));
      const pool = buildQuestionPool();
      const draw = drawQuestion(pool);

      return {
        ...initialBlitzState,
        players,
        targetScore: TARGET_SCORE,
        round: 1,
        remainingQuestions: draw.remaining,
        currentPlayerId: pickRandomPlayer(players),
        currentQuestion: draw.question,
        paused: false,
        phase: 'prompt',
        history: [],
      };
    }

    // Player hit NEXT before time ran out — advance immediately, no penalty.
    case 'SUCCESS': {
      if (state.phase !== 'prompt' || !state.currentQuestion) return state;

      const record: RoundRecord = {
        round: state.round,
        playerId: state.currentPlayerId,
        category: state.currentQuestion.category,
        prompt: state.currentQuestion.prompt,
        seconds: state.currentQuestion.seconds,
        success: true,
      };

      const draw = drawQuestion(state.remainingQuestions);

      return {
        ...state,
        round: state.round + 1,
        remainingQuestions: draw.remaining,
        currentPlayerId: pickRandomPlayer(state.players),
        currentQuestion: draw.question,
        paused: false,
        history: [...state.history, record],
      };
    }

    // Timer hit zero before NEXT was pressed — everyone else scores.
    case 'TIMEOUT': {
      if (state.phase !== 'prompt' || !state.currentQuestion || state.paused) return state;

      const record: RoundRecord = {
        round: state.round,
        playerId: state.currentPlayerId,
        category: state.currentQuestion.category,
        prompt: state.currentQuestion.prompt,
        seconds: state.currentQuestion.seconds,
        success: false,
      };

      const players = state.players.map((p) =>
        p.id === state.currentPlayerId ? p : { ...p, score: p.score + 1 },
      );

      return {
        ...state,
        players,
        phase: 'result',
        history: [...state.history, record],
      };
    }

    // Freeze or resume the countdown so the group can talk through a category
    // without burning the clock.
    case 'TOGGLE_PAUSE': {
      if (state.phase !== 'prompt') return state;
      return { ...state, paused: !state.paused };
    }

    // Current player burns one of their tokens to swap this question for a
    // fresh draw, without losing their turn or costing anyone points.
    case 'REROLL': {
      if (state.phase !== 'prompt' || !state.currentQuestion) return state;
      const current = state.players.find((p) => p.id === state.currentPlayerId);
      if (!current || current.rerollsLeft <= 0) return state;

      const draw = drawQuestion(state.remainingQuestions);
      const players = state.players.map((p) =>
        p.id === current.id ? { ...p, rerollsLeft: p.rerollsLeft - 1 } : p,
      );

      return {
        ...state,
        players,
        // Put the skipped question back into rotation for later in the session.
        remainingQuestions: [...draw.remaining, state.currentQuestion],
        currentQuestion: draw.question,
        paused: false,
      };
    }

    case 'CONTINUE': {
      if (state.phase !== 'result') return state;

      const hasWinner = state.players.some((p) => p.score >= state.targetScore);
      if (hasWinner) {
        return { ...state, phase: 'final' };
      }

      const draw = drawQuestion(state.remainingQuestions);

      return {
        ...state,
        round: state.round + 1,
        remainingQuestions: draw.remaining,
        currentPlayerId: pickRandomPlayer(state.players),
        currentQuestion: draw.question,
        phase: 'prompt',
      };
    }

    case 'PLAY_AGAIN': {
      return {
        ...initialBlitzState,
        players: state.players.map((p) => ({ ...p, score: 0, rerollsLeft: REROLLS_PER_PLAYER })),
      };
    }

    default:
      return state;
  }
}
