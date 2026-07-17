import { useRankUp } from '../context';
import CommandCenterFrame from './CommandCenterFrame';
import GuesserProgressRow from './GuesserProgressRow';
import { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function RankerWaitScreen() {
  const { room, revealRound } = useRankUp();

  if (!room?.prompt) return null;

  return (
    <RankUpPageWrap variant="display">
      <CommandCenterFrame
        eyebrow="Command center — waiting"
        title="Waiting for guesses"
        subtitle={room.prompt}
      >
        <GuesserProgressRow className="mb-8" />

        <RankUpPrimaryButton onClick={revealRound}>Reveal my answer</RankUpPrimaryButton>
      </CommandCenterFrame>
    </RankUpPageWrap>
  );
}
