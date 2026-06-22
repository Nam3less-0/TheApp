import { useTop100 } from '../context';
import { getDealer, getTurnScores, isLastDealerSession } from '../utils';
import Top100Panel, { Top100PageWrap } from './Top100Panel';

export default function TurnRecapScreen() {
  const { state, dispatch } = useTop100();
  const dealer = getDealer(state);
  const turnScores = getTurnScores(state.claimedThisTurn);
  const scoringPlayers = state.players.filter((p) => p.id !== dealer?.id);

  const isLastDealer = isLastDealerSession(state);

  return (
    <Top100PageWrap>
      <h1 className="mb-2 text-center font-display text-[30px] font-extrabold tracking-[-0.5px] text-text-hi">
        {dealer?.name}&apos;s turn recap
      </h1>
      <p className="mb-8 text-center font-body text-sm text-text-mid">
        Points earned across 3 rounds
      </p>

      <Top100Panel>
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

        <button
          type="button"
          onClick={() => dispatch({ type: 'CONTINUE_FROM_RECAP' })}
          className="w-full rounded-xl border-none px-4 py-[15px] font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
          style={{
            background: 'linear-gradient(180deg, #F2F4F8, #C9CDD6 50%, #8B8F99)',
          }}
        >
          {isLastDealer ? 'View final results' : 'Continue to next dealer'}
        </button>
      </Top100Panel>
    </Top100PageWrap>
  );
}
