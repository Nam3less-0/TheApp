import type { Player } from '../types';
import { COLORS, formatScore, getInitials } from '../utils';

interface ScoreChipsProps {
  players: Player[];
  activePlayerId: string | null;
}

export default function ScoreChips({ players, activePlayerId }: ScoreChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {players.map((player) => {
        const active = player.id === activePlayerId;
        return (
          <div
            key={player.id}
            className="flex items-center gap-[7px] rounded-full border bg-surface py-1.5 pl-2 pr-3 text-[13px]"
            style={{
              borderColor: active ? COLORS.sapphireBright : 'rgba(220,224,232,0.10)',
              boxShadow: active ? `inset 0 0 0 1px ${COLORS.sapphireBright}` : 'none',
            }}
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full font-display text-[9px] font-bold text-void"
              style={{ background: 'linear-gradient(165deg, #F2F4F8, #8B8F99)' }}
              aria-hidden="true"
            >
              {getInitials(player.name)}
            </span>
            <span className="font-body font-semibold text-text-hi">{player.name}</span>
            <span className="font-mono text-[11px] text-text-mid">
              {formatScore(player.score)}
            </span>
            <span className="flex items-center gap-1" aria-hidden="true">
              <span
                title="Phone a Friend"
                className="text-[11px] leading-none"
                style={{
                  color: player.lifelines.phoneAFriend ? COLORS.goldBright : COLORS.goldDim,
                  opacity: player.lifelines.phoneAFriend ? 1 : 0.4,
                }}
              >
                ☎
              </span>
              <span
                title="What Choices"
                className="text-[11px] leading-none"
                style={{
                  color: player.lifelines.whatChoices
                    ? COLORS.sapphireBright
                    : COLORS.sapphireDim,
                  opacity: player.lifelines.whatChoices ? 1 : 0.4,
                }}
              >
                ☰
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
