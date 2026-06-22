import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { jeopardyReducer, initialJeopardyState } from './reducer';
import type { JeopardyAction, JeopardySession } from './types';

interface JeopardyContextValue {
  state: JeopardySession;
  dispatch: Dispatch<JeopardyAction>;
}

const JeopardyContext = createContext<JeopardyContextValue | null>(null);

export function JeopardyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(jeopardyReducer, initialJeopardyState);

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
