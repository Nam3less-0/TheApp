import { useHouseOfCards } from '../context';
import Scoreboard from '../components/Scoreboard';
import {
  HocPageWrap,
  HocPanel,
  primaryButtonClass,
  primaryButtonStyle,
} from '../components/Layout';

export default function GameOverPhase() {
  const { state, dispatch } = useHouseOfCards();

  const teamName = (id: 'a' | 'b') => (id === 'a' ? state.teamAName : state.teamBName);
  const winnerName = state.winner ? teamName(state.winner) : null;
  const loserName = state.winner ? teamName(state.winner === 'a' ? 'b' : 'a') : null;

  let heading: string;
  let reason: string;

  switch (state.winReason) {
    case 'threshold_win':
      heading = `${winnerName} wins`;
      reason = `${winnerName} crossed +25 points first.`;
      break;
    case 'threshold_loss':
      heading = `${winnerName} wins`;
      reason = `${loserName} dropped below \u221225 points.`;
      break;
    case 'exhausted_higher_score':
      heading = `${winnerName} wins`;
      reason = `All 52 cards played \u2014 ${winnerName} finished with the higher score.`;
      break;
    case 'exhausted_tie':
      heading = 'Dead-even tie';
      reason = "All 52 cards played \u2014 it's a dead-even tie.";
      break;
    default:
      heading = 'Game over';
      reason = '';
  }

  const isTie = state.winReason === 'exhausted_tie';

  return (
    <HocPageWrap>
      <HocPanel className="text-center">
        <p
          className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--hoc-brass)' }}
        >
          {isTie ? 'Stalemate' : 'Winner'}
        </p>
        <h1
          className="mb-2 font-display text-3xl font-extrabold tracking-[-0.5px] sm:text-4xl"
          style={{ color: isTie ? 'var(--hoc-ivory)' : 'var(--hoc-crimson-bright)' }}
        >
          {heading}
        </h1>
        <p className="mb-6 font-body text-sm" style={{ color: 'var(--hoc-ivory-dim)' }}>
          {reason}
        </p>

        <Scoreboard
          teamAName={state.teamAName}
          teamBName={state.teamBName}
          scoreA={state.scoreA}
          scoreB={state.scoreB}
          activeTeam={state.winner ?? 'a'}
          showActive={!isTie}
        />

        <button
          type="button"
          onClick={() => dispatch({ type: 'RESET' })}
          className={`mt-8 ${primaryButtonClass}`}
          style={primaryButtonStyle}
        >
          Play Again
        </button>
      </HocPanel>
    </HocPageWrap>
  );
}
