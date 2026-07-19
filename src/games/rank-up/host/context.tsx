import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { formatSupabaseError, isSupabaseConfigured } from '../../../lib/supabase';
import {
  abandonCurrentTurn,
  abandonGame as abandonGameRoom,
  advanceTurn,
  fetchRoom,
  revealAnswer,
  startRound,
  subscribeToRoom,
  isGameroomRoom,
} from '../sync/roomApi';
import { isAwaitingRoundStart, type RankUpPlayer, type RankUpRoom } from '../sync/types';

interface RankUpHostContextValue {
  roomCode: string | null;
  room: RankUpRoom | null;
  players: RankUpPlayer[];
  syncError: string | null;
  isConnecting: boolean;
  supabaseReady: boolean;
  submittedCount: number;
  guesserCount: number;
  roundNumber: number;
  turnIndex: number;
  isLastTurnOfRound: boolean;
  awaitingRoundStart: boolean;
  roundPointsByPlayer: Record<string, number>;
  isGameroom: boolean;
  connectToRoom: (code: string) => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
  startNewRound: () => Promise<void>;
  revealRound: () => Promise<void>;
  advanceTurn: () => Promise<void>;
  skipCurrentTurn: () => Promise<void>;
  abandonRound: () => Promise<void>;
  abandonGame: () => Promise<void>;
}

const RankUpHostContext = createContext<RankUpHostContextValue | null>(null);

export function RankUpHostProvider({ children }: { children: ReactNode }) {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [room, setRoom] = useState<RankUpRoom | null>(null);
  const [players, setPlayers] = useState<RankUpPlayer[]>([]);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [roundPointsByPlayer, setRoundPointsByPlayer] = useState<Record<string, number>>({});

  const lastAccumulatedRevealKey = useRef<string | null>(null);
  const trackedRoundNumber = useRef<number | null>(null);

  const guesserCount = players.filter((player) => player.id !== room?.rankerPlayerId).length;
  const submittedCount = players.filter(
    (player) => player.id !== room?.rankerPlayerId && player.guessSubmitted,
  ).length;
  const roundNumber = room?.roundNumber ?? 1;
  const turnOrder = room?.turnOrder ?? [];
  const turnIndex = room?.turnIndex ?? 0;
  const isLastTurnOfRound =
    turnOrder.length > 0 && turnIndex === turnOrder.length - 1;
  const awaitingRoundStart = Boolean(room && isAwaitingRoundStart(room));
  const isGameroom = isGameroomRoom(room);

  useEffect(() => {
    if (!roomCode || !isSupabaseConfigured()) return;

    return subscribeToRoom(
      roomCode,
      setRoom,
      setPlayers,
      (message) => setSyncError(message),
      {
        trackHostPresence: { role: 'host', joinedAt: Date.now() },
      },
    );
  }, [roomCode]);

  useEffect(() => {
    if (!room) return;

    if (trackedRoundNumber.current !== room.roundNumber) {
      trackedRoundNumber.current = room.roundNumber;
      setRoundPointsByPlayer({});
      lastAccumulatedRevealKey.current = null;
    }
  }, [room?.roundNumber, room]);

  useEffect(() => {
    if (room?.phase !== 'reveal' || !room.rankerOrder?.length) return;

    const allScored = players
      .filter((player) => player.id !== room.rankerPlayerId)
      .every((player) => player.lastRoundPoints != null || !player.guessSubmitted);

    if (!allScored) return;

    const key = `${room.roundNumber}:${room.turnIndex}:${room.rankerOrder.join(',')}:points`;
    if (lastAccumulatedRevealKey.current === key) return;
    lastAccumulatedRevealKey.current = key;

    setRoundPointsByPlayer((prev) => {
      const next = { ...prev };
      for (const player of players) {
        if (player.id === room.rankerPlayerId) continue;
        if (player.lastRoundPoints != null) {
          next[player.id] = (next[player.id] ?? 0) + player.lastRoundPoints;
        }
      }
      return next;
    });
  }, [room?.phase, room?.rankerOrder, room?.rankerPlayerId, room?.roundNumber, room?.turnIndex, players, room]);

  const connectToRoom = useCallback(async (code: string) => {
    if (!isSupabaseConfigured()) {
      setSyncError('Supabase is not configured.');
      return;
    }

    const normalized = code.toUpperCase().trim();
    if (normalized.length !== 4) {
      setSyncError('Enter a valid 4-letter room code.');
      return;
    }

    setIsConnecting(true);
    setSyncError(null);

    try {
      const existing = await fetchRoom(normalized);
      if (!existing) {
        setSyncError('Room not found. Check the code and try again.');
        return;
      }

      setRoomCode(normalized);
      setRoom(existing);
    } catch (error) {
      setSyncError(formatSupabaseError(error, 'Could not connect to room.'));
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setRoomCode(null);
    setRoom(null);
    setPlayers([]);
    setSyncError(null);
    setRoundPointsByPlayer({});
    lastAccumulatedRevealKey.current = null;
    trackedRoundNumber.current = null;
  }, []);

  const clearError = useCallback(() => {
    setSyncError(null);
  }, []);

  const startNewRound = useCallback(async () => {
    if (!roomCode) return;
    try {
      await startRound(
        roomCode,
        players.map((player) => player.id),
      );
      setSyncError(null);
    } catch (error) {
      setSyncError(formatSupabaseError(error, 'Could not start round.'));
    }
  }, [roomCode, players]);

  const revealRound = useCallback(async () => {
    if (!roomCode) return;
    try {
      await revealAnswer(roomCode);
      setSyncError(null);
    } catch (error) {
      setSyncError(formatSupabaseError(error, 'Could not reveal answer.'));
    }
  }, [roomCode]);

  const advanceTurnAction = useCallback(async () => {
    if (!roomCode) return;
    try {
      await advanceTurn(roomCode);
      setSyncError(null);
    } catch (error) {
      setSyncError(formatSupabaseError(error, 'Could not advance turn.'));
    }
  }, [roomCode]);

  const skipCurrentTurn = useCallback(async () => {
    await advanceTurnAction();
  }, [advanceTurnAction]);

  const abandonRound = useCallback(async () => {
    if (!roomCode) return;
    try {
      await abandonCurrentTurn(roomCode);
      setSyncError(null);
    } catch (error) {
      setSyncError(formatSupabaseError(error, 'Could not abandon round.'));
    }
  }, [roomCode]);

  const abandonGame = useCallback(async () => {
    if (!roomCode) return;
    try {
      await abandonGameRoom(roomCode);
      setRoundPointsByPlayer({});
      lastAccumulatedRevealKey.current = null;
      trackedRoundNumber.current = null;
      setSyncError(null);
    } catch (error) {
      setSyncError(formatSupabaseError(error, 'Could not abandon game.'));
    }
  }, [roomCode]);

  const value = useMemo(
    (): RankUpHostContextValue => ({
      roomCode,
      room,
      players,
      syncError,
      isConnecting,
      supabaseReady: isSupabaseConfigured(),
      submittedCount,
      guesserCount,
      roundNumber,
      turnIndex,
      isLastTurnOfRound,
      awaitingRoundStart,
      roundPointsByPlayer,
      isGameroom,
      connectToRoom,
      disconnect,
      clearError,
      startNewRound,
      revealRound,
      advanceTurn: advanceTurnAction,
      skipCurrentTurn,
      abandonRound,
      abandonGame,
    }),
    [
      roomCode,
      room,
      players,
      syncError,
      isConnecting,
      submittedCount,
      guesserCount,
      roundNumber,
      turnIndex,
      isLastTurnOfRound,
      awaitingRoundStart,
      roundPointsByPlayer,
      isGameroom,
      connectToRoom,
      disconnect,
      clearError,
      startNewRound,
      revealRound,
      advanceTurnAction,
      skipCurrentTurn,
      abandonRound,
      abandonGame,
    ],
  );

  return <RankUpHostContext.Provider value={value}>{children}</RankUpHostContext.Provider>;
}

export function useRankUpHost() {
  const ctx = useContext(RankUpHostContext);
  if (!ctx) {
    throw new Error('useRankUpHost must be used within RankUpHostProvider');
  }
  return ctx;
}
