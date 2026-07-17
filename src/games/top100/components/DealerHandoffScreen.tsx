import { useState } from 'react';
import { getAvailableCategories } from '../../../data/categories';
import { useTop100 } from '../context';
import { getDealerIndex, getTurnScores } from '../utils';
import CategoryPicker from './CategoryPicker';
import PlayerAvatar from './PlayerAvatar';
import Top100Panel, {
  Top100Frame,
  Top100PageWrap,
  Top100PrimaryButton,
  Top100SectionHeading,
} from './Top100Panel';

export default function DealerHandoffScreen() {
  const { state, dispatch } = useTop100();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const dealerIndex = getDealerIndex(state);
  const nextDealer = state.players[(dealerIndex + 1) % state.players.length];
  const available = getAvailableCategories(state.usedCategoryIds);
  const turnScores = getTurnScores(state.claimedThisTurn);
  const prevDealer = state.players[dealerIndex];

  const canContinue = selectedCategoryId !== null && available.length > 0;

  return (
    <Top100PageWrap>
      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel-blue">
          Next dealer
        </p>
        <div className="mt-2 flex items-center gap-4">
          {nextDealer && <PlayerAvatar name={nextDealer.name} size="lg" ring />}
          <div>
            <h1 className="break-words font-display text-[26px] font-extrabold tracking-[-0.03em] text-text-hi sm:text-[32px]">
              {nextDealer?.name}&apos;s turn
            </h1>
            <p className="mt-1 max-w-xl font-body text-sm text-text-mid">
              {prevDealer?.name} finished dealing. Review the last turn, then pick a new category.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:items-start xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {state.claimedThisTurn.length > 0 ? (
          <Top100Panel compact glow className="min-w-0">
            <Top100SectionHeading
              title="Last turn summary"
              description={`Points from ${prevDealer?.name}'s round`}
              className="mb-4"
            />
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {state.players
                .filter((p) => p.id !== prevDealer?.id)
                .map((player, index) => {
                  const earned = turnScores[player.id] ?? 0;
                  return (
                    <li
                      key={player.id}
                      className="flex items-center gap-3 rounded-xl border border-line/80 bg-surface/40 px-3.5 py-2.5"
                    >
                      <span className="w-5 font-mono text-xs text-text-low">{index + 1}</span>
                      <PlayerAvatar name={player.name} size="sm" />
                      <span className="min-w-0 flex-1 truncate font-body text-sm text-text-hi">
                        {player.name}
                      </span>
                      <span className="font-mono text-sm tabular-nums text-steel-blue">
                        +{earned}
                      </span>
                    </li>
                  );
                })}
            </ul>
          </Top100Panel>
        ) : (
          <Top100Panel compact className="hidden min-h-[180px] items-center justify-center lg:flex">
            <p className="max-w-[240px] text-center font-body text-sm leading-relaxed text-text-mid">
              No points scored last turn — pick a category to keep going.
            </p>
          </Top100Panel>
        )}

        <div className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <Top100Frame
            eyebrow="New category"
            title="Choose the next list"
            subtitle={
              nextDealer
                ? `${nextDealer.name} will deal this round.`
                : undefined
            }
          >
            <CategoryPicker
              categories={available}
              selectedId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
              heading=""
              description="Pick an unused category for this round."
            />

            <div className="mt-6 border-t border-line/60 pt-6">
              <Top100PrimaryButton
                disabled={!canContinue}
                onClick={() => {
                  if (selectedCategoryId) {
                    dispatch({ type: 'CONFIRM_HANDOFF', categoryId: selectedCategoryId });
                  }
                }}
              >
                Start dealing
              </Top100PrimaryButton>
            </div>
          </Top100Frame>
        </div>
      </div>
    </Top100PageWrap>
  );
}
