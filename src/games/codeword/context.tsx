import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { codewordReducer, initialCodewordState } from './reducer';
import {
  clearSession,
  clearTeamCard,
  getOrCreateTeamId,
  loadSession,
  loadTeamCard,
  persistSession,
  saveTeamCard,
} from './storage';
import {
  beginSetup,
  createRoom,
  joinRoom,
  leaveRoom,
  lockTeamCard,
  logInterceptTurn,
  logTransmitTurn,
  resetRoom,
  subscribeToRoom,
} from './sync/roomApi';
import type { CodewordRoom, CodewordTeam } from './sync/types';
import type { CodewordAction, CodewordState, TeamCard } from './types';
import { LOSE_THRESHOLD, WIN_THRESHOLD } from './utils';

export type CodewordLocalPhase = 'setup' | 'local' | 'synced';

interface CodewordContextValue {
  state: CodewordState;
  dispatch: Dispatch<CodewordAction>;
  localPhase: CodewordLocalPhase;
  room: CodewordRoom | null;
  teams: CodewordTeam[];
  teamId: string | null;
  teamName: string | null;
  roomCode: string | null;
  isHost: boolean;
  isTransmitting: boolean;
  synced: boolean;
  supabaseReady: boolean;
  syncError: string | null;
  connecting: boolean;
  opponentTeam: CodewordTeam | null;
  createGame: (teamName: string) => Promise<void>;
  joinGame: (roomCode: string, teamName: string) => Promise<void>;
  leaveGame: () => Promise<void>;
  startSetup: () => Promise<void>;
  lockCard: (card: TeamCard) => Promise<void>;
  playLocally: () => void;
  logOurTurn: (
    code: import('./types').CodeTriple,
    hints: [string, string, string],
    outcome: 'correct' | 'wrong',
  ) => Promise<void>;
  logIntercept: (
    hintsHeard: [string, string, string],
    actualCode: import('./types').CodeTriple,
    outcome: 'intercepted' | 'missed',
  ) => Promise<void>;
  resetSyncedGame: (card: TeamCard) => Promise<void>;
}

const CodewordContext = createContext<CodewordContextValue | null>(null);

function deriveGameStatus(
  misses: number,
  intercepts: number,
): CodewordState['gameStatus'] {
  if (intercepts >= WIN_THRESHOLD) return 'won';
  if (misses >= LOSE_THRESHOLD) return 'lost';
  return 'in-progress';
}

export function CodewordProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(codewordReducer, initialCodewordState);
  const [localPhase, setLocalPhase] = useState<CodewordLocalPhase>('setup');
  const [room, setRoom] = useState<CodewordRoom | null>(null);
  const [teams, setTeams] = useState<CodewordTeam[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const synced = localPhase === 'synced' && Boolean(roomCode);
  const supabaseReady = isSupabaseConfigured();
  const isHost = Boolean(room && teamId && room.hostTeamId === teamId);
  const isTransmitting = Boolean(
    synced && room && teamId && room.transmittingTeamId === teamId,
  );
  const myTeam = teams.find((team) => team.id === teamId) ?? null;
  const opponentTeam = teams.find((team) => team.id !== teamId) ?? null;

  useEffect(() => {
    const session = loadSession();
    if (!session || !isSupabaseConfigured()) return;

    setTeamId(session.teamId);
    setTeamName(session.teamName);
    setRoomCode(session.roomCode);
    setLocalPhase('synced');

    const card = loadTeamCard(session.roomCode);
    if (card) {
      dispatch({ type: 'START_GAME', card });
    }
  }, []);

  useEffect(() => {
    if (!roomCode || !teamId || !teamName || localPhase === 'local' || localPhase === 'setup') {
      return;
    }
    persistSession({ teamId, teamName, roomCode });
  }, [roomCode, teamId, teamName, localPhase]);

  useEffect(() => {
    if (!roomCode || localPhase === 'local' || localPhase === 'setup') return;

    return subscribeToRoom(
      roomCode,
      setRoom,
      setTeams,
      (message) => setSyncError(message),
    );
  }, [roomCode, localPhase]);

  useEffect(() => {
    if (!synced || !room || !myTeam) return;

    const card = loadTeamCard(room.code) ?? state.teamCard;
    const gameStatus =
      room.phase === 'over'
        ? room.winnerTeamId === teamId
          ? 'won'
          : 'lost'
        : deriveGameStatus(myTeam.misses, myTeam.intercepts);

    const phase =
      room.phase === 'over'
        ? 'over'
        : room.phase === 'playing' && card
          ? 'playing'
          : state.phase;

    dispatch({
      type: 'SYNC_STATE',
      payload: {
        phase,
        teamCard: card,
        ourMisses: myTeam.misses,
        ourIntercepts: myTeam.intercepts,
        currentRound: room.currentRound,
        gameStatus,
      },
    });
  }, [
    synced,
    room?.phase,
    room?.currentRound,
    room?.winnerTeamId,
    room?.code,
    myTeam?.misses,
    myTeam?.intercepts,
    teamId,
  ]);

  const createGame = useCallback(async (name: string) => {
    if (!isSupabaseConfigured()) {
      setSyncError('Supabase is not configured.');
      return;
    }

    setConnecting(true);
    setSyncError(null);
    try {
      const id = getOrCreateTeamId();
      const created = await createRoom(id, name.trim());
      setTeamId(id);
      setTeamName(name.trim());
      setRoomCode(created.code);
      setLocalPhase('synced');
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Could not create room.');
    } finally {
      setConnecting(false);
    }
  }, []);

  const joinGame = useCallback(async (code: string, name: string) => {
    if (!isSupabaseConfigured()) {
      setSyncError('Supabase is not configured.');
      return;
    }

    setConnecting(true);
    setSyncError(null);
    try {
      const id = getOrCreateTeamId();
      const joined = await joinRoom(code, id, name.trim());
      setTeamId(id);
      setTeamName(name.trim());
      setRoomCode(joined.code);
      setLocalPhase('synced');
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Could not join room.');
    } finally {
      setConnecting(false);
    }
  }, []);

  const leaveGame = useCallback(async () => {
    if (teamId && roomCode) {
      try {
        await leaveRoom(teamId, roomCode);
      } catch {
        // Best effort cleanup
      }
      clearTeamCard(roomCode);
    }

    clearSession();
    setRoom(null);
    setTeams([]);
    setTeamId(null);
    setTeamName(null);
    setRoomCode(null);
    setSyncError(null);
    setLocalPhase('setup');
    dispatch({ type: 'RESET' });
  }, [teamId, roomCode]);

  const startSetup = useCallback(async () => {
    if (!roomCode) return;
    setSyncError(null);
    try {
      await beginSetup(roomCode);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Could not start setup.');
    }
  }, [roomCode]);

  const lockCard = useCallback(
    async (card: TeamCard) => {
      if (!teamId || !roomCode) {
        dispatch({ type: 'START_GAME', card });
        return;
      }

      saveTeamCard(roomCode, card);
      dispatch({ type: 'START_GAME', card });
      setSyncError(null);
      try {
        await lockTeamCard(teamId);
      } catch (error) {
        setSyncError(error instanceof Error ? error.message : 'Could not lock card.');
      }
    },
    [teamId, roomCode],
  );

  const playLocally = useCallback(() => {
    setLocalPhase('local');
    setSyncError(null);
  }, []);

  const logOurTurn = useCallback(
    async (
      code: import('./types').CodeTriple,
      hints: [string, string, string],
      outcome: 'correct' | 'wrong',
    ) => {
      dispatch({ type: 'LOG_OUR_TURN', code, hints, outcome, skipScore: synced });

      if (!synced || !roomCode || !teamId) return;

      setSyncError(null);
      try {
        await logTransmitTurn(roomCode, teamId, outcome);
      } catch (error) {
        setSyncError(error instanceof Error ? error.message : 'Could not sync turn.');
      }
    },
    [synced, roomCode, teamId],
  );

  const logIntercept = useCallback(
    async (
      hintsHeard: [string, string, string],
      actualCode: import('./types').CodeTriple,
      outcome: 'intercepted' | 'missed',
    ) => {
      dispatch({ type: 'LOG_INTERCEPT', hintsHeard, actualCode, outcome, skipScore: synced });

      if (!synced || !roomCode || !teamId) return;

      setSyncError(null);
      try {
        await logInterceptTurn(roomCode, teamId, outcome);
      } catch (error) {
        setSyncError(error instanceof Error ? error.message : 'Could not sync intercept.');
      }
    },
    [synced, roomCode, teamId],
  );

  const resetSyncedGame = useCallback(
    async (card: TeamCard) => {
      if (!roomCode || !room) return;

      saveTeamCard(roomCode, card);
      dispatch({ type: 'PREPARE_REMATCH', card });
      setSyncError(null);
      try {
        await resetRoom(roomCode, room.hostTeamId);
        await lockTeamCard(teamId!);
      } catch (error) {
        setSyncError(error instanceof Error ? error.message : 'Could not reset game.');
      }
    },
    [roomCode, room, teamId],
  );

  const value = useMemo(
    (): CodewordContextValue => ({
      state,
      dispatch,
      localPhase,
      room,
      teams,
      teamId,
      teamName,
      roomCode,
      isHost,
      isTransmitting,
      synced,
      supabaseReady,
      syncError,
      connecting,
      opponentTeam,
      createGame,
      joinGame,
      leaveGame,
      startSetup,
      lockCard,
      playLocally,
      logOurTurn,
      logIntercept,
      resetSyncedGame,
    }),
    [
      state,
      localPhase,
      room,
      teams,
      teamId,
      teamName,
      roomCode,
      isHost,
      isTransmitting,
      synced,
      supabaseReady,
      syncError,
      connecting,
      opponentTeam,
      createGame,
      joinGame,
      leaveGame,
      startSetup,
      lockCard,
      playLocally,
      logOurTurn,
      logIntercept,
      resetSyncedGame,
    ],
  );

  return (
    <CodewordContext.Provider value={value}>{children}</CodewordContext.Provider>
  );
}

export function useCodeword() {
  const ctx = useContext(CodewordContext);
  if (!ctx) {
    throw new Error('useCodeword must be used within CodewordProvider');
  }
  return ctx;
}
