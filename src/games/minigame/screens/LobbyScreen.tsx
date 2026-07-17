import { useMinigame } from '../context';
import { ROUND_ENGINES } from '../engines';
import MinigamePanel, { MinigamePageWrap, PrimaryButton } from '../components/MinigamePanel';
import PlayerAvatar from '../components/PlayerAvatar';

export default function LobbyScreen() {
  const { state, dispatch } = useMinigame();

  return (
    <MinigamePageWrap>
      <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#B39DFF]">
        10 rounds &middot; 1 hidden Saboteur each time
      </p>
      <h1 className="mb-3 text-center font-display text-[28px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[32px]">
        Minigame
      </h1>
      <p className="mb-7 text-center font-body text-sm text-text-mid">
        Every round, one of you is secretly the Saboteur &mdash; reshuffled fresh each time. Ten completely
        different ways to build, vote, and get caught (or not).
      </p>

      <MinigamePanel className="mb-4">
        <p className="mb-3 font-body text-sm font-bold text-text-hi">Tonight&rsquo;s crew</p>
        <ul className="flex flex-wrap gap-2.5">
          {state.players.map((p) => (
            <li key={p.id} className="flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-3.5">
              <PlayerAvatar name={p.name} size="sm" />
              <span className="font-body text-sm font-semibold text-text-hi">{p.name}</span>
            </li>
          ))}
        </ul>
      </MinigamePanel>

      <MinigamePanel className="mb-6">
        <p className="mb-3 font-body text-sm font-bold text-text-hi">The lineup</p>
        <ol className="flex flex-col gap-2">
          {ROUND_ENGINES.map((engine, i) => (
            <li key={engine.id} className="flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3 py-2">
              <span className="w-5 font-mono text-xs text-text-low">{i + 1}</span>
              <span className="text-base" aria-hidden="true">{engine.glyph}</span>
              <span className="min-w-0 flex-1 truncate font-body text-sm font-semibold text-text-hi">{engine.title}</span>
            </li>
          ))}
        </ol>
      </MinigamePanel>

      <MinigamePanel className="mb-6">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-[#B39DFF]">Scoring</p>
        <p className="font-body text-[13px] leading-snug text-text-mid">
          Builders win a round &rarr; every Builder gets <span className="font-semibold text-text-hi">+1</span>.
          Saboteur wins a round &rarr; the Saboteur gets <span className="font-semibold text-text-hi">+2</span>.
          Highest total after 10 rounds takes it.
        </p>
      </MinigamePanel>

      <PrimaryButton onClick={() => dispatch({ type: 'START' })}>Begin round 1</PrimaryButton>
    </MinigamePageWrap>
  );
}
