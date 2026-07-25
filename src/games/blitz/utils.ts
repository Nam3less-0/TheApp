import { BLITZ_QUESTIONS, type BlitzQuestion } from '../../data/blitz-questions';
import type { Player } from './types';

export const TOTAL_ROUNDS = 10;
export const PLAYER_COUNT = 4;
/** Each player removes this many categories before the game starts. */
export const BANS_PER_PLAYER = 2;
/** Seconds the next player gets to steal a failed prompt. */
export const STEAL_SECONDS = 8;

const DEFAULT_PLAYER_NAMES = ['Belford', 'Joshua', 'Matthew', 'Kai Jie'];

export function createDefaultPlayers(count = PLAYER_COUNT): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `player-${i + 1}`,
    name: DEFAULT_PLAYER_NAMES[i] ?? `Player ${i + 1}`,
    score: 0,
  }));
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

export function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Question ids are `${seedId}-${variantIndex}` — strip the variant suffix. */
export function categoryIdOf(question: BlitzQuestion): string {
  return question.id.replace(/-\d+$/, '');
}

export function buildQuestionPool(bannedCategoryIds: string[] = []): BlitzQuestion[] {
  const banned = new Set(bannedCategoryIds);
  const allowed = BLITZ_QUESTIONS.filter((q) => !banned.has(categoryIdOf(q)));
  // Never hand back an empty pool, even if somehow everything got banned.
  return shuffle(allowed.length > 0 ? allowed : BLITZ_QUESTIONS);
}

/** Draw the next question, reshuffling the filtered pool once it's exhausted. */
export function drawQuestion(
  remaining: BlitzQuestion[],
  bannedCategoryIds: string[] = [],
): { question: BlitzQuestion; remaining: BlitzQuestion[] } {
  const pool = remaining.length > 0 ? remaining : buildQuestionPool(bannedCategoryIds);
  const [question, ...rest] = pool;
  return { question, remaining: rest };
}

/** Pure random pick each round — any player can go, repeats allowed. */
export function pickRandomPlayer(players: Player[]): string {
  return players[Math.floor(Math.random() * players.length)].id;
}

/** The player seated after the given one, used for steal attempts. */
export function nextPlayerAfter(players: Player[], id: string): string {
  const i = players.findIndex((p) => p.id === id);
  if (i === -1) return players[0].id;
  return players[(i + 1) % players.length].id;
}

export function getPlayerById(players: Player[], id: string | null): Player | undefined {
  if (!id) return undefined;
  return players.find((p) => p.id === id);
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
