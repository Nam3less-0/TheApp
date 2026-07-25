import { motion } from 'framer-motion';
import { useBlitz } from '../context';
import { getPlayerById, capitalize } from '../utils';
import BlitzPanel, { BlitzPageWrap } from './BlitzPanel';
import PlayerAvatar from './PlayerAvatar';
import ScoreStrip from './ScoreStrip';

export default function ResultScreen() {
  const { state, dispatch } = useBlitz();
  const record = state.history[state.history.length - 1];
  const player = getPlayerById(state.players, record?.playerId ?? null);
  const stealer = getPlayerById(state.players, record?.stolenBy ?? null);

  if (!record || !player) return null;

  const isLastRound = state.round >= state.totalRounds;

  return (
    <BlitzPageWrap>
      <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-silver">
        Round {record.round} of {state.totalRounds}
      </p>

      <ScoreStrip players={state.players} className="mb-5" />

      <BlitzPanel>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-5 flex flex-col items-center gap-2 text-center"
        >
          <PlayerAvatar name={stealer ? stealer.name : player.name} size="lg" />
          {stealer ? (
            <>
              <p className="font-display text-2xl font-extrabold text-good sm:text-3xl">STOLEN</p>
              <p className="font-body text-sm text-text-mid">
                <span className="font-semibold text-text-hi">{player.name}</span> ran out of time and{' '}
                <span className="font-semibold text-good">{stealer.name}</span> took the point.
              </p>
            </>
          ) : (
            <>
              <p className="font-display text-2xl font-extrabold text-bad sm:text-3xl">
                NOBODY GOT IT
              </p>
              <p className="font-body text-sm text-text-mid">
                <span className="font-semibold text-text-hi">{player.name}</span> missed it and the
                steal failed too. No points this round.
              </p>
            </>
          )}
        </motion.div>

        <div className="mb-5 rounded-xl border border-line bg-surface px-4 py-3 text-center">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-silver-bright">
            {capitalize(record.category)}
          </p>
          <p className="font-body text-[15px] font-semibold leading-snug text-text-hi">
            {record.prompt}
          </p>
          {record.rerolled && (
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-text-low">
              Skip was used this round
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: 'CONTINUE' })}
          className="w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver"
          style={{ background: 'linear-gradient(180deg, #F2F4F8, #C9CDD6 55%, #8B8F99)' }}
        >
          {isLastRound ? 'See final standings' : 'Next round'}
        </button>
      </BlitzPanel>
    </BlitzPageWrap>
  );
}
