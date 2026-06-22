import { useEffect, useState } from 'react';
import RevealVault from '../../../components/RevealVault';
import { useImposter } from '../context';
import { getPlayerById } from '../utils';
import PlayerAvatar from './PlayerAvatar';
import ImposterPanel, { ImposterPageWrap } from './ImposterPanel';

const EMBER = '#C2533B';

export default function RevealScreen() {
  const { state, dispatch } = useImposter();
  const [hasPeeked, setHasPeeked] = useState(false);

  const currentId = state.revealOrder[state.revealIndex];
  const current = getPlayerById(state.players, currentId);

  useEffect(() => {
    setHasPeeked(false);
  }, [state.revealIndex]);

  if (!current) return null;

  const isImposter = currentId === state.currentImposterPlayerId;
  const word = isImposter ? state.currentImposterWord : state.currentMajorityWord;
  const isLast = state.revealIndex === state.revealOrder.length - 1;

  return (
    <ImposterPageWrap>
      <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ember">
        Round {state.currentRound} of {state.totalRounds}
      </p>

      <div className="mb-5 flex items-center justify-center gap-2" aria-hidden="true">
        {state.revealOrder.map((_, i) => {
          const done = i < state.revealIndex;
          const isCurrent = i === state.revealIndex;
          return (
            <span
              key={i}
              className={`h-2.5 rounded-full transition-all ${
                isCurrent ? 'w-6 bg-ember' : done ? 'w-2.5 bg-ember/50' : 'w-2.5 bg-line-bright'
              }`}
            />
          );
        })}
      </div>

      <ImposterPanel>
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <PlayerAvatar name={current.name} size="lg" />
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">
            Pass the phone to
          </p>
          <h1 className="font-display text-[26px] font-extrabold leading-tight text-text-hi">
            {current.name}
          </h1>
        </div>

        <RevealVault key={state.revealIndex} word={word} accent={EMBER} onPeek={() => setHasPeeked(true)} />

        <button
          type="button"
          onClick={() => dispatch({ type: 'ADVANCE_REVEAL' })}
          disabled={!hasPeeked}
          className="mt-5 w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: 'linear-gradient(180deg, #E07A5F, #C2533B 55%, #7A3526)' }}
        >
          {isLast ? "I've seen it — start discussion" : "I've seen it — pass to next player"}
        </button>
        {!hasPeeked && (
          <p className="mt-2.5 text-center font-body text-[12px] text-text-low">
            Reveal your word at least once before passing.
          </p>
        )}
      </ImposterPanel>
    </ImposterPageWrap>
  );
}
