import { useTop100 } from '../context';
import { getDealer, getTurnScores, isLastDealerSession } from '../utils';
import Top100Panel, { Top100PageWrap, Top100PrimaryButton } from './Top100Panel';

export default function TurnRecapScreen() {
  const { state, dispatch } = useTop100();
  const dealer = getDealer(state);
  const turnScores = getTurnScores(state.claimedThisTurn);
  const scoringPlayers = state.players.filter((p) => p.id !== dealer?.id);

  const isLastDealer = isLastDealerSession(state);

  return (
    <Top100PageWrap>
      <div className="mx-auto max-w-lg">
        <header className="mb-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
            Turn complete
          </p>
          <h1 className="mt-1 break-words font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
            {dealer?.name}&apos;s recap
          </h1>
          <p className="mt-2 font-body text-sm text-text-mid">
            Points earned across 3 rounds
          </p>
        </header>

        <Top100Panel compact>
          <ul className="mb-6 flex flex-col gap-2">
            {scoringPlayers.map((player) => {
              const earned = turnScores[player.id] ?? 0;
              return (
                <li
                  key={player.id}
                  className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3"
                >
                  <span className="font-body text-sm text-text-hi">{player.name}</span>
                  <span className="font-mono text-sm text-steel-blue">+{earned} pts</span>
                </li>
              );
            })}
          </ul>

          <Top100PrimaryButton onClick={() => dispatch({ type: 'CONTINUE_FROM_RECAP' })}>
            {isLastDealer ? 'View final results' : 'Continue to next dealer'}
          </Top100PrimaryButton>
        </Top100Panel>
      </div>
    </Top100PageWrap>
  );
}
