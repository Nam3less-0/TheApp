import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { jeopardyReducer, initialJeopardyState } from './reducer';
import type { JeopardyAction, JeopardySession } from './types';
import { defaultSettings } from './utils';

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
    return {
      ...initialJeopardyState,
      ...parsed,
      settings: { ...defaultSettings(), ...(parsed.settings ?? {}) },
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
