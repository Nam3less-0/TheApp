import { motion } from 'framer-motion';
import { useTop100 } from '../context';
import { getDealer, getTurnScores, isLastDealerSession } from '../utils';
import PlayerAvatar from './PlayerAvatar';
import {
  Top100Frame,
  Top100PageWrap,
  Top100PrimaryButton,
} from './Top100Panel';

export default function TurnRecapScreen() {
  const { state, dispatch } = useTop100();
  const dealer = getDealer(state);
  const turnScores = getTurnScores(state.claimedThisTurn);
  const scoringPlayers = state.players.filter((p) => p.id !== dealer?.id);
  const sortedScorers = [...scoringPlayers].sort(
    (a, b) => (turnScores[b.id] ?? 0) - (turnScores[a.id] ?? 0),
  );

  const isLastDealer = isLastDealerSession(state);

  return (
    <Top100PageWrap>
      <Top100Frame
        eyebrow="Turn complete"
        title={`${dealer?.name}'s recap`}
        subtitle="Points earned across 3 rounds"
      >
          <ul className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {sortedScorers.map((player, index) => {
              const earned = turnScores[player.id] ?? 0;
              const isTop = index === 0 && earned > 0;

              return (
                <motion.li
                  key={player.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.25 }}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                    isTop
                      ? 'border-steel-blue/50 bg-steel-blue/8 shadow-[inset_0_0_0_1px_rgba(111,168,220,0.2)]'
                      : 'border-line/80 bg-surface/40'
                  }`}
                >
                  <span className="w-5 font-mono text-sm text-text-low">{index + 1}</span>
                  <PlayerAvatar name={player.name} size="md" ring={isTop} />
                  <span className="min-w-0 flex-1 truncate font-body text-sm font-semibold text-text-hi">
                    {player.name}
                  </span>
                  <span className="font-mono text-base tabular-nums text-steel-blue">
                    +{earned}
                  </span>
                </motion.li>
              );
            })}
          </ul>

          <Top100PrimaryButton onClick={() => dispatch({ type: 'CONTINUE_FROM_RECAP' })}>
            {isLastDealer ? 'View final results' : 'Continue to next dealer'}
          </Top100PrimaryButton>
      </Top100Frame>
    </Top100PageWrap>
  );
}
