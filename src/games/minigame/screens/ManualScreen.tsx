import { useMinigame } from '../context';
import { ROUND_ENGINES, TOTAL_ROUNDS } from '../engines';
import MinigamePanel, { MinigamePageWrap, PrimaryButton, HAZARD, VIOLET } from '../components/MinigamePanel';

export default function ManualScreen() {
  const { state, dispatch } = useMinigame();
  const engine = ROUND_ENGINES[state.roundIndex];

  return (
    <MinigamePageWrap>
      <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#B39DFF]">
        Round {state.roundIndex + 1} of {TOTAL_ROUNDS}
      </p>
      <div className="mb-2 flex items-center justify-center gap-2">
        <span className="text-2xl" aria-hidden="true">{engine.glyph}</span>
        <h1 className="font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
          {engine.title}
        </h1>
      </div>
      <p className="mb-7 text-center font-body text-sm text-text-mid">{engine.tagline}</p>

      <MinigamePanel className="mb-4">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-text-low">The setup</p>
        <p className="font-body text-sm leading-snug text-text-hi">{engine.manual.premise}</p>
      </MinigamePanel>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border px-3.5 py-3" style={{ borderColor: `${VIOLET}55`, background: `${VIOLET}12` }}>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: VIOLET }}>
            Builders want
          </p>
          <p className="font-body text-[13px] leading-snug text-text-hi">{engine.manual.builderGoal}</p>
        </div>
        <div className="rounded-xl border px-3.5 py-3" style={{ borderColor: `${HAZARD}55`, background: `${HAZARD}12` }}>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: HAZARD }}>
            Saboteur wants
          </p>
          <p className="font-body text-[13px] leading-snug text-text-hi">{engine.manual.saboteurGoal}</p>
        </div>
      </div>

      <MinigamePanel className="mb-7">
        <p className="mb-3 font-body text-sm font-bold text-text-hi">How to play</p>
        <ol className="flex flex-col gap-2.5">
          {engine.manual.howToPlay.map((step, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface font-mono text-[10px] text-text-low">
                {i + 1}
              </span>
              <span className="font-body text-[13px] leading-snug text-text-mid">{step}</span>
            </li>
          ))}
        </ol>
      </MinigamePanel>

      <PrimaryButton onClick={() => dispatch({ type: 'BEGIN_ROUND' })}>Reveal roles</PrimaryButton>
    </MinigamePageWrap>
  );
}
