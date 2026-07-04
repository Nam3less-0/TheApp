import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { exposedReducer, initialExposedState } from './reducer';
import type { ExposedAction, ExposedSession } from './types';

interface ExposedContextValue {
  state: ExposedSession;
  dispatch: Dispatch<ExposedAction>;
}

const ExposedContext = createContext<ExposedContextValue | null>(null);

export function ExposedProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(exposedReducer, initialExposedState);

  return (
    <ExposedContext.Provider value={{ state, dispatch }}>
      {children}
    </ExposedContext.Provider>
  );
}

export function useExposed() {
  const ctx = useContext(ExposedContext);
  if (!ctx) {
    throw new Error('useExposed must be used within ExposedProvider');
  }
  return ctx;
}
