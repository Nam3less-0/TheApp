import { useEffect, useState } from 'react';
import RevealVault from '../../../components/RevealVault';
import { useImposter } from '../context';
import { getPlayerById } from '../utils';
import PlayerAvatar from './PlayerAvatar';
import ImposterPanel, { ImposterPageWrap } from './ImposterPanel';

const EMBER = '#C2533B';

/**
 * Hold-to-peek panel for the blank-round imposter: no word, just confirmation
 * that they're the imposter this round (mirrors RevealVault's interaction).
 */
function BlankImposterVault({ onPeek }: { onPeek: () => void }) {
  const [peeking, setPeeking] = useState(false);
  const [revealedOnce, setRevealedOnce] = useState(false);

  function start() {
    setPeeking(true);
    if (!revealedOnce) {
      setRevealedOnce(true);
      onPeek();
    }
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Press and hold to reveal your role"
        className="flex min-h-[140px] w-full select-none flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border px-5 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
        style={{
          touchAction: 'none',
          borderColor: peeking ? EMBER : 'rgba(220,224,232,0.16)',
          background: peeking
            ? `radial-gradient(circle at 50% 40%, ${EMBER}1f, #131417 70%)`
            : 'repeating-linear-gradient(-45deg, #1A1C20, #1A1C20 6px, #222428 6px, #222428 12px)',
          boxShadow: peeking
            ? `inset 0 2px 18px rgba(0,0,0,0.55), 0 0 0 1px ${EMBER}33, 0 0 28px ${EMBER}33`
            : 'inset 0 2px 12px rgba(0,0,0,0.4)',
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          start();
        }}
        onPointerUp={() => setPeeking(false)}
        onPointerLeave={() => setPeeking(false)}
        onPointerCancel={() => setPeeking(false)}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === ' ' || e.key === 'Enter') setPeeking(false);
        }}
        onBlur={() => setPeeking(false)}
      >
        {peeking ? (
          <>
            <span
              className="font-display text-[2rem] font-extrabold leading-tight sm:text-[2.5rem]"
              style={{ color: EMBER }}
            >
              You're the imposter
            </span>
            <span className="font-body text-[13px] text-text-mid">
              No word this round — blend in.
            </span>
          </>
        ) : (
          <span
            className="select-none whitespace-nowrap font-display text-[2rem] font-extrabold leading-tight text-text-low/70 blur-[10px] sm:text-[2.5rem]"
            aria-hidden="true"
          >
            XKM?TQWZ
          </span>
        )}
      </div>
      <p className="mt-2.5 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-text-low">
        {peeking ? 'Release to hide' : 'Press & hold to reveal your role'}
      </p>
    </div>
  );
}

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
  const isBlankImposter = isImposter && state.currentMode === 'blank';
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
          <h1 className="max-w-full break-words font-display text-[22px] font-extrabold leading-tight text-text-hi sm:text-[26px]">
            {current.name}
          </h1>
        </div>

        {isBlankImposter ? (
          <BlankImposterVault onPeek={() => setHasPeeked(true)} />
        ) : (
          <RevealVault key={state.revealIndex} word={word} accent={EMBER} onPeek={() => setHasPeeked(true)} />
        )}

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
