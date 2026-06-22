import { IMPOSTER_PAIRS } from '../../data/imposter-pairs';
import type { Player, WordPair } from './types';

export const ROUND_OPTIONS = [3, 5, 7, 10] as const;
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;

const DEFAULT_PLAYER_NAMES = ['Belford', 'Joshua', 'Matthew', 'Kai Jie'];

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

export function createDefaultPlayers(count = 4): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `player-${i + 1}`,
    name: DEFAULT_PLAYER_NAMES[i] ?? `Player ${i + 1}`,
    score: 0,
  }));
}

export function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function slugify(word: string): string {
  return word
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Build the full pool with stable ids derived from index + slug. */
export function buildPairPool(): WordPair[] {
  return IMPOSTER_PAIRS.map((pair, i) => ({
    id: `${i}-${slugify(pair.wordA)}-${slugify(pair.wordB)}`,
    wordA: pair.wordA,
    wordB: pair.wordB,
  }));
}

export interface RoundDraw {
  pair: WordPair;
  imposterWord: string;
  majorityWord: string;
  imposterPlayerId: string;
  revealOrder: string[];
  remainingPairs: WordPair[];
}

/**
 * Draw a pair (reshuffling the pool when exhausted), avoiding the same pair
 * twice in a row, then re-randomize the imposter, the imposter word (coin flip)
 * and the pass-around reveal order.
 */
export function drawRound(
  players: Player[],
  remainingPairs: WordPair[],
  lastPairId: string | null,
): RoundDraw {
  let pool = remainingPairs.length > 0 ? [...remainingPairs] : shuffle(buildPairPool());

  let index = pool.findIndex((p) => p.id !== lastPairId);
  if (index < 0) index = 0;
  const pair = pool[index];
  pool = pool.filter((_, i) => i !== index);

  const imposterFirst = Math.random() < 0.5;
  const imposterWord = imposterFirst ? pair.wordA : pair.wordB;
  const majorityWord = imposterFirst ? pair.wordB : pair.wordA;

  const playerIds = players.map((p) => p.id);
  const imposterPlayerId = playerIds[Math.floor(Math.random() * playerIds.length)];
  const revealOrder = shuffle(playerIds);

  return {
    pair,
    imposterWord,
    majorityWord,
    imposterPlayerId,
    revealOrder,
    remainingPairs: pool,
  };
}

export function getPlayerById(
  players: Player[],
  id: string | null,
): Player | undefined {
  if (!id) return undefined;
  return players.find((p) => p.id === id);
}
