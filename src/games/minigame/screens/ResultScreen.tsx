import { motion } from 'framer-motion';
import { useMinigame } from '../context';
import { MINIGAMES, TOTAL_GAMES } from '../engines';
import MinigamePanel, { MinigamePageWrap, PrimaryButton } from '../components/MinigamePanel';
import Scoreboard from '../components/Scoreboard';

export default function ResultScreen() {
  const { state, dispatch } = useMinigame();
  const game = MINIGAMES[state.gameIndex];
  const latest = state.history[state.history.length - 1];
  const isLast = state.gameIndex + 1 >= TOTAL_GAMES;

  return (
    <MinigamePageWrap>
      <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-text-low">
        {game.glyph} {game.title} &middot; game {state.gameIndex + 1} of {TOTAL_GAMES}
      </p>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <MinigamePanel className="mb-4">
          <h1
            className="mb-2 text-center font-display text-[26px] font-extrabold leading-tight"
            style={{ color: game.accent }}
          >
            {latest?.headline}
          </h1>
          <p className="mb-4 text-center font-body text-sm text-text-mid">{latest?.summary}</p>

          {latest?.deltas && Object.keys(latest.deltas).length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {state.players
                .filter((p) => (latest.deltas[p.id] ?? 0) > 0)
                .map((p) => (
                  <motion.span
                    key={p.id}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-full border px-3 py-1 font-mono text-[11px] font-bold"
                    style={{ borderColor: '#7ED9A455', background: 'rgba(126,217,164,0.12)', color: '#7ED9A4' }}
                  >
                    {p.name} +{latest.deltas[p.id]}
                  </motion.span>
                ))}
            </div>
          )}
        </MinigamePanel>
      </motion.div>

      <MinigamePanel className="mb-6">
        <Scoreboard players={state.players} deltas={latest?.deltas} />
      </MinigamePanel>

      <PrimaryButton onClick={() => dispatch({ type: 'NEXT_GAME' })}>
        {isLast ? 'See final standings' : `Continue to ${MINIGAMES[state.gameIndex + 1]?.title}`}
      </PrimaryButton>
    </MinigamePageWrap>
  );
}
