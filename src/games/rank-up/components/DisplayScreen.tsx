import { useMemo } from 'react';
import { useRankUp } from '../context';
import { shuffleOptions } from '../utils';
import CommandCenterFrame from './CommandCenterFrame';
import GuesserProgressRow from './GuesserProgressRow';
import { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function DisplayScreen() {
  const { room, players, openGuessing } = useRankUp();

  const shuffledOptions = useMemo(
    () => (room ? shuffleOptions(room.options) : []),
    [room],
  );

  if (!room?.prompt) return null;

  const ranker = players.find((player) => player.id === room.rankerPlayerId);

  return (
    <RankUpPageWrap variant="display">
      <CommandCenterFrame
        eyebrow="Command center — live"
        title={room.prompt}
        subtitle={`Ranked by ${ranker?.name ?? 'ranker'} — match their order on your phone.`}
      >
        <ul className="mb-8 flex flex-col gap-3">
          {shuffledOptions.map((option) => (
            <li
              key={option.id}
              className="rounded-xl border border-line bg-surface/90 px-5 py-4 font-body text-lg font-semibold text-text-hi"
            >
              {option.label}
            </li>
          ))}
        </ul>

        <GuesserProgressRow className="mb-6" />

        <RankUpPrimaryButton onClick={openGuessing}>
          Open guessing for everyone
        </RankUpPrimaryButton>
      </CommandCenterFrame>
    </RankUpPageWrap>
  );
}
