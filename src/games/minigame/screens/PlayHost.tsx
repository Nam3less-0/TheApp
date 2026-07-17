import { useMinigame } from '../context';
import { ROUND_ENGINES } from '../engines';
import { MinigamePageWrap } from '../components/MinigamePanel';
import type { RoundOutcome } from '../types';

export default function PlayHost() {
  const { state, dispatch } = useMinigame();
  const engine = ROUND_ENGINES[state.roundIndex];
  const Play = engine.Play;

  function handleResolve(outcome: RoundOutcome) {
    dispatch({ type: 'RESOLVE_ROUND', outcome });
  }

  return (
    <MinigamePageWrap>
      <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-[#B39DFF]">
        {engine.title}
      </p>
      <Play
        roundState={state.roundState}
        players={state.players}
        saboteurId={state.saboteurId}
        onResolve={handleResolve}
      />
    </MinigamePageWrap>
  );
}
