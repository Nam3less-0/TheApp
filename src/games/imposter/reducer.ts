import type { ImposterAction, ImposterSession, RoundRecord } from './types';
import {
  drawRound,
  shuffle,
  buildBucketPool,
  isRedemptionCorrect,
  roundScoreDeltas,
  applyDeltas,
} from './utils';

const EMPTY_BUCKET = { id: '', words: [] };

export const initialImposterState: ImposterSession = {
  players: [],
  totalRounds: 5,
  currentRound: 0,
  remainingBuckets: [],
  currentBucket: EMPTY_BUCKET,
  currentMode: 'standard',
  currentImposterWord: '',
  currentMajorityWord: '',
  currentImposterPlayerId: '',
  revealOrder: [],
  revealIndex: 0,
  votedPlayerId: null,
  phase: 'setup',
  history: [],
};

export function imposterReducer(
  state: ImposterSession,
  action: ImposterAction,
): ImposterSession {
  switch (action.type) {
    case 'START_GAME': {
      const players = action.players.map((p) => ({ ...p, score: 0 }));
      const pool = shuffle(buildBucketPool());
      const draw = drawRound(players, pool, null);

      return {
        players,
        totalRounds: action.totalRounds,
        currentRound: 1,
        remainingBuckets: draw.remainingBuckets,
        currentBucket: draw.bucket,
        currentMode: draw.mode,
        currentImposterWord: draw.imposterWord,
        currentMajorityWord: draw.majorityWord,
        currentImposterPlayerId: draw.imposterPlayerId,
        revealOrder: draw.revealOrder,
        revealIndex: 0,
        votedPlayerId: null,
        phase: 'reveal',
        history: [],
      };
    }

    case 'ADVANCE_REVEAL': {
      if (state.phase !== 'reveal') return state;
      const nextIndex = state.revealIndex + 1;
      if (nextIndex < state.revealOrder.length) {
        return { ...state, revealIndex: nextIndex };
      }
      return { ...state, phase: 'discuss' };
    }

    case 'MARK_REVEAL_READY': {
      if (state.phase !== 'reveal') return state;
      const ready = action.playerIds.includes(action.playerId)
        ? action.playerIds
        : [...action.playerIds, action.playerId];
      if (ready.length < state.players.length) {
        return state;
      }
      return { ...state, phase: 'discuss' };
    }

    case 'GO_TO_VOTE': {
      if (state.phase !== 'discuss') return state;
      return { ...state, phase: 'vote' };
    }

    case 'SELECT_VOTE': {
      if (state.phase !== 'vote') return state;
      return { ...state, votedPlayerId: action.playerId };
    }

    case 'REVEAL_IMPOSTER': {
      if (state.phase !== 'vote' || !state.votedPlayerId) return state;

      const outcome =
        state.votedPlayerId === state.currentImposterPlayerId ? 'caught' : 'evaded';

      // A caught blank-round imposter earns a redemption guess before scoring.
      if (state.currentMode === 'blank' && outcome === 'caught') {
        return { ...state, phase: 'redeem' };
      }

      const record: RoundRecord = {
        round: state.currentRound,
        bucket: state.currentBucket,
        mode: state.currentMode,
        imposterWord: state.currentImposterWord,
        majorityWord: state.currentMajorityWord,
        imposterPlayerId: state.currentImposterPlayerId,
        votedPlayerId: state.votedPlayerId,
        outcome,
        redemptionGuess: null,
        redemptionCorrect: false,
      };

      return {
        ...state,
        players: applyDeltas(state.players, roundScoreDeltas(record, state.players)),
        phase: 'result',
        history: [...state.history, record],
      };
    }

    case 'SUBMIT_REDEMPTION': {
      if (state.phase !== 'redeem') return state;

      const redemptionCorrect = isRedemptionCorrect(
        action.word,
        state.currentMajorityWord,
      );

      const record: RoundRecord = {
        round: state.currentRound,
        bucket: state.currentBucket,
        mode: state.currentMode,
        imposterWord: state.currentImposterWord,
        majorityWord: state.currentMajorityWord,
        imposterPlayerId: state.currentImposterPlayerId,
        votedPlayerId: state.votedPlayerId,
        outcome: 'caught',
        redemptionGuess: action.word,
        redemptionCorrect,
      };

      return {
        ...state,
        players: applyDeltas(state.players, roundScoreDeltas(record, state.players)),
        phase: 'result',
        history: [...state.history, record],
      };
    }

    case 'NEXT_ROUND': {
      if (state.phase !== 'result') return state;

      if (state.currentRound >= state.totalRounds) {
        return { ...state, phase: 'final' };
      }

      const draw = drawRound(
        state.players,
        state.remainingBuckets,
        state.currentBucket.id,
      );

      return {
        ...state,
        currentRound: state.currentRound + 1,
        remainingBuckets: draw.remainingBuckets,
        currentBucket: draw.bucket,
        currentMode: draw.mode,
        currentImposterWord: draw.imposterWord,
        currentMajorityWord: draw.majorityWord,
        currentImposterPlayerId: draw.imposterPlayerId,
        revealOrder: draw.revealOrder,
        revealIndex: 0,
        votedPlayerId: null,
        phase: 'reveal',
      };
    }

    case 'PLAY_AGAIN': {
      return {
        ...initialImposterState,
        players: state.players.map((p) => ({ ...p, score: 0 })),
        totalRounds: state.totalRounds,
      };
    }

    case 'SYNC_STATE':
      return action.payload;

    case 'RESET':
      return initialImposterState;

    default:
      return state;
  }
}
