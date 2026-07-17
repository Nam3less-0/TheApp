import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTop100 } from '../context';
import PlayerAvatar from './PlayerAvatar';
import { TrophyIcon } from './Top100Icons';
import {
  Top100Frame,
  Top100PageWrap,
  Top100PrimaryButton,
  Top100SecondaryButton,
} from './Top100Panel';

const PODIUM_HEIGHT = ['h-24 sm:h-28 md:h-32', 'h-32 sm:h-36 md:h-40', 'h-20 sm:h-24 md:h-28'] as const;
const PODIUM_ORDER = [1, 0, 2] as const;

export default function FinalResultsScreen() {
  const { state, dispatch } = useTop100();

  const ranked = [...state.players].sort((a, b) => b.score - a.score);
  const winner = ranked[0];
  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  return (
    <Top100PageWrap>
      <Top100Frame
        eyebrow="Game over"
        title="Final standings"
        subtitle={winner ? `${winner.name} wins with ${winner.score} points` : undefined}
        icon={
          <motion.span
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gold/15 text-gold"
          >
            <TrophyIcon className="h-3.5 w-3.5" />
          </motion.span>
        }
      >
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:items-end">
          {podium.length >= 2 && (
            <div className="mb-2 flex items-end justify-center gap-3 px-2 sm:gap-4 md:gap-6 xl:mb-0">
              {PODIUM_ORDER.map((rankIndex) => {
                const player = podium[rankIndex];
                if (!player) return null;
                const place = rankIndex + 1;
                const isWinner = place === 1;

                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rankIndex * 0.1, duration: 0.35 }}
                    className="flex min-w-0 flex-1 flex-col items-center"
                  >
                    <PlayerAvatar
                      name={player.name}
                      size={isWinner ? 'lg' : 'md'}
                      ring={isWinner}
                      className={isWinner ? 'mb-2' : 'mb-1.5'}
                    />
                    <p className="mb-2 max-w-full truncate text-center font-body text-[12px] font-bold text-text-hi sm:text-sm">
                      {player.name}
                    </p>
                    <div
                      className={`flex w-full flex-col items-center justify-end rounded-t-xl border border-line/60 px-2 pb-2 pt-3 sm:px-3 ${PODIUM_HEIGHT[rankIndex]} ${
                        isWinner
                          ? 'border-gold/40 bg-gradient-to-t from-gold/20 to-gold/5'
                          : 'bg-surface/40'
                      }`}
                    >
                      <span
                        className={`font-display text-2xl font-extrabold sm:text-3xl ${
                          isWinner ? 'text-gold-bright' : 'text-text-mid'
                        }`}
                      >
                        {place}
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-text-mid sm:text-xs">
                        {player.score} pts
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="min-w-0">
            {rest.length > 0 && (
              <ol className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                {rest.map((player, index) => (
                  <li
                    key={player.id}
                    className="flex items-center gap-3 rounded-xl border border-line/80 bg-surface/30 px-4 py-2.5"
                  >
                    <span className="w-5 font-mono text-sm text-text-low">{index + 4}</span>
                    <PlayerAvatar name={player.name} size="sm" />
                    <span className="min-w-0 flex-1 truncate font-body text-sm text-text-hi">
                      {player.name}
                    </span>
                    <span className="font-mono text-sm tabular-nums text-text-mid">
                      {player.score}
                    </span>
                  </li>
                ))}
              </ol>
            )}

            {ranked.length <= 2 && (
              <ol className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ranked.map((player, index) => {
                  const isWinner = index === 0;
                  return (
                    <li
                      key={player.id}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                        isWinner
                          ? 'border-gold/40 bg-gold/8 shadow-[inset_0_0_0_1px_rgba(201,164,74,0.25)]'
                          : 'border-line/80 bg-surface/40'
                      }`}
                    >
                      <span className="w-5 font-mono text-sm text-text-low">{index + 1}</span>
                      <PlayerAvatar name={player.name} ring={isWinner} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-body text-sm font-bold text-text-hi">
                          {player.name}
                        </p>
                        {isWinner && (
                          <p className="font-mono text-[9px] uppercase tracking-wider text-gold">
                            Winner
                          </p>
                        )}
                      </div>
                      <span className="font-mono text-base tabular-nums text-text-hi">
                        {player.score}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
              <Top100PrimaryButton onClick={() => dispatch({ type: 'PLAY_AGAIN' })} className="sm:flex-1 xl:flex-none">
                Play again
              </Top100PrimaryButton>
              <Link to="/" className="block sm:flex-1 xl:flex-none">
                <Top100SecondaryButton className="w-full">
                  Back to shelf
                </Top100SecondaryButton>
              </Link>
            </div>
          </div>
        </div>
      </Top100Frame>
    </Top100PageWrap>
  );
}
