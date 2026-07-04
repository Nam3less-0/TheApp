import { useEffect, useState } from 'react';
import { useExposed } from '../context';
import { getPlayerById } from '../utils';
import ExposedPanel, { ExposedPageWrap } from './ExposedPanel';
import PlayerAvatar from './PlayerAvatar';
import QuestionVault from './QuestionVault';

export default function QuestionScreen() {
  const { state, dispatch } = useExposed();
  const [hasPeeked, setHasPeeked] = useState(false);

  const current = getPlayerById(state.players, state.currentPlayerId);

  useEffect(() => {
    setHasPeeked(false);
  }, [state.currentRound]);

  if (!current) return null;

  return (
    <ExposedPageWrap>
      <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-toxic">
        Round {state.currentRound} of {state.totalRounds}
      </p>

      <div className="mb-5 flex items-center justify-center gap-2" aria-hidden="true">
        {Array.from({ length: state.totalRounds }, (_, i) => {
          const done = i < state.currentRound - 1;
          const isCurrent = i === state.currentRound - 1;
          return (
            <span
              key={i}
              className={`h-2.5 rounded-full transition-all ${
                isCurrent ? 'w-6 bg-toxic' : done ? 'w-2.5 bg-toxic/50' : 'w-2.5 bg-line-bright'
              }`}
            />
          );
        })}
      </div>

      <ExposedPanel>
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <PlayerAvatar name={current.name} size="lg" />
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">
            Pass the phone to
          </p>
          <h1 className="max-w-full break-words font-display text-[22px] font-extrabold leading-tight text-text-hi sm:text-[26px]">
            {current.name}
          </h1>
          <p className="max-w-[380px] font-body text-[13px] text-text-mid">
            Read your question, then answer it out loud by naming one of the
            other three — don&rsquo;t say what the question was.
          </p>
        </div>

        <QuestionVault question={state.currentQuestion} onPeek={() => setHasPeeked(true)} />

        <button
          type="button"
          onClick={() => dispatch({ type: 'ANSWERED' })}
          disabled={!hasPeeked}
          className="mt-5 w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-toxic disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: 'linear-gradient(180deg, #C6E86B, #9BC53D 55%, #4A5A1A)' }}
        >
          I&rsquo;ve answered — flip the coin
        </button>
        {!hasPeeked && (
          <p className="mt-2.5 text-center font-body text-[12px] text-text-low">
            Read your question at least once before flipping.
          </p>
        )}
      </ExposedPanel>
    </ExposedPageWrap>
  );
}
