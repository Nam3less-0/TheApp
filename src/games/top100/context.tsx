import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import { initialTop100State, top100Reducer } from './reducer';
import type { Top100Action, Top100State } from './types';

interface Top100ContextValue {
  state: Top100State;
  dispatch: Dispatch<Top100Action>;
}

const Top100Context = createContext<Top100ContextValue | null>(null);

export function Top100Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(top100Reducer, initialTop100State);

  return (
    <Top100Context.Provider value={{ state, dispatch }}>
      {children}
    </Top100Context.Provider>
  );
}

export function useTop100() {
  const ctx = useContext(Top100Context);
  if (!ctx) {
    throw new Error('useTop100 must be used within Top100Provider');
  }
  return ctx;
}
