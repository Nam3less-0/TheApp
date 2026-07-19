import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRankUp } from './context';
import { SessionUIProvider } from './sessionUi';
import TeamFormationScreen from './components/TeamFormationScreen';
import ComposeScreen from './components/ComposeScreen';
import GuesserRevealScreen from './components/GuesserRevealScreen';
import GuessingScreen from './components/GuessingScreen';
import LobbyScreen from './components/LobbyScreen';
import OnboardingCards, { isRankUpOnboarded } from './components/OnboardingCards';
import RankerRankScreen from './components/RankerRankScreen';
import RankerWaitScreen from './components/RankerWaitScreen';
import ErrorPanel from './components/ErrorPanel';
import RejoiningSkeleton from './components/RejoiningSkeleton';
import RevealScreen from './components/RevealScreen';
import RoundPhaseBar from './components/RoundPhaseBar';
import RoundRecapScreen from './components/RoundRecapScreen';
import SetupScreen from './components/SetupScreen';
import TurnOrderStrip from './components/TurnOrderStrip';
import TurnTransitionBeat from './components/TurnTransitionBeat';
import GameOptionsMenu from './components/GameOptionsMenu';
import RankUpPanel, { RankUpPageWrap, RankUpSecondaryButton } from './components/Layout';

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
          <GameOptionsMenu />
        </div>
      </div>
      <RoundPhaseBar />
      <TurnOrderStrip />
      <div className="relative">{children}</div>
    </div>
  );
}

function MidTurnLobbyRouter() {
  const { isRanker, beginCompose, isHost, room, players, skipCurrentTurn } = useRankUp();
  const [transitionDone, setTransitionDone] = useState(false);

  const rankerMissingFromRoom = Boolean(
    room?.rankerPlayerId && !players.some((player) => player.id === room.rankerPlayerId),
  );

  if (rankerMissingFromRoom && isHost) {
    return (
      <RankUpPageWrap>
        <RankUpPanel compact className="mb-4">
          <p className="text-center font-body text-sm text-text-mid">
            The ranker left before their turn. Skip to the next player?
          </p>
        </RankUpPanel>
        <RankUpSecondaryButton onClick={() => skipCurrentTurn()} className="w-full text-center">
          Skip ranker&apos;s turn
        </RankUpSecondaryButton>
      </RankUpPageWrap>
    );
  }

  if (!transitionDone) {
    return (
      <TurnTransitionBeat
        onComplete={() => {
          setTransitionDone(true);
          if (isRanker) beginCompose();
        }}
      />
    );
  }

  if (isRanker) {
    return null;
  }

  return (
    <RankUpPageWrap>
      <p className="text-center font-body text-sm text-text-mid">
        Waiting for the ranker to draw a question…
      </p>
    </RankUpPageWrap>
  );
}

function RankUpRouter() {
  const {
    local,
    room,
    players,
    isRanker,
    leaveGame,
    awaitingRoundStart,
    isTeamsGame,
    teamFormationComplete,
  } = useRankUp();
  const [onboarded, setOnboarded] = useState(isRankUpOnboarded);

  const myPlayer = players.find((player) => player.id === local.playerId);
  const guessAlreadySubmitted =
    local.localPhase === 'guess-submitted' ||
    Boolean(myPlayer?.guessSubmitted && room && room.phase !== 'lobby');

  const isRejoining =
    local.localPhase !== 'setup' && local.roomCode && !room && !local.syncError;

  if (!onboarded && local.localPhase === 'setup') {
    return (
      <RankUpShell>
        <OnboardingCards onComplete={() => setOnboarded(true)} />
      </RankUpShell>
    );
  }

  if (local.localPhase === 'setup') {
    return (
      <RankUpShell>
        <SetupScreen />
      </RankUpShell>
    );
  }

  if (!room && local.syncError) {
    return (
      <RankUpShell>
        <RankUpPageWrap>
          <ErrorPanel message={local.syncError} />
          <RankUpSecondaryButton onClick={leaveGame} className="w-full text-center">
            Back to setup
          </RankUpSecondaryButton>
        </RankUpPageWrap>
      </RankUpShell>
    );
  }

  if (isRejoining) {
    return (
      <RankUpShell>
        <RejoiningSkeleton />
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

  if (guessAlreadySubmitted && !isRanker && room?.phase !== 'round-recap') {
    return (
      <RankUpShell>
        <GuesserRevealScreen />
      </RankUpShell>
    );
  }

  if (!room) {
    return (
      <RankUpShell>
        <RejoiningSkeleton />
      </RankUpShell>
    );
  }

  if (room.phase === 'round-recap') {
    return (
      <RankUpShell>
        <RoundRecapScreen />
      </RankUpShell>
    );
  }

  if (room.phase === 'lobby' && !awaitingRoundStart) {
    return (
      <RankUpShell>
        <MidTurnLobbyRouter
          key={`${room.roundNumber}-${room.turnIndex}-${room.rankerPlayerId}`}
        />
      </RankUpShell>
    );
  }

  if (isRanker) {
    switch (room.phase) {
      case 'display':
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
            {isTeamsGame && awaitingRoundStart && !teamFormationComplete ? (
              <TeamFormationScreen />
            ) : (
              <LobbyScreen />
            )}
          </RankUpShell>
        );
    }
  }

  switch (room.phase) {
    case 'display':
    case 'guessing':
      return (
        <RankUpShell>
          <GuessingScreen />
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
          {isTeamsGame && awaitingRoundStart && !teamFormationComplete ? (
            <TeamFormationScreen />
          ) : (
            <LobbyScreen />
          )}
        </RankUpShell>
      );
  }
}

export default function RankUpGame() {
  return (
    <SessionUIProvider>
      <RankUpRouter />
    </SessionUIProvider>
  );
}
