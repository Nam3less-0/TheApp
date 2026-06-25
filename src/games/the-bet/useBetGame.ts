import { useReducer } from 'react';
import { BET_CATEGORIES } from './data';
import type { BetAction, BetRound, BetState, Team } from './types';
import type { BetCategory } from '../../data/bet-categories';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createDefaultTeams(): [Team, Team] {
  return [
    {
      name: 'Team Alpha',
      players: ['Belford', 'Matthew'],
      bettorIndex: 0,
      score: 0,
    },
    {
      name: 'Team Beta',
      players: ['Kai Jie', 'Joshua'],
      bettorIndex: 0,
      score: 0,
    },
  ];
}

export function createInitialBetState(): BetState {
  return {
    phase: 'categories',
    teams: createDefaultTeams(),
    rounds: [],
    currentRound: null,
    drawnCategories: null,
    selectedCategoryIndex: null,
  };
}

function getUsedCategoryIds(rounds: BetRound[]): Set<string> {
  return new Set(rounds.map((r) => r.category.id));
}

function drawThreeCategories(usedIds: Set<string>): [BetCategory, BetCategory, BetCategory] {
  let pool = BET_CATEGORIES.filter((c) => !usedIds.has(c.id));
  if (pool.length < 3) {
    pool = [...BET_CATEGORIES];
  }

  const picked: BetCategory[] = [];
  const indices = new Set<number>();
  while (picked.length < 3) {
    const idx = randomInt(0, pool.length - 1);
    if (indices.has(idx)) continue;
    indices.add(idx);
    picked.push(pool[idx]);
  }

  return [picked[0], picked[1], picked[2]];
}

function resolveWinningBet(bets: [number, number]): { teamIndex: 0 | 1; amount: number } {
  const lastRaised = randomInt(0, 1) as 0 | 1;
  if (bets[0] > bets[1]) return { teamIndex: 0, amount: bets[0] };
  if (bets[1] > bets[0]) return { teamIndex: 1, amount: bets[1] };
  return { teamIndex: lastRaised, amount: bets[lastRaised] };
}

function rotateBettors(teams: [Team, Team]): [Team, Team] {
  return teams.map((team) => ({
    ...team,
    bettorIndex:
      team.players.length > 0
        ? (team.bettorIndex + 1) % team.players.length
        : team.bettorIndex,
  })) as [Team, Team];
}

export function betReducer(state: BetState, action: BetAction): BetState {
  switch (action.type) {
    case 'DRAW_CATEGORIES': {
      const usedIds = getUsedCategoryIds(state.rounds);
      return {
        ...state,
        drawnCategories: drawThreeCategories(usedIds),
        selectedCategoryIndex: null,
      };
    }

    case 'SELECT_CATEGORY':
      return { ...state, selectedCategoryIndex: action.index };

    case 'START_PLAY': {
      if (state.selectedCategoryIndex === null || !state.drawnCategories) return state;
      const category = state.drawnCategories[state.selectedCategoryIndex];
      const teamBets: [number, number] = [randomInt(3, 8), randomInt(3, 8)];
      const winningBet = resolveWinningBet(teamBets);
      return {
        ...state,
        phase: 'play',
        currentRound: {
          roundIndex: state.rounds.length,
          category,
          bets: [
            { teamIndex: 0, amount: teamBets[0] },
            { teamIndex: 1, amount: teamBets[1] },
          ],
          winningBet,
          activeTeamIndex: winningBet.teamIndex,
          itemsNamed: null,
          won: null,
        },
      };
    }

    case 'CANCEL_PLAY':
      return { ...state, phase: 'categories' };

    case 'NEXT_ROUND': {
      const rounds = state.currentRound
        ? [...state.rounds, { ...state.currentRound, itemsNamed: null, won: null }]
        : state.rounds;

      return {
        ...state,
        phase: 'categories',
        teams: rotateBettors(state.teams),
        rounds,
        drawnCategories: null,
        selectedCategoryIndex: null,
        currentRound: null,
      };
    }

    case 'RESET_GAME':
      return createInitialBetState();

    default:
      return state;
  }
}

export function useBetGame() {
  return useReducer(betReducer, undefined, createInitialBetState);
}
