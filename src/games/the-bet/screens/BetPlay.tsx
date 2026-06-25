import { useCallback, useEffect, useRef, useState } from 'react';
import { useBet } from '../context';
import TimerRing from '../components/TimerRing';
import { BetGoldButton } from '../components/BetLayout';
import { playTimerAlarm } from '../playTimerAlarm';

const COUNTDOWN_SECONDS = 3;
const TIMER_SECONDS = 60;

type PlayStage = 'ready' | 'countdown' | 'go' | 'timer' | 'finished';

export default function BetPlay() {
  const { state, dispatch } = useBet();
  const [stage, setStage] = useState<PlayStage>('ready');
  const [countdownLeft, setCountdownLeft] = useState(COUNTDOWN_SECONDS);
  const [timerLeft, setTimerLeft] = useState(TIMER_SECONDS);
  const alarmPlayedRef = useRef(false);

  const round = state.currentRound;
  const category = round?.category.text ?? '';
  const danger = stage === 'timer' && timerLeft <= 10;
  const isActivePlay = stage === 'timer' || stage === 'finished';

  const handleBack = useCallback(() => {
    if (stage === 'ready') {
      dispatch({ type: 'CANCEL_PLAY' });
      return;
    }
    const ok = window.confirm('Cancel round?');
    if (ok) dispatch({ type: 'CANCEL_PLAY' });
  }, [stage, dispatch]);

  useEffect(() => {
    if (stage !== 'countdown') return;

    if (countdownLeft <= 0) {
      setStage('go');
      return;
    }

    const timer = setTimeout(() => setCountdownLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [stage, countdownLeft]);

  useEffect(() => {
    if (stage !== 'go') return;

    const hold = setTimeout(() => {
      setStage('timer');
      setTimerLeft(TIMER_SECONDS);
    }, 900);

    return () => clearTimeout(hold);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'timer') return;

    if (timerLeft <= 0) {
      setStage('finished');
      return;
    }

    const timer = setTimeout(() => setTimerLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [stage, timerLeft]);

  useEffect(() => {
    if (stage !== 'finished' || alarmPlayedRef.current) return;

    alarmPlayedRef.current = true;
    const stopAlarm = playTimerAlarm();
    return stopAlarm;
  }, [stage]);

  function startCountdown() {
    setStage('countdown');
    setCountdownLeft(COUNTDOWN_SECONDS);
    alarmPlayedRef.current = false;
  }

  function handlePlayAgain() {
    dispatch({ type: 'NEXT_ROUND' });
  }

  const isCountdownPhase = stage === 'ready' || stage === 'countdown' || stage === 'go';
  const countdownDisplay =
    stage === 'go' ? 'GO' : stage === 'countdown' ? String(countdownLeft) : String(COUNTDOWN_SECONDS);
  const countdownProgress =
    stage === 'go' ? 0 : stage === 'countdown' ? countdownLeft / COUNTDOWN_SECONDS : 1;

  return (
    <div className="relative flex min-h-[calc(100svh-49px)] flex-col items-center justify-center px-4 py-8">
      {!isActivePlay ? (
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-4 top-4 font-mono text-xs text-text-low transition-colors hover:text-text-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          ← Back
        </button>
      ) : null}

      {isCountdownPhase ? (
        <>
          <TimerRing
            diameter={220}
            strokeWidth={4}
            progress={countdownProgress}
            strokeClassName={stage === 'go' ? 'text-good' : 'text-gold'}
          >
            <span
              className={`font-display text-6xl font-extrabold tabular-nums motion-safe:animate-[countPulse_0.9s_ease] ${
                stage === 'go' ? 'text-good bet-go-flash' : 'text-text-hi'
              }`}
            >
              {countdownDisplay}
            </span>
          </TimerRing>

          <div className="mt-8 max-w-sm text-center">
            <p className="font-body text-sm text-text-mid">{category}</p>
          </div>

          {stage === 'ready' ? (
            <div className="mt-10 w-full max-w-xs">
              <BetGoldButton onClick={startCountdown}>Start countdown</BetGoldButton>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="mb-6 max-w-sm text-center">
            <p className="font-body text-sm text-text-mid">{category}</p>
          </div>

          <div className="relative">
            {[0, 0.7, 1.4].map((delay) => (
              <div
                key={delay}
                className={`bet-timer-pulse pointer-events-none absolute inset-0 rounded-full border motion-safe:animate-[timerPulse_2s_ease-out_infinite] ${
                  stage === 'finished' || danger ? 'border-bad/40' : 'border-gold/30'
                }`}
                style={{ animationDelay: `${delay}s` }}
                aria-hidden="true"
              />
            ))}

            <TimerRing
              diameter={280}
              strokeWidth={6}
              progress={stage === 'finished' ? 0 : timerLeft / TIMER_SECONDS}
              danger={stage === 'finished' || danger}
            >
              {stage === 'finished' ? (
                <span className="px-4 text-center font-display text-2xl font-extrabold leading-tight text-bad motion-safe:animate-[countPulse_0.9s_ease]">
                  Time&apos;s up!
                </span>
              ) : (
                <span
                  className={`font-display text-5xl font-extrabold tabular-nums motion-safe:transition-colors motion-safe:duration-500 ${
                    danger ? 'text-bad' : 'text-text-hi'
                  }`}
                >
                  {timerLeft}
                </span>
              )}
            </TimerRing>
          </div>

          {stage === 'finished' ? (
            <div className="mt-10 w-full max-w-xs">
              <BetGoldButton onClick={handlePlayAgain}>Play again?</BetGoldButton>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
