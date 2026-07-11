import { IMPOSTER_BUCKETS } from '../../data/imposter-buckets';
import type { Player, RoundMode, RoundRecord, WordBucket } from './types';

export const ROUND_OPTIONS = [3, 5, 7, 10] as const;
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;

/** Each round is a fair 50/50: imposter gets a different word, or no word at all. */
export const BLANK_ROUND_CHANCE = 0.5;

export function pickRoundMode(): RoundMode {
  return Math.random() < BLANK_ROUND_CHANCE ? 'blank' : 'standard';
}

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

/** Build the full pool with stable ids derived from index + first word slug. */
export function buildBucketPool(): WordBucket[] {
  return IMPOSTER_BUCKETS.map((bucket, i) => ({
    id: `${i}-${slugify(bucket.words[0])}`,
    words: [...bucket.words],
  }));
}

function normalizeWord(word: string): string {
  return word.trim().toLowerCase();
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
  bucket: WordBucket;
  mode: RoundMode;
  imposterWord: string;
  majorityWord: string;
  imposterPlayerId: string;
  revealOrder: string[];
  remainingBuckets: WordBucket[];
}

/**
 * Draw a bucket (reshuffling the pool when exhausted), avoiding the same bucket
 * twice in a row, then re-randomize the round mode, the imposter and the
 * pass-around reveal order. The majority word is picked at random from the
 * bucket; in a standard round the imposter gets a *different* word from the same
 * bucket, while in a blank round the imposter gets no word.
 */
export function drawRound(
  players: Player[],
  remainingBuckets: WordBucket[],
  lastBucketId: string | null,
): RoundDraw {
  let pool =
    remainingBuckets.length > 0 ? [...remainingBuckets] : shuffle(buildBucketPool());

  let index = pool.findIndex((b) => b.id !== lastBucketId);
  if (index < 0) index = 0;
  const bucket = pool[index];
  pool = pool.filter((_, i) => i !== index);

  const mode = pickRoundMode();

  const words = shuffle(bucket.words);
  const majorityWord = words[0];
  const imposterWord = mode === 'blank' ? '' : words[1];

  const playerIds = players.map((p) => p.id);
  const imposterPlayerId = playerIds[Math.floor(Math.random() * playerIds.length)];
  const revealOrder = shuffle(playerIds);

  return {
    bucket,
    mode,
    imposterWord,
    majorityWord,
    imposterPlayerId,
    revealOrder,
    remainingBuckets: pool,
  };
}

export function getPlayerById(
  players: Player[],
  id: string | null,
): Player | undefined {
  if (!id) return undefined;
  return players.find((p) => p.id === id);
}
