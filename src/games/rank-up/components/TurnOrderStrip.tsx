import { useRankUp } from '../context';
import { isAwaitingRoundStart } from '../sync/types';
import { CrownIcon } from './RankUpIcons';

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function TurnOrderStrip() {
  const { room, players, turnOrder, turnIndex } = useRankUp();

  if (!room || isAwaitingRoundStart(room)) return null;

  const slots = turnOrder
    .map((playerId) => players.find((player) => player.id === playerId))
    .filter((player): player is NonNullable<typeof player> => Boolean(player));

  if (slots.length === 0) return null;

  const progressRatio =
    slots.length <= 1 ? 0 : turnIndex / (slots.length - 1);

  return (
    <div
      className="border-b border-line/60 px-4 py-3"
      style={{
        background: 'linear-gradient(165deg, #242228, #1C1A20 75%)',
      }}
    >
      <div className="mx-auto max-w-[900px]">
        <div className="relative flex items-start justify-between gap-2">
          <div
            className="pointer-events-none absolute top-[22px] right-[11%] left-[11%] h-0.5 rounded-full bg-[#6FA3C4]/25"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-[22px] left-[11%] h-0.5 rounded-full bg-[#6FA3C4]"
            style={{ width: `${progressRatio * 78}%` }}
            aria-hidden="true"
          />
          {slots.map((player, index) => {
            const done = index < turnIndex;
            const current = index === turnIndex;
            const upcoming = index > turnIndex;

            return (
              <div
                key={player.id}
                className={`relative z-[1] flex min-w-0 flex-1 flex-col items-center gap-1.5 ${
                  upcoming ? 'opacity-45' : ''
                }`}
              >
                <div
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full border font-mono text-xs font-bold ${
                    done
                      ? 'border-good/50 bg-good/10 text-good'
                      : current
                        ? 'border-[#D8B36A] bg-[#D8B36A]/10 text-[#D8B36A] rank-up-turn-pulse'
                        : 'border-line bg-deep/60 text-text-low'
                  }`}
                  title={player.name}
                >
                  {initials(player.name)}
                  {done ? (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-good text-[9px] text-void">
                      ✓
                    </span>
                  ) : null}
                  {current ? (
                    <span className="absolute -top-1.5 -right-1 flex h-5 w-5 items-center justify-center rounded-md bg-[#D8B36A]/20 text-[#D8B36A]">
                      <CrownIcon className="h-3 w-3" />
                    </span>
                  ) : null}
                </div>
                <span
                  className={`max-w-[4.5rem] truncate text-center font-body text-[10px] ${
                    current ? 'font-semibold text-text-hi' : 'text-text-low'
                  }`}
                >
                  {player.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
