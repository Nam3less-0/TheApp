import { Link } from 'react-router-dom';
import { useRankUp } from './context';
import ComposeScreen from './components/ComposeScreen';
import DisplayScreen from './components/DisplayScreen';
import GuesserPromptScreen from './components/GuesserPromptScreen';
import GuesserRevealScreen from './components/GuesserRevealScreen';
import GuessingScreen from './components/GuessingScreen';
import LobbyScreen from './components/LobbyScreen';
import RankerRankScreen from './components/RankerRankScreen';
import RankerWaitScreen from './components/RankerWaitScreen';
import RevealScreen from './components/RevealScreen';
import ScoreSelfScreen from './components/ScoreSelfScreen';
import SetupScreen from './components/SetupScreen';

function RankUpShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-[2] min-h-svh rank-up-game-shell">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% -5%, rgba(155,147,168,0.1) 0%, transparent 55%)',
        }}
        aria-hidden="true"
      />
      <div className="relative border-b border-line bg-void/60 backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[900px] items-center justify-between gap-4 px-6 py-3">
          <Link
            to="/"
            className="font-mono text-xs text-text-low transition-colors hover:text-text-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pewter"
          >
            ← Shelf
          </Link>
          <span className="font-display text-sm font-bold text-text-hi">Rank Up</span>
          <span className="w-12" aria-hidden="true" />
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function RankUpRouter() {
  const { local, room, isRanker } = useRankUp();

  if (local.localPhase === 'setup') {
    return (
      <RankUpShell>
        <SetupScreen />
      </RankUpShell>
    );
  }

  if (local.localPhase === 'compose') {
    return (
      <RankUpShell>
        <ComposeScreen />
      </RankUpShell>
    );
  }

  if (local.localPhase === 'ranker-rank') {
    return (
      <RankUpShell>
        <RankerRankScreen />
      </RankUpShell>
    );
  }

  if (local.localPhase === 'guessing') {
    return (
      <RankUpShell>
        <GuessingScreen />
      </RankUpShell>
    );
  }

  if (local.localPhase === 'score-self') {
    return (
      <RankUpShell>
        <ScoreSelfScreen />
      </RankUpShell>
    );
  }

  if (local.localPhase === 'guess-submitted') {
    return (
      <RankUpShell>
        <GuesserRevealScreen />
      </RankUpShell>
    );
  }

  if (!room) {
    return (
      <RankUpShell>
        <LobbyScreen />
      </RankUpShell>
    );
  }

  if (local.localPhase === 'lobby' && room.phase !== 'lobby') {
    return (
      <RankUpShell>
        <LobbyScreen waitingForNextRound />
      </RankUpShell>
    );
  }

  if (isRanker) {
    switch (room.phase) {
      case 'display':
        return (
          <RankUpShell>
            <DisplayScreen />
          </RankUpShell>
        );
      case 'guessing':
        return (
          <RankUpShell>
            <RankerWaitScreen />
          </RankUpShell>
        );
      case 'reveal':
        return (
          <RankUpShell>
            <RevealScreen />
          </RankUpShell>
        );
      default:
        return (
          <RankUpShell>
            <LobbyScreen />
          </RankUpShell>
        );
    }
  }

  switch (room.phase) {
    case 'display':
    case 'guessing':
      return (
        <RankUpShell>
          <GuesserPromptScreen />
        </RankUpShell>
      );
    case 'reveal':
      return (
        <RankUpShell>
          <GuesserRevealScreen />
        </RankUpShell>
      );
    default:
      return (
        <RankUpShell>
          <LobbyScreen />
        </RankUpShell>
      );
  }
}

export default function RankUpGame() {
  return <RankUpRouter />;
}
