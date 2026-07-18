import type { BlitzAction, BlitzSession, RoundRecord } from './types';
import { TOTAL_ROUNDS, buildQuestionPool, drawQuestion, pickRandomPlayer } from './utils';

export const initialBlitzState: BlitzSession = {
  players: [],
  totalRounds: TOTAL_ROUNDS,
  round: 0,
  remainingQuestions: [],
  currentPlayerId: '',
  currentQuestion: null,
  paused: false,
  rerollUsedThisRound: false,
  phase: 'setup',
  history: [],
};

export function blitzReducer(state: BlitzSession, action: BlitzAction): BlitzSession {
  switch (action.type) {
    case 'START_GAME': {
      const players = action.players.map((p) => ({ ...p, score: 0 }));
      // One big shuffled pool for the whole session — with 800+ prompts and
      // at most ~20 draws in a 10-round game, this never needs to reshuffle,
      // so nothing can repeat within a single game.
      const pool = buildQuestionPool();
      const draw = drawQuestion(pool);

      return {
        ...initialBlitzState,
        players,
        totalRounds: TOTAL_ROUNDS,
        round: 1,
        remainingQuestions: draw.remaining,
        currentPlayerId: pickRandomPlayer(players),
        currentQuestion: draw.question,
        paused: false,
        rerollUsedThisRound: false,
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
        rerolled: state.rerollUsedThisRound,
      };

      const history = [...state.history, record];

      if (state.round >= state.totalRounds) {
        return { ...state, phase: 'final', history };
      }

      const draw = drawQuestion(state.remainingQuestions);

      return {
        ...state,
        round: state.round + 1,
        remainingQuestions: draw.remaining,
        currentPlayerId: pickRandomPlayer(state.players),
        currentQuestion: draw.question,
        paused: false,
        rerollUsedThisRound: false,
        history,
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
        rerolled: state.rerollUsedThisRound,
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

    // Exactly one skip is available per round, usable by whoever's turn it
    // is. The skipped question is dropped for the rest of this session (not
    // returned to the pool) so it can never resurface and repeat later.
    case 'REROLL': {
      if (state.phase !== 'prompt' || !state.currentQuestion || state.rerollUsedThisRound) return state;

      const draw = drawQuestion(state.remainingQuestions);

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

      if (state.round >= state.totalRounds) {
        return { ...state, phase: 'final' };
      }

      const draw = drawQuestion(state.remainingQuestions);

      return {
        ...state,
        round: state.round + 1,
        remainingQuestions: draw.remaining,
        currentPlayerId: pickRandomPlayer(state.players),
        currentQuestion: draw.question,
        rerollUsedThisRound: false,
        phase: 'prompt',
      };
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
