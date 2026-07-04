import { useEffect, useRef, useState } from 'react';
import { useBlitz } from '../context';
import { getPlayerById, capitalize } from '../utils';
import { playTimerAlarm } from '../../the-bet/playTimerAlarm';
import TimerRing from '../../the-bet/components/TimerRing';
import BlitzPanel, { BlitzPageWrap } from './BlitzPanel';
import PlayerAvatar from './PlayerAvatar';
import ScoreStrip from './ScoreStrip';

export default function PromptScreen() {
  const { state, dispatch } = useBlitz();
  const question = state.currentQuestion;
  const current = getPlayerById(state.players, state.currentPlayerId);

  const [timeLeft, setTimeLeft] = useState(question?.seconds ?? 0);
  const timedOutRef = useRef(false);
  const alarmPlayedRef = useRef(false);

  useEffect(() => {
    setTimeLeft(question?.seconds ?? 0);
    timedOutRef.current = false;
    alarmPlayedRef.current = false;
  }, [question?.id, state.round]);

  useEffect(() => {
    if (!question) return undefined;
    if (timeLeft <= 0) {
      if (!timedOutRef.current) {
        timedOutRef.current = true;
        if (!alarmPlayedRef.current) {
          alarmPlayedRef.current = true;
          playTimerAlarm();
        }
        dispatch({ type: 'TIMEOUT' });
      }
      return undefined;
    }
    const timer = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [timeLeft, question, dispatch]);

  if (!question || !current) return null;

  const danger = timeLeft <= 3;
  const progress = question.seconds > 0 ? timeLeft / question.seconds : 0;

  return (
    <BlitzPageWrap>
      <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-silver">
        Round {state.round}
      </p>

      <ScoreStrip
        players={state.players}
        currentPlayerId={state.currentPlayerId}
        targetScore={state.targetScore}
        className="mb-5"
      />

      <BlitzPanel>
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <PlayerAvatar name={current.name} size="lg" />
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">
            It&rsquo;s
          </p>
          <h1 className="max-w-full break-words font-display text-[22px] font-extrabold leading-tight text-text-hi sm:text-[26px]">
            {current.name}&rsquo;s turn
          </h1>
        </div>

        <div className="mb-5 rounded-xl border border-line bg-surface px-4 py-3 text-center">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-silver-bright">
            {capitalize(question.category)}
          </p>
          <p className="font-display text-lg font-bold leading-snug text-text-hi sm:text-xl">
            {question.prompt}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <TimerRing diameter={140} strokeWidth={10} progress={progress} danger={danger}>
            <span
              className={`font-display text-4xl font-extrabold tabular-nums ${
                danger ? 'text-bad' : 'text-text-hi'
              }`}
            >
              {timeLeft}
            </span>
          </TimerRing>

          <button
            type="button"
            onClick={() => dispatch({ type: 'SUCCESS' })}
            className="w-full rounded-xl border-none px-4 py-4 font-display text-lg font-extrabold text-void transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver active:scale-[0.98]"
            style={{ background: 'linear-gradient(180deg, #F2F4F8, #C9CDD6 55%, #8B8F99)' }}
          >
            NEXT
          </button>
        </div>
      </BlitzPanel>
    </BlitzPageWrap>
  );
}
