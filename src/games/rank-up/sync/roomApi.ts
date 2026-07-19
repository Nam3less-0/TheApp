import type { RealtimeChannel } from '@supabase/supabase-js';
import { getSupabase } from '../../../lib/supabase';
import { buildTeamTurnOrder, isTeamsMode } from '../teams';
import { scoreRoundPoints, shuffleIds } from '../utils';
import type { QuestionType, RankOption } from '../types';
import {
  mapPlayer,
  mapRoom,
  mapTeam,
  type GameMode,
  type RankUpPlayer,
  type RankUpRoom,
  type RankUpTeam,
  type TeamDraftOrder,
} from './types';

export const HOST_PRESENCE_KEY = 'host-device';

export interface SubscribeToRoomOptions {
  /** Host device: track read-only spectator presence on join. */
  trackHostPresence?: Record<string, unknown>;
  /** Player clients: notified when a host device is connected. */
  onHostDeviceConnected?: (connected: boolean) => void;
  /** Teams mode: team roster updates. */
  onTeams?: (teams: RankUpTeam[]) => void;
}

function isHostDeviceConnected(channel: RealtimeChannel): boolean {
  const state = channel.presenceState();
  const hostEntries = state[HOST_PRESENCE_KEY];
  return Boolean(hostEntries && Object.keys(hostEntries).length > 0);
}

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

export async function fetchTeams(roomCode: string): Promise<RankUpTeam[]> {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();
  const { data, error } = await supabase
    .from('rank_up_teams')
    .select('*')
    .eq('room_code', code)
    .order('accent', { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => mapTeam(row as never));
}

async function createTeamsForRoom(code: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from('rank_up_teams').insert([
    { id: `${code}-a`, room_code: code, name: 'Team A', accent: 'a' },
    { id: `${code}-b`, room_code: code, name: 'Team B', accent: 'b' },
  ]);

  if (error) throw error;
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

export async function createRoom(
  playerId: string,
  playerName: string,
  gameMode: GameMode = 'classic',
): Promise<RankUpRoom> {
  await clearStalePlayerMembership(playerId);

  const supabase = getSupabase();
  const code = await uniqueRoomCode();

  const { error: roomError } = await supabase.from('rank_up_rooms').insert({
    code,
    host_player_id: playerId,
    ranker_player_id: playerId,
    phase: 'lobby',
    options: [],
    turn_order: [],
    turn_index: 0,
    round_number: 1,
    game_mode: gameMode,
  });

  if (roomError) throw roomError;

  if (gameMode === 'teams') {
    await createTeamsForRoom(code);
  }

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

  if (room.gameMode === 'teams') {
    const existingPlayers = await fetchPlayers(roomCode);
    if (existingPlayers.length >= 4 && !existingPlayers.some((player) => player.id === playerId)) {
      throw new Error('2v2 needs exactly 4 players. This room is full.');
    }
  }

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

export async function assignPlayerToTeam(playerId: string, teamId: string | null): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('rank_up_players')
    .update({ team_id: teamId })
    .eq('id', playerId);

  if (error) throw error;
}

export async function persistTeamDraftOrder(
  roomCode: string,
  draft: TeamDraftOrder,
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('rank_up_rooms')
    .update({ team_draft_order: draft })
    .eq('code', roomCode.toUpperCase());

  if (error) throw error;
}

async function clearTeamDraftOrder(code: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('rank_up_rooms')
    .update({ team_draft_order: null })
    .eq('code', code);

  if (error) throw error;
}

export async function startRound(roomCode: string, playerIds: string[]): Promise<void> {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();
  const room = await fetchRoom(code);
  if (!room) throw new Error('Room not found.');

  const isFirstRoundStart = room.turnOrder.length === 0;
  let turnOrder: string[];

  if (isTeamsMode(room)) {
    const players = await fetchPlayers(code);
    const teams = await fetchTeams(code);
    const teamA = teams.find((team) => team.accent === 'a');
    const teamB = teams.find((team) => team.accent === 'b');
    if (!teamA || !teamB) throw new Error('Teams are not configured for this room.');

    const teamAIds = players.filter((player) => player.teamId === teamA.id).map((player) => player.id);
    const teamBIds = players.filter((player) => player.teamId === teamB.id).map((player) => player.id);
    if (teamAIds.length !== 2 || teamBIds.length !== 2) {
      throw new Error('2v2 needs exactly 2 players per team before starting.');
    }

    turnOrder = buildTeamTurnOrder(teamAIds, teamBIds);
  } else {
    turnOrder = shuffleIds([...playerIds]);
  }

  const { error } = await supabase
    .from('rank_up_rooms')
    .update({
      turn_order: turnOrder,
      turn_index: 0,
      round_number: isFirstRoundStart ? room.roundNumber : room.roundNumber + 1,
      ranker_player_id: turnOrder[0] ?? null,
      phase: 'lobby',
      question_type: null,
      prompt: null,
      options: [],
      ranker_order: null,
      team_draft_order: null,
    })
    .eq('code', code);

  if (error) throw error;

  await resetGuessSubmissions(roomCode);
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

export async function revealAnswer(roomCode: string, rankerOrder: string[]): Promise<void> {
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

  if (isTeamsMode(room)) {
    await scoreTeamsReveal(code, room, existingPlayers, rankerOrder);
    return;
  }

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

async function scoreTeamsReveal(
  code: string,
  room: RankUpRoom,
  players: RankUpPlayer[],
  rankerOrder: string[],
): Promise<void> {
  const supabase = getSupabase();
  const ranker = players.find((player) => player.id === room.rankerPlayerId);
  if (!ranker?.teamId) return;

  const rankerTeammate = players.find(
    (player) => player.teamId === ranker.teamId && player.id !== ranker.id,
  );
  const opposingTeamId = (await fetchTeams(code)).find((team) => team.id !== ranker.teamId)?.id;
  if (!opposingTeamId) return;

  const rankerTeamGuessOrder =
    rankerTeammate?.guessOrder && rankerTeammate.guessOrder.length > 0
      ? rankerTeammate.guessOrder
      : [];
  const opposingMember = players.find(
    (player) => player.teamId === opposingTeamId && (player.guessOrder?.length ?? 0) > 0,
  );
  const opposingGuessOrder = opposingMember?.guessOrder ?? [];

  const candidateOrders = [rankerTeamGuessOrder, opposingGuessOrder].filter(
    (order) => order.length === rankerOrder.length,
  );

  const rankerTeamPoints =
    rankerTeamGuessOrder.length > 0
      ? scoreRoundPoints(rankerTeamGuessOrder, rankerOrder, candidateOrders)
      : 0;
  const opposingPoints =
    opposingGuessOrder.length > 0
      ? scoreRoundPoints(opposingGuessOrder, rankerOrder, candidateOrders)
      : 0;

  await Promise.all(
    players.map(async (player) => {
      let points = 0;
      if (player.teamId === ranker.teamId) points = rankerTeamPoints;
      else if (player.teamId === opposingTeamId) points = opposingPoints;

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

async function clearRoundFields(code: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('rank_up_rooms')
    .update({
      question_type: null,
      prompt: null,
      options: [],
      ranker_order: null,
      team_draft_order: null,
    })
    .eq('code', code);

  if (error) throw error;
}

export async function advanceTurn(roomCode: string): Promise<void> {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();
  const room = await fetchRoom(code);
  if (!room) throw new Error('Room not found.');

  const nextIndex = room.turnIndex + 1;

  if (nextIndex < room.turnOrder.length) {
    const nextRankerId = room.turnOrder[nextIndex]!;

    const { error } = await supabase
      .from('rank_up_rooms')
      .update({
        turn_index: nextIndex,
        ranker_player_id: nextRankerId,
        phase: 'lobby',
      })
      .eq('code', code);

    if (error) throw error;

    await clearRoundFields(code);
    await resetGuessSubmissions(roomCode);
    return;
  }

  const { error } = await supabase
    .from('rank_up_rooms')
    .update({
      phase: 'round-recap',
    })
    .eq('code', code);

  if (error) throw error;

  await clearRoundFields(code);
}

/** Host-only: reset the whole session for everyone back to pre-round-1 lobby. */
export async function abandonGame(roomCode: string): Promise<void> {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();
  const room = await fetchRoom(code);
  if (!room) throw new Error('Room not found.');

  const { error: roomError } = await supabase
    .from('rank_up_rooms')
    .update({
      phase: 'lobby',
      turn_order: [],
      turn_index: 0,
      round_number: 1,
      ranker_player_id: room.hostPlayerId,
      question_type: null,
      prompt: null,
      options: [],
      ranker_order: null,
    })
    .eq('code', code);

  if (roomError) throw roomError;

  const { error: playersError } = await supabase
    .from('rank_up_players')
    .update({
      score: 0,
      guess_submitted: false,
      guess_order: null,
      last_round_points: null,
    })
    .eq('room_code', code);

  if (playersError) throw playersError;
}

export async function abandonCurrentTurn(roomCode: string): Promise<void> {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();
  const room = await fetchRoom(code);
  if (!room?.rankerPlayerId) throw new Error('Room not found.');

  const { error } = await supabase
    .from('rank_up_rooms')
    .update({
      phase: 'lobby',
      question_type: null,
      prompt: null,
      options: [],
      ranker_order: null,
      team_draft_order: null,
    })
    .eq('code', code);

  if (error) throw error;

  await resetGuessSubmissions(roomCode);
}

async function resetGuessSubmissions(roomCode: string): Promise<void> {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();

  await clearTeamDraftOrder(code);

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

export async function markTeamGuessSubmitted(
  roomCode: string,
  playerIds: string[],
  guessOrder: string[],
): Promise<void> {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();

  const { error } = await supabase
    .from('rank_up_players')
    .update({
      guess_submitted: true,
      guess_order: guessOrder,
    })
    .in('id', playerIds);

  if (error) throw error;

  await clearTeamDraftOrder(code);
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
  options?: SubscribeToRoomOptions,
): () => void {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();

  void fetchRoom(code).then((room) => {
    if (room) onRoom(room);
  });
  void fetchPlayers(code).then(onPlayers);
  if (options?.onTeams) {
    void fetchTeams(code).then(options.onTeams);
  }

  const channel = supabase.channel(
    `rank-up-${code}`,
    options?.trackHostPresence
      ? { config: { presence: { key: HOST_PRESENCE_KEY } } }
      : undefined,
  );

  channel
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
    );

  if (options?.onTeams) {
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'rank_up_teams', filter: `room_code=eq.${code}` },
      () => {
        void fetchTeams(code).then(options.onTeams!).catch(() => {
          onError('Could not refresh teams.');
        });
      },
    );
  }

  if (options?.onHostDeviceConnected) {
    const notifyHostPresence = () => {
      options.onHostDeviceConnected!(isHostDeviceConnected(channel));
    };

    channel
      .on('presence', { event: 'sync' }, notifyHostPresence)
      .on('presence', { event: 'join' }, notifyHostPresence)
      .on('presence', { event: 'leave' }, notifyHostPresence);
  }

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      if (options?.trackHostPresence) {
        void channel.track(options.trackHostPresence);
      }
      if (options?.onHostDeviceConnected) {
        options.onHostDeviceConnected(isHostDeviceConnected(channel));
      }
    }

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

  const room = await fetchRoom(code);

  if (room) {
    const leavingIndex = room.turnOrder.indexOf(playerId);
    if (leavingIndex > room.turnIndex) {
      const nextTurnOrder = room.turnOrder.filter((id) => id !== playerId);
      const { error: turnOrderError } = await supabase
        .from('rank_up_rooms')
        .update({ turn_order: nextTurnOrder })
        .eq('code', code);

      if (turnOrderError) throw turnOrderError;
    }
  }

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
