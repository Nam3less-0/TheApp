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
import { imposterReducer, initialImposterState } from './reducer';
import {
  clearSession,
  getOrCreatePlayerId,
  loadSession,
  persistSession,
} from './storage';
import {
  advanceReveal,
  buildSession,
  createRoom,
  goToVote,
  joinRoom,
  leaveRoom,
  markRevealReady,
  nextRound,
  playAgain,
  revealImposter,
  selectVote,
  setTotalRounds,
  startGame,
  submitRedemption,
  subscribeToRoom,
} from './sync/roomApi';
import type { ImposterRoom, ImposterRoomPlayer } from './sync/types';
import type { ImposterAction, ImposterSession } from './types';

export type ImposterLocalPhase = 'setup' | 'local' | 'synced';

interface ImposterContextValue {
  state: ImposterSession;
  dispatch: Dispatch<ImposterAction>;
  localPhase: ImposterLocalPhase;
  room: ImposterRoom | null;
  roomPlayers: ImposterRoomPlayer[];
  playerId: string | null;
  playerName: string | null;
  roomCode: string | null;
  myPlayer: ImposterRoomPlayer | null;
  isHost: boolean;
  isImposter: boolean;
  synced: boolean;
  supabaseReady: boolean;
  syncError: string | null;
  connecting: boolean;
  revealReadyIds: string[];
  createGame: (playerName: string) => Promise<void>;
  joinGame: (roomCode: string, playerName: string) => Promise<void>;
  leaveGame: () => Promise<void>;
  updateTotalRounds: (rounds: number) => Promise<void>;
  startSyncedGame: () => Promise<void>;
  playLocally: () => void;
  markReady: () => Promise<void>;
  advanceRevealTurn: () => Promise<void>;
  goToVotePhase: () => Promise<void>;
  castVote: (targetId: string) => Promise<void>;
  revealVote: () => Promise<void>;
  submitRedemptionGuess: (word: string) => Promise<void>;
  advanceRound: () => Promise<void>;
  restartGame: () => Promise<void>;
}

const ImposterContext = createContext<ImposterContextValue | null>(null);

export function ImposterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(imposterReducer, initialImposterState);
  const [localPhase, setLocalPhase] = useState<ImposterLocalPhase>('setup');
  const [room, setRoom] = useState<ImposterRoom | null>(null);
  const [roomPlayers, setRoomPlayers] = useState<ImposterRoomPlayer[]>([]);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const synced = localPhase === 'synced' && Boolean(roomCode);
  const supabaseReady = isSupabaseConfigured();
  const isHost = Boolean(room && playerId && room.hostPlayerId === playerId);
  const myPlayer = roomPlayers.find((player) => player.id === playerId) ?? null;
  const isImposter = Boolean(myPlayer?.isImposter);
  const revealReadyIds = room?.revealReadyIds ?? [];

  useEffect(() => {
    const session = loadSession();
    if (!session || !isSupabaseConfigured()) return;

    setPlayerId(session.playerId);
    setPlayerName(session.playerName);
    setRoomCode(session.roomCode);
    setLocalPhase('synced');
  }, []);

  useEffect(() => {
    if (!roomCode || !playerId || !playerName || localPhase !== 'synced') return;
    persistSession({ playerId, playerName, roomCode });
  }, [roomCode, playerId, playerName, localPhase]);

  useEffect(() => {
    if (!roomCode || localPhase !== 'synced') return;

    return subscribeToRoom(
      roomCode,
      setRoom,
      setRoomPlayers,
      (message) => setSyncError(message),
    );
  }, [roomCode, localPhase]);

  useEffect(() => {
    if (!synced || !room) return;
    const session = buildSession(room, roomPlayers);
    dispatch({ type: 'SYNC_STATE', payload: session });
  }, [synced, room, roomPlayers]);

  const createGame = useCallback(async (name: string) => {
    if (!isSupabaseConfigured()) {
      setSyncError('Supabase is not configured.');
      return;
    }

    setConnecting(true);
    setSyncError(null);
    try {
      const id = getOrCreatePlayerId();
      const created = await createRoom(id, name.trim());
      setPlayerId(id);
      setPlayerName(name.trim());
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
      const id = getOrCreatePlayerId();
      await joinRoom(code, id, name.trim());
      setPlayerId(id);
      setPlayerName(name.trim());
      setRoomCode(code.toUpperCase());
      setLocalPhase('synced');
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Could not join room.');
    } finally {
      setConnecting(false);
    }
  }, []);

  const leaveGame = useCallback(async () => {
    if (playerId && roomCode) {
      try {
        await leaveRoom(playerId, roomCode);
      } catch {
        // Best effort
      }
    }

    clearSession();
    setRoom(null);
    setRoomPlayers([]);
    setPlayerId(null);
    setPlayerName(null);
    setRoomCode(null);
    setSyncError(null);
    setLocalPhase('setup');
    dispatch({ type: 'RESET' });
  }, [playerId, roomCode]);

  const updateTotalRounds = useCallback(
    async (rounds: number) => {
      if (!roomCode) return;
      setSyncError(null);
      try {
        await setTotalRounds(roomCode, rounds);
      } catch (error) {
        setSyncError(error instanceof Error ? error.message : 'Could not update rounds.');
      }
    },
    [roomCode],
  );

  const startSyncedGame = useCallback(async () => {
    if (!roomCode || !room) return;
    setSyncError(null);
    try {
      await startGame(roomCode, room.totalRounds);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Could not start game.');
    }
  }, [roomCode, room]);

  const playLocally = useCallback(() => {
    setLocalPhase('local');
    setSyncError(null);
  }, []);

  const markReady = useCallback(async () => {
    if (!synced || !roomCode || !playerId) return;
    setSyncError(null);
    try {
      await markRevealReady(roomCode, playerId);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Could not mark ready.');
    }
  }, [synced, roomCode, playerId]);

  const advanceRevealTurn = useCallback(async () => {
    if (!synced || !roomCode) {
      dispatch({ type: 'ADVANCE_REVEAL' });
      return;
    }
    setSyncError(null);
    try {
      await advanceReveal(roomCode);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Could not advance reveal.');
    }
  }, [synced, roomCode]);

  const goToVotePhase = useCallback(async () => {
    if (!synced || !roomCode) {
      dispatch({ type: 'GO_TO_VOTE' });
      return;
    }
    setSyncError(null);
    try {
      await goToVote(roomCode);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Could not start voting.');
    }
  }, [synced, roomCode]);

  const castVote = useCallback(
    async (targetId: string) => {
      if (!synced || !roomCode) {
        dispatch({ type: 'SELECT_VOTE', playerId: targetId });
        return;
      }
      setSyncError(null);
      try {
        await selectVote(roomCode, targetId);
      } catch (error) {
        setSyncError(error instanceof Error ? error.message : 'Could not record vote.');
      }
    },
    [synced, roomCode],
  );

  const revealVote = useCallback(async () => {
    if (!synced || !roomCode) {
      dispatch({ type: 'REVEAL_IMPOSTER' });
      return;
    }
    setSyncError(null);
    try {
      await revealImposter(roomCode);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Could not reveal imposter.');
    }
  }, [synced, roomCode]);

  const submitRedemptionGuess = useCallback(
    async (word: string) => {
      if (!synced || !roomCode) {
        dispatch({ type: 'SUBMIT_REDEMPTION', word });
        return;
      }
      setSyncError(null);
      try {
        await submitRedemption(roomCode, word);
      } catch (error) {
        setSyncError(error instanceof Error ? error.message : 'Could not submit guess.');
      }
    },
    [synced, roomCode],
  );

  const advanceRound = useCallback(async () => {
    if (!synced || !roomCode) {
      dispatch({ type: 'NEXT_ROUND' });
      return;
    }
    setSyncError(null);
    try {
      await nextRound(roomCode);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Could not start next round.');
    }
  }, [synced, roomCode]);

  const restartGame = useCallback(async () => {
    if (!synced || !roomCode) {
      dispatch({ type: 'PLAY_AGAIN' });
      return;
    }
    setSyncError(null);
    try {
      await playAgain(roomCode);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Could not restart game.');
    }
  }, [synced, roomCode]);

  const value = useMemo(
    (): ImposterContextValue => ({
      state,
      dispatch,
      localPhase,
      room,
      roomPlayers,
      playerId,
      playerName,
      roomCode,
      myPlayer,
      isHost,
      isImposter,
      synced,
      supabaseReady,
      syncError,
      connecting,
      revealReadyIds,
      createGame,
      joinGame,
      leaveGame,
      updateTotalRounds,
      startSyncedGame,
      playLocally,
      markReady,
      advanceRevealTurn,
      goToVotePhase,
      castVote,
      revealVote,
      submitRedemptionGuess,
      advanceRound,
      restartGame,
    }),
    [
      state,
      localPhase,
      room,
      roomPlayers,
      playerId,
      playerName,
      roomCode,
      myPlayer,
      isHost,
      isImposter,
      synced,
      supabaseReady,
      syncError,
      connecting,
      revealReadyIds,
      createGame,
      joinGame,
      leaveGame,
      updateTotalRounds,
      startSyncedGame,
      playLocally,
      markReady,
      advanceRevealTurn,
      goToVotePhase,
      castVote,
      revealVote,
      submitRedemptionGuess,
      advanceRound,
      restartGame,
    ],
  );

  return (
    <ImposterContext.Provider value={value}>{children}</ImposterContext.Provider>
  );
}

export function useImposter() {
  const ctx = useContext(ImposterContext);
  if (!ctx) {
    throw new Error('useImposter must be used within ImposterProvider');
  }
  return ctx;
}
