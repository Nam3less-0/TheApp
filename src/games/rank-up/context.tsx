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
import { formatSupabaseError, isSupabaseConfigured } from '../../lib/supabase';
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
  abandonCurrentTurn,
  abandonGame as abandonGameRoom,
  advanceTurn,
  assignPlayerToTeam,
  createRoom,
  fetchPlayers,
  joinRoom,
  leaveRoom,
  markGuessSubmitted,
  markTeamGuessSubmitted,
  publishDisplay,
  revealAnswer,
  startRound,
  subscribeToRoom,
  isGameroomRoom,
} from './sync/roomApi';
import {
  isAwaitingRoundStart,
  type GameMode,
  type RankUpPlayer,
  type RankUpRoom,
  type RankUpTeam,
} from './sync/types';
import {
  getTeamsGuessRole,
  isTeamFormationComplete,
  isTeamsMode,
  teamsGuessProgress,
} from './teams';

interface RankUpContextValue {
  local: LocalState;
  room: RankUpRoom | null;
  players: RankUpPlayer[];
  teams: RankUpTeam[];
  isTeamsGame: boolean;
  teamFormationComplete: boolean;
  teamsGuessRole: ReturnType<typeof getTeamsGuessRole> | null;
  isRanker: boolean;
  isHost: boolean;
  canStartRound: boolean;
  supabaseReady: boolean;
  submittedCount: number;
  guesserCount: number;
  hostDeviceConnected: boolean;
  turnOrder: string[];
  turnIndex: number;
  roundNumber: number;
  isLastTurnOfRound: boolean;
  awaitingRoundStart: boolean;
  createGame: (playerName: string, gameMode?: GameMode) => Promise<void>;
  joinGame: (roomCode: string, playerName: string) => Promise<void>;
  assignPlayerTeam: (playerId: string, teamId: string | null) => Promise<void>;
  leaveGame: () => Promise<void>;
  beginCompose: () => void;
  confirmCompose: (questionType: QuestionType, prompt: string, options: RankOption[]) => void;
  confirmRankerOrder: (order: string[]) => Promise<void>;
  revealRound: () => Promise<void>;
  advanceTurn: () => Promise<void>;
  startNewRound: () => Promise<void>;
  skipCurrentTurn: () => Promise<void>;
  abandonRound: () => Promise<void>;
  abandonGame: () => Promise<void>;
  submitGuess: (order: string[]) => Promise<void>;
  submitTeamGuess: (order: string[], teammateIds: string[]) => Promise<void>;
}

const RankUpContext = createContext<RankUpContextValue | null>(null);

export function RankUpProvider({ children }: { children: ReactNode }) {
  const [local, dispatch] = useReducer(localReducer, initialLocalState);
  const [room, setRoom] = useState<RankUpRoom | null>(null);
  const [players, setPlayers] = useState<RankUpPlayer[]>([]);
  const [teams, setTeams] = useState<RankUpTeam[]>([]);
  const [hostDeviceConnected, setHostDeviceConnected] = useState(false);

  const isTeamsGame = isTeamsMode(room);
  const teamFormationComplete = isTeamFormationComplete(players, teams);
  const teamsGuessRole =
    room && isTeamsGame && local.playerId
      ? getTeamsGuessRole(room, players, teams, local.playerId)
      : null;

  const isRanker = Boolean(room && local.playerId && room.rankerPlayerId === local.playerId);
  const isHost = Boolean(room && local.playerId && room.hostPlayerId === local.playerId);
  const gameroom = isGameroomRoom(room);
  const isFirstPlayer = Boolean(
    local.playerId && players.length > 0 && players[0]?.id === local.playerId,
  );
  const canStartRound = Boolean(
    room &&
      (isHost || (gameroom && !hostDeviceConnected && isFirstPlayer)),
  );
  const myPlayer = players.find((player) => player.id === local.playerId) ?? null;
  const teamsProgress = room && isTeamsGame ? teamsGuessProgress(room, players, teams) : null;
  const guesserCount =
    teamsProgress?.guesserCount ??
    players.filter((player) => player.id !== room?.rankerPlayerId).length;
  const submittedCount =
    teamsProgress?.submittedCount ??
    players.filter(
      (player) => player.id !== room?.rankerPlayerId && player.guessSubmitted,
    ).length;

  const turnOrder = room?.turnOrder ?? [];
  const turnIndex = room?.turnIndex ?? 0;
  const roundNumber = room?.roundNumber ?? 1;
  const isLastTurnOfRound =
    turnOrder.length > 0 && turnIndex === turnOrder.length - 1;
  const awaitingRoundStart = Boolean(room && isAwaitingRoundStart(room));

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

    setHostDeviceConnected(false);
    setTeams([]);

    return subscribeToRoom(
      local.roomCode,
      setRoom,
      setPlayers,
      (message) => dispatch({ type: 'SET_SYNC_ERROR', message }),
      {
        onHostDeviceConnected: setHostDeviceConnected,
        onTeams: setTeams,
      },
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
    if (!room || !awaitingRoundStart) return;
    if (local.localPhase === 'lobby' || local.localPhase === 'setup') return;
    dispatch({ type: 'RETURN_TO_LOBBY' });
  }, [awaitingRoundStart, local.localPhase, room]);

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

  const createGame = useCallback(async (playerName: string, gameMode: GameMode = 'classic') => {
    if (!isSupabaseConfigured()) {
      dispatch({ type: 'SET_SYNC_ERROR', message: 'Supabase is not configured.' });
      return;
    }

    dispatch({ type: 'SET_CONNECTING', value: true });
    try {
      const playerId = getOrCreatePlayerId();
      const created = await createRoom(playerId, playerName.trim(), gameMode);
      dispatch({
        type: 'ENTER_LOBBY',
        playerId,
        playerName: playerName.trim(),
        roomCode: created.code,
      });
    } catch (error) {
      dispatch({
        type: 'SET_SYNC_ERROR',
        message: formatSupabaseError(error, 'Could not create room.'),
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
        message: formatSupabaseError(error, 'Could not join room.'),
      });
    }
  }, []);

  const assignPlayerTeamAction = useCallback(async (targetPlayerId: string, teamId: string | null) => {
    try {
      await assignPlayerToTeam(targetPlayerId, teamId);
      dispatch({ type: 'SET_SYNC_ERROR', message: null });
    } catch (error) {
      dispatch({
        type: 'SET_SYNC_ERROR',
        message: formatSupabaseError(error, 'Could not update team assignment.'),
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
    setTeams([]);
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
          message: formatSupabaseError(error, 'Could not publish round.'),
        });
      }
    },
    [local.roomCode, local.roundDraft, local.playerId],
  );

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
        message: formatSupabaseError(error, 'Could not reveal answer.'),
      });
    }
  }, [local.roomCode]);

  const advanceTurnAction = useCallback(async () => {
    if (!local.roomCode) return;
    await advanceTurn(local.roomCode);
    dispatch({ type: 'RETURN_TO_LOBBY' });
  }, [local.roomCode]);

  const startNewRound = useCallback(async () => {
    if (!local.roomCode || !canStartRound) return;
    await startRound(
      local.roomCode,
      players.map((player) => player.id),
    );
    dispatch({ type: 'RETURN_TO_LOBBY' });
  }, [local.roomCode, players, canStartRound]);

  const skipCurrentTurn = useCallback(async () => {
    if (!local.roomCode || !isHost) return;
    await advanceTurn(local.roomCode);
    dispatch({ type: 'RETURN_TO_LOBBY' });
  }, [local.roomCode, isHost]);

  const abandonRound = useCallback(async () => {
    if (!room) return;

    if (room.phase === 'lobby') {
      dispatch({ type: 'RETURN_TO_LOBBY' });
      return;
    }

    if (!local.roomCode || (!isHost && !isRanker)) return;

    await abandonCurrentTurn(local.roomCode);
    clearPendingOrder(local.roomCode);
    dispatch({ type: 'RETURN_TO_LOBBY' });
  }, [local.roomCode, room, isHost, isRanker]);

  const abandonGame = useCallback(async () => {
    if (!local.roomCode || !isHost) return;

    await abandonGameRoom(local.roomCode);
    clearPendingOrder(local.roomCode);
    dispatch({ type: 'RETURN_TO_LOBBY' });
    dispatch({ type: 'SYNC_SCORE', score: 0 });
  }, [local.roomCode, isHost]);

  const submitGuess = useCallback(
    async (order: string[]) => {
      try {
        await markGuessSubmitted(local.playerId, order);
        dispatch({ type: 'SUBMIT_GUESS', guessOrder: order });
      } catch (error) {
        dispatch({
          type: 'SET_SYNC_ERROR',
          message: formatSupabaseError(error, 'Could not submit guess.'),
        });
      }
    },
    [local.playerId],
  );

  const submitTeamGuess = useCallback(
    async (order: string[], teammateIds: string[]) => {
      if (!local.roomCode) return;
      try {
        await markTeamGuessSubmitted(local.roomCode, teammateIds, order);
        dispatch({ type: 'SUBMIT_GUESS', guessOrder: order });
      } catch (error) {
        dispatch({
          type: 'SET_SYNC_ERROR',
          message: formatSupabaseError(error, 'Could not submit team guess.'),
        });
      }
    },
    [local.roomCode],
  );

  const value = useMemo(
    (): RankUpContextValue => ({
      local,
      room,
      players,
      teams,
      isTeamsGame,
      teamFormationComplete,
      teamsGuessRole,
      isRanker,
      isHost,
      canStartRound,
      supabaseReady: isSupabaseConfigured(),
      submittedCount,
      guesserCount,
      hostDeviceConnected,
      turnOrder,
      turnIndex,
      roundNumber,
      isLastTurnOfRound,
      awaitingRoundStart,
      createGame,
      joinGame,
      assignPlayerTeam: assignPlayerTeamAction,
      leaveGame,
      beginCompose,
      confirmCompose,
      confirmRankerOrder,
      revealRound,
      advanceTurn: advanceTurnAction,
      startNewRound,
      skipCurrentTurn,
      abandonRound,
      abandonGame,
      submitGuess,
      submitTeamGuess,
    }),
    [
      local,
      room,
      players,
      teams,
      isTeamsGame,
      teamFormationComplete,
      teamsGuessRole,
      isRanker,
      isHost,
      canStartRound,
      submittedCount,
      guesserCount,
      hostDeviceConnected,
      turnOrder,
      turnIndex,
      roundNumber,
      isLastTurnOfRound,
      awaitingRoundStart,
      createGame,
      joinGame,
      assignPlayerTeamAction,
      leaveGame,
      beginCompose,
      confirmCompose,
      confirmRankerOrder,
      revealRound,
      advanceTurnAction,
      startNewRound,
      skipCurrentTurn,
      abandonRound,
      abandonGame,
      submitGuess,
      submitTeamGuess,
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
