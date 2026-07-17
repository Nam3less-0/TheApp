import type {
  ImposterPhase,
  ImposterSession,
  Player,
  RoundMode,
  RoundRecord,
  WordBucket,
} from '../types';

export interface ImposterRoom {
  code: string;
  phase: ImposterPhase | 'lobby';
  hostPlayerId: string;
  totalRounds: number;
  currentRound: number;
  currentBucket: WordBucket | null;
  currentMode: RoundMode | null;
  currentMajorityWord: string;
  currentImposterWord: string;
  currentImposterPlayerId: string;
  revealOrder: string[];
  revealIndex: number;
  revealReadyIds: string[];
  votedPlayerId: string | null;
  remainingBuckets: WordBucket[];
  history: RoundRecord[];
}

export interface ImposterRoomPlayer extends Player {
  currentWord: string | null;
  isImposter: boolean;
}

export interface RoomRow {
  code: string;
  phase: string;
  host_player_id: string;
  total_rounds: number;
  current_round: number;
  current_bucket: WordBucket | null;
  current_mode: RoundMode | null;
  current_majority_word: string | null;
  current_imposter_word: string | null;
  current_imposter_player_id: string | null;
  reveal_order: string[];
  reveal_index: number;
  reveal_ready_ids: string[];
  voted_player_id: string | null;
  remaining_buckets: WordBucket[];
  history: RoundRecord[];
}

export interface PlayerRow {
  id: string;
  room_code: string;
  name: string;
  score: number;
  current_word: string | null;
  is_imposter: boolean;
}

const EMPTY_BUCKET = { id: '', words: [] };

export function mapRoom(row: RoomRow): ImposterRoom {
  return {
    code: row.code,
    phase: row.phase as ImposterRoom['phase'],
    hostPlayerId: row.host_player_id,
    totalRounds: row.total_rounds,
    currentRound: row.current_round,
    currentBucket: row.current_bucket,
    currentMode: row.current_mode,
    currentMajorityWord: row.current_majority_word ?? '',
    currentImposterWord: row.current_imposter_word ?? '',
    currentImposterPlayerId: row.current_imposter_player_id ?? '',
    revealOrder: row.reveal_order ?? [],
    revealIndex: row.reveal_index ?? 0,
    revealReadyIds: row.reveal_ready_ids ?? [],
    votedPlayerId: row.voted_player_id,
    remainingBuckets: row.remaining_buckets ?? [],
    history: row.history ?? [],
  };
}

export function mapPlayer(row: PlayerRow): ImposterRoomPlayer {
  return {
    id: row.id,
    name: row.name,
    score: row.score,
    currentWord: row.current_word,
    isImposter: row.is_imposter,
  };
}

export function buildSession(room: ImposterRoom, players: ImposterRoomPlayer[]): ImposterSession {
  return {
    players: players.map(({ id, name, score }) => ({ id, name, score })),
    totalRounds: room.totalRounds,
    currentRound: room.currentRound,
    remainingBuckets: room.remainingBuckets,
    currentBucket: room.currentBucket ?? EMPTY_BUCKET,
    currentMode: room.currentMode ?? 'standard',
    currentImposterWord: room.currentImposterWord,
    currentMajorityWord: room.currentMajorityWord,
    currentImposterPlayerId: room.currentImposterPlayerId,
    revealOrder: room.revealOrder,
    revealIndex: room.revealIndex,
    votedPlayerId: room.votedPlayerId,
    phase: room.phase === 'lobby' ? 'setup' : room.phase,
    history: room.history,
  };
}

export function roomToRow(room: ImposterRoom): Partial<RoomRow> {
  return {
    code: room.code,
    phase: room.phase,
    host_player_id: room.hostPlayerId,
    total_rounds: room.totalRounds,
    current_round: room.currentRound,
    current_bucket: room.currentBucket,
    current_mode: room.currentMode,
    current_majority_word: room.currentMajorityWord,
    current_imposter_word: room.currentImposterWord,
    current_imposter_player_id: room.currentImposterPlayerId,
    reveal_order: room.revealOrder,
    reveal_index: room.revealIndex,
    reveal_ready_ids: room.revealReadyIds,
    voted_player_id: room.votedPlayerId,
    remaining_buckets: room.remainingBuckets,
    history: room.history,
  };
}

export function playerWordUpdates(
  session: ImposterSession,
  players: ImposterRoomPlayer[],
): Array<{ id: string; current_word: string | null; is_imposter: boolean }> {
  return players.map((player) => {
    const isImposter = player.id === session.currentImposterPlayerId;
    return {
      id: player.id,
      current_word: isImposter ? session.currentImposterWord || null : session.currentMajorityWord,
      is_imposter: isImposter,
    };
  });
}
