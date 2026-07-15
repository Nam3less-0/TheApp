import { useState } from 'react';
import { useRankUp } from '../context';
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
      <header className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-pewter">
          {local.playerName} — private
        </p>
        <h1 className="mt-1 font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
          Your guess
        </h1>
        <p className="mt-2 font-body text-sm text-text-mid">{room.prompt}</p>
      </header>

      <RankEditor
        options={room.options}
        order={order}
        onOrderChange={setOrder}
        heading="Predicted ranking"
        description="Tap in order from what you think is #1 to last place."
      />

      <div className="mt-8">
        <RankUpPrimaryButton onClick={handleSubmit} disabled={!canSubmit}>
          Lock in guess
        </RankUpPrimaryButton>
      </div>
    </RankUpPageWrap>
  );
}
