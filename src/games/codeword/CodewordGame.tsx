import { Link } from 'react-router-dom';
import { useCodeword } from './context';
import CodewordPlayScreen from './components/CodewordPlayScreen';
import CodewordSetupScreen from './components/CodewordSetupScreen';
import GameOverScreen from './components/GameOverScreen';

function CodewordShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-[2] min-h-svh">
      <div className="border-b border-line bg-void/60 backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[960px] items-center justify-between gap-4 px-5 py-2.5">
          <Link
            to="/"
            className="font-mono text-xs text-text-low transition-colors hover:text-text-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
          >
            ← Shelf
          </Link>
          <span className="font-display text-sm font-bold text-copper">Codeword</span>
          <span className="w-12" aria-hidden="true" />
        </div>
      </div>
      {children}
    </div>
  );
}

export default function CodewordGame() {
  const { state } = useCodeword();

  let screen: React.ReactNode;
  switch (state.phase) {
    case 'setup':
      screen = <CodewordSetupScreen />;
      break;
    case 'playing':
      screen = <CodewordPlayScreen />;
      break;
    case 'over':
      screen = <GameOverScreen />;
      break;
    default:
      screen = null;
  }

  return <CodewordShell>{screen}</CodewordShell>;
}
