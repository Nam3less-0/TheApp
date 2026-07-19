import { useState } from 'react';
import { useRankUp } from '../context';
import CommandCenterFrame from './CommandCenterFrame';
import ErrorPanel from './ErrorPanel';
import GuesserProgressRow from './GuesserProgressRow';
import AbandonRoundButton from './AbandonRoundButton';
import RankUpPanel, { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function RankerWaitScreen() {
  const {
    local,
    room,
    submittedCount,
    guesserCount,
    revealRound,
    canRevealRound,
    sessionHostActive,
  } = useRankUp();
  const [revealing, setRevealing] = useState(false);

  if (!room?.prompt) return null;

  const canReveal = guesserCount === 0 || submittedCount >= guesserCount;
  const allIn = guesserCount > 0 && submittedCount >= guesserCount;

  async function handleReveal() {
    if (!canReveal || revealing || !canRevealRound) return;
    setRevealing(true);
    try {
      await revealRound();
    } finally {
      setRevealing(false);
    }
  }

  return (
    <RankUpPageWrap variant="display">
      <CommandCenterFrame
        eyebrow="Command center — live"
        title={room.prompt}
        subtitle="Your ranking is live. Guessers are ranking on their phones."
      >
        <GuesserProgressRow className="mb-6" variant="waiting" />

        {local.syncError ? (
          <ErrorPanel message={local.syncError} className="!mb-4" />
        ) : null}

        {sessionHostActive ? (
          <RankUpPanel compact className="mb-6">
            <p className="text-center font-body text-sm text-text-mid">
              {allIn
                ? 'All guesses are in — the gameroom host will reveal.'
                : 'The gameroom host will reveal when everyone has guessed.'}
            </p>
          </RankUpPanel>
        ) : (
          <>
            {allIn ? (
              <p className="mb-6 rounded-xl border border-good/30 bg-good/10 px-4 py-3 text-center font-body text-sm font-semibold text-good">
                All guesses are in — ready to reveal.
              </p>
            ) : guesserCount === 0 ? (
              <p className="mb-6 text-center font-body text-sm text-text-mid">
                No other players — reveal whenever you&apos;re ready.
              </p>
            ) : (
              <p className="mb-6 text-center font-body text-sm text-text-mid">
                Waiting for {guesserCount - submittedCount} more{' '}
                {guesserCount - submittedCount === 1 ? 'guess' : 'guesses'}…
              </p>
            )}

            <RankUpPrimaryButton onClick={handleReveal} disabled={!canReveal || revealing}>
              {revealing
                ? 'Revealing…'
                : canReveal
                  ? 'Reveal answer'
                  : `Reveal answer (${submittedCount}/${guesserCount})`}
            </RankUpPrimaryButton>
          </>
        )}
        {!sessionHostActive ? <AbandonRoundButton className="mt-3" /> : null}
      </CommandCenterFrame>
    </RankUpPageWrap>
  );
}
