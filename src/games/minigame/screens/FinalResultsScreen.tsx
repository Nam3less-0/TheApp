import { Link } from 'react-router-dom';
import { useMinigame } from '../context';
import { getInitials } from '../utils';
import MinigamePanel, { MinigamePageWrap, PrimaryButton, HAZARD } from '../components/MinigamePanel';
import PlayerAvatar from '../components/PlayerAvatar';
import type { Player } from '../types';

const PODIUM = [
  {
    place: 1,
    label: '1st',
    color: '#B39DFF',
    avatarBg: 'linear-gradient(165deg, #B39DFF, #453473)',
    pedestal: 'linear-gradient(180deg, rgba(139,111,217,0.35), rgba(69,52,115,0.15))',
    border: 'rgba(179,157,255,0.6)',
    height: 'h-28',
    avatar: 'h-16 w-16 text-xl',
  },
  {
    place: 2,
    label: '2nd',
    color: '#C9CDD6',
    avatarBg: 'linear-gradient(165deg, #F2F4F8, #8B8F99)',
    pedestal: 'linear-gradient(180deg, rgba(201,205,214,0.22), rgba(139,143,153,0.08))',
    border: 'rgba(201,205,214,0.4)',
    height: 'h-20',
    avatar: 'h-12 w-12 text-base',
  },
  {
    place: 3,
    label: '3rd',
    color: '#C99A7A',
    avatarBg: 'linear-gradient(165deg, #E2C0A8, #A87C5E)',
    pedestal: 'linear-gradient(180deg, rgba(201,154,122,0.22), rgba(168,124,94,0.08))',
    border: 'rgba(201,154,122,0.4)',
    height: 'h-16',
    avatar: 'h-12 w-12 text-base',
  },
] as const;

function PodiumColumn({ player, slot }: { player: Player; slot: (typeof PODIUM)[number] }) {
  const isWinner = slot.place === 1;
  return (
    <div className="flex flex-col items-center justify-end gap-2">
      {isWinner && (
        <span className="text-lg leading-none" aria-hidden="true" style={{ color: slot.color }}>
          &#9812;
        </span>
      )}
      <span
        className={`flex items-center justify-center rounded-full font-display font-bold text-void ${slot.avatar}`}
        style={{
          background: slot.avatarBg,
          boxShadow: `0 0 0 2px #131417, 0 0 0 4px ${slot.border}${isWinner ? ', 0 0 22px -2px ' + slot.color : ''}`,
        }}
        aria-hidden="true"
      >
        {getInitials(player.name)}
      </span>
      <p className="max-w-full truncate px-1 text-center font-body text-[13px] font-bold text-text-hi">{player.name}</p>
      <div
        className={`flex w-full flex-col items-center justify-start gap-0.5 rounded-t-xl border-x border-t pt-2.5 ${slot.height}`}
        style={{ background: slot.pedestal, borderColor: slot.border }}
      >
        <span className="font-display text-2xl font-extrabold tabular-nums" style={{ color: slot.color }}>
          {player.score}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-mid">{slot.label}</span>
      </div>
    </div>
  );
}

export default function FinalResultsScreen() {
  const { state, dispatch } = useMinigame();

  const ranked = [...state.players].sort((a, b) => b.score - a.score);
  const topScore = ranked[0]?.score ?? 0;
  const winners = ranked.filter((p) => p.score === topScore);
  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3);
  const podiumLayout = [podium[1], podium[0], podium[2]];
  const slotByPlace = (place: number) => PODIUM.find((s) => s.place === place)!;

  const timesSaboteur = (playerId: string) => state.history.filter((h) => h.saboteurId === playerId).length;

  return (
    <MinigamePageWrap>
      <p className="mb-1 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#B39DFF]">
        All 10 rounds complete
      </p>
      <h1 className="mb-2 text-center font-display text-[26px] font-extrabold tracking-[-0.5px] text-text-hi sm:text-[30px]">
        Final standings
      </h1>
      {ranked[0] && (
        <p className="mb-7 text-center font-body text-sm text-text-mid">
          {winners.length > 1 ? (
            <>
              <span className="font-bold text-[#B39DFF]">Tie</span> at {topScore} points
            </>
          ) : (
            <>
              <span className="font-bold text-[#B39DFF]">{ranked[0].name}</span> takes it with {topScore} points
            </>
          )}
        </p>
      )}

      <MinigamePanel>
        <div className="grid grid-cols-3 items-end gap-2.5">
          {podiumLayout.map((player, i) => {
            if (!player) return <div key={i} aria-hidden="true" />;
            const place = ranked.indexOf(player) + 1;
            return <PodiumColumn key={player.id} player={player} slot={slotByPlace(Math.min(place, 3))} />;
          })}
        </div>

        {rest.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
            {rest.map((player, index) => (
              <li key={player.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5">
                <span className="w-5 font-mono text-sm text-text-low">{index + 4}</span>
                <PlayerAvatar name={player.name} size="sm" />
                <span className="min-w-0 flex-1 truncate font-body text-sm font-semibold text-text-hi">{player.name}</span>
                <span className="font-display text-base font-bold tabular-nums text-text-hi">{player.score}</span>
              </li>
            ))}
          </ul>
        )}
      </MinigamePanel>

      <MinigamePanel className="mt-4">
        <p className="mb-3 font-body text-sm font-bold text-text-hi">Who was the Saboteur, and when</p>
        <ul className="flex flex-col gap-2">
          {state.players.map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded-lg border border-line bg-surface px-3 py-2">
              <span className="font-body text-sm font-semibold text-text-hi">{p.name}</span>
              <span className="font-mono text-[11px] text-text-low">{timesSaboteur(p.id)}&times; Saboteur</span>
            </li>
          ))}
        </ul>
      </MinigamePanel>

      <MinigamePanel className="mt-4">
        <p className="mb-3 font-body text-sm font-bold text-text-hi">Round recap</p>
        <ul className="flex flex-col gap-2.5">
          {state.history.map((h, i) => (
            <li key={h.roundId} className="rounded-xl border border-line bg-surface px-3.5 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-text-low">
                  Round {i + 1} &middot; {h.glyph} {h.roundTitle}
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-wider"
                  style={{ color: h.buildersWon ? '#7ED9A4' : HAZARD }}
                >
                  {h.buildersWon ? 'Builders' : 'Saboteur'}
                </span>
              </div>
              <p className="mt-1 font-body text-[13px] text-text-mid">{h.summary}</p>
            </li>
          ))}
        </ul>
      </MinigamePanel>

      <div className="mt-5 flex flex-col gap-3">
        <PrimaryButton onClick={() => dispatch({ type: 'RESTART' })}>Play again</PrimaryButton>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line px-4 py-3 text-center font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6FD9]"
        >
          Back to shelf
        </Link>
      </div>
    </MinigamePageWrap>
  );
}
