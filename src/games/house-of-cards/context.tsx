import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { houseOfCardsReducer, initialHouseOfCardsState } from './reducer';
import type { HouseOfCardsAction, HouseOfCardsState } from './types';

interface HouseOfCardsContextValue {
  state: HouseOfCardsState;
  dispatch: Dispatch<HouseOfCardsAction>;
}

const HouseOfCardsContext = createContext<HouseOfCardsContextValue | null>(null);

export function HouseOfCardsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    houseOfCardsReducer,
    initialHouseOfCardsState,
  );

  return (
    <HouseOfCardsContext.Provider value={{ state, dispatch }}>
      {children}
    </HouseOfCardsContext.Provider>
  );
}

export function useHouseOfCards() {
  const ctx = useContext(HouseOfCardsContext);
  if (!ctx) {
    throw new Error('useHouseOfCards must be used within HouseOfCardsProvider');
  }
  return ctx;
}
