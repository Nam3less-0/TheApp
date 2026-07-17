import { Link } from 'react-router-dom';
import { useCodeword } from './context';
import CodewordPlayScreen from './components/CodewordPlayScreen';
import CodewordSetupScreen from './components/CodewordSetupScreen';
import ErrorPanel from './components/ErrorPanel';
import GameOverScreen from './components/GameOverScreen';
import LobbyScreen from './components/LobbyScreen';
import RejoiningSkeleton from './components/RejoiningSkeleton';
import SyncSetupScreen from './components/SyncSetupScreen';

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

function CodewordRouter() {
  const { state, localPhase, room, synced, syncError, leaveGame, teams, teamId, roomCode } =
    useCodeword();

  const myTeam = teams.find((team) => team.id === teamId);
  const isRejoining = synced && roomCode && !room && !syncError;

  if (localPhase === 'setup') {
    return (
      <CodewordShell>
        <SyncSetupScreen />
      </CodewordShell>
    );
  }

  if (isRejoining) {
    return (
      <CodewordShell>
        <RejoiningSkeleton />
      </CodewordShell>
    );
  }

  if (synced && syncError && !room) {
    return (
      <CodewordShell>
        <div className="mx-auto max-w-[560px] px-4 py-6">
          <ErrorPanel message={syncError} />
          <button
            type="button"
            onClick={leaveGame}
            className="mt-4 w-full rounded-xl border border-line px-4 py-2.5 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi"
          >
            Back to setup
          </button>
        </div>
      </CodewordShell>
    );
  }

  if (localPhase === 'local') {
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

  if (synced && room) {
    if (room.phase === 'lobby') {
      return (
        <CodewordShell>
          <LobbyScreen />
        </CodewordShell>
      );
    }

    if (room.phase === 'setup') {
      if (!myTeam?.cardLocked) {
        return (
          <CodewordShell>
            <CodewordSetupScreen synced />
          </CodewordShell>
        );
      }
      return (
        <CodewordShell>
          <LobbyScreen />
        </CodewordShell>
      );
    }

    if (room.phase === 'playing') {
      return (
        <CodewordShell>
          <CodewordPlayScreen />
        </CodewordShell>
      );
    }

    if (room.phase === 'over') {
      return (
        <CodewordShell>
          <GameOverScreen />
        </CodewordShell>
      );
    }
  }

  return (
    <CodewordShell>
      <RejoiningSkeleton />
    </CodewordShell>
  );
}

export default function CodewordGame() {
  return <CodewordRouter />;
}
