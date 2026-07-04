import { useExposed } from '../context';
import { getPlayerById } from '../utils';
import ExposedPanel, { ExposedPageWrap } from './ExposedPanel';
import PlayerAvatar from './PlayerAvatar';

export default function ResultScreen() {
  const { state, dispatch } = useExposed();
  const record = state.history[state.history.length - 1];
  const player = getPlayerById(state.players, state.currentPlayerId);

  if (!record || !player) return null;

  const revealed = record.outcome === 'revealed';
  const isLast = state.currentRound >= state.totalRounds;

  return (
    <ExposedPageWrap>
      <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-toxic">
        Round {state.currentRound} of {state.totalRounds}
      </p>

      <ExposedPanel>
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <PlayerAvatar name={player.name} size="lg" />
          <p
            className={`font-display text-2xl font-extrabold sm:text-3xl ${
              revealed ? 'text-bad' : 'text-good'
            }`}
          >
            {revealed ? 'EXPOSED' : 'STAYS SECRET'}
          </p>
          <p className="font-body text-sm text-text-mid">
            {revealed ? (
              <>
                <span className="font-semibold text-text-hi">{player.name}</span> has to
                read the question out loud to everyone.
              </>
            ) : (
              <>
                <span className="font-semibold text-text-hi">{player.name}</span> gets to
                keep the question a secret. No one finds out.
              </>
            )}
          </p>
        </div>

        {revealed && (
          <div className="mb-5 rounded-xl border border-bad/40 bg-bad/10 px-4 py-4 text-center">
            <p className="font-body text-[15px] font-semibold text-text-hi">
              &ldquo;{record.question}&rdquo;
            </p>
          </div>
        )}

        <div className="mb-5 flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-low">
            Points earned
          </span>
          <span
            className={`font-display text-lg font-bold tabular-nums ${
              revealed ? 'text-bad' : 'text-good'
            }`}
          >
            +{record.points}
          </span>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: 'NEXT_ROUND' })}
          className="w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-toxic"
          style={{ background: 'linear-gradient(180deg, #C6E86B, #9BC53D 55%, #4A5A1A)' }}
        >
          {isLast ? 'See final standings' : 'Next round'}
        </button>
      </ExposedPanel>
    </ExposedPageWrap>
  );
}
