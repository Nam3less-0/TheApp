import { Link } from 'react-router-dom';
import { useHouseOfCards } from './context';
import SetupPhase from './phases/SetupPhase';
import BoardPhase from './phases/BoardPhase';
import QuestionPhase from './phases/QuestionPhase';
import RevealPhase from './phases/RevealPhase';
import GameOverPhase from './phases/GameOverPhase';

function HouseOfCardsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="hoc-game-shell relative z-[2] min-h-svh">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% -5%, rgba(169,32,58,0.10) 0%, transparent 55%)',
        }}
        aria-hidden="true"
      />

      <div
        className="relative border-b backdrop-blur-[12px]"
        style={{ borderColor: 'var(--hoc-line)', background: 'rgba(12,11,16,0.6)' }}
      >
        <div className="mx-auto flex max-w-[960px] items-center justify-between gap-4 px-5 py-2.5">
          <Link
            to="/"
            className="font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2"
            style={{ color: 'var(--hoc-ivory-dim)' }}
          >
            ← Shelf
          </Link>
          <span className="font-display text-sm font-bold" style={{ color: 'var(--hoc-crimson-bright)' }}>
            House of Cards
          </span>
          <span className="w-12" aria-hidden="true" />
        </div>
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}

export default function HouseOfCardsGame() {
  const { state } = useHouseOfCards();

  let screen: React.ReactNode;
  switch (state.phase) {
    case 'setup':
      screen = <SetupPhase />;
      break;
    case 'board':
      screen = <BoardPhase />;
      break;
    case 'question':
      screen = <QuestionPhase />;
      break;
    case 'reveal':
      screen = <RevealPhase />;
      break;
    case 'gameover':
      screen = <GameOverPhase />;
      break;
    default:
      screen = null;
  }

  return <HouseOfCardsShell>{screen}</HouseOfCardsShell>;
}
