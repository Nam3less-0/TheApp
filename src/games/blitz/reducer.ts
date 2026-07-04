import type { BlitzAction, BlitzSession, RoundRecord } from './types';
import { TARGET_SCORE, buildQuestionPool, drawQuestion, pickRandomPlayer } from './utils';

export const initialBlitzState: BlitzSession = {
  players: [],
  targetScore: TARGET_SCORE,
  round: 0,
  remainingQuestions: [],
  currentPlayerId: '',
  currentQuestion: null,
  phase: 'setup',
  history: [],
};

export function blitzReducer(state: BlitzSession, action: BlitzAction): BlitzSession {
  switch (action.type) {
    case 'START_GAME': {
      const players = action.players.map((p) => ({ ...p, score: 0 }));
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
        history: [...state.history, record],
      };
    }

    // Timer hit zero before NEXT was pressed — everyone else scores.
    case 'TIMEOUT': {
      if (state.phase !== 'prompt' || !state.currentQuestion) return state;

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
        players: state.players.map((p) => ({ ...p, score: 0 })),
      };
    }

    default:
      return state;
  }
}
