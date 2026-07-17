import type { Player } from './types';

export const MINIGAME_PLAYER_NAMES = ['Belford', 'Joshua', 'Matthew', 'Kai Jie'];

export function createFixedPlayers(): Player[] {
  return MINIGAME_PLAYER_NAMES.map((name, i) => ({
    id: `mg-player-${i + 1}`,
    name,
    score: 0,
  }));
}

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
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

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getPlayerById(players: Player[], id: string | null | undefined) {
  return players.find((p) => p.id === id);
}

export function otherPlayers(players: Player[], id: string) {
  return players.filter((p) => p.id !== id);
}
