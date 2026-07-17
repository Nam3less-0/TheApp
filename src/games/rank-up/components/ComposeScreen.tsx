import { useMemo, useState } from 'react';
import {
  drawPromptPreset,
  presetToReelItem,
  presetsForType,
  type RankPromptPreset,
} from '../../../data/rank-up/prompts';
import { useRankUp } from '../context';
import type { QuestionType } from '../types';
import { optionsFromLabels } from '../utils';
import CommandCenterFrame from './CommandCenterFrame';
import PromptReelTrack from './PromptReelTrack';
import { CrownIcon } from './RankUpIcons';
import RankUpPanel, {
  RankUpPageWrap,
  RankUpPrimaryButton,
  RankUpSecondaryButton,
} from './Layout';

export default function ComposeScreen() {
  const { local, players, confirmCompose } = useRankUp();

  const [questionType, setQuestionType] = useState<QuestionType>('players');
  const [drawnPreset, setDrawnPreset] = useState<RankPromptPreset>(() =>
    drawPromptPreset('players'),
  );
  const [spinKey, setSpinKey] = useState(0);
  const [isSettled, setIsSettled] = useState(false);

  const reelPool = useMemo(
    () => presetsForType(questionType).map(presetToReelItem),
    [questionType],
  );
  const reelItem = useMemo(() => presetToReelItem(drawnPreset), [drawnPreset]);

  const playerLabels = useMemo(
    () => players.map((player) => player.name).filter((name) => name.trim().length > 0),
    [players],
  );

  const optionLabels =
    drawnPreset.type === 'players'
      ? playerLabels
      : (drawnPreset.items ?? []).filter((item) => item.trim().length > 0);

  const canConfirm = isSettled && optionLabels.length >= 3;

  function switchType(type: QuestionType) {
    if (type === questionType) return;
    setQuestionType(type);
    setDrawnPreset(drawPromptPreset(type));
    setSpinKey((key) => key + 1);
    setIsSettled(false);
  }

  function handleRespin() {
    setDrawnPreset((current) => drawPromptPreset(questionType, current.id));
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
          Spin the reel, reroll if you want, then lock in and rank in secret.
        </p>
      </header>

      <CommandCenterFrame>
        <div className="mb-5 grid grid-cols-2 gap-3">
          {(
            [
              { id: 'players' as const, label: 'Player rank', hint: 'Rank people' },
              { id: 'items' as const, label: 'Item rank', hint: 'Rank things' },
            ] as const
          ).map((type) => {
            const selected = questionType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => switchType(type.id)}
                disabled={!isSettled}
                className={`rounded-xl border bg-surface p-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pewter disabled:opacity-50 ${
                  selected
                    ? 'border-pewter shadow-[0_0_0_1px_#9B93A8_inset]'
                    : 'border-line hover:border-line-bright'
                }`}
                aria-pressed={selected}
              >
                <p className="font-body text-sm font-bold text-text-hi">{type.label}</p>
                <p className="mt-1 font-body text-[12px] text-text-mid">{type.hint}</p>
              </button>
            );
          })}
        </div>

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
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
              Ranking
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

      <div className="mt-6">
        <RankUpPrimaryButton onClick={handleConfirm} disabled={!canConfirm}>
          {isSettled ? 'Lock in question' : 'Waiting for reel…'}
        </RankUpPrimaryButton>
      </div>
    </RankUpPageWrap>
  );
}
