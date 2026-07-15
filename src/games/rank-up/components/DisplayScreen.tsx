import { useMemo } from 'react';
import { useRankUp } from '../context';
import { shuffleOptions } from '../utils';
import RankUpPanel, { RankUpPageWrap, RankUpPrimaryButton } from './Layout';

export default function DisplayScreen() {
  const { room, players, submittedCount, guesserCount, openGuessing } = useRankUp();

  const shuffledOptions = useMemo(
    () => (room ? shuffleOptions(room.options) : []),
    [room],
  );

  if (!room?.prompt) return null;

  const ranker = players.find((player) => player.id === room.rankerPlayerId);

  return (
    <RankUpPageWrap variant="display">
      <div className="text-center">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-pewter">
          Live — synced to all phones
        </p>
        <RankUpPanel compact className="mb-8 border-pewter/30">
          <p className="font-display text-2xl font-extrabold leading-tight text-text-hi sm:text-3xl">
            {room.prompt}
          </p>
          <p className="mt-4 font-body text-sm text-text-mid">
            Ranked by {ranker?.name ?? 'ranker'} — match their order on your phone.
          </p>
        </RankUpPanel>

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

        <p className="mb-4 font-mono text-[12px] text-text-mid">
          Guesses locked: {submittedCount}/{guesserCount}
        </p>

        <RankUpPrimaryButton onClick={openGuessing}>
          Open guessing for everyone
        </RankUpPrimaryButton>
      </div>
    </RankUpPageWrap>
  );
}
