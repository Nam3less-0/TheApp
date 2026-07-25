import { useMinigame } from '../context';
import { MINIGAMES, TOTAL_GAMES } from '../engines';
import { MinigamePageWrap } from '../components/MinigamePanel';
import RulesSheet from '../components/RulesSheet';
import type { GameOutcome } from '../types';

export default function PlayHost() {
  const { state, dispatch } = useMinigame();
  const game = MINIGAMES[state.gameIndex];
  const Play = game.Play;

  function handleResolve(outcome: GameOutcome) {
    dispatch({ type: 'RESOLVE_GAME', outcome });
  }

  return (
    <MinigamePageWrap>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-base" aria-hidden="true">
            {game.glyph}
          </span>
          <span
            className="truncate font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: game.accent }}
          >
            {game.title}
          </span>
          <span className="shrink-0 font-mono text-[10px] text-text-low">
            {state.gameIndex + 1}/{TOTAL_GAMES}
          </span>
        </div>
        <RulesSheet game={game} />
      </div>
      <Play players={state.players} onResolve={handleResolve} />
    </MinigamePageWrap>
  );
}
