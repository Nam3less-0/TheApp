import { useRankUp } from '../context';
import { useSessionUI } from '../sessionUi';
import RankUpPanel, { RankUpPageWrap } from './Layout';

const PODIUM_STYLES = [
  { ring: 'border-[#D8B36A]/50', text: 'text-[#D8B36A]', label: '1st' },
  { ring: 'border-[#C3C9D1]/50', text: 'text-[#C3C9D1]', label: '2nd' },
  { ring: 'border-[#C08A5C]/50', text: 'text-[#C08A5C]', label: '3rd' },
] as const;

export default function RoundRecapScreen() {
  const { local, room, players, roundNumber, isHost, startNewRound, leaveGame } = useRankUp();
  const { roundPointsByPlayer } = useSessionUI();

  if (!room) return null;

  const roundStandings = players
    .map((player) => ({
      player,
      roundPoints: roundPointsByPlayer[player.id] ?? 0,
    }))
    .sort((a, b) => b.roundPoints - a.roundPoints || b.player.score - a.player.score);

  const podium = roundStandings.slice(0, 3);
  const cumulative = [...players].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  return (
    <RankUpPageWrap>
      <header className="mb-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6FA3C4]">
          Round {roundNumber} complete
        </p>
        <h1 className="mt-1 font-display text-[28px] font-extrabold text-text-hi">Round recap</h1>
        <p className="mt-2 font-body text-sm text-text-mid">
          Points earned this round — then cumulative standings.
        </p>
      </header>

      <RankUpPanel compact className="mb-6">
        <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
          This round
        </p>
        <div className="flex items-end justify-center gap-3 sm:gap-5">
          {podium.map(({ player, roundPoints }, index) => {
            const style = PODIUM_STYLES[index]!;
            const heightClass = index === 0 ? 'h-28' : index === 1 ? 'h-24' : 'h-20';

            return (
              <div key={player.id} className="flex flex-col items-center gap-2">
                <div
                  className={`flex w-[88px] flex-col items-center justify-end rounded-2xl border px-2 pb-3 pt-4 ${style.ring} ${heightClass}`}
                  style={{
                    background: 'linear-gradient(180deg, rgba(36,34,40,0.9), rgba(28,26,32,0.95))',
                  }}
                >
                  <span className={`font-mono text-[10px] uppercase ${style.text}`}>
                    {style.label}
                  </span>
                  <p className="mt-1 max-w-full truncate font-body text-sm font-bold text-text-hi">
                    {player.name}
                  </p>
                  <p className={`mt-1 font-display text-xl font-extrabold ${style.text}`}>
                    +{roundPoints}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </RankUpPanel>

      <RankUpPanel compact className="mb-6">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
          Overall standings
        </p>
        <ol className="flex flex-col gap-2">
          {cumulative.map((player, index) => (
            <li
              key={player.id}
              className="flex items-center justify-between rounded-xl border border-line px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="font-mono text-xs text-text-low">{index + 1}</span>
                <span className="truncate font-body text-sm font-semibold text-text-hi">
                  {player.name}
                  {player.id === local.playerId ? ' (you)' : ''}
                </span>
              </div>
              <span className="font-mono text-sm text-pewter">{player.score}</span>
            </li>
          ))}
        </ol>
      </RankUpPanel>

      <div className="flex flex-col gap-3">
        {isHost ? (
          <button
            type="button"
            onClick={() => startNewRound()}
            className="w-full rounded-xl border-none px-4 py-[15px] font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FA3C4] disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: 'linear-gradient(180deg, #8BB8D4, #6FA3C4 55%, #4E7F9C)',
            }}
          >
            Start Round {roundNumber + 1}
          </button>
        ) : (
          <RankUpPanel compact>
            <p className="text-center font-body text-sm text-text-mid">
              Waiting for host to start Round {roundNumber + 1}…
            </p>
          </RankUpPanel>
        )}

        <button
          type="button"
          onClick={() => leaveGame()}
          className="rounded-xl border border-line px-4 py-3 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi"
        >
          Leave room
        </button>
      </div>
    </RankUpPageWrap>
  );
}
