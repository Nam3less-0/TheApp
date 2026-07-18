import { BLITZ_QUESTIONS, type BlitzQuestion } from '../../data/blitz-questions';
import type { Player } from './types';

export const TOTAL_ROUNDS = 10;
export const PLAYER_COUNT = 4;

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

export function buildQuestionPool(): BlitzQuestion[] {
  return shuffle(BLITZ_QUESTIONS);
}

/** Draw the next question, reshuffling the full pool once it's exhausted. */
export function drawQuestion(
  remaining: BlitzQuestion[],
): { question: BlitzQuestion; remaining: BlitzQuestion[] } {
  const pool = remaining.length > 0 ? remaining : buildQuestionPool();
  const [question, ...rest] = pool;
  return { question, remaining: rest };
}

/** Pure random pick each round — any player can go, repeats allowed. */
export function pickRandomPlayer(players: Player[]): string {
  return players[Math.floor(Math.random() * players.length)].id;
}

export function getPlayerById(players: Player[], id: string | null): Player | undefined {
  if (!id) return undefined;
  return players.find((p) => p.id === id);
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
