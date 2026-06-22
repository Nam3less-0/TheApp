import type { Top100State } from '../types';
import { getCurrentGuesserId, getDealer } from '../utils';
import PlayerAvatar from './PlayerAvatar';

interface ScoreboardStripProps {
  state: Top100State;
}

export default function ScoreboardStrip({ state }: ScoreboardStripProps) {
  const dealer = getDealer(state);
  const currentGuesserId = getCurrentGuesserId(state);

  return (
    <div
      className="mb-[22px] flex flex-wrap gap-2.5"
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
            className={`flex items-center gap-2 rounded-full border bg-surface py-2 pl-2 pr-3.5 text-[13px] font-semibold ${
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
