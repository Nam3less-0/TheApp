import { useEffect, useRef, useState } from 'react';
import { useExposed } from '../context';
import ExposedPanel, { ExposedPageWrap } from './ExposedPanel';

const SPINS = 5;

export default function CoinFlipScreen() {
  const { state, dispatch } = useExposed();
  const [flipping, setFlipping] = useState(false);
  const [settled, setSettled] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const outcome = state.currentOutcome;
  // rotateY multiples of 360 land on the front face (hidden); +180 lands on
  // the back face (revealed).
  const finalDeg = SPINS * 360 + (outcome === 'revealed' ? 180 : 0);

  useEffect(() => {
    setFlipping(false);
    setSettled(false);
    const startTimer = window.setTimeout(() => setFlipping(true), 250);
    return () => window.clearTimeout(startTimer);
  }, [state.currentRound]);

  useEffect(() => {
    if (!flipping) return undefined;
    timeoutRef.current = window.setTimeout(() => setSettled(true), 1750);
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, [flipping]);

  return (
    <ExposedPageWrap>
      <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-toxic">
        Round {state.currentRound} of {state.totalRounds}
      </p>

      <ExposedPanel>
        <div className="flex flex-col items-center gap-6 py-6">
          <p className="font-body text-sm text-text-mid">Flipping the coin&hellip;</p>

          <div className="coin-scene h-40 w-40">
            <div
              key={state.currentRound}
              className={`coin-disc h-40 w-40 ${flipping ? 'is-flipping' : ''}`}
              style={{ ['--fy' as string]: `${finalDeg}deg` }}
            >
              <div
                className="coin-face coin-face--front"
                style={{ background: 'linear-gradient(150deg, #dff0b0, #9BC53D 55%, #4A5A1A)' }}
              >
                <span className="font-display text-3xl font-extrabold text-void">?</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-void/70">
                  Hidden
                </span>
              </div>
              <div
                className="coin-face coin-face--back"
                style={{ background: 'linear-gradient(150deg, #f6c9bd, #E08B7A 55%, #7A3526)' }}
              >
                <span className="font-display text-3xl font-extrabold text-void">!</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-void/70">
                  Revealed
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => dispatch({ type: 'COIN_SETTLED' })}
            disabled={!settled}
            className="w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-toxic disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: 'linear-gradient(180deg, #C6E86B, #9BC53D 55%, #4A5A1A)' }}
          >
            {settled ? 'See what happened' : 'Landing\u2026'}
          </button>
        </div>
      </ExposedPanel>
    </ExposedPageWrap>
  );
}
