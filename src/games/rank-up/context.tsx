import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { initialLocalState, localReducer, type LocalState, type QuestionType, type RankOption } from './types';
import {
  clearPendingOrder,
  clearSession,
  getOrCreatePlayerId,
  loadPendingOrder,
  loadSession,
  persistSessionFromState,
  savePendingOrder,
} from './storage';
import {
  createRoom,
  joinRoom,
  leaveRoom,
  markGuessSubmitted,
  publishDisplay,
  resetToLobby,
  revealAnswer,
  setRanker,
  startGuessing,
  subscribeToRoom,
  updatePlayerScore,
} from './sync/roomApi';
import type { RankUpPlayer, RankUpRoom } from './sync/types';

interface RankUpContextValue {
  local: LocalState;
  room: RankUpRoom | null;
  players: RankUpPlayer[];
  isRanker: boolean;
  isHost: boolean;
  supabaseReady: boolean;
  submittedCount: number;
  guesserCount: number;
  createGame: (playerName: string) => Promise<void>;
  joinGame: (roomCode: string, playerName: string) => Promise<void>;
  leaveGame: () => Promise<void>;
  beginCompose: () => void;
  confirmCompose: (questionType: QuestionType, prompt: string, options: RankOption[]) => void;
  confirmRankerOrder: (order: string[]) => Promise<void>;
  openGuessing: () => Promise<void>;
  revealRound: () => Promise<void>;
  nextRound: (nextRankerId?: string) => Promise<void>;
  abandonRound: () => Promise<void>;
  assignRanker: (playerId: string) => Promise<void>;
  startGuessingLocal: () => void;
  beginSelfScore: () => void;
  submitGuess: (order: string[]) => Promise<void>;
  selfScore: (points: 0 | 1 | 3) => Promise<void>;
}

const RankUpContext = createContext<RankUpContextValue | null>(null);

export function RankUpProvider({ children }: { children: ReactNode }) {
  const [local, dispatch] = useReducer(localReducer, initialLocalState);
  const [room, setRoom] = useState<RankUpRoom | null>(null);
  const [players, setPlayers] = useState<RankUpPlayer[]>([]);

  const isRanker = Boolean(room && local.playerId && room.rankerPlayerId === local.playerId);
  const isHost = Boolean(room && local.playerId && room.hostPlayerId === local.playerId);
  const guesserCount = players.filter((player) => player.id !== room?.rankerPlayerId).length;
  const submittedCount = players.filter(
    (player) => player.id !== room?.rankerPlayerId && player.guessSubmitted,
  ).length;

  useEffect(() => {
    if (local.localPhase === 'setup') return;
    persistSessionFromState(local);
  }, [local]);

  useEffect(() => {
    const session = loadSession();
    if (!session || !isSupabaseConfigured()) return;

    dispatch({
      type: 'ENTER_LOBBY',
      playerId: session.playerId,
      playerName: session.playerName,
      roomCode: session.roomCode,
      score: session.score,
    });
  }, []);

  useEffect(() => {
    if (!local.roomCode || !isSupabaseConfigured()) return;

    return subscribeToRoom(
      local.roomCode,
      setRoom,
      setPlayers,
      (message) => dispatch({ type: 'SET_SYNC_ERROR', message }),
    );
  }, [local.roomCode]);

  useEffect(() => {
    if (!room) return;

    if (room.phase === 'lobby' && local.localPhase !== 'lobby' && local.localPhase !== 'setup') {
      dispatch({ type: 'RETURN_TO_LOBBY' });
    }
  }, [room?.phase, local.localPhase, room]);

  const createGame = useCallback(async (playerName: string) => {
    if (!isSupabaseConfigured()) {
      dispatch({ type: 'SET_SYNC_ERROR', message: 'Supabase is not configured.' });
      return;
    }

    dispatch({ type: 'SET_CONNECTING', value: true });
    try {
      const playerId = getOrCreatePlayerId();
      const created = await createRoom(playerId, playerName.trim());
      dispatch({
        type: 'ENTER_LOBBY',
        playerId,
        playerName: playerName.trim(),
        roomCode: created.code,
      });
    } catch (error) {
      dispatch({
        type: 'SET_SYNC_ERROR',
        message: error instanceof Error ? error.message : 'Could not create room.',
      });
    }
  }, []);

  const joinGame = useCallback(async (roomCode: string, playerName: string) => {
    if (!isSupabaseConfigured()) {
      dispatch({ type: 'SET_SYNC_ERROR', message: 'Supabase is not configured.' });
      return;
    }

    dispatch({ type: 'SET_CONNECTING', value: true });
    try {
      const playerId = getOrCreatePlayerId();
      const joined = await joinRoom(roomCode, playerId, playerName.trim());
      dispatch({
        type: 'ENTER_LOBBY',
        playerId,
        playerName: playerName.trim(),
        roomCode: joined.code,
      });
    } catch (error) {
      dispatch({
        type: 'SET_SYNC_ERROR',
        message: error instanceof Error ? error.message : 'Could not join room.',
      });
    }
  }, []);

  const leaveGame = useCallback(async () => {
    if (local.playerId && local.roomCode) {
      try {
        await leaveRoom(local.playerId, local.roomCode);
      } catch {
        // Still clear local session if network fails.
      }
    }
    clearSession();
    if (local.roomCode) clearPendingOrder(local.roomCode);
    dispatch({ type: 'RESET' });
    setRoom(null);
    setPlayers([]);
  }, [local.playerId, local.roomCode]);

  const beginCompose = useCallback(() => {
    dispatch({ type: 'BEGIN_COMPOSE' });
  }, []);

  const confirmCompose = useCallback(
    (questionType: QuestionType, prompt: string, options: RankOption[]) => {
      dispatch({
        type: 'ENTER_RANKER_RANK',
        draft: { type: questionType, prompt, options },
      });
    },
    [],
  );

  const confirmRankerOrder = useCallback(
    async (order: string[]) => {
      if (!local.roomCode || !local.roundDraft) return;
      savePendingOrder(local.roomCode, order);
      await publishDisplay(local.roomCode, {
        questionType: local.roundDraft.type,
        prompt: local.roundDraft.prompt,
        options: local.roundDraft.options,
        rankerPlayerId: local.playerId,
      });
      dispatch({ type: 'RETURN_TO_LOBBY' });
    },
    [local.roomCode, local.roundDraft, local.playerId],
  );

  const openGuessing = useCallback(async () => {
    if (!local.roomCode) return;
    await startGuessing(local.roomCode);
  }, [local.roomCode]);

  const revealRound = useCallback(async () => {
    if (!local.roomCode) return;
    const order = loadPendingOrder(local.roomCode);
    if (!order) {
      dispatch({ type: 'SET_SYNC_ERROR', message: 'Ranker order not found on this device.' });
      return;
    }
    await revealAnswer(local.roomCode, order);
    clearPendingOrder(local.roomCode);
  }, [local.roomCode]);

  const nextRound = useCallback(
    async (nextRankerId?: string) => {
      if (!local.roomCode) return;
      const rankerId = nextRankerId ?? local.playerId;
      await resetToLobby(local.roomCode, rankerId);
      dispatch({ type: 'RETURN_TO_LOBBY' });
    },
    [local.roomCode, local.playerId],
  );

  const abandonRound = useCallback(async () => {
    if (!room) return;

    if (room.phase === 'lobby') {
      dispatch({ type: 'RETURN_TO_LOBBY' });
      return;
    }

    if (!local.roomCode || (!isHost && !isRanker)) return;

    const rankerId = room.rankerPlayerId ?? local.playerId;
    await resetToLobby(local.roomCode, rankerId);
    clearPendingOrder(local.roomCode);
    dispatch({ type: 'RETURN_TO_LOBBY' });
  }, [local.roomCode, local.playerId, room, isHost, isRanker]);

  const assignRanker = useCallback(
    async (playerId: string) => {
      if (!local.roomCode) return;
      await setRanker(local.roomCode, playerId);
    },
    [local.roomCode],
  );

  const startGuessingLocal = useCallback(() => {
    dispatch({ type: 'ENTER_GUESSING' });
  }, []);

  const beginSelfScore = useCallback(() => {
    dispatch({ type: 'ENTER_SCORE_SELF' });
  }, []);

  const submitGuess = useCallback(
    async (order: string[]) => {
      dispatch({ type: 'SUBMIT_GUESS', guessOrder: order });
      await markGuessSubmitted(local.playerId);
    },
    [local.playerId],
  );

  const selfScore = useCallback(
    async (points: 0 | 1 | 3) => {
      const nextScore = local.score + points;
      dispatch({ type: 'ADD_SCORE', points });
      await updatePlayerScore(local.playerId, nextScore);
    },
    [local.playerId, local.score],
  );

  const value = useMemo(
    (): RankUpContextValue => ({
      local,
      room,
      players,
      isRanker,
      isHost,
      supabaseReady: isSupabaseConfigured(),
      submittedCount,
      guesserCount,
      createGame,
      joinGame,
      leaveGame,
      beginCompose,
      confirmCompose,
      confirmRankerOrder,
      openGuessing,
      revealRound,
      nextRound,
      abandonRound,
      assignRanker,
      startGuessingLocal,
      beginSelfScore,
      submitGuess,
      selfScore,
    }),
    [
      local,
      room,
      players,
      isRanker,
      isHost,
      submittedCount,
      guesserCount,
      createGame,
      joinGame,
      leaveGame,
      beginCompose,
      confirmCompose,
      confirmRankerOrder,
      openGuessing,
      revealRound,
      nextRound,
      abandonRound,
      assignRanker,
      startGuessingLocal,
      beginSelfScore,
      submitGuess,
      selfScore,
    ],
  );

  return <RankUpContext.Provider value={value}>{children}</RankUpContext.Provider>;
}

export function useRankUp() {
  const ctx = useContext(RankUpContext);
  if (!ctx) {
    throw new Error('useRankUp must be used within RankUpProvider');
  }
  return ctx;
}

/** @deprecated use useRankUp().local — kept briefly for screen migration */
export function useRankUpLocal() {
  return useRankUp().local;
}
