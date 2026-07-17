import { useEffect, useState } from 'react';
import { useMinigame } from '../context';
import { ROUND_ENGINES } from '../engines';
import { getPlayerById } from '../utils';
import MinigamePanel, { MinigamePageWrap, PrimaryButton, VIOLET } from '../components/MinigamePanel';
import PlayerAvatar from '../components/PlayerAvatar';
import RoleVault from '../components/RoleVault';

export default function RevealScreen() {
  const { state, dispatch } = useMinigame();
  const [hasPeeked, setHasPeeked] = useState(false);

  const currentId = state.revealOrder[state.revealIndex];
  const current = getPlayerById(state.players, currentId);
  const engine = ROUND_ENGINES[state.roundIndex];

  useEffect(() => {
    setHasPeeked(false);
  }, [state.revealIndex]);

  if (!current) return null;

  const briefing = engine.briefing(currentId, state.roundState, state.saboteurId);
  const isLast = state.revealIndex === state.revealOrder.length - 1;

  return (
    <MinigamePageWrap>
      <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: VIOLET }}>
        {engine.title}
      </p>

      <div className="mb-5 flex items-center justify-center gap-2" aria-hidden="true">
        {state.revealOrder.map((_, i) => {
          const done = i < state.revealIndex;
          const isCurrent = i === state.revealIndex;
          return (
            <span
              key={i}
              className="h-2.5 rounded-full transition-all"
              style={{
                width: isCurrent ? '24px' : '10px',
                background: isCurrent ? VIOLET : done ? `${VIOLET}80` : 'rgba(220,224,232,0.22)',
              }}
            />
          );
        })}
      </div>

      <MinigamePanel>
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <PlayerAvatar name={current.name} size="lg" />
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">Pass the phone to</p>
          <h1 className="max-w-full break-words font-display text-[22px] font-extrabold leading-tight text-text-hi sm:text-[26px]">
            {current.name}
          </h1>
        </div>

        <RoleVault key={state.revealIndex} briefing={briefing} onPeek={() => setHasPeeked(true)} />

        <div className="mt-5">
          <PrimaryButton disabled={!hasPeeked} onClick={() => dispatch({ type: 'ADVANCE_REVEAL' })}>
            {isLast ? "I've seen it — start the round" : "I've seen it — pass to next player"}
          </PrimaryButton>
        </div>
        {!hasPeeked && (
          <p className="mt-2.5 text-center font-body text-[12px] text-text-low">
            Reveal your role at least once before passing.
          </p>
        )}
      </MinigamePanel>
    </MinigamePageWrap>
  );
}
