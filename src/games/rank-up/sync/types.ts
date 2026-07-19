import type { QuestionType, RankOption } from '../types';
import type { RoundPoints } from '../utils';

export type RoomPhase = 'lobby' | 'display' | 'guessing' | 'reveal' | 'round-recap';

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
  joined_at: string;
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
}

export interface RankUpPlayer {
  id: string;
  name: string;
  score: number;
  guessSubmitted: boolean;
  guessOrder: string[] | null;
  lastRoundPoints: RoundPoints | null;
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
  };
}

/** Host has not called startRound — turn queue is empty until then. */
export function isAwaitingRoundStart(room: RankUpRoom): boolean {
  return room.phase === 'lobby' && room.turnOrder.length === 0;
}
