import { getCategoryById } from '../../data/categories';
import type { Player, Top100Action, Top100State } from './types';
import { advanceTurnState, computeTurnOrder } from './utils';

export const initialTop100State: Top100State = {
  phase: 'setup',
  players: [],
  gameMode: 'full',
  startingDealerIndex: 0,
  dealerSessionIndex: 0,
  usedCategoryIds: [],
  currentCategory: null,
  claimedThisTurn: [],
  round: 1,
  turnOrder: [],
  turnIndex: 0,
  reveal: null,
};

export function top100Reducer(state: Top100State, action: Top100Action): Top100State {
  switch (action.type) {
    case 'START_GAME': {
      const category = getCategoryById(action.categoryId);
      if (!category) return state;

      const players = action.players.map((p) => ({ ...p, score: 0 }));
      const dealerIndex = players.findIndex((p) => p.id === action.dealerId);
      if (dealerIndex < 0) return state;

      return {
        phase: 'playing',
        players,
        gameMode: action.gameMode,
        startingDealerIndex: dealerIndex,
        dealerSessionIndex: 0,
        usedCategoryIds: [action.categoryId],
        currentCategory: category,
        claimedThisTurn: [],
        round: 1,
        turnOrder: computeTurnOrder(players, dealerIndex),
        turnIndex: 0,
        reveal: null,
      };
    }

    case 'RESOLVE_CORRECT': {
      if (state.phase !== 'playing' || !state.currentCategory || state.reveal) {
        return state;
      }

      const guesserId = state.turnOrder[state.turnIndex];
      if (!guesserId) return state;

      const item = state.currentCategory.items.find((i) => i.rank === action.rank);
      if (!item || state.claimedThisTurn.some((c) => c.rank === action.rank)) {
        return state;
      }

      const players = state.players.map((p) =>
        p.id === guesserId ? { ...p, score: p.score + action.rank } : p,
      );

      return {
        ...state,
        players,
        claimedThisTurn: [
          ...state.claimedThisTurn,
          { rank: action.rank, claimedBy: guesserId },
        ],
        reveal: {
          type: 'correct',
          playerId: guesserId,
          itemName: item.name,
          rank: action.rank,
          points: action.rank,
        },
      };
    }

    case 'RESOLVE_WRONG': {
      if (state.phase !== 'playing' || state.reveal) return state;

      const guesserId = state.turnOrder[state.turnIndex];
      if (!guesserId) return state;

      return {
        ...state,
        reveal: {
          type: 'wrong',
          playerId: guesserId,
          points: 0,
        },
      };
    }

    case 'DISMISS_REVEAL': {
      if (!state.reveal) return state;
      return { ...state, ...advanceTurnState(state) };
    }

    case 'CONTINUE_FROM_RECAP': {
      if (state.phase !== 'turn-recap') return state;

      const totalSessions = state.gameMode === 'single' ? 1 : state.players.length;
      if (state.dealerSessionIndex >= totalSessions - 1) {
        return { ...state, phase: 'final' };
      }

      return { ...state, phase: 'handoff' };
    }

    case 'CONFIRM_HANDOFF': {
      if (state.phase !== 'handoff') return state;

      const category = getCategoryById(action.categoryId);
      if (!category) return state;

      const nextSessionIndex = state.dealerSessionIndex + 1;
      const nextDealerIndex =
        (state.startingDealerIndex + nextSessionIndex) % state.players.length;

      return {
        ...state,
        phase: 'playing',
        dealerSessionIndex: nextSessionIndex,
        usedCategoryIds: [...state.usedCategoryIds, action.categoryId],
        currentCategory: category,
        claimedThisTurn: [],
        round: 1,
        turnOrder: computeTurnOrder(state.players, nextDealerIndex),
        turnIndex: 0,
        reveal: null,
      };
    }

    case 'PLAY_AGAIN': {
      return {
        ...initialTop100State,
        phase: 'setup',
        players: state.players.map((p) => ({ ...p, score: 0 })),
      };
    }

    default:
      return state;
  }
}

export function updatePlayerName(
  players: Player[],
  id: string,
  name: string,
): Player[] {
  return players.map((p) => (p.id === id ? { ...p, name } : p));
}

export function addPlayer(players: Player[]): Player[] {
  if (players.length >= 8) return players;
  const nextIndex = players.length + 1;
  return [
    ...players,
    { id: `player-${Date.now()}`, name: `Player ${nextIndex}`, score: 0 },
  ];
}

export function removePlayer(players: Player[], id: string): Player[] {
  if (players.length <= 3) return players;
  return players.filter((p) => p.id !== id);
}
