import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useBlitz } from '../context';
import { STEAL_SECONDS, capitalize, getPlayerById } from '../utils';
import { playTimerAlarm } from '../../the-bet/playTimerAlarm';
import TimerRing from '../../the-bet/components/TimerRing';
import BlitzPanel, { BlitzPageWrap } from './BlitzPanel';
import PlayerAvatar from './PlayerAvatar';

export default function StealScreen() {
  const { state, dispatch } = useBlitz();
  const question = state.currentQuestion;
  const stealer = getPlayerById(state.players, state.stealPlayerId);
  const original = getPlayerById(state.players, state.currentPlayerId);

  const [timeLeft, setTimeLeft] = useState(STEAL_SECONDS);
  const firedRef = useRef(false);

  useEffect(() => {
    setTimeLeft(STEAL_SECONDS);
    firedRef.current = false;
  }, [question?.id, state.round]);

  useEffect(() => {
    if (!question) return undefined;
    if (timeLeft <= 0) {
      if (!firedRef.current) {
        firedRef.current = true;
        playTimerAlarm();
        dispatch({ type: 'STEAL_FAIL' });
      }
      return undefined;
    }
    const t = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [timeLeft, question, dispatch]);

  if (!question || !stealer) return null;

  const danger = timeLeft <= 3;

  return (
    <BlitzPageWrap>
      <motion.p
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-bad"
      >
        {original?.name} ran out of time
      </motion.p>

      <BlitzPanel>
        <div className="mb-4 flex flex-col items-center gap-2 text-center">
          <PlayerAvatar name={stealer.name} size="lg" />
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-silver-bright">
            Steal attempt
          </p>
          <h1 className="font-display text-[22px] font-extrabold leading-tight text-text-hi sm:text-[26px]">
            {stealer.name}, can you get it?
          </h1>
        </div>

        <div className="mb-5 rounded-xl border border-line bg-surface px-4 py-3 text-center">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-silver-bright">
            {capitalize(question.category)}
          </p>
          <p className="font-display text-lg font-bold leading-snug text-text-hi sm:text-xl">
            {question.prompt.replace(/in \d+ seconds$/, `in ${STEAL_SECONDS} seconds`)}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <TimerRing
            diameter={120}
            strokeWidth={9}
            progress={timeLeft / STEAL_SECONDS}
            danger={danger}
          >
            <span
              className={`font-display text-3xl font-extrabold tabular-nums ${
                danger ? 'text-bad' : 'text-text-hi'
              }`}
            >
              {timeLeft}
            </span>
          </TimerRing>

          <button
            type="button"
            onClick={() => dispatch({ type: 'STEAL_SUCCESS' })}
            className="w-full rounded-xl border-none px-4 py-4 font-display text-lg font-extrabold text-void transition-transform active:scale-[0.98]"
            style={{ background: 'linear-gradient(180deg, #A8E6C0, #7ED9A4 55%, #4E9C72)' }}
          >
            STOLEN — {stealer.name} got it
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: 'STEAL_FAIL' })}
            className="w-full rounded-xl border border-line px-4 py-2.5 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright"
          >
            Nobody got it
          </button>
        </div>
      </BlitzPanel>
    </BlitzPageWrap>
  );
}
