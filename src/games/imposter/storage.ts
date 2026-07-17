const SESSION_KEY = 'imposter-session';
const PLAYER_ID_KEY = 'imposter-player-id';

export function getOrCreatePlayerId(): string {
  const existing = localStorage.getItem(PLAYER_ID_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(PLAYER_ID_KEY, id);
  return id;
}

export interface ImposterSessionStorage {
  playerId: string;
  playerName: string;
  roomCode: string;
}

export function loadSession(): ImposterSessionStorage | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ImposterSessionStorage;
  } catch {
    return null;
  }
}

export function saveSession(session: ImposterSessionStorage) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function persistSession(session: ImposterSessionStorage) {
  saveSession(session);
}
