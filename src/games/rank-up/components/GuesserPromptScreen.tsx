import { useMemo } from 'react';
import { useRankUp } from '../context';
import { shuffleOptions } from '../utils';
import { GuesserScreenHeader } from './GuesserBadge';
import RankUpPanel, { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function GuesserPromptScreen() {
  const { room, startGuessingLocal } = useRankUp();

  const shuffledOptions = useMemo(
    () => (room ? shuffleOptions(room.options) : []),
    [room],
  );

  if (!room?.prompt) return null;

  const canGuess = room.phase === 'display' || room.phase === 'guessing';

  return (
    <RankUpPageWrap>
      <GuesserScreenHeader
        eyebrow="Round live"
        title="Rank your guess"
        subtitle="Read the ranker's mind — predict their secret order."
      />

      <RankUpPanel compact className="mb-6">
        <p className="font-body text-base font-bold leading-snug text-text-hi">{room.prompt}</p>
        <ul className="mt-4 flex flex-col gap-2">
          {shuffledOptions.map((option) => (
            <li
              key={option.id}
              className="rounded-lg border border-line bg-deep/50 px-4 py-3 font-body text-sm font-semibold text-text-hi"
            >
              {option.label}
            </li>
          ))}
        </ul>
      </RankUpPanel>

      {canGuess ? (
        <RankUpPrimaryButton onClick={startGuessingLocal}>Start my ranking</RankUpPrimaryButton>
      ) : (
        <p className="text-center font-body text-sm text-text-mid">Waiting for ranker…</p>
      )}
    </RankUpPageWrap>
  );
}
