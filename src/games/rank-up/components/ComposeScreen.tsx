import { useMemo, useState } from 'react';
import {
  drawPromptPreset,
  optionLabelsForPreset,
  presetToReelItem,
  RANK_PROMPT_PRESETS,
  type RankPromptPreset,
} from '../../../data/rank-up/prompts';
import { useRankUp } from '../context';
import { optionsFromLabels } from '../utils';
import CommandCenterFrame from './CommandCenterFrame';
import PromptReelTrack from './PromptReelTrack';
import AbandonRoundButton from './AbandonRoundButton';
import { CrownIcon } from './RankUpIcons';
import RankUpPanel, {
  RankUpPageWrap,
  RankUpPrimaryButton,
  RankUpSecondaryButton,
} from './Layout';

export default function ComposeScreen() {
  const { local, players, confirmCompose } = useRankUp();

  const [drawnPreset, setDrawnPreset] = useState<RankPromptPreset>(() => drawPromptPreset());
  const [spinKey, setSpinKey] = useState(0);
  const [isSettled, setIsSettled] = useState(false);

  const reelPool = useMemo(
    () => RANK_PROMPT_PRESETS.map(presetToReelItem),
    [],
  );
  const reelItem = useMemo(() => presetToReelItem(drawnPreset), [drawnPreset]);

  const playerNames = useMemo(
    () => players.map((player) => player.name),
    [players],
  );

  const optionLabels = useMemo(
    () => optionLabelsForPreset(drawnPreset, playerNames),
    [drawnPreset, playerNames],
  );

  const canConfirm = isSettled && optionLabels.length >= 3;

  function handleRespin() {
    setDrawnPreset((current) => drawPromptPreset(current.id));
    setSpinKey((key) => key + 1);
    setIsSettled(false);
  }

  function handleConfirm() {
    if (!canConfirm) return;
    confirmCompose(drawnPreset.type, drawnPreset.prompt, optionsFromLabels(optionLabels));
  }

  return (
    <RankUpPageWrap>
      <header className="mb-6 text-center">
        <p className="flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-pewter">
          <CrownIcon className="h-3.5 w-3.5" />
          {local.playerName} — ranker
        </p>
        <h1 className="mt-1 font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
          Draw your question
        </h1>
        <p className="mt-2 font-body text-sm text-text-mid">
          Player or item questions — spin the reel, reroll if you want, then rank in secret.
        </p>
      </header>

      <CommandCenterFrame>
        <PromptReelTrack
          item={reelItem}
          pool={reelPool}
          spinKey={spinKey}
          onSettled={setIsSettled}
        />

        <RankUpSecondaryButton
          onClick={handleRespin}
          disabled={!isSettled}
          className="mt-5 w-full text-center"
        >
          ↻ Reroll question
        </RankUpSecondaryButton>

        {isSettled ? (
          <RankUpPanel compact className="mt-5 border-pewter/25">
            <p className="mb-2 flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
                Ranking
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-pewter">
                {drawnPreset.type === 'players' ? 'Players' : 'Items'} · {optionLabels.length}
              </span>
            </p>
            <ul className="flex flex-wrap gap-2">
              {optionLabels.map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-line bg-deep/60 px-3 py-1 font-body text-[12px] text-text-hi"
                >
                  {label}
                </li>
              ))}
            </ul>
            {drawnPreset.type === 'players' && optionLabels.length < 3 ? (
              <p className="mt-3 font-body text-[12px] text-bad">
                Need at least 3 players in the room for a player rank.
              </p>
            ) : null}
          </RankUpPanel>
        ) : (
          <p className="mt-5 text-center font-mono text-[11px] text-text-low" aria-live="polite">
            Spinning…
          </p>
        )}
      </CommandCenterFrame>

      <div className="mt-6 flex flex-col gap-3">
        <RankUpPrimaryButton onClick={handleConfirm} disabled={!canConfirm}>
          {isSettled ? 'Lock in question' : 'Waiting for reel…'}
        </RankUpPrimaryButton>
        <AbandonRoundButton />
      </div>
    </RankUpPageWrap>
  );
}
