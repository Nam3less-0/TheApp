import { useState } from 'react';
import { getAvailableCategories } from '../../../data/categories';
import { useTop100 } from '../context';
import { getDealerIndex, getTurnScores } from '../utils';
import CategoryPicker from './CategoryPicker';
import Top100Panel, { Top100PageWrap } from './Top100Panel';

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
      <h1 className="mb-2 font-display text-[30px] font-extrabold tracking-[-0.5px] text-text-hi">
        {nextDealer?.name}&apos;s turn
      </h1>
      <p className="mb-8 font-body text-sm text-text-mid">
        {prevDealer?.name} finished dealing. Pick a new category to begin.
      </p>

      <Top100Panel>
        {state.claimedThisTurn.length > 0 && (
          <section className="mb-6">
            <p className="mb-3 font-body text-sm font-bold text-text-hi">Last turn summary</p>
            <ul className="flex flex-col gap-2">
              {state.players
                .filter((p) => p.id !== prevDealer?.id)
                .map((player) => (
                  <li
                    key={player.id}
                    className="flex justify-between rounded-xl border border-line bg-surface px-3 py-2 font-body text-sm"
                  >
                    <span className="text-text-mid">{player.name}</span>
                    <span className="font-mono text-steel-blue">
                      +{turnScores[player.id] ?? 0} pts
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        )}

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

        <button
          type="button"
          onClick={() => {
            if (selectedCategoryId) {
              dispatch({ type: 'CONFIRM_HANDOFF', categoryId: selectedCategoryId });
            }
          }}
          disabled={!canContinue}
          className="mt-6 w-full rounded-xl border-none px-4 py-[15px] font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: 'linear-gradient(180deg, #F2F4F8, #C9CDD6 50%, #8B8F99)',
          }}
        >
          Start dealing
        </button>
      </Top100Panel>
    </Top100PageWrap>
  );
}
