import type { ExposedAction, ExposedSession, RoundRecord } from './types';
import {
  TOTAL_ROUNDS,
  buildQuestionPool,
  drawQuestion,
  flipCoin,
  pickRandomPlayer,
  pointsFor,
} from './utils';

export const initialExposedState: ExposedSession = {
  players: [],
  totalRounds: TOTAL_ROUNDS,
  currentRound: 0,
  remainingQuestions: [],
  currentPlayerId: '',
  currentQuestion: '',
  currentOutcome: null,
  phase: 'setup',
  history: [],
};

export function exposedReducer(
  state: ExposedSession,
  action: ExposedAction,
): ExposedSession {
  switch (action.type) {
    case 'START_GAME': {
      const players = action.players.map((p) => ({ ...p, score: 0 }));
      const pool = buildQuestionPool();
      const draw = drawQuestion(pool);

      return {
        ...initialExposedState,
        players,
        totalRounds: TOTAL_ROUNDS,
        currentRound: 1,
        remainingQuestions: draw.remaining,
        currentPlayerId: pickRandomPlayer(players),
        currentQuestion: draw.question,
        currentOutcome: null,
        phase: 'question',
        history: [],
      };
    }

    case 'ANSWERED': {
      if (state.phase !== 'question') return state;

      const outcome = flipCoin();
      const points = pointsFor(outcome);

      const record: RoundRecord = {
        round: state.currentRound,
        playerId: state.currentPlayerId,
        question: state.currentQuestion,
        outcome,
        points,
      };

      const players = state.players.map((p) =>
        p.id === state.currentPlayerId ? { ...p, score: p.score + points } : p,
      );

      return {
        ...state,
        players,
        currentOutcome: outcome,
        phase: 'coinflip',
        history: [...state.history, record],
      };
    }

    case 'COIN_SETTLED': {
      if (state.phase !== 'coinflip') return state;
      return { ...state, phase: 'result' };
    }

    case 'NEXT_ROUND': {
      if (state.phase !== 'result') return state;

      if (state.currentRound >= state.totalRounds) {
        return { ...state, phase: 'final' };
      }

      const draw = drawQuestion(state.remainingQuestions);

      return {
        ...state,
        currentRound: state.currentRound + 1,
        remainingQuestions: draw.remaining,
        currentPlayerId: pickRandomPlayer(state.players),
        currentQuestion: draw.question,
        currentOutcome: null,
        phase: 'question',
      };
    }

    case 'PLAY_AGAIN': {
      return {
        ...initialExposedState,
        players: state.players.map((p) => ({ ...p, score: 0 })),
      };
    }

    default:
      return state;
  }
}
