import { Link } from 'react-router-dom';
import { useJeopardy } from '../context';
import { COLORS, SILVER_BUTTON, formatScore } from '../utils';
import { JeopardyPageWrap } from './JeopardyPanel';
import PlayerAvatar from './PlayerAvatar';

export default function FinalScreen() {
  const { state, dispatch } = useJeopardy();

  const ranked = [...state.players].sort((a, b) => b.score - a.score);
  const topScore = ranked[0]?.score ?? 0;
  const winners = ranked.filter((p) => p.score === topScore);
  const tie = winners.length > 1;

  return (
    <JeopardyPageWrap>
      <div className="mb-[22px] text-center">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[1px] text-text-low">
          Game over · board cleared · {state.questionsAnswered} clues
        </div>
        <div className="font-display text-2xl font-black text-text-hi">
          {tie ? `${topScore.toLocaleString('en-US')}-point tie!` : `${ranked[0]?.name} wins!`}
        </div>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-line">
        {ranked.map((player, index) => {
          const first = index === 0 && !tie;
          const details: string[] = [
            `${player.correct} correct`,
            `${player.missed} missed`,
          ];
          if (player.doublesHit > 0) {
            details.push(
              `incl. ${player.doublesHit} double${player.doublesHit > 1 ? 's' : ''}`,
            );
          }
          return (
            <div
              key={player.id}
              className="flex items-center gap-3.5 px-[18px] py-3.5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-line"
              style={{
                background: first
                  ? `linear-gradient(165deg, color-mix(in srgb, ${COLORS.goldBright} 10%, #222428), #1A1C20)`
                  : '#1A1C20',
              }}
            >
              <span
                className="w-7 shrink-0 font-display text-base font-extrabold"
                style={{ color: first ? COLORS.goldBright : COLORS.gold }}
              >
                {index + 1}
              </span>
              <PlayerAvatar name={player.name} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-body text-sm font-bold text-text-hi">
                  {player.name}
                </div>
                <div className="mt-0.5 font-mono text-[10.5px] text-text-low">
                  {details.join(' · ')}
                </div>
              </div>
              <span
                className="font-display text-[17px] font-extrabold tabular-nums"
                style={{ color: first ? COLORS.goldBright : '#9CA0AA' }}
              >
                {formatScore(player.score)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: 'PLAY_AGAIN' })}
          className="w-full rounded-xl border-none px-4 py-[15px] font-body text-[15px] font-bold text-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
          style={{ background: SILVER_BUTTON }}
        >
          Play again
        </button>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line px-4 py-3 text-center font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
        >
          Back to shelf
        </Link>
      </div>
    </JeopardyPageWrap>
  );
}
