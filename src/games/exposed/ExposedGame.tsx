import { Link } from 'react-router-dom';
import { useExposed } from './context';
import ExposedSetupScreen from './components/ExposedSetupScreen';
import QuestionScreen from './components/QuestionScreen';
import CoinFlipScreen from './components/CoinFlipScreen';
import ResultScreen from './components/ResultScreen';
import FinalResultsScreen from './components/FinalResultsScreen';

function ExposedShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-[2] min-h-svh">
      <div className="border-b border-line bg-void/60 backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[960px] items-center justify-between gap-4 px-5 py-2.5">
          <Link
            to="/"
            className="font-mono text-xs text-text-low transition-colors hover:text-text-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-toxic"
          >
            &larr; Shelf
          </Link>
          <span className="font-display text-sm font-bold text-toxic">Exposed</span>
          <span className="w-12" aria-hidden="true" />
        </div>
      </div>
      {children}
    </div>
  );
}

export default function ExposedGame() {
  const { state } = useExposed();

  let screen: React.ReactNode;
  switch (state.phase) {
    case 'setup':
      screen = <ExposedSetupScreen />;
      break;
    case 'question':
      screen = <QuestionScreen />;
      break;
    case 'coinflip':
      screen = <CoinFlipScreen />;
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

  return <ExposedShell>{screen}</ExposedShell>;
}
