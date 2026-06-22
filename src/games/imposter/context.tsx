import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { imposterReducer, initialImposterState } from './reducer';
import type { ImposterAction, ImposterSession } from './types';

interface ImposterContextValue {
  state: ImposterSession;
  dispatch: Dispatch<ImposterAction>;
}

const ImposterContext = createContext<ImposterContextValue | null>(null);

export function ImposterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(imposterReducer, initialImposterState);

  return (
    <ImposterContext.Provider value={{ state, dispatch }}>
      {children}
    </ImposterContext.Provider>
  );
}

export function useImposter() {
  const ctx = useContext(ImposterContext);
  if (!ctx) {
    throw new Error('useImposter must be used within ImposterProvider');
  }
  return ctx;
}
