import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GameProps, Player } from '../../types';
import MinigamePanel, { PrimaryButton } from '../../components/MinigamePanel';
import PlayerAvatar from '../../components/PlayerAvatar';
import { shuffle } from '../../utils';

const HAND = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
/** Sentinel value for the Joker — outranks every numbered card. */
const JOKER = 99;
/** The Joker only unlocks once your highest remaining numbered card is this or lower. */
const JOKER_UNLOCK_MAX = 5;

/** A Joker sits in every hand from the start but stays locked until late. */
function startingHand(): number[] {
  return [...HAND, JOKER];
}

/** Highest numbered (non-Joker) card still in hand; 0 when only a Joker is left. */
function highestNumbered(hand: number[]): number {
  const numbered = hand.filter((c) => c !== JOKER);
  return numbered.length > 0 ? Math.max(...numbered) : 0;
}

/** The Joker is playable only once every card above 5 has been spent. */
function jokerUnlocked(hand: number[]): boolean {
  if (!hand.includes(JOKER)) return false;
  return highestNumbered(hand) <= JOKER_UNLOCK_MAX;
}
/** Ten prizes, balanced spread, order shuffled each game. */
const PRIZE_POOL = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
const ROUNDS = 10;

type Phase = 'intro' | 'gate' | 'pick' | 'reveal' | 'done';

interface RoundResult {
  round: number;
  prize: number;
  plays: Record<string, number>;
  winnerId: string | null;
}

export default function LadderPlay({ players, onResolve }: GameProps) {
  const prizes = useMemo(() => shuffle(PRIZE_POOL), []);
  const [hands, setHands] = useState<Record<string, number[]>>(() =>
    Object.fromEntries(players.map((p) => [p.id, startingHand()])),
  );
  const [points, setPoints] = useState<Record<string, number>>(() =>
    Object.fromEntries(players.map((p) => [p.id, 0])),
  );
  const [roundIndex, setRoundIndex] = useState(0);
  const [seatIndex, setSeatIndex] = useState(0);
  const [plays, setPlays] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<Phase>('intro');
  const [history, setHistory] = useState<RoundResult[]>([]);

  const playerById = useMemo(() => {
    const map = new Map<string, Player>();
    players.forEach((p) => map.set(p.id, p));
    return map;
  }, [players]);

  const currentSeat = players[seatIndex];
  const prize = prizes[roundIndex];
  const nextPrize = prizes[roundIndex + 1];
  const prizeAfter = prizes[roundIndex + 2];

  function playCard(card: number) {
    const nextPlays = { ...plays, [currentSeat.id]: card };
    setPlays(nextPlays);

    if (seatIndex + 1 < players.length) {
      setSeatIndex(seatIndex + 1);
      setPhase('gate');
      return;
    }

    // Everyone has committed — resolve.
    const values = Object.values(nextPlays);
    const highest = Math.max(...values);
    const tiedCount = values.filter((v) => v === highest).length;
    // A tie on the highest card means nobody takes the prize.
    const winnerId =
      tiedCount > 1
        ? null
        : (Object.keys(nextPlays).find((id) => nextPlays[id] === highest) ?? null);

    setHands((prev) => {
      const next = { ...prev };
      Object.entries(nextPlays).forEach(([id, c]) => {
        next[id] = next[id].filter((x) => x !== c);
      });
      return next;
    });
    if (winnerId) {
      setPoints((prev) => ({ ...prev, [winnerId]: prev[winnerId] + prize }));
    }
    setHistory((h) => [...h, { round: roundIndex + 1, prize, plays: nextPlays, winnerId }]);
    setPhase('reveal');
  }

  function advanceRound() {
    if (roundIndex + 1 >= ROUNDS) {
      finish();
      return;
    }
    setRoundIndex(roundIndex + 1);
    setSeatIndex(0);
    setPlays({});
    setPhase('gate');
  }

  function finish() {
    const ranked = [...players].sort((a, b) => points[b.id] - points[a.id]);
    const top = points[ranked[0].id];
    const winners = ranked.filter((p) => points[p.id] === top);

    // Points scale with placing so a close second still earns something.
    const deltas: Record<string, number> = {};
    ranked.forEach((p) => {
      const isWinner = points[p.id] === top;
      deltas[p.id] = isWinner ? (winners.length > 1 ? 3 : 5) : 0;
    });
    // Second place (if not tied for first) gets a consolation point.
    const nonWinners = ranked.filter((p) => points[p.id] !== top);
    if (nonWinners.length > 0) {
      const secondBest = Math.max(...nonWinners.map((p) => points[p.id]));
      nonWinners
        .filter((p) => points[p.id] === secondBest)
        .forEach((p) => {
          deltas[p.id] = 2;
        });
    }

    onResolve({
      deltas,
      headline:
        winners.length > 1
          ? `Tied at ${top} points`
          : `${ranked[0].name} tops the ladder`,
      summary:
        winners.length > 1
          ? `${winners.map((w) => w.name).join(' and ')} finished level on ${top} points.`
          : `Took ${top} points across ${ROUNDS} prizes.`,
      details: ranked.map((p) => `${p.name}: ${points[p.id]} pts`),
    });
  }

  // ---------- Intro ----------
  if (phase === 'intro') {
    return (
      <MinigamePanel>
        <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-[#C9A44A]">
          Every player for themselves
        </p>
        <h2 className="mb-4 text-center font-display text-xl font-extrabold text-text-hi">
          Ten cards. Ten prizes.
        </h2>
        <p className="mb-5 text-center font-body text-sm text-text-mid">
          You hold cards 1 through 10. Each round a prize is revealed and everyone secretly plays one
          card. Highest card takes the prize &mdash; and that card is gone for good.
        </p>

        <div className="mb-5 rounded-xl border border-line bg-surface px-3.5 py-3">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-text-low">
            The catch
          </p>
          <p className="font-body text-[12.5px] leading-snug text-text-mid">
            Everyone can see which cards everyone else has already spent, and you can see the next two
            prizes coming. Match the highest card and nobody wins it.
          </p>
        </div>

        <PrimaryButton onClick={() => setPhase('gate')}>Reveal the first prize</PrimaryButton>
      </MinigamePanel>
    );
  }

  // ---------- Pass gate ----------
  if (phase === 'gate') {
    return (
      <>
        <PrizeHeader prize={prize} nextPrize={nextPrize} prizeAfter={prizeAfter} roundIndex={roundIndex} />
        <MinigamePanel>
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-center">
            <PlayerAvatar name={currentSeat.name} size="lg" />
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">
              Pass to
            </p>
            <h2 className="font-display text-2xl font-extrabold text-text-hi">{currentSeat.name}</h2>
            <div className="mt-2 w-full max-w-[240px]">
              <PrimaryButton onClick={() => setPhase('pick')}>I have it</PrimaryButton>
            </div>
          </div>
        </MinigamePanel>
        <SpentTable players={players} hands={hands} points={points} />
      </>
    );
  }

  // ---------- Card pick ----------
  if (phase === 'pick') {
    const hand = hands[currentSeat.id];
    return (
      <>
        <PrizeHeader prize={prize} nextPrize={nextPrize} prizeAfter={prizeAfter} roundIndex={roundIndex} />
        <MinigamePanel>
          <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">
            {currentSeat.name} &mdash; play a card
          </p>
          <div className="grid grid-cols-5 gap-2">
            {hand
              .filter((card) => card !== JOKER)
              .map((card) => (
                <button
                  key={card}
                  type="button"
                  onClick={() => playCard(card)}
                  className="flex aspect-[3/4] items-center justify-center rounded-xl border-2 border-line bg-surface font-display text-xl font-extrabold text-text-hi transition-colors hover:border-[#C9A44A]"
                >
                  {card}
                </button>
              ))}
          </div>

          {hand.includes(JOKER) && (
            <div className="mt-3">
              {jokerUnlocked(hand) ? (
                <motion.button
                  type="button"
                  onClick={() => playCard(JOKER)}
                  animate={{ boxShadow: ['0 0 0 0 rgba(201,164,74,0)', '0 0 22px -4px #C9A44A', '0 0 0 0 rgba(201,164,74,0)'] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border-2 px-4 py-3.5"
                  style={{ borderColor: '#C9A44A', background: 'linear-gradient(150deg, rgba(201,164,74,0.22), rgba(19,20,23,0.9))' }}
                >
                  <span className="text-xl" aria-hidden="true">🃏</span>
                  <span className="font-display text-base font-extrabold text-[#EAC870]">
                    Play the Joker
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-low">
                    beats 10
                  </span>
                </motion.button>
              ) : (
                <div className="flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-line px-4 py-3.5 opacity-50">
                  <span className="text-lg grayscale" aria-hidden="true">🃏</span>
                  <span className="font-body text-[13px] font-semibold text-text-low">
                    Joker locked
                  </span>
                  <span className="font-mono text-[10px] text-text-low">
                    spend everything above {JOKER_UNLOCK_MAX}
                  </span>
                </div>
              )}
            </div>
          )}

          <p className="mt-3 text-center font-body text-[11.5px] text-text-low">
            {hand.length} card{hand.length === 1 ? '' : 's'} left in your hand
          </p>
        </MinigamePanel>
        <SpentTable players={players} hands={hands} points={points} />
      </>
    );
  }

  // ---------- Reveal ----------
  if (phase === 'reveal') {
    const latest = history[history.length - 1];
    return (
      <>
        <PrizeHeader prize={prize} nextPrize={nextPrize} prizeAfter={prizeAfter} roundIndex={roundIndex} />
        <MinigamePanel>
          <div className="mb-4 grid grid-cols-4 gap-2">
            {players.map((p, i) => {
              const card = latest.plays[p.id];
              const won = latest.winnerId === p.id;
              return (
                <motion.div
                  key={p.id}
                  initial={{ rotateY: 180, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ delay: i * 0.12, duration: 0.4 }}
                  className="flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3"
                  style={{
                    borderColor: won ? '#C9A44A' : 'rgba(220,224,232,0.16)',
                    background: won ? 'rgba(201,164,74,0.14)' : 'rgba(26,28,32,0.6)',
                    boxShadow: won ? '0 0 20px -6px #C9A44A' : undefined,
                  }}
                >
                  <span
                    className="font-display text-2xl font-extrabold"
                    style={{ color: won ? '#EAC870' : '#DCE0E8' }}
                  >
                    {card === JOKER ? '🃏' : card}
                  </span>
                  <span className="max-w-full truncate font-body text-[11px] text-text-mid">
                    {p.name}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 }}
              className="mb-4 text-center font-display text-xl font-extrabold"
              style={{ color: latest.winnerId ? '#EAC870' : '#8B8F99' }}
            >
              {latest.winnerId
                ? `${playerById.get(latest.winnerId)?.name} takes ${prize} point${prize === 1 ? '' : 's'}`
                : latest.plays && Object.values(latest.plays).filter((v) => v === JOKER).length > 1
                  ? 'Jokers cancel out — prize discarded'
                  : 'Tied at the top — prize discarded'}
            </motion.h2>
          </AnimatePresence>

          <PrimaryButton onClick={advanceRound}>
            {roundIndex + 1 >= ROUNDS ? 'See final standings' : 'Next prize'}
          </PrimaryButton>
        </MinigamePanel>
        <SpentTable players={players} hands={hands} points={points} />
      </>
    );
  }

  return null;
}

function PrizeHeader({
  prize,
  nextPrize,
  prizeAfter,
  roundIndex,
}: {
  prize: number;
  nextPrize?: number;
  prizeAfter?: number;
  roundIndex: number;
}) {
  return (
    <MinigamePanel className="mb-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-low">
          Prize {roundIndex + 1} of {ROUNDS}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-low">
          Coming up
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-display text-2xl font-extrabold text-void"
          style={{ background: 'linear-gradient(165deg, #EAC870, #A67C2E)' }}
        >
          {prize}
        </div>
        <div className="ml-auto flex gap-2">
          {[nextPrize, prizeAfter].map((v, i) =>
            v === undefined ? (
              <div
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-line font-mono text-[11px] text-text-low"
              >
                &mdash;
              </div>
            ) : (
              <div
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface font-display text-sm font-bold text-text-mid"
              >
                {v}
              </div>
            ),
          )}
        </div>
      </div>
    </MinigamePanel>
  );
}

function SpentTable({
  players,
  hands,
  points,
}: {
  players: Player[];
  hands: Record<string, number[]>;
  points: Record<string, number>;
}) {
  return (
    <MinigamePanel className="mt-3">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-low">
        Cards remaining &mdash; public information
      </p>
      <ul className="flex flex-col gap-2">
        {players.map((p) => (
          <li key={p.id} className="flex items-center gap-2">
            <span className="w-16 shrink-0 truncate font-body text-[12px] font-semibold text-text-hi">
              {p.name}
            </span>
            <span className="flex flex-1 flex-wrap items-center gap-1">
              {HAND.map((card) => {
                const has = hands[p.id].includes(card);
                return (
                  <span
                    key={card}
                    className="flex h-5 w-5 items-center justify-center rounded font-mono text-[10px]"
                    style={{
                      background: has ? 'rgba(220,224,232,0.10)' : 'transparent',
                      color: has ? '#DCE0E8' : 'rgba(139,143,153,0.35)',
                      textDecoration: has ? 'none' : 'line-through',
                    }}
                  >
                    {card}
                  </span>
                );
              })}
              {/* Joker state is public too — everyone can see who has it armed. */}
              <span
                className="flex h-5 items-center justify-center rounded px-1 text-[10px]"
                title={
                  !hands[p.id].includes(JOKER)
                    ? 'Joker spent'
                    : jokerUnlocked(hands[p.id])
                      ? 'Joker armed'
                      : 'Joker locked'
                }
                style={{
                  background: jokerUnlocked(hands[p.id]) ? 'rgba(201,164,74,0.22)' : 'transparent',
                  opacity: hands[p.id].includes(JOKER) ? (jokerUnlocked(hands[p.id]) ? 1 : 0.4) : 0.2,
                  filter: jokerUnlocked(hands[p.id]) ? 'none' : 'grayscale(1)',
                  textDecoration: hands[p.id].includes(JOKER) ? 'none' : 'line-through',
                }}
              >
                🃏
              </span>
            </span>
            <span className="w-10 shrink-0 text-right font-display text-sm font-bold text-[#EAC870]">
              {points[p.id]}
            </span>
          </li>
        ))}
      </ul>
    </MinigamePanel>
  );
}
