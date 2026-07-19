import { useState } from 'react';
import { useRankUp } from '../context';
import { defaultRankOrder } from '../utils';
import DifficultyBadge from './DifficultyBadge';
import RankEditor from './RankEditor';
import AbandonRoundButton from './AbandonRoundButton';
import ErrorPanel from './ErrorPanel';
import { CrownIcon } from './RankUpIcons';
import RankUpPanel, { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function RankerRankScreen() {
  const { local, confirmRankerOrder } = useRankUp();
  const draft = local.roundDraft;
  const [order, setOrder] = useState<string[]>(() =>
    draft ? defaultRankOrder(draft.options) : [],
  );
  const [publishing, setPublishing] = useState(false);

  if (!draft) return null;

  const canConfirm = order.length === draft.options.length;

  async function handleConfirm() {
    if (!canConfirm || publishing) return;
    setPublishing(true);
    try {
      await confirmRankerOrder(order);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <RankUpPageWrap>
      <header className="mb-6">
        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-pewter">
          <CrownIcon className="h-3.5 w-3.5" />
          Private — don&apos;t show anyone
        </p>
        <h1 className="mt-1 font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
          Lock in your order
        </h1>
      </header>

      {local.syncError ? (
        <ErrorPanel message={local.syncError} className="!mb-4" />
      ) : null}

      <RankUpPanel compact className="mb-4">
        <p className="font-body text-base font-bold leading-snug text-text-hi">{draft.prompt}</p>
      </RankUpPanel>

      <DifficultyBadge options={draft.options} className="mb-6" />

      <RankEditor
        options={draft.options}
        order={order}
        onOrderChange={setOrder}
        heading="Your secret ranking"
        description="Drag to reorder from best to worst."
      />

      <div className="mt-8 flex flex-col gap-3">
        <RankUpPrimaryButton onClick={handleConfirm} disabled={!canConfirm || publishing}>
          {publishing ? 'Publishing…' : 'Publish round'}
        </RankUpPrimaryButton>
        <AbandonRoundButton />
      </div>
    </RankUpPageWrap>
  );
}
