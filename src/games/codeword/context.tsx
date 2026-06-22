import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { codewordReducer, initialCodewordState } from './reducer';
import type { CodewordAction, CodewordState } from './types';

interface CodewordContextValue {
  state: CodewordState;
  dispatch: Dispatch<CodewordAction>;
}

const CodewordContext = createContext<CodewordContextValue | null>(null);

export function CodewordProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(codewordReducer, initialCodewordState);

  return (
    <CodewordContext.Provider value={{ state, dispatch }}>
      {children}
    </CodewordContext.Provider>
  );
}

export function useCodeword() {
  const ctx = useContext(CodewordContext);
  if (!ctx) {
    throw new Error('useCodeword must be used within CodewordProvider');
  }
  return ctx;
}
