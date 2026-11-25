import type { Player } from '../types';
import { COLORS, formatScore, getInitials } from '../utils';

interface ScoreChipsProps {
  players: Player[];
  activePlayerId: string | null;
  onSelectPlayer?: (playerId: string) => void;
}

export default function ScoreChips({
  players,
  activePlayerId,
  onSelectPlayer,
}: ScoreChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {players.map((player) => {
        const active = player.id === activePlayerId;
        const selectable = Boolean(onSelectPlayer) && !active;
        return (
          <button
            key={player.id}
            type="button"
            onClick={
              selectable && onSelectPlayer
                ? () => onSelectPlayer(player.id)
                : undefined
            }
            title={selectable ? 'Hand them the next pick' : undefined}
            className="flex items-center gap-[7px] rounded-full border bg-surface py-1.5 pl-2 pr-3 text-[13px]"
            style={{
              borderColor: active ? COLORS.sapphireBright : 'rgba(220,224,232,0.10)',
              boxShadow: active ? `inset 0 0 0 1px ${COLORS.sapphireBright}` : 'none',
              cursor: selectable ? 'pointer' : 'default',
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
                  color:
                    player.lifelines.phoneAFriend > 0
                      ? COLORS.goldBright
                      : COLORS.goldDim,
                  opacity: player.lifelines.phoneAFriend > 0 ? 1 : 0.4,
                }}
              >
                ☎{player.lifelines.phoneAFriend > 1 ? player.lifelines.phoneAFriend : ''}
              </span>
              <span
                title="What Choices"
                className="text-[11px] leading-none"
                style={{
                  color:
                    player.lifelines.whatChoices > 0
                      ? COLORS.sapphireBright
                      : COLORS.sapphireDim,
                  opacity: player.lifelines.whatChoices > 0 ? 1 : 0.4,
                }}
              >
                ☰{player.lifelines.whatChoices > 1 ? player.lifelines.whatChoices : ''}
              </span>
              <span
                title="Snipe"
                className="text-[11px] leading-none"
                style={{
                  color: player.lifelines.snipe > 0 ? COLORS.bad : '#5E3A34',
                  opacity: player.lifelines.snipe > 0 ? 1 : 0.4,
                }}
              >
                ⊕{player.lifelines.snipe > 1 ? player.lifelines.snipe : ''}
              </span>
              {player.streak >= 2 && (
                <span
                  title={`${player.streak} in a row`}
                  className="text-[11px] leading-none"
                  style={{ color: COLORS.goldBright }}
                >
                  🔥{player.streak}
                </span>
              )}
              {player.secondWind && (
                <span
                  title="Second wind still available"
                  className="text-[11px] leading-none"
                  style={{ color: COLORS.sapphireBright }}
                >
                  ↺
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
