import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { blitzReducer, initialBlitzState } from './reducer';
import type { BlitzAction, BlitzSession } from './types';

interface BlitzContextValue {
  state: BlitzSession;
  dispatch: Dispatch<BlitzAction>;
}

const BlitzContext = createContext<BlitzContextValue | null>(null);

export function BlitzProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(blitzReducer, initialBlitzState);

  return (
    <BlitzContext.Provider value={{ state, dispatch }}>
      {children}
    </BlitzContext.Provider>
  );
}

export function useBlitz() {
  const ctx = useContext(BlitzContext);
  if (!ctx) {
    throw new Error('useBlitz must be used within BlitzProvider');
  }
  return ctx;
}
