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
}

const SessionUIContext = createContext<SessionUIContextValue | null>(null);

export function SessionUIProvider({ children }: { children: ReactNode }) {
  const { room, players, local } = useRankUp();
  const [roundHistory, setRoundHistory] = useState<RoundHistoryEntry[]>([]);
  const lastRecordedKey = useRef<string | null>(null);

  useEffect(() => {
    if (local.localPhase === 'setup' || !local.roomCode) {
      setRoundHistory([]);
      lastRecordedKey.current = null;
    }
  }, [local.localPhase, local.roomCode]);

  useEffect(() => {
    if (room?.phase !== 'reveal' || !room.rankerOrder?.length || !room.prompt) return;

    const key = `${room.prompt}:${room.rankerOrder.join(',')}`;
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
  }, [room?.phase, room?.prompt, room?.rankerOrder, room?.options, room?.rankerPlayerId, players]);

  const value = useMemo(() => ({ roundHistory }), [roundHistory]);

  return <SessionUIContext.Provider value={value}>{children}</SessionUIContext.Provider>;
}

export function useSessionUI() {
  const ctx = useContext(SessionUIContext);
  if (!ctx) {
    throw new Error('useSessionUI must be used within SessionUIProvider');
  }
  return ctx;
}
