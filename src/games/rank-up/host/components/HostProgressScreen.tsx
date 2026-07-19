import { useRankUpHost } from '../context';
import PlayerAvatarChip from '../../components/PlayerAvatarChip';
import RankUpPanel, { RankUpPageWrap } from '../../components/Layout';
import { CrownIcon } from '../../components/RankUpIcons';

export default function HostProgressScreen() {
  const { room, players, submittedCount, guesserCount } = useRankUpHost();

  if (!room?.prompt) return null;

  const ranker = players.find((player) => player.id === room.rankerPlayerId);
  const guessers = players.filter((player) => player.id !== room.rankerPlayerId);
  const progress = guesserCount > 0 ? Math.round((submittedCount / guesserCount) * 100) : 0;
  const allIn = guesserCount > 0 && submittedCount >= guesserCount;

  return (
    <RankUpPageWrap variant="display">
      <header className="mb-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6FA3C4]">
          Host display — live
        </p>
        <h1 className="mt-2 font-display text-[28px] font-extrabold leading-tight text-text-hi sm:text-4xl">
          {room.prompt}
        </h1>
        <p className="mt-3 inline-flex items-center justify-center gap-2 font-body text-sm text-text-mid">
          <CrownIcon className="h-4 w-4 text-pewter" />
          <span>
            Ranker:{' '}
            <span className="font-semibold text-text-hi">{ranker?.name ?? 'Unknown'}</span>
          </span>
        </p>
      </header>

      <RankUpPanel compact className="mx-auto max-w-2xl border-[#6FA3C4]/25">
        <div className="mb-2 flex items-end justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
            Guess progress
          </p>
          <p className="font-display text-2xl font-extrabold text-text-hi">
            {submittedCount}
            <span className="text-lg text-text-low"> / {guesserCount}</span>
          </p>
        </div>

        <div className="mb-2 h-3 overflow-hidden rounded-full bg-deep/80">
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #6FA3C4, #8BB8D4)',
            }}
          />
        </div>

        <p className="text-center font-body text-sm text-text-mid">
          {allIn
            ? 'All guesses in — waiting for reveal'
            : `${submittedCount} of ${guesserCount} guesses in`}
        </p>

        <div className="mt-6 flex flex-wrap items-start justify-center gap-4">
          {guessers.map((player) => (
            <PlayerAvatarChip
              key={player.id}
              player={player}
              submitted={player.guessSubmitted}
            />
          ))}
        </div>
      </RankUpPanel>
    </RankUpPageWrap>
  );
}
