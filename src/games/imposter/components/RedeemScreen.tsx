import { useState } from 'react';
import { useImposter } from '../context';
import { getPlayerById } from '../utils';
import ImposterPanel, { ImposterPageWrap } from './ImposterPanel';
import PlayerAvatar from './PlayerAvatar';

export default function RedeemScreen() {
  const { state, synced, isImposter, playerId, submitRedemptionGuess } = useImposter();
  const [selected, setSelected] = useState<string | null>(null);

  const imposter = getPlayerById(state.players, state.currentImposterPlayerId);
  const options = state.currentBucket.words;
  const canSubmit = selected !== null;

  function submitGuess() {
    if (selected === null) return;
    void submitRedemptionGuess(selected);
  }

  if (synced && playerId !== state.currentImposterPlayerId) {
    return (
      <ImposterPageWrap>
        <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ember">
          Round {state.currentRound} of {state.totalRounds}
        </p>
        <ImposterPanel className="text-center">
          <p className="font-body text-sm font-semibold text-text-hi">Redemption round</p>
          <p className="mt-2 font-body text-[13px] text-text-mid">
            {imposter?.name} was caught and gets one guess at the majority word…
          </p>
        </ImposterPanel>
      </ImposterPageWrap>
    );
  }

  return (
    <ImposterPageWrap>
      <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ember">
        Round {state.currentRound} of {state.totalRounds}
      </p>
      <h1 className="mb-1 text-center font-display text-2xl font-extrabold leading-tight text-text-hi sm:text-[28px]">
        Caught — last chance
      </h1>
      <p className="mb-6 text-center font-body text-sm text-text-mid">
        {synced && isImposter
          ? 'The table voted you out. Pick the majority word to steal a point.'
          : 'The table voted out the imposter. They get one guess at the majority word.'}
      </p>

      <ImposterPanel>
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <PlayerAvatar name={imposter?.name ?? '?'} size="lg" />
          <p className="font-body text-sm text-text-mid">
            <span className="font-bold text-text-hi">{imposter?.name}</span>, which word did
            everyone else have?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {options.map((word) => {
            const isSelected = selected === word;
            return (
              <button
                key={word}
                type="button"
                onClick={() => setSelected(word)}
                aria-pressed={isSelected}
                className={`flex min-h-[60px] items-center justify-center rounded-xl border px-3.5 py-3 text-center transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember ${
                  isSelected
                    ? 'border-ember shadow-[0_0_0_1px_#C2533B_inset]'
                    : 'border-line bg-surface hover:border-line-bright'
                }`}
              >
                <span className="min-w-0 break-words font-body text-[15px] font-semibold text-text-hi">
                  {word}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={submitGuess}
          disabled={!canSubmit}
          className="mt-6 w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: 'linear-gradient(180deg, #E07A5F, #C2533B 55%, #7A3526)' }}
        >
          Lock in my guess
        </button>
      </ImposterPanel>
    </ImposterPageWrap>
  );
}
