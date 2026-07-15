import type { LocalState } from './types';

const SESSION_KEY = 'rank-up-session';
const PLAYER_ID_KEY = 'rank-up-player-id';

export function getOrCreatePlayerId(): string {
  const existing = localStorage.getItem(PLAYER_ID_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(PLAYER_ID_KEY, id);
  return id;
}

export interface RankUpSession {
  playerId: string;
  playerName: string;
  roomCode: string;
  score: number;
}

export function loadSession(): RankUpSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RankUpSession;
  } catch {
    return null;
  }
}

export function saveSession(session: RankUpSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function persistSessionFromState(state: LocalState) {
  if (!state.roomCode || !state.playerId || !state.playerName) return;
  saveSession({
    playerId: state.playerId,
    playerName: state.playerName,
    roomCode: state.roomCode,
    score: state.score,
  });
}

export function pendingOrderKey(roomCode: string) {
  return `rank-up-pending-order-${roomCode.toUpperCase()}`;
}

export function savePendingOrder(roomCode: string, order: string[]) {
  sessionStorage.setItem(pendingOrderKey(roomCode), JSON.stringify(order));
}

export function loadPendingOrder(roomCode: string): string[] | null {
  try {
    const raw = sessionStorage.getItem(pendingOrderKey(roomCode));
    if (!raw) return null;
    return JSON.parse(raw) as string[];
  } catch {
    return null;
  }
}

export function clearPendingOrder(roomCode: string) {
  sessionStorage.removeItem(pendingOrderKey(roomCode));
}
