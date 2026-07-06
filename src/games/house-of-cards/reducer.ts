import { TOPIC_POOL } from '../../data/house-of-cards';
import { buildDeck, SUITS } from './deck';
import type { HouseOfCardsAction, HouseOfCardsState, Suit, SuitTopic } from './types';

export const WIN_THRESHOLD = 25;
export const LOSS_THRESHOLD = -25;

function emptySuitTopicMap(): Record<Suit, SuitTopic> {
  const map = {} as Record<Suit, SuitTopic>;
  for (const suit of SUITS) map[suit] = { id: '', name: '' };
  return map;
}

export const initialHouseOfCardsState: HouseOfCardsState = {
  phase: 'setup',
  teamAName: 'Team A',
  teamBName: 'Team B',
  scoreA: 0,
  scoreB: 0,
  activeTeam: 'a',
  deck: [],
  activeCardIndex: null,
  suitTopicMap: emptySuitTopicMap(),
  winner: null,
  winReason: null,
};

export function houseOfCardsReducer(
  state: HouseOfCardsState,
  action: HouseOfCardsAction,
): HouseOfCardsState {
  switch (action.type) {
    case 'START_GAME': {
      const { deck, suitTopicMap } = buildDeck(TOPIC_POOL);
      const teamAName = action.teamAName.trim() || 'Team A';
      const teamBName = action.teamBName.trim() || 'Team B';
      return {
        ...initialHouseOfCardsState,
        phase: 'board',
        teamAName,
        teamBName,
        deck,
        suitTopicMap,
        // Team A always opens; turn order is strict A → B → A → B thereafter.
        activeTeam: 'a',
      };
    }

    case 'PICK_CARD': {
      if (state.phase !== 'board') return state;
      const card = state.deck[action.index];
      if (!card || card.used) return state;
      return { ...state, phase: 'question', activeCardIndex: action.index };
    }

    case 'REVEAL': {
      if (state.phase !== 'question') return state;
      return { ...state, phase: 'reveal' };
    }

    case 'PUT_BACK': {
      // Escape hatch for a misclick: return to the board without switching turns.
      // The card was never marked used, so nothing else needs undoing.
      if (state.phase !== 'question' && state.phase !== 'reveal') return state;
      return { ...state, phase: 'board', activeCardIndex: null };
    }

    case 'JUDGE': {
      if (state.phase !== 'reveal' || state.activeCardIndex === null) return state;
      const card = state.deck[state.activeCardIndex];
      if (!card || card.used) return state;

      const delta = action.correct ? card.value : -card.value;
      const nextScoreA = state.activeTeam === 'a' ? state.scoreA + delta : state.scoreA;
      const nextScoreB = state.activeTeam === 'b' ? state.scoreB + delta : state.scoreB;

      const deck = state.deck.map((c, i) =>
        i === state.activeCardIndex
          ? { ...c, used: true, result: action.correct ? ('correct' as const) : ('incorrect' as const) }
          : c,
      );

      const resolved: HouseOfCardsState = {
        ...state,
        deck,
        scoreA: nextScoreA,
        scoreB: nextScoreB,
        activeCardIndex: null,
      };

      // Check thresholds BEFORE flipping the turn — win/lose is immediate.
      if (nextScoreA > WIN_THRESHOLD) {
        return { ...resolved, phase: 'gameover', winner: 'a', winReason: 'threshold_win' };
      }
      if (nextScoreB > WIN_THRESHOLD) {
        return { ...resolved, phase: 'gameover', winner: 'b', winReason: 'threshold_win' };
      }
      if (nextScoreA < LOSS_THRESHOLD) {
        return { ...resolved, phase: 'gameover', winner: 'b', winReason: 'threshold_loss' };
      }
      if (nextScoreB < LOSS_THRESHOLD) {
        return { ...resolved, phase: 'gameover', winner: 'a', winReason: 'threshold_loss' };
      }

      // No threshold crossed — check deck exhaustion.
      const remaining = deck.filter((c) => !c.used).length;
      if (remaining === 0) {
        if (nextScoreA === nextScoreB) {
          return { ...resolved, phase: 'gameover', winner: null, winReason: 'exhausted_tie' };
        }
        const winner = nextScoreA > nextScoreB ? 'a' : 'b';
        return { ...resolved, phase: 'gameover', winner, winReason: 'exhausted_higher_score' };
      }

      // Otherwise, flip the turn strictly and return to the board.
      return {
        ...resolved,
        phase: 'board',
        activeTeam: state.activeTeam === 'a' ? 'b' : 'a',
      };
    }

    case 'RESET':
      return initialHouseOfCardsState;

    default:
      return state;
  }
}
