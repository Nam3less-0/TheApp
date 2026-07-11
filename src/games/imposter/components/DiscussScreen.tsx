import { useImposter } from '../context';
import ImposterPanel, { ImposterPageWrap } from './ImposterPanel';
import Scoreboard from './Scoreboard';

export default function DiscussScreen() {
  const { state, dispatch } = useImposter();

  return (
    <ImposterPageWrap>
      <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ember">
        Round {state.currentRound} of {state.totalRounds}
      </p>
      <h1 className="mb-6 text-center font-display text-2xl font-extrabold leading-tight text-text-hi sm:text-[28px]">
        Discuss it out loud
      </h1>

      <ImposterPanel>
        <ol className="flex flex-col gap-3">
          {[
            'Go around the table once — each player says one word related to the word they were shown.',
            'Listen for who feels off — the imposter may have a different word, or no word at all.',
            'Talk it through and agree together on who to vote out.',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ember/15 font-display text-sm font-bold text-ember-bright">
                {i + 1}
              </span>
              <p className="pt-0.5 font-body text-[15px] leading-snug text-text-mid">
                {step}
              </p>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => dispatch({ type: 'GO_TO_VOTE' })}
          className="mt-6 w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          style={{ background: 'linear-gradient(180deg, #E07A5F, #C2533B 55%, #7A3526)' }}
        >
          Ready to vote
        </button>
      </ImposterPanel>

      {state.history.length > 0 && (
        <ImposterPanel className="mt-4">
          <Scoreboard players={state.players} />
        </ImposterPanel>
      )}
    </ImposterPageWrap>
  );
}
