import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { jeopardyReducer, initialJeopardyState } from './reducer';
import type { GameSettings, JeopardyAction, JeopardySession, Player } from './types';
import { defaultSettings } from './utils';

function coerceSnipe(value: unknown): number {
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.round(value));
  }
  return 0;
}

function coercePlayer(
  player: Player,
  settings: GameSettings,
): Player {
  return {
    ...player,
    streak: typeof player.streak === 'number' ? player.streak : 0,
    secondWind: Boolean(player.secondWind),
    lifelines: {
      phoneAFriend:
        typeof player.lifelines?.phoneAFriend === 'number'
          ? player.lifelines.phoneAFriend
          : settings.phoneAFriendUses,
      whatChoices:
        typeof player.lifelines?.whatChoices === 'number'
          ? player.lifelines.whatChoices
          : settings.whatChoicesUses,
      snipe: coerceSnipe(player.lifelines?.snipe),
    },
  };
}

interface JeopardyContextValue {
  state: JeopardySession;
  dispatch: Dispatch<JeopardyAction>;
}

const JeopardyContext = createContext<JeopardyContextValue | null>(null);

const STORAGE_KEY = 'jeopardy-session-v1';

/** Restore an in-progress game from sessionStorage so a refresh doesn't lose it. */
function loadPersistedState(): JeopardySession {
  if (typeof window === 'undefined') return initialJeopardyState;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialJeopardyState;
    const parsed = JSON.parse(raw) as Partial<JeopardySession>;
    if (!parsed || typeof parsed !== 'object' || !parsed.phase) {
      return initialJeopardyState;
    }
    // Merge onto defaults so older/newer shapes don't crash the reducer.
    const settings = { ...defaultSettings(), ...(parsed.settings ?? {}) };
    return {
      ...initialJeopardyState,
      ...parsed,
      settings,
      players: Array.isArray(parsed.players)
        ? parsed.players.map((player) => coercePlayer(player, settings))
        : [],
      pendingPlayers: Array.isArray(parsed.pendingPlayers)
        ? parsed.pendingPlayers.map((player) => coercePlayer(player, settings))
        : [],
      revealedColumnIds: Array.isArray(parsed.revealedColumnIds)
        ? parsed.revealedColumnIds.filter((id): id is string => typeof id === 'string')
        : [],
      scorePot: typeof parsed.scorePot === 'number' ? parsed.scorePot : 0,
    };
  } catch {
    return initialJeopardyState;
  }
}

export function JeopardyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    jeopardyReducer,
    undefined,
    loadPersistedState,
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (state.phase === 'setup') {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } else {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {
      // Ignore quota / private-mode failures.
    }
  }, [state]);

  return (
    <JeopardyContext.Provider value={{ state, dispatch }}>
      {children}
    </JeopardyContext.Provider>
  );
}

export function useJeopardy() {
  const ctx = useContext(JeopardyContext);
  if (!ctx) {
    throw new Error('useJeopardy must be used within JeopardyProvider');
  }
  return ctx;
}
