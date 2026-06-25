import { Link } from 'react-router-dom';
import { useTop100 } from './context';
import DealerTurnScreen from './components/DealerTurnScreen';
import DealerHandoffScreen from './components/DealerHandoffScreen';
import FinalResultsScreen from './components/FinalResultsScreen';
import PlayerSetupScreen from './components/PlayerSetupScreen';
import TurnRecapScreen from './components/TurnRecapScreen';

function Top100Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-[2] min-h-svh">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% -5%, rgba(111,168,220,0.08) 0%, transparent 55%)',
        }}
        aria-hidden="true"
      />
      <div className="relative border-b border-line bg-void/60 backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[900px] items-center justify-between gap-4 px-6 py-3">
          <Link
            to="/"
            className="font-mono text-xs text-text-low transition-colors hover:text-text-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
          >
            ← Shelf
          </Link>
          <span className="font-display text-sm font-bold text-text-hi">Top 100</span>
          <span className="w-12" aria-hidden="true" />
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function Top100Router() {
  const { state } = useTop100();

  switch (state.phase) {
    case 'setup':
      return (
        <Top100Shell>
          <PlayerSetupScreen />
        </Top100Shell>
      );
    case 'playing':
      return (
        <Top100Shell>
          <DealerTurnScreen />
        </Top100Shell>
      );
    case 'turn-recap':
      return (
        <Top100Shell>
          <TurnRecapScreen />
        </Top100Shell>
      );
    case 'handoff':
      return (
        <Top100Shell>
          <DealerHandoffScreen />
        </Top100Shell>
      );
    case 'final':
      return (
        <Top100Shell>
          <FinalResultsScreen />
        </Top100Shell>
      );
    default:
      return null;
  }
}

export default function Top100Game() {
  return <Top100Router />;
}
