import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import { minigameReducer, initialMinigameState } from './reducer';
import type { MinigameAction, MinigameSession } from './types';

interface MinigameContextValue {
  state: MinigameSession;
  dispatch: Dispatch<MinigameAction>;
}

const MinigameContext = createContext<MinigameContextValue | null>(null);

export function MinigameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(minigameReducer, initialMinigameState);
  return <MinigameContext.Provider value={{ state, dispatch }}>{children}</MinigameContext.Provider>;
}

export function useMinigame() {
  const ctx = useContext(MinigameContext);
  if (!ctx) throw new Error('useMinigame must be used within MinigameProvider');
  return ctx;
}
