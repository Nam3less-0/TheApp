import type { Top100State } from '../types';
import { getCurrentGuesserId, getDealer } from '../utils';
import { DealerIcon, GuesserIcon } from './Top100Icons';
import PlayerAvatar from './PlayerAvatar';

interface ScoreboardStripProps {
  state: Top100State;
  layout?: 'strip' | 'sidebar';
}

export default function ScoreboardStrip({
  state,
  layout = 'strip',
}: ScoreboardStripProps) {
  const dealer = getDealer(state);
  const currentGuesserId = getCurrentGuesserId(state);

  if (layout === 'sidebar') {
    return (
      <div className="flex flex-col gap-2" role="list" aria-label="Scoreboard">
        {state.players.map((player) => {
          const isDealer = dealer?.id === player.id;
          const isActive = currentGuesserId === player.id;

          return (
            <div
              key={player.id}
              role="listitem"
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-200 ${
                isActive
                  ? 'border-steel-blue/60 bg-steel-blue/10 shadow-[0_0_20px_-6px_rgba(111,168,220,0.4),inset_0_0_0_1px_rgba(111,168,220,0.3)]'
                  : isDealer
                    ? 'border-pewter/50 bg-surface/50'
                    : 'border-line/80 bg-surface/30'
              }`}
            >
              <PlayerAvatar name={player.name} size="sm" ring={isActive} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-sm font-semibold text-text-hi">
                  {player.name}
                </p>
                <p className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-text-low">
                  {isDealer ? (
                    <>
                      <DealerIcon className="h-3 w-3 text-pewter" />
                      <span className="text-pewter">Dealing</span>
                    </>
                  ) : isActive ? (
                    <>
                      <GuesserIcon className="h-3 w-3 text-steel-blue" />
                      <span className="text-steel-blue">Guessing</span>
                    </>
                  ) : (
                    `${player.score} pts`
                  )}
                </p>
              </div>
              {!isDealer && (
                <span
                  className={`shrink-0 font-mono text-xs tabular-nums ${isActive ? 'text-steel-blue' : 'text-text-mid'}`}
                >
                  {player.score}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="-mx-1 flex flex-wrap gap-2 px-1 pb-0.5"
      role="list"
      aria-label="Scoreboard"
    >
      {state.players.map((player) => {
        const isDealer = dealer?.id === player.id;
        const isActive = currentGuesserId === player.id;

        return (
          <div
            key={player.id}
            role="listitem"
            className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-[13px] font-semibold transition-all ${
              isActive
                ? 'border-steel-blue/60 bg-steel-blue/10 shadow-[0_0_16px_-4px_rgba(111,168,220,0.45),inset_0_0_0_1px_rgba(111,168,220,0.25)]'
                : isDealer
                  ? 'border-pewter/50 bg-surface/60'
                  : 'border-line bg-surface/40'
            }`}
          >
            <PlayerAvatar name={player.name} size="sm" ring={isActive} />
            {isDealer ? (
              <div>
                <span className="text-text-hi">{player.name}</span>
                <p className="font-mono text-[9px] uppercase tracking-wider text-pewter">
                  Dealing
                </p>
              </div>
            ) : (
              <span className="text-text-hi">
                {player.name}{' '}
                <span className={`font-mono font-normal tabular-nums ${isActive ? 'text-steel-blue' : 'text-text-mid'}`}>
                  {player.score}
                </span>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
