import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useMinigame } from './context';
import LobbyScreen from './screens/LobbyScreen';
import ManualScreen from './screens/ManualScreen';
import RevealScreen from './screens/RevealScreen';
import PlayHost from './screens/PlayHost';
import ResultScreen from './screens/ResultScreen';
import FinalResultsScreen from './screens/FinalResultsScreen';

function MinigameShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-[2] min-h-svh">
      <div className="border-b border-line bg-void/60 backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[960px] items-center justify-between gap-4 px-5 py-2.5">
          <Link
            to="/"
            className="font-mono text-xs text-text-low transition-colors hover:text-text-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6FD9]"
          >
            ← Shelf
          </Link>
          <span className="font-display text-sm font-bold text-[#B39DFF]">Minigame</span>
          <span className="w-12" aria-hidden="true" />
        </div>
      </div>
      {children}
    </div>
  );
}

export default function MinigameGame() {
  const { state } = useMinigame();

  let screen: ReactNode;
  switch (state.phase) {
    case 'lobby':
      screen = <LobbyScreen />;
      break;
    case 'manual':
      screen = <ManualScreen />;
      break;
    case 'reveal':
      screen = <RevealScreen />;
      break;
    case 'play':
      screen = <PlayHost />;
      break;
    case 'result':
      screen = <ResultScreen />;
      break;
    case 'final':
      screen = <FinalResultsScreen />;
      break;
    default:
      screen = null;
  }

  return <MinigameShell>{screen}</MinigameShell>;
}
