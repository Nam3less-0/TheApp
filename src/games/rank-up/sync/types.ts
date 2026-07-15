import type { QuestionType, RankOption } from '../types';

export type RoomPhase = 'lobby' | 'display' | 'guessing' | 'reveal';

export interface RoomRow {
  code: string;
  phase: RoomPhase;
  host_player_id: string;
  ranker_player_id: string | null;
  question_type: QuestionType | null;
  prompt: string | null;
  options: RankOption[];
  ranker_order: string[] | null;
  created_at: string;
}

export interface PlayerRow {
  id: string;
  room_code: string;
  name: string;
  score: number;
  guess_submitted: boolean;
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
}

export interface RankUpPlayer {
  id: string;
  name: string;
  score: number;
  guessSubmitted: boolean;
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
  };
}

export function mapPlayer(row: PlayerRow): RankUpPlayer {
  return {
    id: row.id,
    name: row.name,
    score: row.score,
    guessSubmitted: row.guess_submitted,
  };
}
