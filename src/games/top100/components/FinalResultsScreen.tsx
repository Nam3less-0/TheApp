import { Link } from 'react-router-dom';
import { useTop100 } from '../context';
import PlayerAvatar from './PlayerAvatar';
import Top100Panel, { Top100PageWrap } from './Top100Panel';

export default function FinalResultsScreen() {
  const { state, dispatch } = useTop100();

  const ranked = [...state.players].sort((a, b) => b.score - a.score);
  const winner = ranked[0];

  return (
    <Top100PageWrap>
      <h1 className="mb-2 text-center font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
        Final standings
      </h1>
      {winner && (
        <p className="mb-8 text-center font-body text-sm text-steel-blue">
          {winner.name} wins with {winner.score} points
        </p>
      )}

      <Top100Panel>
        <ol className="mb-6 flex flex-col gap-2.5">
          {ranked.map((player, index) => {
            const isWinner = index === 0;
            return (
              <li
                key={player.id}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                  isWinner
                    ? 'border-steel-blue shadow-[0_0_0_1px_#6FA8DC_inset]'
                    : 'border-line bg-surface'
                }`}
              >
                <span className="w-5 font-mono text-sm text-text-low">{index + 1}</span>
                <PlayerAvatar name={player.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-body text-sm font-bold text-text-hi">
                    {player.name}
                  </p>
                  {isWinner && (
                    <p className="font-mono text-[9px] uppercase tracking-wider text-steel-blue">
                      Winner
                    </p>
                  )}
                </div>
                <span className="font-mono text-base text-text-hi">{player.score}</span>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: 'PLAY_AGAIN' })}
            className="w-full rounded-xl border-none px-4 py-[15px] font-body text-[15px] font-bold text-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
            style={{
              background: 'linear-gradient(180deg, #F2F4F8, #C9CDD6 50%, #8B8F99)',
            }}
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
      </Top100Panel>
    </Top100PageWrap>
  );
}
