import { getSupabase } from '../../../lib/supabase';
import { imposterReducer } from '../reducer';
import type { ImposterAction, ImposterSession, Player } from '../types';
import {
  buildSession,
  mapPlayer,
  mapRoom,
  playerWordUpdates,
  type ImposterRoom,
  type ImposterRoomPlayer,
  type RoomRow,
} from './types';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

export function createPlayerId(): string {
  return crypto.randomUUID();
}

function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < 4; i += 1) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

async function roomCodeExists(code: string): Promise<boolean> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from('imposter_rooms')
    .select('code')
    .eq('code', code)
    .maybeSingle();
  return Boolean(data);
}

async function uniqueRoomCode(): Promise<string> {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = generateRoomCode();
    if (!(await roomCodeExists(code))) return code;
  }
  throw new Error('Could not generate a unique room code.');
}

export async function fetchRoom(code: string): Promise<ImposterRoom | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('imposter_rooms')
    .select('*')
    .eq('code', code.toUpperCase())
    .maybeSingle();

  if (error) throw error;
  return data ? mapRoom(data as RoomRow) : null;
}

export async function fetchPlayers(roomCode: string): Promise<ImposterRoomPlayer[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('imposter_players')
    .select('*')
    .eq('room_code', roomCode.toUpperCase())
    .order('joined_at', { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => mapPlayer(row as never));
}

export async function createRoom(
  playerId: string,
  playerName: string,
): Promise<ImposterRoom> {
  const supabase = getSupabase();
  const code = await uniqueRoomCode();

  const { error: roomError } = await supabase.from('imposter_rooms').insert({
    code,
    host_player_id: playerId,
    phase: 'lobby',
  });

  if (roomError) throw roomError;

  const { error: playerError } = await supabase.from('imposter_players').insert({
    id: playerId,
    room_code: code,
    name: playerName,
  });

  if (playerError) throw playerError;

  const room = await fetchRoom(code);
  if (!room) throw new Error('Room was not created.');
  return room;
}

export async function joinRoom(
  code: string,
  playerId: string,
  playerName: string,
): Promise<ImposterRoom> {
  const supabase = getSupabase();
  const roomCode = code.toUpperCase();
  const room = await fetchRoom(roomCode);
  if (!room) throw new Error('Room not found. Check the code and try again.');
  if (room.phase !== 'lobby') {
    throw new Error('This game has already started.');
  }

  const players = await fetchPlayers(roomCode);
  if (players.length >= 10) {
    throw new Error('This room is full.');
  }

  const { error } = await supabase.from('imposter_players').insert({
    id: playerId,
    room_code: roomCode,
    name: playerName,
  });

  if (error) {
    if (error.code === '23505') {
      throw new Error('You are already in this room on another tab.');
    }
    throw error;
  }

  return room;
}

function sessionToRoomUpdate(session: ImposterSession, room: ImposterRoom) {
  const phase = session.phase === 'setup' ? 'lobby' : session.phase;
  return {
    phase,
    total_rounds: session.totalRounds,
    current_round: session.currentRound,
    current_bucket: session.currentBucket.id ? session.currentBucket : null,
    current_mode: session.currentMode,
    current_majority_word: session.currentMajorityWord,
    current_imposter_word: session.currentImposterWord,
    current_imposter_player_id: session.currentImposterPlayerId,
    reveal_order: session.revealOrder,
    reveal_index: session.revealIndex,
    voted_player_id: session.votedPlayerId,
    remaining_buckets: session.remainingBuckets,
    history: session.history,
    reveal_ready_ids: room.revealReadyIds,
  };
}

async function persistSession(
  roomCode: string,
  session: ImposterSession,
  room: ImposterRoom,
  players: ImposterRoomPlayer[],
): Promise<void> {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();

  const { error: roomError } = await supabase
    .from('imposter_rooms')
    .update(sessionToRoomUpdate(session, room))
    .eq('code', code);

  if (roomError) throw roomError;

  for (const player of session.players) {
    const { error } = await supabase
      .from('imposter_players')
      .update({ name: player.name, score: player.score })
      .eq('id', player.id);

    if (error) throw error;
  }

  const wordUpdates = playerWordUpdates(session, players);
  for (const update of wordUpdates) {
    const { error } = await supabase
      .from('imposter_players')
      .update({
        current_word: update.current_word,
        is_imposter: update.is_imposter,
      })
      .eq('id', update.id);

    if (error) throw error;
  }
}

async function loadAndApply(
  roomCode: string,
  action: ImposterAction,
  roomPatch?: Partial<ImposterRoom>,
): Promise<void> {
  const room = await fetchRoom(roomCode);
  if (!room) throw new Error('Room not found.');

  const players = await fetchPlayers(roomCode);
  const session = buildSession({ ...room, ...roomPatch }, players);
  const next = imposterReducer(session, action);
  await persistSession(roomCode, next, { ...room, ...roomPatch }, players);
}

export async function setTotalRounds(roomCode: string, totalRounds: number): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('imposter_rooms')
    .update({ total_rounds: totalRounds })
    .eq('code', roomCode.toUpperCase());

  if (error) throw error;
}

export async function startGame(roomCode: string, totalRounds: number): Promise<void> {
  const room = await fetchRoom(roomCode);
  if (!room) throw new Error('Room not found.');
  const players = await fetchPlayers(roomCode);

  const roster: Player[] = players.map(({ id, name, score }) => ({ id, name, score }));
  await loadAndApply(
    roomCode,
    { type: 'START_GAME', players: roster, totalRounds },
    { totalRounds, revealReadyIds: [] },
  );
}

export async function markRevealReady(roomCode: string, playerId: string): Promise<void> {
  const room = await fetchRoom(roomCode);
  if (!room) throw new Error('Room not found.');
  if (room.phase !== 'reveal') return;

  const ready = room.revealReadyIds.includes(playerId)
    ? room.revealReadyIds
    : [...room.revealReadyIds, playerId];

  const players = await fetchPlayers(roomCode);
  const playerIds = players.map((player) => player.id);

  if (ready.length >= playerIds.length) {
    await loadAndApply(roomCode, { type: 'MARK_REVEAL_READY', playerId, playerIds: ready }, {
      revealReadyIds: ready,
    });
    return;
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from('imposter_rooms')
    .update({ reveal_ready_ids: ready })
    .eq('code', roomCode.toUpperCase());

  if (error) throw error;
}

export async function advanceReveal(roomCode: string): Promise<void> {
  await loadAndApply(roomCode, { type: 'ADVANCE_REVEAL' });
}

export async function goToVote(roomCode: string): Promise<void> {
  await loadAndApply(roomCode, { type: 'GO_TO_VOTE' });
}

export async function selectVote(roomCode: string, playerId: string): Promise<void> {
  await loadAndApply(roomCode, { type: 'SELECT_VOTE', playerId });
}

export async function revealImposter(roomCode: string): Promise<void> {
  await loadAndApply(roomCode, { type: 'REVEAL_IMPOSTER' });
}

export async function submitRedemption(roomCode: string, word: string): Promise<void> {
  const room = await fetchRoom(roomCode);
  if (!room) throw new Error('Room not found.');
  const players = await fetchPlayers(roomCode);
  const session = buildSession(room, players);
  const next = imposterReducer(session, { type: 'SUBMIT_REDEMPTION', word });
  await persistSession(roomCode, next, room, players);
}

export async function nextRound(roomCode: string): Promise<void> {
  const room = await fetchRoom(roomCode);
  if (!room) throw new Error('Room not found.');
  await loadAndApply(roomCode, { type: 'NEXT_ROUND' }, { revealReadyIds: [] });
}

export async function playAgain(roomCode: string): Promise<void> {
  const room = await fetchRoom(roomCode);
  if (!room) throw new Error('Room not found.');
  const players = await fetchPlayers(roomCode);
  const session = buildSession(room, players);
  const next = imposterReducer(session, { type: 'PLAY_AGAIN' });

  const supabase = getSupabase();
  const code = roomCode.toUpperCase();

  const { error: roomError } = await supabase
    .from('imposter_rooms')
    .update({
      phase: 'lobby',
      total_rounds: next.totalRounds,
      current_round: 0,
      current_bucket: null,
      current_mode: null,
      current_majority_word: null,
      current_imposter_word: null,
      current_imposter_player_id: null,
      reveal_order: [],
      reveal_index: 0,
      reveal_ready_ids: [],
      voted_player_id: null,
      remaining_buckets: [],
      history: [],
    })
    .eq('code', code);

  if (roomError) throw roomError;

  for (const player of players) {
    const { error } = await supabase
      .from('imposter_players')
      .update({
        score: 0,
        current_word: null,
        is_imposter: false,
      })
      .eq('id', player.id);

    if (error) throw error;
  }
}

export function subscribeToRoom(
  roomCode: string,
  onRoom: (room: ImposterRoom) => void,
  onPlayers: (players: ImposterRoomPlayer[]) => void,
  onError: (message: string) => void,
): () => void {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();

  void fetchRoom(code).then((room) => {
    if (room) onRoom(room);
  });
  void fetchPlayers(code).then(onPlayers);

  const channel = supabase
    .channel(`imposter-${code}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'imposter_rooms', filter: `code=eq.${code}` },
      (payload) => {
        if (payload.new) onRoom(mapRoom(payload.new as RoomRow));
      },
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'imposter_players', filter: `room_code=eq.${code}` },
      () => {
        void fetchPlayers(code).then(onPlayers).catch(() => {
          onError('Could not refresh players.');
        });
      },
    )
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR') {
        onError('Realtime connection failed.');
      }
    });

  return () => {
    void supabase.removeChannel(channel);
  };
}

export async function leaveRoom(playerId: string, roomCode: string): Promise<void> {
  const supabase = getSupabase();
  await supabase.from('imposter_players').delete().eq('id', playerId);

  const players = await fetchPlayers(roomCode);
  if (players.length === 0) {
    await supabase.from('imposter_rooms').delete().eq('code', roomCode.toUpperCase());
  }
}

export { buildSession };
