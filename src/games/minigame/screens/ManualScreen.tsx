import { motion } from 'framer-motion';
import { useMinigame } from '../context';
import { MINIGAMES, TOTAL_GAMES } from '../engines';
import MinigamePanel, { MinigamePageWrap, PrimaryButton } from '../components/MinigamePanel';

export default function ManualScreen() {
  const { state, dispatch } = useMinigame();
  const game = MINIGAMES[state.gameIndex];

  return (
    <MinigamePageWrap>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: game.accent }}>
          Game {state.gameIndex + 1} of {TOTAL_GAMES}
        </p>
        <div className="mb-2 flex items-center justify-center gap-2.5">
          <span className="text-3xl" aria-hidden="true">
            {game.glyph}
          </span>
          <h1 className="font-display text-[28px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[32px]">
            {game.title}
          </h1>
        </div>
        <p className="mb-6 text-center font-body text-sm text-text-mid">{game.tagline}</p>
      </motion.div>

      <MinigamePanel className="mb-4">
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-text-low">The setup</p>
        <p className="font-body text-[13.5px] leading-relaxed text-text-hi">{game.manual.premise}</p>
      </MinigamePanel>

      <MinigamePanel className="mb-4">
        <p className="mb-3 font-body text-sm font-bold text-text-hi">How it works</p>
        <ol className="flex flex-col gap-2.5">
          {game.manual.howToPlay.map((step, i) => (
            <li key={i} className="flex gap-2.5">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold"
                style={{ background: `${game.accent}22`, color: game.accent }}
              >
                {i + 1}
              </span>
              <span className="font-body text-[13px] leading-snug text-text-mid">{step}</span>
            </li>
          ))}
        </ol>
      </MinigamePanel>

      <MinigamePanel className="mb-6">
        <p className="mb-2.5 font-body text-sm font-bold text-text-hi">Points</p>
        <ul className="flex flex-col gap-1.5">
          {game.manual.scoring.map((line, i) => (
            <li key={i} className="flex gap-2 font-body text-[13px] text-text-mid">
              <span style={{ color: game.accent }}>&bull;</span>
              {line}
            </li>
          ))}
        </ul>
      </MinigamePanel>

      <PrimaryButton onClick={() => dispatch({ type: 'BEGIN_GAME' })}>Begin</PrimaryButton>
    </MinigamePageWrap>
  );
}
