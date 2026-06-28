import type { ImposterAction, ImposterSession, RoundRecord } from './types';
import {
  drawRound,
  shuffle,
  buildPairPool,
  buildRedemptionOptions,
  isRedemptionCorrect,
  roundScoreDeltas,
  applyDeltas,
} from './utils';

const EMPTY_PAIR = { id: '', wordA: '', wordB: '' };

export const initialImposterState: ImposterSession = {
  players: [],
  totalRounds: 5,
  currentRound: 0,
  remainingPairs: [],
  currentPair: EMPTY_PAIR,
  currentMode: 'standard',
  currentImposterWord: '',
  currentMajorityWord: '',
  currentImposterPlayerId: '',
  revealOrder: [],
  revealIndex: 0,
  votedPlayerId: null,
  redemptionOptions: [],
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
      const pool = shuffle(buildPairPool());
      const draw = drawRound(players, pool, null);

      return {
        players,
        totalRounds: action.totalRounds,
        currentRound: 1,
        remainingPairs: draw.remainingPairs,
        currentPair: draw.pair,
        currentMode: draw.mode,
        currentImposterWord: draw.imposterWord,
        currentMajorityWord: draw.majorityWord,
        currentImposterPlayerId: draw.imposterPlayerId,
        revealOrder: draw.revealOrder,
        revealIndex: 0,
        votedPlayerId: null,
        redemptionOptions: [],
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
        return {
          ...state,
          phase: 'redeem',
          redemptionOptions: buildRedemptionOptions(state.currentMajorityWord),
        };
      }

      const record: RoundRecord = {
        round: state.currentRound,
        pair: state.currentPair,
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
        pair: state.currentPair,
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

      const draw = drawRound(state.players, state.remainingPairs, state.currentPair.id);

      return {
        ...state,
        currentRound: state.currentRound + 1,
        remainingPairs: draw.remainingPairs,
        currentPair: draw.pair,
        currentMode: draw.mode,
        currentImposterWord: draw.imposterWord,
        currentMajorityWord: draw.majorityWord,
        currentImposterPlayerId: draw.imposterPlayerId,
        revealOrder: draw.revealOrder,
        revealIndex: 0,
        votedPlayerId: null,
        redemptionOptions: [],
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

    default:
      return state;
  }
}
