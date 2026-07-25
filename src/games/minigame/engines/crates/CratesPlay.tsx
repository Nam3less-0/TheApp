import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GameProps, Player } from '../../types';
import MinigamePanel, { PrimaryButton, GhostButton } from '../../components/MinigamePanel';
import PlayerAvatar from '../../components/PlayerAvatar';
import CrateTile from './CrateTile';
import RoleCard from './RoleCard';
import {
  createCratesSetup,
  createRound2,
  roleBriefing,
  ROLE_ACCENT,
  ROLE_LABEL,
  type CratesRound,
  type CratesSetup,
} from './logic';
import { shuffle } from '../../utils';

type Phase =
  | 'role-gate'
  | 'role-peek'
  | 'statements'
  | 'discussion'
  | 'vote-gate'
  | 'vote'
  | 'influencer-gate'
  | 'influencer'
  | 'reveal';

const STATEMENT_SECONDS = 10;
const DISCUSSION_SECONDS = 180;

export default function CratesPlay({ players, onResolve }: GameProps) {
  const [setup] = useState<CratesSetup>(() => createCratesSetup(players));
  const [roundNumber, setRoundNumber] = useState<1 | 2>(1);
  const [round, setRound] = useState<CratesRound>(setup.round1);

  const [phase, setPhase] = useState<Phase>('role-gate');
  const [seatIndex, setSeatIndex] = useState(0);
  const [statementIndex, setStatementIndex] = useState(0);
  const [statementSeconds, setStatementSeconds] = useState(STATEMENT_SECONDS);
  const [discussionSeconds, setDiscussionSeconds] = useState(DISCUSSION_SECONDS);
  const [discussionRunning, setDiscussionRunning] = useState(true);

  const [crateVotes, setCrateVotes] = useState<Record<string, string>>({});
  const [saboteurVotes, setSaboteurVotes] = useState<Record<string, string>>({});
  const [draftCrate, setDraftCrate] = useState<string | null>(null);
  const [draftSuspect, setDraftSuspect] = useState<string | null>(null);

  const [swapTarget, setSwapTarget] = useState<string | null>(null);
  const [openedCrate, setOpenedCrate] = useState<string | null>(null);
  const [round1WrongCrate, setRound1WrongCrate] = useState<string | null>(null);
  /** Accumulated across both rounds so a correct suspect call always pays. */
  const suspectBonusRef = useRef<Record<string, number>>({});

  const speakingOrder = useMemo(() => shuffle(players.map((p) => p.id)), [players]);
  const saboteurId = useMemo(
    () => Object.keys(setup.roles).find((id) => setup.roles[id] === 'SABOTEUR')!,
    [setup],
  );
  const influencerId = useMemo(
    () => Object.keys(setup.roles).find((id) => setup.roles[id] === 'INFLUENCER')!,
    [setup],
  );

  const playerById = useMemo(() => {
    const map = new Map<string, Player>();
    players.forEach((p) => map.set(p.id, p));
    return map;
  }, [players]);

  // Statement timer
  useEffect(() => {
    if (phase !== 'statements') return undefined;
    if (statementSeconds <= 0) return undefined;
    const t = setTimeout(() => setStatementSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, statementSeconds]);

  // Discussion timer
  useEffect(() => {
    if (phase !== 'discussion' || !discussionRunning) return undefined;
    if (discussionSeconds <= 0) return undefined;
    const t = setTimeout(() => setDiscussionSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, discussionRunning, discussionSeconds]);

  const currentSeat = players[seatIndex];

  function advanceRoleReveal() {
    if (seatIndex + 1 < players.length) {
      setSeatIndex(seatIndex + 1);
      setPhase('role-gate');
    } else {
      setSeatIndex(0);
      setStatementIndex(0);
      setStatementSeconds(STATEMENT_SECONDS);
      setPhase('statements');
    }
  }

  function advanceStatement() {
    if (statementIndex + 1 < speakingOrder.length) {
      setStatementIndex(statementIndex + 1);
      setStatementSeconds(STATEMENT_SECONDS);
    } else {
      setPhase('discussion');
      setDiscussionRunning(true);
    }
  }

  function submitVote() {
    if (!draftCrate || !draftSuspect) return;
    const voter = players[seatIndex];
    const nextCrateVotes = { ...crateVotes, [voter.id]: draftCrate };
    const nextSuspectVotes = { ...saboteurVotes, [voter.id]: draftSuspect };
    setCrateVotes(nextCrateVotes);
    setSaboteurVotes(nextSuspectVotes);
    setDraftCrate(null);
    setDraftSuspect(null);

    if (seatIndex + 1 < players.length) {
      setSeatIndex(seatIndex + 1);
      setPhase('vote-gate');
    } else {
      setSeatIndex(0);
      setPhase('influencer-gate');
    }
  }

  /** Majority crate choice; ties broken by the Saboteur's own vote for tension. */
  function tallyCrate(votes: Record<string, string>): string {
    const counts: Record<string, number> = {};
    Object.values(votes).forEach((c) => {
      counts[c] = (counts[c] ?? 0) + 1;
    });
    let best: string[] = [];
    let bestCount = -1;
    Object.entries(counts).forEach(([crate, count]) => {
      if (count > bestCount) {
        best = [crate];
        bestCount = count;
      } else if (count === bestCount) {
        best.push(crate);
      }
    });
    if (best.length === 1) return best[0];
    const saboteurPick = votes[saboteurId];
    if (saboteurPick && best.includes(saboteurPick)) return saboteurPick;
    return best[0];
  }

  function resolveInfluencer(swapWith: string | null) {
    const groupChoice = tallyCrate(crateVotes);
    const finalCrate = swapWith ?? groupChoice;
    setSwapTarget(swapWith);
    setOpenedCrate(finalCrate);

    // Bank suspect-call bonuses for this round before any state resets.
    const bonuses = { ...suspectBonusRef.current };
    players.forEach((p) => {
      if (p.id !== saboteurId && saboteurVotes[p.id] === saboteurId) {
        bonuses[p.id] = (bonuses[p.id] ?? 0) + 1;
      }
    });
    suspectBonusRef.current = bonuses;

    setPhase('reveal');
  }

  function finishRound() {
    const found = openedCrate === round.riggedCrate;

    if (found) {
      // Builders located the rigged crate. Round 1 pays full, round 2 pays half.
      const base = roundNumber === 1 ? 4 : 2;
      const deltas: Record<string, number> = {};
      players.forEach((p) => {
        if (p.id !== saboteurId) deltas[p.id] = base;
      });
      Object.entries(suspectBonusRef.current).forEach(([id, bonus]) => {
        deltas[id] = (deltas[id] ?? 0) + bonus;
      });
      onResolve({
        deltas,
        headline: roundNumber === 1 ? 'Rigged crate found!' : 'Found it — just in time',
        summary: `The crew opened Crate ${openedCrate} and it was the rigged one. ${
          playerById.get(saboteurId)?.name
        } was the Saboteur.`,
        details: buildDetails(),
      });
      return;
    }

    if (roundNumber === 1) {
      // Wrong crate: it's now proven safe and removed. Run round 2.
      setRound1WrongCrate(openedCrate);
      const r2 = createRound2(setup, openedCrate!);
      setRound(r2);
      setRoundNumber(2);
      setCrateVotes({});
      setSaboteurVotes({});
      setDraftCrate(null);
      setDraftSuspect(null);
      setSwapTarget(null);
      setOpenedCrate(null);
      setSeatIndex(0);
      setStatementIndex(0);
      setStatementSeconds(STATEMENT_SECONDS);
      setDiscussionSeconds(DISCUSSION_SECONDS);
      setPhase('role-gate');
      return;
    }

    // Round 2 failed — Saboteur survives.
    const deltas: Record<string, number> = { [saboteurId]: 6 };
    Object.entries(suspectBonusRef.current).forEach(([id, bonus]) => {
      deltas[id] = (deltas[id] ?? 0) + bonus;
    });
    onResolve({
      deltas,
      headline: 'The Saboteur got away with it',
      summary: `Crate ${round.riggedCrate} was rigged and never opened. ${
        playerById.get(saboteurId)?.name
      } was the Saboteur.`,
      details: buildDetails(),
    });
  }

  function buildDetails(): string[] {
    const lines = players.map((p) => `${p.name} — ${ROLE_LABEL[setup.roles[p.id]]}`);
    const correctCallers = players
      .filter((p) => p.id !== saboteurId && saboteurVotes[p.id] === saboteurId)
      .map((p) => p.name);
    if (correctCallers.length > 0) {
      lines.push(`Correctly named the Saboteur: ${correctCallers.join(', ')}`);
    }
    if (swapTarget) {
      lines.push(`The Influencer swapped the chosen crate for Crate ${swapTarget}.`);
    }
    return lines;
  }

  const roundBadge = (
    <div className="mb-4 flex items-center justify-center gap-2">
      <span
        className="rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em]"
        style={{ borderColor: '#B39DFF66', color: '#B39DFF' }}
      >
        Round {roundNumber} of 2
      </span>
      {round1WrongCrate && (
        <span className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-text-low">
          Crate {round1WrongCrate} proven safe
        </span>
      )}
    </div>
  );

  // ---------- Role reveal ----------
  if (phase === 'role-gate') {
    return (
      <>
        {roundBadge}
        <MinigamePanel>
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
            <PlayerAvatar name={currentSeat.name} size="lg" />
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">
              Pass the iPad to
            </p>
            <h2 className="font-display text-2xl font-extrabold text-text-hi">{currentSeat.name}</h2>
            <div className="mt-2 w-full max-w-[240px]">
              <PrimaryButton onClick={() => setPhase('role-peek')}>I have it</PrimaryButton>
            </div>
          </div>
        </MinigamePanel>
      </>
    );
  }

  if (phase === 'role-peek') {
    const role = setup.roles[currentSeat.id];
    const briefing = roleBriefing(role, round);
    return (
      <>
        {roundBadge}
        <MinigamePanel>
          <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">
            {currentSeat.name}&rsquo;s role
          </p>
          <RoleCard
            role={role}
            headline={briefing.headline}
            detail={briefing.detail}
            crates={round.crates}
          />
          <div className="mt-5">
            <PrimaryButton onClick={advanceRoleReveal}>
              {seatIndex + 1 < players.length ? 'Got it — pass along' : 'Got it — begin statements'}
            </PrimaryButton>
          </div>
        </MinigamePanel>
      </>
    );
  }

  // ---------- Individual statements ----------
  if (phase === 'statements') {
    const speaker = playerById.get(speakingOrder[statementIndex])!;
    const pct = (statementSeconds / STATEMENT_SECONDS) * 100;
    return (
      <>
        {roundBadge}
        <MinigamePanel>
          <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-[#B39DFF]">
            Statement {statementIndex + 1} of {speakingOrder.length}
          </p>
          <h2 className="mb-1 text-center font-display text-2xl font-extrabold text-text-hi">
            {speaker.name}
          </h2>
          <p className="mb-5 text-center font-body text-sm text-text-mid">
            10 seconds, no interruptions. Say what you know — or what you want them to think.
          </p>

          <div className="mb-5 flex flex-col items-center gap-3">
            <span
              className="font-display text-5xl font-extrabold tabular-nums"
              style={{ color: statementSeconds <= 3 ? '#E08B7A' : '#F2F4F8' }}
            >
              {statementSeconds}
            </span>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full rounded-full"
                style={{ background: statementSeconds <= 3 ? '#E08B7A' : '#B39DFF' }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.4, ease: 'linear' }}
              />
            </div>
          </div>

          <div className="mb-3 flex flex-wrap justify-center gap-2">
            {round.crates.map((c) => (
              <span
                key={c}
                className="rounded-lg border border-line bg-surface px-3 py-1.5 font-display text-sm font-bold text-text-mid"
              >
                {c}
              </span>
            ))}
          </div>

          <PrimaryButton onClick={advanceStatement}>
            {statementIndex + 1 < speakingOrder.length ? 'Next speaker' : 'Open the floor'}
          </PrimaryButton>
        </MinigamePanel>
      </>
    );
  }

  // ---------- Group discussion ----------
  if (phase === 'discussion') {
    const mins = Math.floor(discussionSeconds / 60);
    const secs = discussionSeconds % 60;
    return (
      <>
        {roundBadge}
        <MinigamePanel>
          <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-[#B39DFF]">
            Open discussion
          </p>
          <h2 className="mb-4 text-center font-display text-xl font-extrabold text-text-hi">
            Which crate is rigged?
          </h2>

          <div className="mb-5 flex flex-col items-center gap-3">
            <span
              className="font-display text-5xl font-extrabold tabular-nums"
              style={{ color: discussionSeconds <= 20 ? '#E08B7A' : '#F2F4F8' }}
            >
              {mins}:{String(secs).padStart(2, '0')}
            </span>
            <div className="flex gap-2">
              <GhostButton onClick={() => setDiscussionRunning((r) => !r)}>
                {discussionRunning ? 'Pause' : 'Resume'}
              </GhostButton>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-5 gap-2">
            {round.crates.map((c) => (
              <div
                key={c}
                className="flex aspect-square items-center justify-center rounded-xl border border-line bg-surface font-display text-lg font-extrabold text-text-mid"
              >
                {c}
              </div>
            ))}
          </div>

          <p className="mb-4 text-center font-body text-[12px] text-text-low">
            Compare what everyone claimed. Only three crates can genuinely be safe.
          </p>

          <PrimaryButton onClick={() => setPhase('vote-gate')}>Move to secret votes</PrimaryButton>
        </MinigamePanel>
      </>
    );
  }

  // ---------- Secret votes ----------
  if (phase === 'vote-gate') {
    return (
      <>
        {roundBadge}
        <MinigamePanel>
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
            <PlayerAvatar name={currentSeat.name} size="lg" />
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">
              Pass to vote
            </p>
            <h2 className="font-display text-2xl font-extrabold text-text-hi">{currentSeat.name}</h2>
            <div className="mt-2 w-full max-w-[240px]">
              <PrimaryButton onClick={() => setPhase('vote')}>I have it</PrimaryButton>
            </div>
          </div>
        </MinigamePanel>
      </>
    );
  }

  if (phase === 'vote') {
    return (
      <>
        {roundBadge}
        <MinigamePanel>
          <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">
            {currentSeat.name}&rsquo;s secret vote
          </p>

          <p className="mb-2 font-body text-sm font-bold text-text-hi">Which crate is rigged?</p>
          <div className="mb-5 grid grid-cols-5 gap-2">
            {round.crates.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setDraftCrate(c)}
                className={`flex aspect-square items-center justify-center rounded-xl border-2 font-display text-lg font-extrabold transition-colors ${
                  draftCrate === c
                    ? 'border-[#B39DFF] bg-[#B39DFF]/15 text-[#B39DFF]'
                    : 'border-line bg-surface text-text-mid'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="mb-2 font-body text-sm font-bold text-text-hi">Who is the Saboteur?</p>
          <div className="mb-5 grid grid-cols-2 gap-2">
            {players
              .filter((p) => p.id !== currentSeat.id)
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDraftSuspect(p.id)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    draftSuspect === p.id ? 'border-[#E8A33D]' : 'border-line'
                  }`}
                  style={draftSuspect === p.id ? { background: 'rgba(232,163,61,0.12)' } : undefined}
                >
                  <PlayerAvatar name={p.name} size="sm" />
                  <span className="min-w-0 flex-1 truncate font-body text-[13px] font-semibold text-text-hi">
                    {p.name}
                  </span>
                </button>
              ))}
          </div>

          <PrimaryButton disabled={!draftCrate || !draftSuspect} onClick={submitVote}>
            Lock in vote
          </PrimaryButton>
        </MinigamePanel>
      </>
    );
  }

  // ---------- Influencer swap ----------
  if (phase === 'influencer-gate') {
    const influencer = playerById.get(influencerId)!;
    return (
      <>
        {roundBadge}
        <MinigamePanel>
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
            <PlayerAvatar name={influencer.name} size="lg" />
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">
              Pass to the Influencer
            </p>
            <h2 className="font-display text-2xl font-extrabold text-text-hi">{influencer.name}</h2>
            <p className="max-w-[280px] font-body text-[12px] text-text-low">
              Everyone else, look away — this decision is private.
            </p>
            <div className="mt-1 w-full max-w-[240px]">
              <PrimaryButton onClick={() => setPhase('influencer')}>I have it</PrimaryButton>
            </div>
          </div>
        </MinigamePanel>
      </>
    );
  }

  if (phase === 'influencer') {
    const groupChoice = tallyCrate(crateVotes);
    const voteCounts: Record<string, number> = {};
    Object.values(crateVotes).forEach((c) => {
      voteCounts[c] = (voteCounts[c] ?? 0) + 1;
    });
    return (
      <>
        {roundBadge}
        <MinigamePanel>
          <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">
            Influencer only
          </p>
          <h2 className="mb-1 text-center font-display text-xl font-extrabold text-text-hi">
            The group chose Crate {groupChoice}
          </h2>
          <p className="mb-4 text-center font-body text-[12px] text-text-low">
            {Object.entries(voteCounts)
              .map(([c, n]) => `${c}: ${n}`)
              .join('  ·  ')}
          </p>

          <p className="mb-3 text-center font-body text-sm text-text-mid">
            You may secretly swap it for a different crate — or let it stand.
          </p>

          <div className="mb-5 grid grid-cols-5 gap-2">
            {round.crates.map((c) => {
              const isChoice = c === groupChoice;
              return (
                <button
                  key={c}
                  type="button"
                  disabled={isChoice}
                  onClick={() => resolveInfluencer(c)}
                  className={`flex aspect-square items-center justify-center rounded-xl border-2 font-display text-lg font-extrabold transition-colors disabled:opacity-30 ${
                    isChoice ? 'border-[#B39DFF] text-[#B39DFF]' : 'border-line bg-surface text-text-mid'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <PrimaryButton onClick={() => resolveInfluencer(null)}>
            Let the vote stand
          </PrimaryButton>
        </MinigamePanel>
      </>
    );
  }

  // ---------- Reveal ----------
  const found = openedCrate === round.riggedCrate;
  return (
    <>
      {roundBadge}
      <MinigamePanel>
        <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">
          Opening Crate {openedCrate}
        </p>

        <div className="mb-5 grid grid-cols-5 gap-2">
          {round.crates.map((c) => (
            <CrateTile
              key={c}
              label={c}
              opened={c === openedCrate}
              rigged={c === round.riggedCrate}
              revealAll
            />
          ))}
        </div>

        <AnimatePresence>
          <motion.h2
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-2 text-center font-display text-2xl font-extrabold"
            style={{ color: found ? '#7ED9A4' : '#E8A33D' }}
          >
            {found ? 'Rigged crate found' : 'Safe crate — nothing inside'}
          </motion.h2>
        </AnimatePresence>

        <p className="mb-5 text-center font-body text-sm text-text-mid">
          {found
            ? 'The crew located it.'
            : roundNumber === 1
              ? `Crate ${openedCrate} is now proven safe and removed. One more attempt.`
              : 'Out of attempts.'}
        </p>

        {swapTarget && (
          <p className="mb-4 rounded-lg border px-3 py-2 text-center font-body text-[12px]"
             style={{ borderColor: '#B36FD955', background: 'rgba(179,111,217,0.1)', color: '#C9A0EC' }}>
            The Influencer swapped the vote to Crate {swapTarget}.
          </p>
        )}

        <PrimaryButton onClick={finishRound}>
          {found || roundNumber === 2 ? 'See results' : 'Continue to round 2'}
        </PrimaryButton>
      </MinigamePanel>

      {/* Roles stay hidden between rounds — revealing them here would kill round 2. */}
      {(found || roundNumber === 2) && (
        <MinigamePanel className="mt-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-low">Roles</p>
          <ul className="flex flex-col gap-1.5">
            {players.map((p) => {
              const role = setup.roles[p.id];
              return (
                <li key={p.id} className="flex items-center justify-between">
                  <span className="font-body text-[13px] text-text-hi">{p.name}</span>
                  <span className="font-mono text-[11px]" style={{ color: ROLE_ACCENT[role] }}>
                    {ROLE_LABEL[role]}
                  </span>
                </li>
              );
            })}
          </ul>
        </MinigamePanel>
      )}
    </>
  );
}
