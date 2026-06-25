import { Link } from 'react-router-dom';
import { BetProvider, useBet } from './context';
import BetCategories from './screens/BetCategories';
import BetPlay from './screens/BetPlay';
import { BetFloatingLabel } from './components/BetLayout';

function BetShell({ children, hideBack }: { children: React.ReactNode; hideBack?: boolean }) {
  return (
    <div className="bet-game-shell relative z-[2] min-h-svh">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% -5%, rgba(201,164,74,0.07) 0%, transparent 55%)',
        }}
        aria-hidden="true"
      />

      <div className="relative border-b border-line bg-void/60 backdrop-blur-[12px]">
        <div className="mx-auto flex max-w-[960px] items-center justify-between gap-4 px-5 py-2.5">
          {hideBack ? (
            <span className="w-12" aria-hidden="true" />
          ) : (
            <Link
              to="/"
              className="font-mono text-xs text-text-low transition-colors hover:text-text-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              ← Shelf
            </Link>
          )}
          <span className="font-display text-sm font-bold text-gold">The Bet</span>
          <span className="w-12" aria-hidden="true" />
        </div>
      </div>

      <div className="relative">
        <BetFloatingLabel>EST. 2025</BetFloatingLabel>
        {children}
      </div>
    </div>
  );
}

function BetRouter() {
  const { state } = useBet();

  let screen: React.ReactNode;
  let hideBack = false;

  switch (state.phase) {
    case 'categories':
      screen = <BetCategories />;
      break;
    case 'play':
      screen = <BetPlay />;
      hideBack = true;
      break;
    default:
      screen = null;
  }

  return <BetShell hideBack={hideBack}>{screen}</BetShell>;
}

export default function TheBet() {
  return (
    <BetProvider>
      <BetRouter />
    </BetProvider>
  );
}
