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
  fetchPlayers,
  joinRoom,
  leaveRoom,
  markGuessSubmitted,
  publishDisplay,
  resetToLobby,
  revealAnswer,
  setRanker,
  startGuessing,
  subscribeToRoom,
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
  submitGuess: (order: string[]) => Promise<void>;
}

const RankUpContext = createContext<RankUpContextValue | null>(null);

export function RankUpProvider({ children }: { children: ReactNode }) {
  const [local, dispatch] = useReducer(localReducer, initialLocalState);
  const [room, setRoom] = useState<RankUpRoom | null>(null);
  const [players, setPlayers] = useState<RankUpPlayer[]>([]);

  const isRanker = Boolean(room && local.playerId && room.rankerPlayerId === local.playerId);
  const isHost = Boolean(room && local.playerId && room.hostPlayerId === local.playerId);
  const myPlayer = players.find((player) => player.id === local.playerId) ?? null;
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
    if (local.localPhase === 'setup' || !local.playerId || !local.roomCode) return;

    function handlePageHide() {
      void leaveRoom(local.playerId, local.roomCode!);
      clearSession();
      clearPendingOrder(local.roomCode!);
    }

    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, [local.localPhase, local.playerId, local.roomCode]);

  useEffect(() => {
    if (!room || isRanker) return;

    if (room.phase === 'lobby' && local.localPhase !== 'lobby' && local.localPhase !== 'setup') {
      dispatch({ type: 'RETURN_TO_LOBBY' });
    }
  }, [room?.phase, isRanker, local.localPhase, room]);

  useEffect(() => {
    if (!myPlayer || myPlayer.score === local.score) return;
    dispatch({ type: 'SYNC_SCORE', score: myPlayer.score });
  }, [myPlayer?.score, local.score, myPlayer]);

  useEffect(() => {
    if (!myPlayer?.guessSubmitted || !myPlayer.guessOrder?.length) return;
    if (local.localPhase === 'guess-submitted') return;
    if (room?.phase === 'lobby' || !room) return;
    dispatch({ type: 'SUBMIT_GUESS', guessOrder: myPlayer.guessOrder });
  }, [
    myPlayer?.guessSubmitted,
    myPlayer?.guessOrder,
    room?.phase,
    local.localPhase,
    myPlayer,
    room,
  ]);

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
      if (!local.roomCode || !local.roundDraft) {
        dispatch({
          type: 'SET_SYNC_ERROR',
          message: 'Round setup was lost. Cancel and start the round again.',
        });
        return;
      }

      savePendingOrder(local.roomCode, order);
      const draft = local.roundDraft;

      try {
        const updatedRoom = await publishDisplay(local.roomCode, {
          questionType: draft.type,
          prompt: draft.prompt,
          options: draft.options,
          rankerPlayerId: local.playerId,
        });
        setRoom(updatedRoom);
        const updatedPlayers = await fetchPlayers(local.roomCode);
        setPlayers(updatedPlayers);
        dispatch({ type: 'RETURN_TO_LOBBY' });
        dispatch({ type: 'SET_SYNC_ERROR', message: null });
      } catch (error) {
        dispatch({
          type: 'SET_SYNC_ERROR',
          message: error instanceof Error ? error.message : 'Could not publish round.',
        });
      }
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
    try {
      await revealAnswer(local.roomCode, order);
      clearPendingOrder(local.roomCode);
      dispatch({ type: 'SET_SYNC_ERROR', message: null });
    } catch (error) {
      dispatch({
        type: 'SET_SYNC_ERROR',
        message: error instanceof Error ? error.message : 'Could not reveal answer.',
      });
    }
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

  const submitGuess = useCallback(
    async (order: string[]) => {
      try {
        await markGuessSubmitted(local.playerId, order);
        dispatch({ type: 'SUBMIT_GUESS', guessOrder: order });
      } catch (error) {
        dispatch({
          type: 'SET_SYNC_ERROR',
          message: error instanceof Error ? error.message : 'Could not submit guess.',
        });
      }
    },
    [local.playerId],
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
      submitGuess,
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
      submitGuess,
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
