import { Link } from 'react-router-dom';
import { useImposter } from './context';
import ImposterSetupScreen from './components/ImposterSetupScreen';
import RevealScreen from './components/RevealScreen';
import DiscussScreen from './components/DiscussScreen';
import VoteScreen from './components/VoteScreen';
import FinalResultsScreen from './components/FinalResultsScreen';

function ImposterShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-[2] min-h-svh">
      <div className="border-b border-line bg-void/60 backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[960px] items-center justify-between gap-4 px-5 py-2.5">
          <Link
            to="/"
            className="font-mono text-xs text-text-low transition-colors hover:text-text-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          >
            ← Shelf
          </Link>
          <span className="font-display text-sm font-bold text-ember">Imposter</span>
          <span className="w-12" aria-hidden="true" />
        </div>
      </div>
      {children}
    </div>
  );
}

export default function ImposterGame() {
  const { state } = useImposter();

  let screen: React.ReactNode;
  switch (state.phase) {
    case 'setup':
      screen = <ImposterSetupScreen />;
      break;
    case 'reveal':
      screen = <RevealScreen />;
      break;
    case 'discuss':
      screen = <DiscussScreen />;
      break;
    case 'vote':
    case 'result':
      screen = <VoteScreen />;
      break;
    case 'final':
      screen = <FinalResultsScreen />;
      break;
    default:
      screen = null;
  }

  return <ImposterShell>{screen}</ImposterShell>;
}
