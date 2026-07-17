import { useImposter } from '../context';
import { getPlayerById, roundScoreDeltas } from '../utils';
import ImposterPanel, { ImposterPageWrap } from './ImposterPanel';
import PlayerAvatar from './PlayerAvatar';
import Scoreboard from './Scoreboard';

function ResultPanel() {
  const { state, advanceRound } = useImposter();
  const record = state.history[state.history.length - 1];
  if (!record) return null;

  const caught = record.outcome === 'caught';
  const isBlank = record.mode === 'blank';
  const redeemed = isBlank && caught && record.redemptionCorrect;
  const imposter = getPlayerById(state.players, record.imposterPlayerId);
  const voted = getPlayerById(state.players, record.votedPlayerId);
  const isLastRound = state.currentRound >= state.totalRounds;

  const deltas = roundScoreDeltas(record, state.players);
  const imposterScored = (deltas[record.imposterPlayerId] ?? 0) > 0;
  const nonImposterCount = state.players.length - 1;

  // Green when the table denied the imposter any points, red when they scored.
  const accent = imposterScored ? '#E08B7A' : '#7ED9A4';

  const label = caught
    ? redeemed
      ? 'Caught — redeemed'
      : 'Imposter caught'
    : 'Imposter evaded';
  const headline = caught
    ? redeemed
      ? 'Stole it back!'
      : 'Good read!'
    : 'They slipped away';

  let scoringText: string;
  if (isBlank && !caught) {
    scoringText = `Blank round — +3 points to ${imposter?.name}`;
  } else if (redeemed) {
    scoringText = `${imposter?.name} guessed the word — +1 point, everyone else gets nothing`;
  } else if (caught) {
    scoringText = `+1 point to all ${nonImposterCount} non-imposters`;
  } else {
    scoringText = `+2 points to ${imposter?.name}`;
  }

  return (
    <ImposterPageWrap>
      <ImposterPanel
        className="text-center"
      >
        <div
          className="-m-4 mb-4 rounded-t-[16px] px-5 py-6 sm:-m-[18px] sm:mb-4"
          style={{
            background: imposterScored
              ? 'radial-gradient(circle at 50% 0%, rgba(224,139,122,0.2), transparent 70%)'
              : 'radial-gradient(circle at 50% 0%, rgba(126,217,164,0.18), transparent 70%)',
          }}
        >
          {isBlank && (
            <span className="mb-2 inline-block rounded-full border border-ember/40 bg-ember/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ember-bright">
              Blank round
            </span>
          )}
          <p
            className="mb-1 font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: accent }}
          >
            {label}
          </p>
          <h1 className="font-display text-[22px] font-extrabold leading-tight text-text-hi sm:text-[26px]">
            {headline}
          </h1>
        </div>

        <div className="mb-4 flex flex-col items-center gap-2">
          <PlayerAvatar name={imposter?.name ?? '?'} size="lg" />
          <p className="font-body text-sm text-text-mid">
            <span className="font-bold text-text-hi">{imposter?.name}</span> was the
            imposter
          </p>
          {voted && (
            <p className="font-mono text-[11px] text-text-low">
              The table voted out {voted.name}
            </p>
          )}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-line bg-surface px-3 py-3">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-text-low">
              Majority word
            </p>
            <p className="font-display text-lg font-bold text-text-hi">
              {record.majorityWord}
            </p>
          </div>
          <div
            className="rounded-xl border px-3 py-3"
            style={{ borderColor: 'rgba(194,83,59,0.45)', background: 'rgba(194,83,59,0.1)' }}
          >
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-ember-bright">
              {isBlank ? 'Imposter' : 'Imposter word'}
            </p>
            <p className="font-display text-lg font-bold text-ember-bright">
              {isBlank ? 'No word' : record.imposterWord}
            </p>
          </div>
        </div>

        {isBlank && caught && record.redemptionGuess && (
          <div
            className="mb-4 rounded-xl border px-4 py-3 font-body text-sm"
            style={{
              borderColor: redeemed ? 'rgba(224,139,122,0.45)' : 'rgba(126,217,164,0.45)',
              background: redeemed ? 'rgba(224,139,122,0.1)' : 'rgba(126,217,164,0.1)',
            }}
          >
            Redemption guess:{' '}
            <span className="font-bold text-text-hi">{record.redemptionGuess}</span>{' '}
            {redeemed ? '✓ correct' : '✗ wrong'}
          </div>
        )}

        <div
          className="mb-5 rounded-xl border px-4 py-3 font-body text-sm"
          style={{ borderColor: `${accent}55`, background: `${accent}14`, color: accent }}
        >
          {scoringText}
        </div>

        <div className="mb-5 text-left">
          <Scoreboard players={state.players} deltas={deltas} />
        </div>

        <button
          type="button"
          onClick={() => void advanceRound()}
          className="w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          style={{ background: 'linear-gradient(180deg, #E07A5F, #C2533B 55%, #7A3526)' }}
        >
          {isLastRound ? 'View results' : 'Next round'}
        </button>
      </ImposterPanel>
    </ImposterPageWrap>
  );
}

function VotePanel() {
  const { state, castVote, revealVote } = useImposter();

  return (
    <ImposterPageWrap>
      <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ember">
        Round {state.currentRound} of {state.totalRounds}
      </p>
      <h1 className="mb-1 text-center font-display text-2xl font-extrabold leading-tight text-text-hi sm:text-[28px]">
        Who's the imposter?
      </h1>
      <p className="mb-6 text-center font-body text-sm text-text-mid">
        Select the player the table agreed to vote out.
      </p>

      <ImposterPanel>
        <div className="grid grid-cols-2 gap-2.5">
          {state.players.map((player) => {
            const selected = state.votedPlayerId === player.id;
            return (
              <button
                key={player.id}
                type="button"
                onClick={() => void castVote(player.id)}
                aria-pressed={selected}
                className={`flex min-h-[60px] items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember ${
                  selected
                    ? 'border-ember shadow-[0_0_0_1px_#C2533B_inset]'
                    : 'border-line bg-surface hover:border-line-bright'
                }`}
              >
                <PlayerAvatar name={player.name} />
                <span className="min-w-0 flex-1 truncate font-body text-[15px] font-semibold text-text-hi">
                  {player.name}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => void revealVote()}
          disabled={!state.votedPlayerId}
          className="mt-6 w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: 'linear-gradient(180deg, #E07A5F, #C2533B 55%, #7A3526)' }}
        >
          Reveal the imposter
        </button>
      </ImposterPanel>
    </ImposterPageWrap>
  );
}

export default function VoteScreen() {
  const { state } = useImposter();
  return state.phase === 'result' ? <ResultPanel /> : <VotePanel />;
}
