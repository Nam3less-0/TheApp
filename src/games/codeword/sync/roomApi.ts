import { getSupabase } from '../../../lib/supabase';
import { LOSE_THRESHOLD, WIN_THRESHOLD } from '../utils';
import { mapRoom, mapTeam, type CodewordRoom, type CodewordTeam } from './types';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

export function createTeamId(): string {
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
    .from('codeword_rooms')
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

export async function fetchRoom(code: string): Promise<CodewordRoom | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('codeword_rooms')
    .select('*')
    .eq('code', code.toUpperCase())
    .maybeSingle();

  if (error) throw error;
  return data ? mapRoom(data as never) : null;
}

export async function fetchTeams(roomCode: string): Promise<CodewordTeam[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('codeword_teams')
    .select('*')
    .eq('room_code', roomCode.toUpperCase())
    .order('slot', { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => mapTeam(row as never));
}

export async function createRoom(teamId: string, teamName: string): Promise<CodewordRoom> {
  const supabase = getSupabase();
  const code = await uniqueRoomCode();

  const { error: roomError } = await supabase.from('codeword_rooms').insert({
    code,
    host_team_id: teamId,
    transmitting_team_id: teamId,
    phase: 'lobby',
  });

  if (roomError) throw roomError;

  const { error: teamError } = await supabase.from('codeword_teams').insert({
    id: teamId,
    room_code: code,
    name: teamName,
    slot: 1,
  });

  if (teamError) throw teamError;

  const room = await fetchRoom(code);
  if (!room) throw new Error('Room was not created.');
  return room;
}

export async function joinRoom(
  code: string,
  teamId: string,
  teamName: string,
): Promise<CodewordRoom> {
  const supabase = getSupabase();
  const roomCode = code.toUpperCase();
  const room = await fetchRoom(roomCode);
  if (!room) throw new Error('Room not found. Check the code and try again.');
  if (room.phase !== 'lobby') {
    throw new Error('This game has already started.');
  }

  const teams = await fetchTeams(roomCode);
  if (teams.length >= 2) {
    throw new Error('This room already has two teams.');
  }

  const { error } = await supabase.from('codeword_teams').insert({
    id: teamId,
    room_code: roomCode,
    name: teamName,
    slot: 2,
  });

  if (error) {
    if (error.code === '23505') {
      throw new Error('You are already in this room on another tab.');
    }
    throw error;
  }

  return room;
}

export async function beginSetup(roomCode: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('codeword_rooms')
    .update({ phase: 'setup' })
    .eq('code', roomCode.toUpperCase());

  if (error) throw error;
}

export async function lockTeamCard(teamId: string): Promise<void> {
  const supabase = getSupabase();
  const { data: teamRow, error: teamError } = await supabase
    .from('codeword_teams')
    .update({ card_locked: true })
    .eq('id', teamId)
    .select('room_code')
    .single();

  if (teamError) throw teamError;

  const roomCode = (teamRow as { room_code: string }).room_code;
  const teams = await fetchTeams(roomCode);
  const allLocked = teams.length === 2 && teams.every((team) => team.cardLocked);

  if (!allLocked) return;

  const room = await fetchRoom(roomCode);
  if (!room) return;

  const { error: roomError } = await supabase
    .from('codeword_rooms')
    .update({
      phase: 'playing',
      transmitting_team_id: room.hostTeamId,
      current_round: 1,
    })
    .eq('code', roomCode.toUpperCase());

  if (roomError) throw roomError;
}

function otherTeamId(teams: CodewordTeam[], teamId: string): string | null {
  const other = teams.find((team) => team.id !== teamId);
  return other?.id ?? null;
}

async function finishRound(
  roomCode: string,
  teamId: string,
  teams: CodewordTeam[],
): Promise<void> {
  const supabase = getSupabase();
  const room = await fetchRoom(roomCode);
  if (!room) return;

  const nextTeamId = otherTeamId(teams, teamId) ?? teamId;
  const myTeam = teams.find((team) => team.id === teamId);
  if (!myTeam) return;

  let winnerTeamId: string | null = null;
  if (myTeam.intercepts >= WIN_THRESHOLD) {
    winnerTeamId = teamId;
  } else if (myTeam.misses >= LOSE_THRESHOLD) {
    winnerTeamId = otherTeamId(teams, teamId);
  }

  const { error } = await supabase
    .from('codeword_rooms')
    .update({
      current_round: room.currentRound + 1,
      transmitting_team_id: nextTeamId,
      phase: winnerTeamId ? 'over' : 'playing',
      winner_team_id: winnerTeamId,
    })
    .eq('code', roomCode.toUpperCase());

  if (error) throw error;
}

export async function logTransmitTurn(
  roomCode: string,
  teamId: string,
  outcome: 'correct' | 'wrong',
): Promise<void> {
  const supabase = getSupabase();
  const room = await fetchRoom(roomCode);
  if (!room) throw new Error('Room not found.');
  if (room.phase !== 'playing') throw new Error('Game is not in progress.');
  if (room.transmittingTeamId !== teamId) {
    throw new Error('It is not your team\'s turn to transmit.');
  }

  const teams = await fetchTeams(roomCode);
  const myTeam = teams.find((team) => team.id === teamId);
  if (!myTeam) throw new Error('Team not found.');

  const misses = outcome === 'wrong' ? myTeam.misses + 1 : myTeam.misses;

  const { error } = await supabase
    .from('codeword_teams')
    .update({ misses })
    .eq('id', teamId);

  if (error) throw error;

  const updatedTeams = teams.map((team) =>
    team.id === teamId ? { ...team, misses } : team,
  );
  await finishRound(roomCode, teamId, updatedTeams);
}

export async function logInterceptTurn(
  roomCode: string,
  teamId: string,
  outcome: 'intercepted' | 'missed',
): Promise<void> {
  const supabase = getSupabase();
  const room = await fetchRoom(roomCode);
  if (!room) throw new Error('Room not found.');
  if (room.phase !== 'playing') throw new Error('Game is not in progress.');
  if (room.transmittingTeamId === teamId) {
    throw new Error('You cannot intercept on your own transmission turn.');
  }

  const teams = await fetchTeams(roomCode);
  const myTeam = teams.find((team) => team.id === teamId);
  if (!myTeam) throw new Error('Team not found.');

  const intercepts =
    outcome === 'intercepted' ? myTeam.intercepts + 1 : myTeam.intercepts;

  const { error: teamError } = await supabase
    .from('codeword_teams')
    .update({ intercepts })
    .eq('id', teamId);

  if (teamError) throw teamError;

  if (intercepts >= WIN_THRESHOLD) {
    const { error: roomError } = await supabase
      .from('codeword_rooms')
      .update({ phase: 'over', winner_team_id: teamId })
      .eq('code', roomCode.toUpperCase());

    if (roomError) throw roomError;
  }
}

export async function resetRoom(roomCode: string, hostTeamId: string): Promise<void> {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();

  const { error: roomError } = await supabase
    .from('codeword_rooms')
    .update({
      phase: 'setup',
      transmitting_team_id: hostTeamId,
      current_round: 1,
      winner_team_id: null,
    })
    .eq('code', code);

  if (roomError) throw roomError;

  const { error: teamsError } = await supabase
    .from('codeword_teams')
    .update({ misses: 0, intercepts: 0, card_locked: false })
    .eq('room_code', code);

  if (teamsError) throw teamsError;
}

export function subscribeToRoom(
  roomCode: string,
  onRoom: (room: CodewordRoom) => void,
  onTeams: (teams: CodewordTeam[]) => void,
  onError: (message: string) => void,
): () => void {
  const supabase = getSupabase();
  const code = roomCode.toUpperCase();

  void fetchRoom(code).then((room) => {
    if (room) onRoom(room);
  });
  void fetchTeams(code).then(onTeams);

  const channel = supabase
    .channel(`codeword-${code}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'codeword_rooms', filter: `code=eq.${code}` },
      (payload) => {
        if (payload.new) onRoom(mapRoom(payload.new as never));
      },
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'codeword_teams', filter: `room_code=eq.${code}` },
      () => {
        void fetchTeams(code).then(onTeams).catch(() => {
          onError('Could not refresh teams.');
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

export async function leaveRoom(teamId: string, roomCode: string): Promise<void> {
  const supabase = getSupabase();
  await supabase.from('codeword_teams').delete().eq('id', teamId);

  const teams = await fetchTeams(roomCode);
  if (teams.length === 0) {
    await supabase.from('codeword_rooms').delete().eq('code', roomCode.toUpperCase());
  }
}
