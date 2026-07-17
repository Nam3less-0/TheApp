import { useRankUp } from '../context';
import { GuesserScreenHeader } from './GuesserBadge';
import OrderList from './OrderList';
import RankUpPanel, { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function GuesserRevealScreen() {
  const { local, room, beginSelfScore } = useRankUp();

  if (!room?.prompt) return null;

  const revealed = room.phase === 'reveal' && room.rankerOrder;

  if (!revealed) {
    return (
      <RankUpPageWrap>
        <GuesserScreenHeader
          eyebrow="Guess locked in"
          title="Waiting for reveal"
          subtitle={room.prompt}
        />
        <RankUpPanel compact>
          <p className="text-center font-body text-sm text-text-mid">
            The ranker will reveal their order soon. You&apos;ll score yourself after.
          </p>
        </RankUpPanel>
      </RankUpPageWrap>
    );
  }

  return (
    <RankUpPageWrap>
      <GuesserScreenHeader
        eyebrow="Revealed"
        title="Ranker's order"
        subtitle={room.prompt}
      />

      <RankUpPanel compact className="mb-6">
        <OrderList
          order={room.rankerOrder!}
          options={room.options}
          showRail
          bestLabel="Best"
          worstLabel="Worst"
        />
      </RankUpPanel>

      <RankUpPrimaryButton onClick={beginSelfScore}>Score myself</RankUpPrimaryButton>
      <p className="mt-3 text-center font-body text-[12px] text-text-low">
        Your score: {local.score}
      </p>
    </RankUpPageWrap>
  );
}
