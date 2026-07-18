import { useRankUp } from '../context';
import { labelForOption } from '../utils';
import AbandonRoundButton from './AbandonRoundButton';
import CommandCenterFrame from './CommandCenterFrame';
import { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function RevealScreen() {
  const { room, players, nextRound } = useRankUp();

  if (!room?.rankerOrder || !room.prompt) return null;

  const ranker = players.find((player) => player.id === room.rankerPlayerId);

  return (
    <RankUpPageWrap variant="display">
      <CommandCenterFrame
        eyebrow="Command center — revealed"
        title={`${ranker?.name ?? 'Ranker'}'s ranking`}
        subtitle={room.prompt}
      >
        <ol className="mb-8 flex flex-col gap-2 text-left">
          {room.rankerOrder.map((id, index) => (
            <li
              key={id}
              className="flex items-center gap-3 rounded-xl border border-pewter/40 bg-surface px-4 py-3"
            >
              <span className="font-mono text-sm font-bold text-pewter">{index + 1}</span>
              <span className="font-body text-sm font-semibold text-text-hi">
                {labelForOption(room.options, id)}
              </span>
            </li>
          ))}
        </ol>

        <p className="mb-6 font-body text-[13px] text-text-mid">
          Everyone scores themselves on their phone.
        </p>

        <RankUpPrimaryButton onClick={() => nextRound()}>Next round</RankUpPrimaryButton>
        <AbandonRoundButton className="mt-3" />
      </CommandCenterFrame>
    </RankUpPageWrap>
  );
}
