import { Link } from 'react-router-dom';
import { useBlitz } from './context';
import BlitzSetupScreen from './components/BlitzSetupScreen';
import PromptScreen from './components/PromptScreen';
import ResultScreen from './components/ResultScreen';
import FinalResultsScreen from './components/FinalResultsScreen';

function BlitzShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-[2] min-h-svh">
      <div className="border-b border-line bg-void/60 backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[960px] items-center justify-between gap-4 px-5 py-2.5">
          <Link
            to="/"
            className="font-mono text-xs text-text-low transition-colors hover:text-text-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver"
          >
            &larr; Shelf
          </Link>
          <span className="font-display text-sm font-bold text-silver-bright">Blitz</span>
          <span className="w-12" aria-hidden="true" />
        </div>
      </div>
      {children}
    </div>
  );
}

export default function BlitzGame() {
  const { state } = useBlitz();

  let screen: React.ReactNode;
  switch (state.phase) {
    case 'setup':
      screen = <BlitzSetupScreen />;
      break;
    case 'prompt':
      screen = <PromptScreen />;
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

  return <BlitzShell>{screen}</BlitzShell>;
}
