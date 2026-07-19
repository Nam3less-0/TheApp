import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useRankUp } from './context';
import type { RankOption } from './types';

export interface RoundHistoryEntry {
  prompt: string;
  options: RankOption[];
  rankerOrder: string[];
  rankerName: string;
}

interface SessionUIContextValue {
  roundHistory: RoundHistoryEntry[];
  roundPointsByPlayer: Record<string, number>;
}

const SessionUIContext = createContext<SessionUIContextValue | null>(null);

export function SessionUIProvider({ children }: { children: ReactNode }) {
  const { room, players, local } = useRankUp();
  const [roundHistory, setRoundHistory] = useState<RoundHistoryEntry[]>([]);
  const [roundPointsByPlayer, setRoundPointsByPlayer] = useState<Record<string, number>>({});
  const lastRecordedKey = useRef<string | null>(null);
  const lastAccumulatedRevealKey = useRef<string | null>(null);
  const trackedRoundNumber = useRef<number | null>(null);

  useEffect(() => {
    if (local.localPhase === 'setup' || !local.roomCode) {
      setRoundHistory([]);
      setRoundPointsByPlayer({});
      lastRecordedKey.current = null;
      lastAccumulatedRevealKey.current = null;
      trackedRoundNumber.current = null;
    }
  }, [local.localPhase, local.roomCode]);

  useEffect(() => {
    if (!room) return;

    if (trackedRoundNumber.current !== room.roundNumber) {
      trackedRoundNumber.current = room.roundNumber;
      setRoundPointsByPlayer({});
      lastAccumulatedRevealKey.current = null;
    }
  }, [room?.roundNumber, room]);

  useEffect(() => {
    if (room?.phase !== 'reveal' || !room.rankerOrder?.length || !room.prompt) return;

    const key = `${room.roundNumber}:${room.turnIndex}:${room.prompt}:${room.rankerOrder.join(',')}`;
    if (lastRecordedKey.current === key) return;
    lastRecordedKey.current = key;

    const ranker = players.find((player) => player.id === room.rankerPlayerId);

    setRoundHistory((prev) => [
      ...prev,
      {
        prompt: room.prompt!,
        options: room.options,
        rankerOrder: room.rankerOrder!,
        rankerName: ranker?.name ?? 'Ranker',
      },
    ]);
  }, [
    room?.phase,
    room?.prompt,
    room?.rankerOrder,
    room?.options,
    room?.rankerPlayerId,
    room?.roundNumber,
    room?.turnIndex,
    players,
    room,
  ]);

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

  const value = useMemo(
    () => ({ roundHistory, roundPointsByPlayer }),
    [roundHistory, roundPointsByPlayer],
  );

  return <SessionUIContext.Provider value={value}>{children}</SessionUIContext.Provider>;
}

export function useSessionUI() {
  const ctx = useContext(SessionUIContext);
  if (!ctx) {
    throw new Error('useSessionUI must be used within SessionUIProvider');
  }
  return ctx;
}
