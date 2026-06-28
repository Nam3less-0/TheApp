import { IMPOSTER_PAIRS } from '../../data/imposter-pairs';
import type { Player, RoundMode, RoundRecord, WordPair } from './types';

export const ROUND_OPTIONS = [3, 5, 7, 10] as const;
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;

/** Chance any given round is a "blank imposter" round instead of standard. */
export const BLANK_ROUND_CHANCE = 0.3;
/** Number of word choices (1 correct + decoys) shown during redemption. */
export const REDEMPTION_OPTION_COUNT = 4;

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

/** Flat list of every distinct word across all pairs (decoy source). */
function allWords(): string[] {
  const set = new Set<string>();
  for (const pair of IMPOSTER_PAIRS) {
    set.add(pair.wordA);
    set.add(pair.wordB);
  }
  return [...set];
}

function normalizeWord(word: string): string {
  return word.trim().toLowerCase();
}

/**
 * Multiple-choice options for a caught blank-round imposter's redemption guess:
 * the real majority word plus random decoys, all shuffled.
 */
export function buildRedemptionOptions(
  correctWord: string,
  count = REDEMPTION_OPTION_COUNT,
): string[] {
  const correctKey = normalizeWord(correctWord);
  const decoys: string[] = [];
  const seen = new Set<string>([correctKey]);
  for (const candidate of shuffle(allWords())) {
    if (decoys.length >= count - 1) break;
    const key = normalizeWord(candidate);
    if (seen.has(key)) continue;
    seen.add(key);
    decoys.push(candidate);
  }
  return shuffle([correctWord, ...decoys]);
}

/** True when a redemption guess matches the round's majority word. */
export function isRedemptionCorrect(guess: string, majorityWord: string): boolean {
  return normalizeWord(guess) === normalizeWord(majorityWord);
}

/**
 * Per-player point changes for a finished round. Centralizes scoring so the
 * reducer and the result screen never disagree.
 *
 * Standard: caught → +1 each non-imposter; evaded → +2 imposter.
 * Blank:    evaded → +3 imposter; caught + correct redemption → +1 imposter;
 *           caught + wrong redemption → +1 each non-imposter.
 */
export function roundScoreDeltas(
  record: RoundRecord,
  players: Player[],
): Record<string, number> {
  const deltas: Record<string, number> = {};
  const isImposter = (id: string) => id === record.imposterPlayerId;

  if (record.mode === 'blank') {
    if (record.outcome === 'evaded') {
      deltas[record.imposterPlayerId] = 3;
    } else if (record.redemptionCorrect) {
      deltas[record.imposterPlayerId] = 1;
    } else {
      for (const p of players) if (!isImposter(p.id)) deltas[p.id] = 1;
    }
    return deltas;
  }

  if (record.outcome === 'caught') {
    for (const p of players) if (!isImposter(p.id)) deltas[p.id] = 1;
  } else {
    deltas[record.imposterPlayerId] = 2;
  }
  return deltas;
}

/** Apply per-player point deltas, returning a new players array. */
export function applyDeltas(
  players: Player[],
  deltas: Record<string, number>,
): Player[] {
  return players.map((p) =>
    deltas[p.id] ? { ...p, score: p.score + deltas[p.id] } : p,
  );
}

export interface RoundDraw {
  pair: WordPair;
  mode: RoundMode;
  imposterWord: string;
  majorityWord: string;
  imposterPlayerId: string;
  revealOrder: string[];
  remainingPairs: WordPair[];
}

/**
 * Draw a pair (reshuffling the pool when exhausted), avoiding the same pair
 * twice in a row, then re-randomize the round mode, the imposter, the imposter
 * word (coin flip) and the pass-around reveal order. In a blank round the
 * imposter gets no word.
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

  const mode: RoundMode = Math.random() < BLANK_ROUND_CHANCE ? 'blank' : 'standard';

  const imposterFirst = Math.random() < 0.5;
  const majorityWord = imposterFirst ? pair.wordB : pair.wordA;
  const imposterWord = mode === 'blank' ? '' : imposterFirst ? pair.wordA : pair.wordB;

  const playerIds = players.map((p) => p.id);
  const imposterPlayerId = playerIds[Math.floor(Math.random() * playerIds.length)];
  const revealOrder = shuffle(playerIds);

  return {
    pair,
    mode,
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
