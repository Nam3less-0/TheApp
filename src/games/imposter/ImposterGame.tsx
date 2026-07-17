import { Link } from 'react-router-dom';
import { useImposter } from './context';
import DiscussScreen from './components/DiscussScreen';
import ErrorPanel from './components/ErrorPanel';
import FinalResultsScreen from './components/FinalResultsScreen';
import ImposterSetupScreen from './components/ImposterSetupScreen';
import LobbyScreen from './components/LobbyScreen';
import RedeemScreen from './components/RedeemScreen';
import RejoiningSkeleton from './components/RejoiningSkeleton';
import RevealScreen from './components/RevealScreen';
import SyncSetupScreen from './components/SyncSetupScreen';
import VoteScreen from './components/VoteScreen';

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

function ImposterRouter() {
  const { state, localPhase, room, synced, syncError, leaveGame, roomCode } = useImposter();

  const isRejoining = synced && roomCode && !room && !syncError;

  if (localPhase === 'setup') {
    return (
      <ImposterShell>
        <SyncSetupScreen />
      </ImposterShell>
    );
  }

  if (isRejoining) {
    return (
      <ImposterShell>
        <RejoiningSkeleton />
      </ImposterShell>
    );
  }

  if (synced && syncError && !room) {
    return (
      <ImposterShell>
        <div className="mx-auto max-w-[560px] px-4 py-6">
          <ErrorPanel message={syncError} />
          <button
            type="button"
            onClick={() => void leaveGame()}
            className="mt-4 w-full rounded-xl border border-line px-4 py-2.5 font-body text-sm font-semibold text-text-mid"
          >
            Back to setup
          </button>
        </div>
      </ImposterShell>
    );
  }

  if (synced && room?.phase === 'lobby') {
    return (
      <ImposterShell>
        <LobbyScreen />
      </ImposterShell>
    );
  }

  if (localPhase === 'local' && state.phase === 'setup') {
    return (
      <ImposterShell>
        <ImposterSetupScreen />
      </ImposterShell>
    );
  }

  let screen: React.ReactNode;
  switch (state.phase) {
    case 'setup':
      screen = <LobbyScreen />;
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
    case 'redeem':
      screen = <RedeemScreen />;
      break;
    case 'final':
      screen = <FinalResultsScreen />;
      break;
    default:
      screen = null;
  }

  return <ImposterShell>{screen ?? <RejoiningSkeleton />}</ImposterShell>;
}

export default function ImposterGame() {
  return <ImposterRouter />;
}
