import { motion } from 'framer-motion';
import { useMinigame } from '../context';
import { ROUND_ENGINES, TOTAL_ROUNDS } from '../engines';
import { getPlayerById } from '../utils';
import MinigamePanel, { MinigamePageWrap, PrimaryButton, HAZARD, VIOLET } from '../components/MinigamePanel';
import PlayerAvatar from '../components/PlayerAvatar';
import Scoreboard from '../components/Scoreboard';

export default function ResultScreen() {
  const { state, dispatch } = useMinigame();
  const engine = ROUND_ENGINES[state.roundIndex];
  const saboteur = getPlayerById(state.players, state.saboteurId);
  const latest = state.history[state.history.length - 1];
  const buildersWon = state.lastOutcome?.buildersWon ?? false;
  const isLastRound = state.roundIndex + 1 >= TOTAL_ROUNDS;

  return (
    <MinigamePageWrap>
      <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-text-low">
        Round {state.roundIndex + 1} of {TOTAL_ROUNDS} &middot; {engine.title}
      </p>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <MinigamePanel className="mb-4">
          <h1
            className="mb-3 text-center font-display text-2xl font-extrabold"
            style={{ color: buildersWon ? '#7ED9A4' : HAZARD }}
          >
            {buildersWon ? 'Builders held the line' : 'The Saboteur got through'}
          </h1>
          <p className="mb-5 text-center font-body text-sm text-text-mid">{latest?.summary}</p>

          <div
            className="flex items-center justify-center gap-3 rounded-xl border px-4 py-3.5"
            style={{ borderColor: `${HAZARD}55`, background: `${HAZARD}12` }}
          >
            {saboteur && <PlayerAvatar name={saboteur.name} />}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: HAZARD }}>
                The Saboteur was
              </p>
              <p className="font-display text-base font-extrabold text-text-hi">{saboteur?.name}</p>
            </div>
          </div>
        </MinigamePanel>
      </motion.div>

      <MinigamePanel className="mb-6">
        <Scoreboard players={state.players} deltas={latest?.deltas} saboteurId={state.saboteurId} />
      </MinigamePanel>

      <PrimaryButton onClick={() => dispatch({ type: 'NEXT_ROUND' })}>
        {isLastRound ? 'See final results' : `Continue to round ${state.roundIndex + 2}`}
      </PrimaryButton>

      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider" style={{ color: VIOLET }}>
        {ROUND_ENGINES[Math.min(state.roundIndex + 1, TOTAL_ROUNDS - 1)]?.title}
        {!isLastRound ? ' up next' : ''}
      </p>
    </MinigamePageWrap>
  );
}
