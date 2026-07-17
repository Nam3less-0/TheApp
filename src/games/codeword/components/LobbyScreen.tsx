import { useCodeword } from '../context';
import CodewordPanel, { CodewordPageWrap } from './CodewordPanel';
import RoomCodeDisplay from './RoomCodeDisplay';

export default function LobbyScreen() {
  const {
    room,
    teams,
    teamId,
    isHost,
    opponentTeam,
    startSetup,
    leaveGame,
    syncError,
  } = useCodeword();

  if (!room) return null;

  const bothTeamsReady = teams.length === 2;
  const myTeam = teams.find((team) => team.id === teamId);

  return (
    <CodewordPageWrap>
      <header className="mb-6">
        <RoomCodeDisplay code={room.code} />
      </header>

      {syncError && (
        <CodewordPanel className="mb-6 border-bad/40">
          <p className="font-body text-sm text-bad">{syncError}</p>
        </CodewordPanel>
      )}

      <CodewordPanel className="mb-6">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
          Teams ({teams.length}/2)
        </p>
        <ul className="flex flex-col gap-2">
          {teams.map((team) => {
            const isYou = team.id === teamId;
            const isOpponent = team.id === opponentTeam?.id;
            return (
              <li
                key={team.id}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  isYou ? 'border-copper/50 bg-surface' : 'border-line'
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate font-body text-sm font-semibold text-text-hi">
                    {team.name}
                    {isYou ? ' (you)' : ''}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-text-low">
                    {team.slot === 1 ? 'Host' : 'Guest'}
                    {room.transmittingTeamId === team.id && room.phase === 'playing'
                      ? ' · Transmitting'
                      : ''}
                  </p>
                </div>
                {room.phase === 'setup' && (
                  <span
                    className={`shrink-0 font-mono text-[11px] ${
                      team.cardLocked ? 'text-good' : 'text-text-low'
                    }`}
                  >
                    {team.cardLocked ? 'Card locked' : 'Drawing card…'}
                  </span>
                )}
                {room.phase === 'playing' && isOpponent && (
                  <span className="shrink-0 font-mono text-[11px] text-text-mid">
                    {team.intercepts} int · {team.misses} miss
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </CodewordPanel>

      {room.phase === 'lobby' && (
        <div className="flex flex-col gap-3">
          {bothTeamsReady && isHost ? (
            <button
              type="button"
              onClick={startSetup}
              className="w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
              style={{
                background: 'linear-gradient(180deg, #E2C0A8, #C99A7A 55%, #A87C5E)',
              }}
            >
              Both teams ready — draw cards
            </button>
          ) : bothTeamsReady ? (
            <CodewordPanel>
              <p className="text-center font-body text-sm text-text-mid">
                Waiting for{' '}
                <span className="font-semibold text-text-hi">
                  {teams.find((t) => t.id === room.hostTeamId)?.name ?? 'host'}
                </span>{' '}
                to start…
              </p>
            </CodewordPanel>
          ) : (
            <CodewordPanel>
              <p className="text-center font-body text-sm text-text-mid">
                Waiting for the other team to join…
              </p>
              <p className="mt-2 text-center font-mono text-[11px] text-text-low">
                Share the room code with the opposing team.
              </p>
            </CodewordPanel>
          )}
        </div>
      )}

      {room.phase === 'setup' && myTeam?.cardLocked && !opponentTeam?.cardLocked && (
        <CodewordPanel className="mb-6">
          <p className="text-center font-body text-sm text-text-mid">
            Your card is locked. Waiting for{' '}
            <span className="font-semibold text-text-hi">
              {opponentTeam?.name ?? 'the other team'}
            </span>{' '}
            to lock theirs…
          </p>
        </CodewordPanel>
      )}

      <button
        type="button"
        onClick={leaveGame}
        className="mt-4 w-full rounded-xl border border-line px-4 py-2.5 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
      >
        Leave room
      </button>
    </CodewordPageWrap>
  );
}
