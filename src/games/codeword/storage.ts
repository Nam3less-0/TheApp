import type { TeamCard } from './types';

const SESSION_KEY = 'codeword-session';
const TEAM_ID_KEY = 'codeword-team-id';

export function getOrCreateTeamId(): string {
  const existing = localStorage.getItem(TEAM_ID_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(TEAM_ID_KEY, id);
  return id;
}

export interface CodewordSession {
  teamId: string;
  teamName: string;
  roomCode: string;
}

export function loadSession(): CodewordSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CodewordSession;
  } catch {
    return null;
  }
}

export function saveSession(session: CodewordSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function persistSession(session: CodewordSession) {
  saveSession(session);
}

function teamCardKey(roomCode: string) {
  return `codeword-card-${roomCode.toUpperCase()}`;
}

export function saveTeamCard(roomCode: string, card: TeamCard) {
  localStorage.setItem(teamCardKey(roomCode), JSON.stringify(card));
}

export function loadTeamCard(roomCode: string): TeamCard | null {
  try {
    const raw = localStorage.getItem(teamCardKey(roomCode));
    if (!raw) return null;
    return JSON.parse(raw) as TeamCard;
  } catch {
    return null;
  }
}

export function clearTeamCard(roomCode: string) {
  localStorage.removeItem(teamCardKey(roomCode));
}
