import { motion } from 'framer-motion';
import { useMinigame } from '../context';
import { MINIGAMES } from '../engines';
import MinigamePanel, { MinigamePageWrap, PrimaryButton } from '../components/MinigamePanel';
import PlayerAvatar from '../components/PlayerAvatar';

export default function LobbyScreen() {
  const { state, dispatch } = useMinigame();

  return (
    <MinigamePageWrap>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#B39DFF]">
          Three games &middot; one winner
        </p>
        <h1 className="mb-3 text-center font-display text-[30px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[36px]">
          Minigame
        </h1>
        <p className="mb-7 text-center font-body text-sm leading-relaxed text-text-mid">
          Three completely different games back to back. Points carry across all three, and the highest
          total takes first place.
        </p>
      </motion.div>

      <MinigamePanel className="mb-4">
        <p className="mb-3 font-body text-sm font-bold text-text-hi">Tonight&rsquo;s players</p>
        <ul className="flex flex-wrap gap-2.5">
          {state.players.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-3.5"
            >
              <PlayerAvatar name={p.name} size="sm" />
              <span className="font-body text-sm font-semibold text-text-hi">{p.name}</span>
            </li>
          ))}
        </ul>
      </MinigamePanel>

      <div className="mb-6 flex flex-col gap-3">
        {MINIGAMES.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.3 }}
            className="relative overflow-hidden rounded-2xl border px-4 py-3.5"
            style={{ borderColor: `${g.accent}44`, background: `linear-gradient(150deg, ${g.accent}12, #1A1C20 70%)` }}
          >
            <span
              className="absolute left-0 top-0 h-full w-0.5"
              style={{ background: g.accent }}
              aria-hidden="true"
            />
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">
                {g.glyph}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-extrabold text-text-hi">
                  {i + 1}. {g.title}
                </p>
                <p className="font-body text-[12.5px] text-text-mid">{g.tagline}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <PrimaryButton onClick={() => dispatch({ type: 'START' })}>Start game 1</PrimaryButton>
    </MinigamePageWrap>
  );
}
