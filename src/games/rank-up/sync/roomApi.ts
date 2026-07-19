import { getSupabase } from '../../../lib/supabase';
import { scoreRoundPoints } from '../utils';
import type { QuestionType, RankOption } from '../types';
import { mapPlayer, mapRoom, type RankUpPlayer, type RankUpRoom } from './types';

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
  const { data } = await supabase.from('rank_up_rooms').select('code').eq('code', code).maybeSingle();
  return Boolean(data);
}

async function uniqueRoomCode(): Promise<string> {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = generateRoomCode();
    if (!(await roomCodeExists(code))) return code;
  }
  throw new Error('Could not generate a unique room code.');
}

export async function fetchRoom(code: string): Promise<RankUpRoom | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('rank_up_rooms')
    .select('*')
    .eq('code', code.toUpperCase())
    .maybeSingle();

  if (error) throw error;
  return data ? mapRoom(data as never) : null;
}

export async function fetchPlayers(roomCode: string): Promise<RankUpPlayer[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('rank_up_players')
    .select('*')
    .eq('room_code', roomCode.toUpperCase())
    .order('joined_at', { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => mapPlayer(row as never));
}

async function fetchPlayerRoomCode(playerId: string): Promise<string | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('rank_up_players')
    .select('room_code')
    .eq('id', playerId)
    .maybeSingle();

  if (error) throw error;
  return data?.room_code ?? null;
}

async function clearStalePlayerMembership(playerId: string): Promise<void> {
  const existingRoomCode = await fetchPlayerRoomCode(playerId);
  if (!existingRoomCode) return;
  await leaveRoom(playerId, existingRoomCode);
}

export async function createRoom(playerId: string, playerName: string): Promise<RankUpRoom> {
  await clearStalePlayerMembership(playerId);

  const supabase = getSupabase();
  const code = await uniqueRoomCode();

  const { error: roomError } = await supabase.from('rank_up_rooms').insert({
    code,
    host_player_id: playerId,
    ranker_player_id: playerId,
    phase: 'lobby',
    options: [],
  });

  if (roomError) throw roomError;

  const { error: playerError } = await supabase.from('rank_up_players').insert({
    id: playerId,
    room_code: code,
    name: playerName,
  });

  if (playerError) {
    await supabase.from('rank_up_rooms').delete().eq('code', code);
    throw playerError;
  }

  const room = await fetchRoom(code);
  if (!room) throw new Error('Room was not created.');
  return room;
}

export async function joinRoom(
  code: string,
  playerId: string,
  playerName: string,
): Promise<RankUpRoom> {
  const supabase = getSupabase();
  const roomCode = code.toUpperCase();
  const room = await fetchRoom(roomCode);
  if (!room) throw new Error('Room not found. Check the code and try again.');

  const existingRoomCode = await fetchPlayerRoomCode(playerId);
  if (existingRoomCode === roomCode) {
    const { error: updateError } = await supabase
      .from('rank_up_players')
      .update({ name: playerName })
      .eq('id', playerId);
    if (updateError) throw updateError;
    return room;
  }

  if (existingRoomCode) {
    await leaveRoom(playerId, existingRoomCode);
  }

  const { error } = await supabase.from('rank_up_players').insert({
    id: playerId,
    room_code: roomCode,
    name: playerName,
  });

  if (error) throw error;

  return room;
}

export async function publishDisplay(
  roomCode: string,
  payload: {
    questionType: QuestionType;
    prompt: string;
    options: RankOption[];
    rankerPlayerId: string;
  },
): Promise<RankUpRoom> {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();
  const { error } = await supabase
    .from('rank_up_rooms')
    .update({
      phase: 'guessing',
      question_type: payload.questionType,
      prompt: payload.prompt,
      options: payload.options,
      ranker_player_id: payload.rankerPlayerId,
      ranker_order: null,
    })
    .eq('code', code);

  if (error) throw error;

  await resetGuessSubmissions(code);

  const room = await fetchRoom(code);
  if (!room) throw new Error('Room not found after publish.');
  return room;
}

export async function startGuessing(roomCode: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('rank_up_rooms')
    .update({ phase: 'guessing' })
    .eq('code', roomCode.toUpperCase());

  if (error) throw error;
}

export async function revealAnswer(
  roomCode: string,
  rankerOrder: string[],
): Promise<void> {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();
  const existingRoom = await fetchRoom(code);
  const existingPlayers = await fetchPlayers(code);

  if (
    existingRoom?.phase === 'reveal' &&
    existingPlayers.some((player) => player.lastRoundPoints != null)
  ) {
    return;
  }

  const { error } = await supabase
    .from('rank_up_rooms')
    .update({
      phase: 'reveal',
      ranker_order: rankerOrder,
    })
    .eq('code', code);

  if (error) throw error;

  const room = await fetchRoom(code);
  if (!room?.rankerPlayerId) return;

  const guessers = existingPlayers.filter((player) => player.id !== room.rankerPlayerId);
  const allGuessOrders = guessers
    .map((player) => player.guessOrder ?? [])
    .filter((order) => order.length > 0);

  await Promise.all(
    guessers.map(async (player) => {
      const guessOrder = player.guessOrder ?? [];
      const points =
        guessOrder.length > 0
          ? scoreRoundPoints(guessOrder, rankerOrder, allGuessOrders)
          : 0;

      const { error: playerError } = await supabase
        .from('rank_up_players')
        .update({
          score: player.score + points,
          last_round_points: points,
        })
        .eq('id', player.id);

      if (playerError) throw playerError;
    }),
  );
}

export async function resetToLobby(
  roomCode: string,
  nextRankerPlayerId: string,
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('rank_up_rooms')
    .update({
      phase: 'lobby',
      ranker_player_id: nextRankerPlayerId,
      question_type: null,
      prompt: null,
      options: [],
      ranker_order: null,
    })
    .eq('code', roomCode.toUpperCase());

  if (error) throw error;

  await resetGuessSubmissions(roomCode);
}

export async function setRanker(roomCode: string, rankerPlayerId: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('rank_up_rooms')
    .update({ ranker_player_id: rankerPlayerId })
    .eq('code', roomCode.toUpperCase());

  if (error) throw error;
}

async function resetGuessSubmissions(roomCode: string): Promise<void> {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();
  const { error } = await supabase
    .from('rank_up_players')
    .update({
      guess_submitted: false,
      guess_order: null,
      last_round_points: null,
    })
    .eq('room_code', code);

  if (!error) return;

  const { error: fallbackError } = await supabase
    .from('rank_up_players')
    .update({ guess_submitted: false })
    .eq('room_code', code);

  if (fallbackError) throw fallbackError;
}

export async function markGuessSubmitted(
  playerId: string,
  guessOrder: string[],
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('rank_up_players')
    .update({
      guess_submitted: true,
      guess_order: guessOrder,
    })
    .eq('id', playerId);

  if (!error) return;

  const { error: fallbackError } = await supabase
    .from('rank_up_players')
    .update({ guess_submitted: true })
    .eq('id', playerId);

  if (fallbackError) throw fallbackError;
}

export async function updatePlayerScore(playerId: string, score: number): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('rank_up_players')
    .update({ score })
    .eq('id', playerId);

  if (error) throw error;
}

export function subscribeToRoom(
  roomCode: string,
  onRoom: (room: RankUpRoom) => void,
  onPlayers: (players: RankUpPlayer[]) => void,
  onError: (message: string) => void,
): () => void {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();

  void fetchRoom(code).then((room) => {
    if (room) onRoom(room);
  });
  void fetchPlayers(code).then(onPlayers);

  const channel = supabase
    .channel(`rank-up-${code}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'rank_up_rooms', filter: `code=eq.${code}` },
      (payload) => {
        if (payload.new) onRoom(mapRoom(payload.new as never));
      },
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'rank_up_players', filter: `room_code=eq.${code}` },
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
  const code = roomCode.toUpperCase();

  const { error: playerError } = await supabase
    .from('rank_up_players')
    .delete()
    .eq('id', playerId);
  if (playerError) throw playerError;

  const players = await fetchPlayers(code);
  if (players.length === 0) {
    const { error: roomError } = await supabase.from('rank_up_rooms').delete().eq('code', code);
    if (roomError) throw roomError;
  }
}
