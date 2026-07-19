import { useState } from 'react';
import { useRankUp } from '../context';
import { defaultRankOrder } from '../utils';
import { GuesserScreenHeader } from './GuesserBadge';
import AbandonRoundButton from './AbandonRoundButton';
import ErrorPanel from './ErrorPanel';
import RankEditor from './RankEditor';
import { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function GuessingScreen() {
  const { local, room, submitGuess } = useRankUp();
  const [order, setOrder] = useState<string[]>(() =>
    room ? defaultRankOrder(room.options) : [],
  );
  const [submitting, setSubmitting] = useState(false);

  if (!room?.options.length) return null;

  const canSubmit = order.length === room.options.length;

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await submitGuess(order);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <RankUpPageWrap>
      <GuesserScreenHeader
        eyebrow="Round live — your turn"
        title="Rank your guess"
        subtitle={room.prompt ?? undefined}
      />

      {local.syncError ? (
        <ErrorPanel message={local.syncError} className="mb-4" />
      ) : null}

      <RankEditor
        options={room.options}
        order={order}
        onOrderChange={setOrder}
        heading="Predicted ranking"
        description="Drag to reorder from best to worst."
      />

      <div className="mt-8 flex flex-col gap-3">
        <RankUpPrimaryButton onClick={handleSubmit} disabled={!canSubmit || submitting}>
          {submitting ? 'Locking in…' : 'Lock in guess'}
        </RankUpPrimaryButton>
        <AbandonRoundButton />
      </div>
    </RankUpPageWrap>
  );
}
