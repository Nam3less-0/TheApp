import { useMemo, useState } from 'react';
import {
  ITEM_PROMPT_SUGGESTIONS,
  PLAYER_PROMPT_SUGGESTIONS,
} from '../../../data/rank-up/prompts';
import { useRankUp } from '../context';
import type { QuestionType } from '../types';
import { optionsFromLabels } from '../utils';
import RankUpPanel, {
  RankUpPageWrap,
  RankUpPrimaryButton,
  RankUpSectionHeading,
  RankUpSecondaryButton,
} from './Layout';

export default function ComposeScreen() {
  const { local, confirmCompose } = useRankUp();

  const [questionType, setQuestionType] = useState<QuestionType>('players');
  const [prompt, setPrompt] = useState('');
  const [items, setItems] = useState<string[]>(() =>
    questionType === 'players'
      ? ['Alex', 'Jordan', 'Sam', 'Taylor']
      : ['Coffee', 'Apple juice', 'Beer', 'Coke Zero'],
  );

  const suggestions =
    questionType === 'players' ? PLAYER_PROMPT_SUGGESTIONS : ITEM_PROMPT_SUGGESTIONS;

  const options = useMemo(() => optionsFromLabels(items), [items]);
  const canConfirm = prompt.trim().length > 0 && options.length >= 3;

  function switchType(type: QuestionType) {
    setQuestionType(type);
    setItems(
      type === 'players'
        ? ['Alex', 'Jordan', 'Sam', 'Taylor']
        : ['Coffee', 'Apple juice', 'Beer', 'Coke Zero'],
    );
  }

  function updateItem(index: number, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addItem() {
    if (items.length >= 8) return;
    setItems((prev) => [...prev, '']);
  }

  function removeItem(index: number) {
    if (items.length <= 3) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function handleConfirm() {
    if (!canConfirm) return;
    confirmCompose(questionType, prompt.trim(), options);
  }

  return (
    <RankUpPageWrap>
      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-pewter">
          {local.playerName} — ranker
        </p>
        <h1 className="mt-1 font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
          Write your question
        </h1>
      </header>

      <div className="flex flex-col gap-6">
        <RankUpPanel compact>
          <RankUpSectionHeading title="Question type" className="mb-4" />
          <div className="grid grid-cols-2 gap-3">
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
                  className={`rounded-xl border bg-surface p-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pewter ${
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
        </RankUpPanel>

        <RankUpPanel compact>
          <RankUpSectionHeading title="Question" className="mb-4" />
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            maxLength={200}
            className="w-full resize-none rounded-xl border border-line bg-deep px-4 py-3 font-body text-[15px] text-text-hi outline-none focus-visible:border-pewter focus-visible:ring-1 focus-visible:ring-pewter"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.slice(0, 4).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setPrompt(suggestion)}
                className="rounded-full border border-line px-3 py-1.5 font-body text-[11px] text-text-mid transition-colors hover:border-pewter/50 hover:text-text-hi"
              >
                {suggestion.length > 42 ? `${suggestion.slice(0, 42)}…` : suggestion}
              </button>
            ))}
          </div>
        </RankUpPanel>

        <RankUpPanel compact>
          <RankUpSectionHeading title="Options to rank" className="mb-4" />
          <ul className="flex flex-col gap-2">
            {items.map((item, index) => (
              <li key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  maxLength={40}
                  className="min-h-11 flex-1 rounded-xl border border-line bg-deep px-4 font-body text-sm text-text-hi outline-none focus-visible:border-pewter focus-visible:ring-1 focus-visible:ring-pewter"
                />
                <RankUpSecondaryButton
                  onClick={() => removeItem(index)}
                  disabled={items.length <= 3}
                  className="shrink-0"
                >
                  Remove
                </RankUpSecondaryButton>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={addItem}
            disabled={items.length >= 8}
            className="mt-3 font-mono text-[12px] text-text-mid hover:text-text-hi disabled:opacity-40"
          >
            + Add option
          </button>
        </RankUpPanel>

        <RankUpPrimaryButton onClick={handleConfirm} disabled={!canConfirm}>
          Continue to ranking
        </RankUpPrimaryButton>
      </div>
    </RankUpPageWrap>
  );
}
