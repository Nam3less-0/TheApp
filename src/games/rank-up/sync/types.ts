import type { QuestionType, RankOption } from '../types';
import type { RoundPoints } from '../utils';

export type RoomPhase = 'lobby' | 'display' | 'guessing' | 'reveal' | 'round-recap';
export type GameMode = 'classic' | 'teams';
export type TeamAccent = 'a' | 'b';

export interface TeamDraftOrder {
  order: string[];
  movedBy: string | null;
  updatedAt: number;
}

export interface RoomRow {
  code: string;
  phase: RoomPhase;
  host_player_id: string;
  ranker_player_id: string | null;
  question_type: QuestionType | null;
  prompt: string | null;
  options: RankOption[];
  ranker_order: string[] | null;
  turn_order: string[];
  turn_index: number;
  round_number: number;
  game_mode: GameMode;
  team_draft_order: TeamDraftOrder | null;
  created_at: string;
}

export interface PlayerRow {
  id: string;
  room_code: string;
  name: string;
  score: number;
  guess_submitted: boolean;
  guess_order: string[] | null;
  last_round_points: number | null;
  team_id: string | null;
  joined_at: string;
}

export interface TeamRow {
  id: string;
  room_code: string;
  name: string;
  accent: TeamAccent;
}

export interface RankUpRoom {
  code: string;
  phase: RoomPhase;
  hostPlayerId: string;
  rankerPlayerId: string | null;
  questionType: QuestionType | null;
  prompt: string | null;
  options: RankOption[];
  rankerOrder: string[] | null;
  turnOrder: string[];
  turnIndex: number;
  roundNumber: number;
  gameMode: GameMode;
  teamDraftOrder: TeamDraftOrder | null;
}

export interface RankUpPlayer {
  id: string;
  name: string;
  score: number;
  guessSubmitted: boolean;
  guessOrder: string[] | null;
  lastRoundPoints: RoundPoints | null;
  teamId: string | null;
}

export interface RankUpTeam {
  id: string;
  roomCode: string;
  name: string;
  accent: TeamAccent;
}

function parseTeamDraftOrder(value: unknown): TeamDraftOrder | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as Record<string, unknown>;
  if (!Array.isArray(row.order)) return null;
  return {
    order: row.order as string[],
    movedBy: typeof row.movedBy === 'string' ? row.movedBy : null,
    updatedAt: typeof row.updatedAt === 'number' ? row.updatedAt : Date.now(),
  };
}

export function mapRoom(row: RoomRow): RankUpRoom {
  return {
    code: row.code,
    phase: row.phase,
    hostPlayerId: row.host_player_id,
    rankerPlayerId: row.ranker_player_id,
    questionType: row.question_type,
    prompt: row.prompt,
    options: Array.isArray(row.options) ? row.options : [],
    rankerOrder: row.ranker_order,
    turnOrder: Array.isArray(row.turn_order) ? row.turn_order : [],
    turnIndex: row.turn_index ?? 0,
    roundNumber: row.round_number ?? 1,
    gameMode: row.game_mode ?? 'classic',
    teamDraftOrder: parseTeamDraftOrder(row.team_draft_order),
  };
}

function parseRoundPoints(value: number | null | undefined): RoundPoints | null {
  if (value == null || value < 0 || value > 3) return null;
  return value;
}

export function mapPlayer(row: PlayerRow): RankUpPlayer {
  const guessOrder = Array.isArray(row.guess_order) ? row.guess_order : null;

  return {
    id: row.id,
    name: row.name,
    score: row.score,
    guessSubmitted: row.guess_submitted,
    guessOrder,
    lastRoundPoints: parseRoundPoints(row.last_round_points),
    teamId: row.team_id,
  };
}

export function mapTeam(row: TeamRow): RankUpTeam {
  return {
    id: row.id,
    roomCode: row.room_code,
    name: row.name,
    accent: row.accent,
  };
}

/** Host has not called startRound — turn queue is empty until then. */
export function isAwaitingRoundStart(room: RankUpRoom): boolean {
  return room.phase === 'lobby' && room.turnOrder.length === 0;
}
