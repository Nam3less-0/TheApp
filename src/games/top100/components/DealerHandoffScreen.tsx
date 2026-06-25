import { useState } from 'react';
import { getAvailableCategories } from '../../../data/categories';
import { useTop100 } from '../context';
import { getDealerIndex, getTurnScores } from '../utils';
import CategoryPicker from './CategoryPicker';
import Top100Panel, {
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
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
          Next dealer
        </p>
        <h1 className="mt-1 break-words font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
          {nextDealer?.name}&apos;s turn
        </h1>
        <p className="mt-2 max-w-xl font-body text-sm text-text-mid">
          {prevDealer?.name} finished dealing. Review the last turn, then pick a new category.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start lg:gap-8">
        {state.claimedThisTurn.length > 0 ? (
          <Top100Panel compact>
            <Top100SectionHeading
              title="Last turn summary"
              description={`Points from ${prevDealer?.name}'s round`}
              className="mb-4"
            />
            <ul className="flex flex-col gap-2">
              {state.players
                .filter((p) => p.id !== prevDealer?.id)
                .map((player) => (
                  <li
                    key={player.id}
                    className="flex items-center justify-between rounded-xl border border-line bg-surface px-3.5 py-2.5 font-body text-sm"
                  >
                    <span className="text-text-hi">{player.name}</span>
                    <span className="font-mono text-steel-blue">
                      +{turnScores[player.id] ?? 0} pts
                    </span>
                  </li>
                ))}
            </ul>
          </Top100Panel>
        ) : (
          <Top100Panel compact className="hidden lg:flex lg:min-h-[220px] lg:items-center lg:justify-center">
            <p className="text-center font-body text-sm text-text-mid">
              No points scored last turn — pick a category to keep going.
            </p>
          </Top100Panel>
        )}

        <Top100Panel compact>
          <CategoryPicker
            categories={available}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            heading="Next category"
            description={
              nextDealer
                ? `${nextDealer.name} deals this round — choose an unused category.`
                : undefined
            }
          />

          <div className="mt-6 border-t border-line pt-6">
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
        </Top100Panel>
      </div>
    </Top100PageWrap>
  );
}
