import type { Top100State } from '../types';
import { getCurrentGuesserId, getDealer } from '../utils';
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
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-[border-color,box-shadow] ${
                isActive
                  ? 'border-steel-blue bg-steel-blue/10 shadow-[0_0_0_1px_#6FA8DC_inset]'
                  : isDealer
                    ? 'border-pewter/60 bg-surface/60'
                    : 'border-line bg-surface/40'
              }`}
            >
              <PlayerAvatar name={player.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-sm font-semibold text-text-hi">
                  {player.name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-text-low">
                  {isDealer ? 'Dealing' : isActive ? 'Guessing' : `${player.score} pts`}
                </p>
              </div>
              {!isDealer && (
                <span className="shrink-0 font-mono text-xs text-text-mid">{player.score}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5"
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
            className={`flex shrink-0 items-center gap-2 rounded-full border bg-surface py-2 pl-2 pr-3.5 text-[13px] font-semibold ${
              isActive
                ? 'border-steel-blue shadow-[0_0_0_1px_#6FA8DC_inset,0_0_16px_-4px_#6FA8DC]'
                : isDealer
                  ? 'border-pewter'
                  : 'border-line'
            }`}
          >
            <PlayerAvatar name={player.name} size="sm" />
            {isDealer ? (
              <div>
                <span className="text-text-hi">{player.name}</span>
                <p className="font-mono text-[9px] uppercase tracking-wider text-text-low">
                  Dealing
                </p>
              </div>
            ) : (
              <span className="text-text-hi">
                {player.name}{' '}
                <span className="font-mono font-normal text-text-mid">
                  {player.score} pts
                </span>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
