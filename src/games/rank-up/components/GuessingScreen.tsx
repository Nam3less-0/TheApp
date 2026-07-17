import { useState } from 'react';
import { useRankUp } from '../context';
import { GuesserScreenHeader } from './GuesserBadge';
import RankEditor from './RankEditor';
import { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function GuessingScreen() {
  const { local, room, submitGuess } = useRankUp();
  const [order, setOrder] = useState<string[]>([]);

  if (!room?.options.length) return null;

  const canSubmit = order.length === room.options.length;

  async function handleSubmit() {
    if (!canSubmit) return;
    await submitGuess(order);
  }

  return (
    <RankUpPageWrap>
      <GuesserScreenHeader
        eyebrow={`${local.playerName} — private`}
        title="Your guess"
        subtitle={room.prompt ?? undefined}
      />

      <RankEditor
        options={room.options}
        order={order}
        onOrderChange={setOrder}
        heading="Predicted ranking"
        description="Tap to add, then drag to reorder from best to worst."
      />

      <div className="mt-8">
        <RankUpPrimaryButton onClick={handleSubmit} disabled={!canSubmit}>
          Lock in guess
        </RankUpPrimaryButton>
      </div>
    </RankUpPageWrap>
  );
}
