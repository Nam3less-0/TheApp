import type { Player, Round, Top100State } from './types';

export function computeTurnOrder(players: Player[], dealerIndex: number): string[] {
  const count = players.length;
  const order: string[] = [];
  for (let i = 1; i < count; i += 1) {
    order.push(players[(dealerIndex + i) % count].id);
  }
  return order;
}

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

export function getPlayerById(state: Top100State, id: string): Player | undefined {
  return state.players.find((p) => p.id === id);
}

export function getCurrentGuesserId(state: Top100State): string | null {
  if (state.phase !== 'playing' || state.turnOrder.length === 0) return null;
  return state.turnOrder[state.turnIndex] ?? null;
}

export function getDealerIndex(state: Top100State): number {
  const count = state.players.length;
  if (count === 0) return 0;
  return (state.startingDealerIndex + state.dealerSessionIndex) % count;
}

export function getDealer(state: Top100State): Player | undefined {
  return state.players[getDealerIndex(state)];
}

export function getTotalDealerSessions(state: Top100State): number {
  return state.gameMode === 'single' ? 1 : state.players.length;
}

export function isLastDealerSession(state: Top100State): boolean {
  return state.dealerSessionIndex >= getTotalDealerSessions(state) - 1;
}

export function getGuesserName(state: Top100State): string {
  const id = getCurrentGuesserId(state);
  if (!id) return '';
  return getPlayerById(state, id)?.name ?? '';
}

export function isRankClaimed(state: Top100State, rank: number): boolean {
  return state.claimedThisTurn.some((c) => c.rank === rank);
}

export function getTurnScores(
  claimed: Top100State['claimedThisTurn'],
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const claim of claimed) {
    scores[claim.claimedBy] = (scores[claim.claimedBy] ?? 0) + claim.rank;
  }
  return scores;
}

const DEFAULT_PLAYER_NAMES = ['Belford', 'Joshua', 'Matthew', 'Kai Jie'];

export function createDefaultPlayers(count = 4): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `player-${i + 1}`,
    name: DEFAULT_PLAYER_NAMES[i] ?? `Player ${i + 1}`,
    score: 0,
  }));
}

function advanceAfterGuess(state: Top100State): Partial<Top100State> {
  const nextTurnIndex = state.turnIndex + 1;

  if (nextTurnIndex < state.turnOrder.length) {
    return { turnIndex: nextTurnIndex, reveal: null };
  }

  if (state.round < 3) {
    const nextRound = (state.round + 1) as Round;
    return { round: nextRound, turnIndex: 0, reveal: null };
  }

  return { phase: 'turn-recap', reveal: null };
}

export function advanceTurnState(state: Top100State): Partial<Top100State> {
  return advanceAfterGuess(state);
}
