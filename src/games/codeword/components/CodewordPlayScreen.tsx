import { useState } from 'react';
import { useCodeword } from '../context';
import { PlayPageWrap } from './CodewordPanel';
import InterceptScreen, {
  buildInterceptPayload,
  emptyTheirDraft,
  type TheirDraft,
} from './InterceptScreen';
import OurTurnScreen, { emptyOurDraft, type OurDraft } from './OurTurnScreen';
import PlayChrome from './PlayChrome';
import type { PlayMode } from './TurnSwitcher';

export default function CodewordPlayScreen() {
  const { state, dispatch } = useCodeword();
  const [mode, setMode] = useState<PlayMode>('ours');
  const [ourDraft, setOurDraft] = useState<OurDraft>(emptyOurDraft);
  const [theirDraft, setTheirDraft] = useState<TheirDraft>(emptyTheirDraft);

  if (!state.teamCard) return null;

  function resolveOurTurn(outcome: 'correct' | 'wrong') {
    if (!ourDraft.code) return;
    dispatch({
      type: 'LOG_OUR_TURN',
      code: ourDraft.code,
      hints: ourDraft.hints,
      outcome,
    });
    setOurDraft(emptyOurDraft);
  }

  function resolveIntercept(outcome: 'intercepted' | 'missed') {
    const { hintsHeard, actualCode } = buildInterceptPayload(theirDraft);
    dispatch({
      type: 'LOG_INTERCEPT',
      hintsHeard,
      actualCode,
      outcome,
    });
    setTheirDraft(emptyTheirDraft);
  }

  return (
    <PlayPageWrap>
      <PlayChrome
        round={state.currentRound}
        misses={state.ourMisses}
        intercepts={state.ourIntercepts}
        mode={mode}
        onModeChange={setMode}
      />

      {mode === 'ours' ? (
        <OurTurnScreen
          card={state.teamCard}
          round={state.currentRound}
          draft={ourDraft}
          onDraftChange={setOurDraft}
          onResolve={resolveOurTurn}
        />
      ) : (
        <InterceptScreen
          round={state.currentRound}
          interceptLog={state.interceptLog}
          draft={theirDraft}
          onDraftChange={setTheirDraft}
          onResolve={resolveIntercept}
        />
      )}
    </PlayPageWrap>
  );
}
