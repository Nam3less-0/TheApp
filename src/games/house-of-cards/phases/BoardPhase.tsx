import { useHouseOfCards } from '../context';
import { SUITS, SUIT_META } from '../deck';
import { LOSS_THRESHOLD, WIN_THRESHOLD } from '../reducer';
import CardTile from '../components/CardTile';
import Scoreboard from '../components/Scoreboard';
import SuitLegend from '../components/SuitLegend';
import { HocPageWrap } from '../components/Layout';

export default function BoardPhase() {
  const { state, dispatch } = useHouseOfCards();
  const remaining = state.deck.filter((c) => !c.used).length;
  const activeName = state.activeTeam === 'a' ? state.teamAName : state.teamBName;

  return (
    <HocPageWrap>
      <Scoreboard
        teamAName={state.teamAName}
        teamBName={state.teamBName}
        scoreA={state.scoreA}
        scoreB={state.scoreB}
        activeTeam={state.activeTeam}
      />

      <p
        className="mt-3 text-center font-body text-sm"
        style={{ color: 'var(--hoc-ivory-dim)' }}
      >
        <span className="font-semibold" style={{ color: 'var(--hoc-brass)' }}>
          {activeName}
        </span>{' '}
        picks a card &middot; first to reach +{WIN_THRESHOLD + 1} wins, below{' '}
        {LOSS_THRESHOLD - 1} loses &middot; {remaining} cards left
      </p>

      <div className="mt-5">
        <SuitLegend suitTopicMap={state.suitTopicMap} />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {SUITS.map((suit) => {
          const meta = SUIT_META[suit];
          const suitColor = meta.isRed ? 'var(--hoc-crimson-bright)' : 'var(--hoc-ivory)';
          const cards = state.deck
            .map((card, index) => ({ card, index }))
            .filter((entry) => entry.card.suit === suit)
            .sort((a, b) => a.card.value - b.card.value);

          return (
            <div key={suit}>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-base leading-none" style={{ color: suitColor }} aria-hidden="true">
                  {meta.symbol}
                </span>
                <span
                  className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: 'var(--hoc-ivory-dim)' }}
                >
                  {state.suitTopicMap[suit].name}
                </span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 sm:gap-2">
                {cards.map(({ card, index }) => (
                  <div key={`${suit}-${card.value}`} className="w-[46px] shrink-0 sm:w-auto sm:flex-1">
                    <CardTile
                      card={card}
                      disabled={card.used}
                      onPick={() => dispatch({ type: 'PICK_CARD', index })}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p
        className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] sm:hidden"
        style={{ color: 'var(--hoc-ivory-dim)' }}
      >
        Swipe each row to see all 13 cards
      </p>
    </HocPageWrap>
  );
}
