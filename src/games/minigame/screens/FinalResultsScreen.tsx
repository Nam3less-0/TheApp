import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMinigame } from '../context';
import { getInitials } from '../utils';
import MinigamePanel, { MinigamePageWrap, PrimaryButton } from '../components/MinigamePanel';
import PlayerAvatar from '../components/PlayerAvatar';
import type { Player } from '../types';

const PLACE = [
  { label: '1st', color: '#B39DFF', size: 'h-16 w-16 text-xl', pedestal: 'h-24' },
  { label: '2nd', color: '#C9CDD6', size: 'h-12 w-12 text-base', pedestal: 'h-16' },
  { label: '3rd', color: '#C99A7A', size: 'h-12 w-12 text-base', pedestal: 'h-12' },
  { label: '4th', color: '#8B8F99', size: 'h-11 w-11 text-sm', pedestal: 'h-9' },
];

export default function FinalResultsScreen() {
  const { state, dispatch } = useMinigame();

  const ranked = [...state.players].sort((a, b) => b.score - a.score);
  const topScore = ranked[0]?.score ?? 0;
  const winners = ranked.filter((p) => p.score === topScore);

  /** Dense ranking so genuine ties share a placing. */
  const placeFor = (player: Player) =>
    ranked.filter((p) => p.score > player.score).length;

  const podium = [ranked[1], ranked[0], ranked[2]];

  return (
    <MinigamePageWrap>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#B39DFF]">
          All three games complete
        </p>
        <h1 className="mb-2 text-center font-display text-[28px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[32px]">
          Final standings
        </h1>
        {ranked[0] && (
          <p className="mb-7 text-center font-body text-sm text-text-mid">
            {winners.length > 1 ? (
              <>
                <span className="font-bold text-[#B39DFF]">{winners.map((w) => w.name).join(' & ')}</span> tie
                at {topScore} points
              </>
            ) : (
              <>
                <span className="font-bold text-[#B39DFF]">{ranked[0].name}</span> wins with {topScore} points
              </>
            )}
          </p>
        )}
      </motion.div>

      <MinigamePanel className="mb-4">
        <div className="grid grid-cols-3 items-end gap-2.5">
          {podium.map((player, i) => {
            if (!player) return <div key={i} aria-hidden="true" />;
            const slot = PLACE[placeFor(player)] ?? PLACE[3];
            const isWinner = placeFor(player) === 0;
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.4 }}
                className="flex flex-col items-center justify-end gap-2"
              >
                {isWinner && (
                  <motion.span
                    className="text-xl leading-none"
                    style={{ color: slot.color }}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    aria-hidden="true"
                  >
                    &#9812;
                  </motion.span>
                )}
                <span
                  className={`flex items-center justify-center rounded-full font-display font-bold text-void ${slot.size}`}
                  style={{
                    background: `linear-gradient(165deg, ${slot.color}, #131417)`,
                    boxShadow: `0 0 0 2px #131417, 0 0 0 4px ${slot.color}66${isWinner ? `, 0 0 24px -2px ${slot.color}` : ''}`,
                  }}
                  aria-hidden="true"
                >
                  {getInitials(player.name)}
                </span>
                <p className="max-w-full truncate px-1 text-center font-body text-[13px] font-bold text-text-hi">
                  {player.name}
                </p>
                <div
                  className={`flex w-full flex-col items-center justify-start gap-0.5 rounded-t-xl border-x border-t pt-2.5 ${slot.pedestal}`}
                  style={{
                    background: `linear-gradient(180deg, ${slot.color}30, ${slot.color}08)`,
                    borderColor: `${slot.color}55`,
                  }}
                >
                  <span className="font-display text-2xl font-extrabold tabular-nums" style={{ color: slot.color }}>
                    {player.score}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-mid">
                    {slot.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {ranked[3] && (
          <div className="mt-4 border-t border-line pt-4">
            <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5">
              <span className="w-6 font-mono text-sm text-text-low">
                {PLACE[placeFor(ranked[3])]?.label ?? '4th'}
              </span>
              <PlayerAvatar name={ranked[3].name} size="sm" />
              <span className="min-w-0 flex-1 truncate font-body text-sm font-semibold text-text-hi">
                {ranked[3].name}
              </span>
              <span className="font-display text-base font-bold tabular-nums text-text-hi">
                {ranked[3].score}
              </span>
            </div>
          </div>
        )}
      </MinigamePanel>

      <MinigamePanel className="mb-6">
        <p className="mb-3 font-body text-sm font-bold text-text-hi">Game by game</p>
        <ul className="flex flex-col gap-2.5">
          {state.history.map((h, i) => (
            <li key={h.gameId} className="rounded-xl border border-line bg-surface px-3.5 py-2.5">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm" aria-hidden="true">
                  {h.glyph}
                </span>
                <span className="font-mono text-[11px] text-text-low">
                  Game {i + 1} &middot; {h.gameTitle}
                </span>
              </div>
              <p className="font-body text-[13px] font-semibold text-text-hi">{h.headline}</p>
              <p className="font-body text-[12px] text-text-mid">{h.summary}</p>
            </li>
          ))}
        </ul>
      </MinigamePanel>

      <div className="flex flex-col gap-3">
        <PrimaryButton onClick={() => dispatch({ type: 'RESTART' })}>Play again</PrimaryButton>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line px-4 py-3 text-center font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi"
        >
          Back to shelf
        </Link>
      </div>
    </MinigamePageWrap>
  );
}
