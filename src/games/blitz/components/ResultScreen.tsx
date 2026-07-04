import { useBlitz } from '../context';
import { getPlayerById, capitalize } from '../utils';
import BlitzPanel, { BlitzPageWrap } from './BlitzPanel';
import PlayerAvatar from './PlayerAvatar';
import ScoreStrip from './ScoreStrip';

export default function ResultScreen() {
  const { state, dispatch } = useBlitz();
  const record = state.history[state.history.length - 1];
  const player = getPlayerById(state.players, record?.playerId ?? null);

  if (!record || !player) return null;

  const others = state.players.filter((p) => p.id !== player.id);
  const hasWinner = state.players.some((p) => p.score >= state.targetScore);

  return (
    <BlitzPageWrap>
      <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-silver">
        Round {record.round}
      </p>

      <ScoreStrip
        players={state.players}
        targetScore={state.targetScore}
        className="mb-5"
      />

      <BlitzPanel>
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <PlayerAvatar name={player.name} size="lg" />
          <p className="font-display text-2xl font-extrabold text-bad sm:text-3xl">
            TIME&rsquo;S UP
          </p>
          <p className="font-body text-sm text-text-mid">
            <span className="font-semibold text-text-hi">{player.name}</span> didn&rsquo;t hit
            NEXT in time.
          </p>
        </div>

        <div className="mb-5 rounded-xl border border-line bg-surface px-4 py-3 text-center">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-silver-bright">
            {capitalize(record.category)}
          </p>
          <p className="font-body text-[15px] font-semibold leading-snug text-text-hi">
            {record.prompt}
          </p>
        </div>

        <div className="mb-5 rounded-xl border border-bad/40 bg-bad/10 px-4 py-3 text-center">
          <p className="font-body text-sm text-text-hi">
            <span className="font-bold text-bad">+1 point</span> each for{' '}
            {others.map((p, i) => (
              <span key={p.id} className="font-semibold">
                {p.name}
                {i < others.length - 2 ? ', ' : i === others.length - 2 ? ' and ' : ''}
              </span>
            ))}
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: 'CONTINUE' })}
          className="w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver"
          style={{ background: 'linear-gradient(180deg, #F2F4F8, #C9CDD6 55%, #8B8F99)' }}
        >
          {hasWinner ? 'See final standings' : 'Next round'}
        </button>
      </BlitzPanel>
    </BlitzPageWrap>
  );
}
