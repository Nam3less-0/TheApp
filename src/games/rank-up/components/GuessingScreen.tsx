import { useEffect, useState } from 'react';
import { useRankUp } from '../context';
import { defaultRankOrder } from '../utils';
import { GuesserScreenHeader } from './GuesserBadge';
import AbandonRoundButton from './AbandonRoundButton';
import RankEditor from './RankEditor';
import { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function GuessingScreen() {
  const { local, room, submitGuess } = useRankUp();
  const [order, setOrder] = useState<string[]>(() =>
    room ? defaultRankOrder(room.options) : [],
  );

  useEffect(() => {
    if (room?.options) {
      setOrder(defaultRankOrder(room.options));
    }
  }, [room?.prompt]);

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
        description="Drag to reorder from best to worst."
      />

      <div className="mt-8 flex flex-col gap-3">
        <RankUpPrimaryButton onClick={handleSubmit} disabled={!canSubmit}>
          Lock in guess
        </RankUpPrimaryButton>
        <AbandonRoundButton />
      </div>
    </RankUpPageWrap>
  );
}
