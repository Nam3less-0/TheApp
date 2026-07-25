import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GameProps, Player } from '../../types';
import MinigamePanel, { PrimaryButton } from '../../components/MinigamePanel';
import PlayerAvatar from '../../components/PlayerAvatar';
import { shuffle } from '../../utils';

const ZONE_VALUES = [1, 1, 2, 2, 3];
const TOKENS_PER_TEAM = 12;
const BATTLES_TO_WIN = 2;
const TOTAL_BATTLES = 3;

type TeamId = 'A' | 'B';

interface Battle {
  /** Point value per zone, reshuffled every battle. */
  values: number[];
  /** Which team places first this battle. */
  firstTeam: TeamId;
}

function makeBattle(firstTeam: TeamId): Battle {
  return { values: shuffle(ZONE_VALUES), firstTeam };
}

export default function SplitLinePlay({ players, onResolve }: GameProps) {
  // Randomised pairings so the same duo doesn't always play together.
  const teams = useMemo(() => {
    const order = shuffle(players);
    return {
      A: [order[0], order[1]],
      B: [order[2], order[3]],
    } as Record<TeamId, Player[]>;
  }, [players]);

  const [battleIndex, setBattleIndex] = useState(0);
  const [battle, setBattle] = useState<Battle>(() => makeBattle('A'));
  const [tokens, setTokens] = useState<Record<TeamId, number[]>>({
    A: [0, 0, 0, 0, 0],
    B: [0, 0, 0, 0, 0],
  });
  const [placed, setPlaced] = useState<Record<TeamId, number>>({ A: 0, B: 0 });
  const [turn, setTurn] = useState<TeamId>('A');
  const [lastPlacedZone, setLastPlacedZone] = useState<number | null>(null);
  const [battleWins, setBattleWins] = useState<Record<TeamId, number>>({ A: 0, B: 0 });
  const [phase, setPhase] = useState<'intro' | 'placing' | 'battle-result'>('intro');

  /** The team going first gets one extra token to offset the last-word advantage. */
  function budgetFor(team: TeamId) {
    return team === battle.firstTeam ? TOKENS_PER_TEAM + 1 : TOKENS_PER_TEAM;
  }

  const aDone = placed.A >= budgetFor('A');
  const bDone = placed.B >= budgetFor('B');
  const allDone = aDone && bDone;

  function placeToken(zoneIndex: number) {
    if (phase !== 'placing') return;
    const team = turn;
    if (placed[team] >= budgetFor(team)) return;

    const nextTokens = { ...tokens, [team]: tokens[team].map((v, i) => (i === zoneIndex ? v + 1 : v)) };
    const nextPlaced = { ...placed, [team]: placed[team] + 1 };
    setTokens(nextTokens);
    setPlaced(nextPlaced);
    setLastPlacedZone(zoneIndex);

    const aFinished = nextPlaced.A >= budgetFor('A');
    const bFinished = nextPlaced.B >= budgetFor('B');

    if (aFinished && bFinished) {
      setPhase('battle-result');
      return;
    }
    const other: TeamId = team === 'A' ? 'B' : 'A';
    const otherFinished = other === 'A' ? aFinished : bFinished;
    if (!otherFinished) setTurn(other);
  }

  /** Zone-by-zone scoring: more tokens takes it, ties score for nobody. */
  function scoreBattle() {
    let aPoints = 0;
    let bPoints = 0;
    battle.values.forEach((value, i) => {
      if (tokens.A[i] > tokens.B[i]) aPoints += value;
      else if (tokens.B[i] > tokens.A[i]) bPoints += value;
    });
    return { aPoints, bPoints };
  }

  function nextBattle() {
    const { aPoints, bPoints } = scoreBattle();
    const winner: TeamId | null = aPoints > bPoints ? 'A' : bPoints > aPoints ? 'B' : null;
    const nextWins = winner
      ? { ...battleWins, [winner]: battleWins[winner] + 1 }
      : battleWins;
    setBattleWins(nextWins);

    const someoneWon = nextWins.A >= BATTLES_TO_WIN || nextWins.B >= BATTLES_TO_WIN;
    const outOfBattles = battleIndex + 1 >= TOTAL_BATTLES;

    if (someoneWon || outOfBattles) {
      finish(nextWins);
      return;
    }

    // Alternate who goes first each battle, and reshuffle zone values.
    const nextFirst: TeamId = battle.firstTeam === 'A' ? 'B' : 'A';
    setBattle(makeBattle(nextFirst));
    setTokens({ A: [0, 0, 0, 0, 0], B: [0, 0, 0, 0, 0] });
    setPlaced({ A: 0, B: 0 });
    setTurn(nextFirst);
    setLastPlacedZone(null);
    setBattleIndex(battleIndex + 1);
    setPhase('placing');
  }

  function finish(wins: Record<TeamId, number>) {
    const winner: TeamId | null = wins.A > wins.B ? 'A' : wins.B > wins.A ? 'B' : null;
    const deltas: Record<string, number> = {};
    if (winner) {
      teams[winner].forEach((p) => {
        deltas[p.id] = 4;
      });
    } else {
      players.forEach((p) => {
        deltas[p.id] = 2;
      });
    }
    const names = (t: TeamId) => teams[t].map((p) => p.name).join(' & ');
    onResolve({
      deltas,
      headline: winner ? `${names(winner)} take the line` : 'Deadlock — battles split',
      summary: winner
        ? `Won ${wins[winner]} of ${battleIndex + 1} battles.`
        : `Both sides won ${wins.A} battle${wins.A === 1 ? '' : 's'}.`,
      details: [
        `Team A — ${names('A')}: ${wins.A} battle win${wins.A === 1 ? '' : 's'}`,
        `Team B — ${names('B')}: ${wins.B} battle win${wins.B === 1 ? '' : 's'}`,
      ],
    });
  }

  const teamName = (t: TeamId) => teams[t].map((p) => p.name).join(' & ');
  const teamColor = (t: TeamId) => (t === 'A' ? '#6FA8DC' : '#E8A33D');

  // ---------- Intro ----------
  if (phase === 'intro') {
    return (
      <MinigamePanel>
        <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-[#B39DFF]">
          Teams drawn at random
        </p>
        <h2 className="mb-5 text-center font-display text-xl font-extrabold text-text-hi">
          Two against two
        </h2>

        <div className="mb-5 flex flex-col gap-3">
          {(['A', 'B'] as TeamId[]).map((t) => (
            <div
              key={t}
              className="rounded-xl border px-3.5 py-3"
              style={{ borderColor: `${teamColor(t)}55`, background: `${teamColor(t)}12` }}
            >
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider" style={{ color: teamColor(t) }}>
                Team {t}
              </p>
              <div className="flex flex-wrap gap-2">
                {teams[t].map((p) => (
                  <span key={p.id} className="flex items-center gap-1.5">
                    <PlayerAvatar name={p.name} size="sm" />
                    <span className="font-body text-[13px] font-semibold text-text-hi">{p.name}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5 rounded-xl border border-line bg-surface px-3.5 py-3">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-text-low">
            No talking
          </p>
          <p className="font-body text-[12.5px] leading-snug text-text-mid">
            You cannot speak to your partner at any point. Read their placements and infer the plan.
            Everything is visible to everyone &mdash; the only hidden thing is intent.
          </p>
        </div>

        <PrimaryButton onClick={() => { setTurn(battle.firstTeam); setPhase('placing'); }}>
          Start battle 1
        </PrimaryButton>
      </MinigamePanel>
    );
  }

  // ---------- Battle result ----------
  if (phase === 'battle-result') {
    const { aPoints, bPoints } = scoreBattle();
    const winner: TeamId | null = aPoints > bPoints ? 'A' : bPoints > aPoints ? 'B' : null;
    return (
      <MinigamePanel>
        <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-low">
          Battle {battleIndex + 1} result
        </p>
        <h2
          className="mb-5 text-center font-display text-2xl font-extrabold"
          style={{ color: winner ? teamColor(winner) : '#8B8F99' }}
        >
          {winner ? `Team ${winner} wins ${aPoints}\u2013${bPoints}` : `Drawn ${aPoints}\u2013${bPoints}`}
        </h2>

        <div className="mb-5 flex flex-col gap-2">
          {battle.values.map((value, i) => {
            const a = tokens.A[i];
            const b = tokens.B[i];
            const zoneWinner: TeamId | null = a > b ? 'A' : b > a ? 'B' : null;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.09 }}
                className="flex items-center gap-2 rounded-xl border px-3 py-2"
                style={{
                  borderColor: zoneWinner ? `${teamColor(zoneWinner)}66` : 'rgba(220,224,232,0.16)',
                  background: zoneWinner ? `${teamColor(zoneWinner)}12` : 'rgba(26,28,32,0.6)',
                }}
              >
                <span className="w-14 font-mono text-[11px] text-text-low">Zone {i + 1}</span>
                <span className="font-display text-sm font-bold text-text-hi">{value}pt</span>
                <span className="ml-auto flex items-center gap-2 font-mono text-[12px]">
                  <span style={{ color: teamColor('A') }}>{a}</span>
                  <span className="text-text-low">vs</span>
                  <span style={{ color: teamColor('B') }}>{b}</span>
                </span>
                <span className="w-14 text-right font-mono text-[10px] uppercase tracking-wider" style={{ color: zoneWinner ? teamColor(zoneWinner) : '#8B8F99' }}>
                  {zoneWinner ? `Team ${zoneWinner}` : 'Tie'}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="mb-5 flex items-center justify-center gap-4 font-mono text-[12px]">
          <span style={{ color: teamColor('A') }}>Team A: {battleWins.A + (winner === 'A' ? 1 : 0)}</span>
          <span className="text-text-low">·</span>
          <span style={{ color: teamColor('B') }}>Team B: {battleWins.B + (winner === 'B' ? 1 : 0)}</span>
        </div>

        <PrimaryButton onClick={nextBattle}>Continue</PrimaryButton>
      </MinigamePanel>
    );
  }

  // ---------- Placing ----------
  const budgetA = budgetFor('A');
  const budgetB = budgetFor('B');

  return (
    <>
      <MinigamePanel className="mb-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-low">
            Battle {battleIndex + 1} of {TOTAL_BATTLES}
          </span>
          <span className="font-mono text-[10px] text-text-low">
            A {battleWins.A} &middot; B {battleWins.B}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={turn}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-3 flex items-center justify-center gap-2 rounded-full border px-4 py-2"
            style={{ borderColor: `${teamColor(turn)}66`, background: `${teamColor(turn)}14` }}
          >
            <span className="font-body text-sm font-bold" style={{ color: teamColor(turn) }}>
              Team {turn} places
            </span>
            <span className="font-mono text-[11px] text-text-low">
              {budgetFor(turn) - placed[turn]} left
            </span>
          </motion.div>
        </AnimatePresence>

        <p className="text-center font-body text-[12px] text-text-low">{teamName(turn)}</p>
      </MinigamePanel>

      <MinigamePanel className="mb-3">
        <div className="flex flex-col gap-2">
          {battle.values.map((value, i) => {
            const a = tokens.A[i];
            const b = tokens.B[i];
            const leader: TeamId | null = a > b ? 'A' : b > a ? 'B' : null;
            const justPlaced = lastPlacedZone === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => placeToken(i)}
                disabled={allDone}
                className="relative overflow-hidden rounded-xl border-2 px-3 py-2.5 text-left transition-colors disabled:opacity-50"
                style={{
                  borderColor: leader ? `${teamColor(leader)}66` : 'rgba(220,224,232,0.16)',
                  background: leader ? `${teamColor(leader)}10` : 'rgba(26,28,32,0.6)',
                }}
              >
                {justPlaced && (
                  <motion.span
                    className="absolute inset-0"
                    style={{ background: teamColor(turn === 'A' ? 'B' : 'A') }}
                    initial={{ opacity: 0.22 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                <div className="relative flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-display text-sm font-extrabold"
                    style={{
                      background: value === 3 ? '#C9A44A' : value === 2 ? '#6B7280' : '#3F4450',
                      color: '#131417',
                    }}
                  >
                    {value}
                  </span>
                  <span className="font-mono text-[11px] text-text-low">Zone {i + 1}</span>

                  <span className="ml-auto flex items-center gap-2.5">
                    <span className="flex items-center gap-1">
                      {Array.from({ length: Math.min(a, 8) }).map((_, k) => (
                        <motion.span
                          key={k}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: teamColor('A') }}
                        />
                      ))}
                      {a > 8 && <span className="font-mono text-[10px]" style={{ color: teamColor('A') }}>+{a - 8}</span>}
                    </span>
                    <span className="font-mono text-[10px] text-text-low">|</span>
                    <span className="flex items-center gap-1">
                      {Array.from({ length: Math.min(b, 8) }).map((_, k) => (
                        <motion.span
                          key={k}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: teamColor('B') }}
                        />
                      ))}
                      {b > 8 && <span className="font-mono text-[10px]" style={{ color: teamColor('B') }}>+{b - 8}</span>}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </MinigamePanel>

      <MinigamePanel>
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span style={{ color: teamColor('A') }}>
            Team A: {placed.A}/{budgetA}
          </span>
          <span className="text-text-low">
            Overflow past the win is wasted
          </span>
          <span style={{ color: teamColor('B') }}>
            Team B: {placed.B}/{budgetB}
          </span>
        </div>
        {allDone && (
          <div className="mt-3">
            <PrimaryButton onClick={() => setPhase('battle-result')}>Score the battle</PrimaryButton>
          </div>
        )}
      </MinigamePanel>
    </>
  );
}
