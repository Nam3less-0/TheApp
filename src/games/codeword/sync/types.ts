export type CodewordRoomPhase = 'lobby' | 'setup' | 'playing' | 'over';

export interface CodewordRoom {
  code: string;
  phase: CodewordRoomPhase;
  hostTeamId: string;
  transmittingTeamId: string | null;
  currentRound: number;
  winnerTeamId: string | null;
}

export interface CodewordTeam {
  id: string;
  roomCode: string;
  name: string;
  slot: 1 | 2;
  misses: number;
  intercepts: number;
  cardLocked: boolean;
}

export interface RoomRow {
  code: string;
  phase: CodewordRoomPhase;
  host_team_id: string;
  transmitting_team_id: string | null;
  current_round: number;
  winner_team_id: string | null;
}

export interface TeamRow {
  id: string;
  room_code: string;
  name: string;
  slot: number;
  misses: number;
  intercepts: number;
  card_locked: boolean;
}

export function mapRoom(row: RoomRow): CodewordRoom {
  return {
    code: row.code,
    phase: row.phase,
    hostTeamId: row.host_team_id,
    transmittingTeamId: row.transmitting_team_id,
    currentRound: row.current_round,
    winnerTeamId: row.winner_team_id,
  };
}

export function mapTeam(row: TeamRow): CodewordTeam {
  return {
    id: row.id,
    roomCode: row.room_code,
    name: row.name,
    slot: row.slot as 1 | 2,
    misses: row.misses,
    intercepts: row.intercepts,
    cardLocked: row.card_locked,
  };
}
