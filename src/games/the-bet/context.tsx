import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
} from 'react';
import { useBetGame } from './useBetGame';
import type { BetAction, BetState } from './types';

interface BetContextValue {
  state: BetState;
  dispatch: Dispatch<BetAction>;
}

const BetContext = createContext<BetContextValue | null>(null);

export function BetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useBetGame();
  return (
    <BetContext.Provider value={{ state, dispatch }}>{children}</BetContext.Provider>
  );
}

export function useBet() {
  const ctx = useContext(BetContext);
  if (!ctx) {
    throw new Error('useBet must be used within BetProvider');
  }
  return ctx;
}
