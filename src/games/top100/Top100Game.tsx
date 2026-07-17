import { Link } from 'react-router-dom';
import { useTop100 } from './context';
import DealerTurnScreen from './components/DealerTurnScreen';
import DealerHandoffScreen from './components/DealerHandoffScreen';
import FinalResultsScreen from './components/FinalResultsScreen';
import PlayerSetupScreen from './components/PlayerSetupScreen';
import TurnRecapScreen from './components/TurnRecapScreen';
import { ListIcon } from './components/Top100Icons';

function Top100Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-[2] min-h-svh">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 75% 50% at 50% -10%, rgba(111,168,220,0.12) 0%, transparent 55%)',
            'radial-gradient(ellipse 40% 30% at 100% 100%, rgba(201,164,74,0.06) 0%, transparent 50%)',
          ].join(', '),
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(111,168,220,0.5) 39px, rgba(111,168,220,0.5) 40px)',
        }}
        aria-hidden="true"
      />
      <div className="relative border-b border-line bg-void/70 backdrop-blur-[14px]">
        <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <Link
            to="/"
            className="font-mono text-xs text-text-low transition-colors hover:text-text-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
          >
            ← Shelf
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-steel-blue/15 text-steel-blue">
              <ListIcon className="h-4 w-4" />
            </span>
            <span className="font-display text-sm font-bold tracking-[-0.02em] text-text-hi">
              Top <span className="text-steel-blue">100</span>
            </span>
          </div>
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
