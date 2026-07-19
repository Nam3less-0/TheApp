import { useRankUp } from '../context';
import {
  formatTeamMembers,
  getOpposingTeam,
  getRankerTeammate,
} from '../teams';
import PlayerAvatarChip from './PlayerAvatarChip';
import RankUpPanel from './Layout';

interface GuesserProgressRowProps {
  showLabel?: boolean;
  className?: string;
  variant?: 'waiting' | 'locked';
}

export default function GuesserProgressRow({
  showLabel = true,
  className = '',
  variant = 'locked',
}: GuesserProgressRowProps) {
  const { room, players, teams, submittedCount, guesserCount, isTeamsGame } = useRankUp();

  if (!room) return null;

  const allIn = guesserCount > 0 && submittedCount >= guesserCount;

  const label =
    variant === 'waiting'
      ? allIn
        ? `All guesses in — ${submittedCount}/${guesserCount}`
        : `Guesses coming in — ${submittedCount}/${guesserCount}`
      : `Guesses locked — ${submittedCount}/${guesserCount}`;

  if (isTeamsGame) {
    const ranker = players.find((player) => player.id === room.rankerPlayerId);
    const teammate = getRankerTeammate(players, room.rankerPlayerId);
    const opposingTeam = getOpposingTeam(teams, ranker?.teamId ?? null);
    const opposingMembers = opposingTeam
      ? players.filter((player) => player.teamId === opposingTeam.id)
      : [];
    const opposingSubmitted = opposingMembers.some((player) => player.guessSubmitted);

    return (
      <div className={className}>
        {showLabel ? (
          <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-text-mid">
            {label}
          </p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          {teammate ? (
            <RankUpPanel compact className="border-[#6FA3C4]/25">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#6FA3C4]">
                Ranker&apos;s teammate
              </p>
              <div className="flex justify-center">
                <PlayerAvatarChip
                  player={teammate}
                  submitted={teammate.guessSubmitted}
                />
              </div>
            </RankUpPanel>
          ) : null}
          {opposingTeam ? (
            <RankUpPanel compact className="border-copper/25">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-copper">
                {formatTeamMembers(opposingTeam, players)}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {opposingMembers.map((player) => (
                  <PlayerAvatarChip
                    key={player.id}
                    player={player}
                    submitted={opposingSubmitted}
                  />
                ))}
              </div>
            </RankUpPanel>
          ) : null}
        </div>
      </div>
    );
  }

  const guessers = players.filter((player) => player.id !== room.rankerPlayerId);

  return (
    <div className={className}>
      {showLabel ? (
        <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-text-mid">
          {label}
        </p>
      ) : null}
      <div className="flex flex-wrap items-start justify-center gap-4">
        {guessers.map((player) => (
          <PlayerAvatarChip
            key={player.id}
            player={player}
            submitted={player.guessSubmitted}
          />
        ))}
      </div>
    </div>
  );
}
