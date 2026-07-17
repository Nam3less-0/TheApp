import { useImposter } from '../context';
import { MIN_PLAYERS, ROUND_OPTIONS } from '../utils';
import ImposterPanel, { ImposterPageWrap } from './ImposterPanel';
import PlayerAvatar from './PlayerAvatar';
import RoomCodeDisplay from './RoomCodeDisplay';

export default function LobbyScreen() {
  const {
    room,
    roomPlayers,
    playerId,
    isHost,
    syncError,
    startSyncedGame,
    updateTotalRounds,
    leaveGame,
  } = useImposter();

  if (!room) return null;

  const canStart = roomPlayers.length >= MIN_PLAYERS;

  return (
    <ImposterPageWrap>
      <header className="mb-6">
        <RoomCodeDisplay code={room.code} />
      </header>

      {syncError && (
        <ImposterPanel className="mb-6 border-bad/40">
          <p className="font-body text-sm text-bad">{syncError}</p>
        </ImposterPanel>
      )}

      <ImposterPanel className="mb-6">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
          Players ({roomPlayers.length})
        </p>
        <ul className="flex flex-col gap-2">
          {roomPlayers.map((player) => (
            <li
              key={player.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                player.id === playerId ? 'border-ember/50 bg-surface' : 'border-line'
              }`}
            >
              <PlayerAvatar name={player.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-sm font-semibold text-text-hi">
                  {player.name}
                  {player.id === playerId ? ' (you)' : ''}
                </p>
                {player.id === room.hostPlayerId && (
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ember-bright">
                    Host
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
        {roomPlayers.length < MIN_PLAYERS && (
          <p className="mt-3 font-body text-[13px] text-text-mid">
            Need at least {MIN_PLAYERS} players to start. Share the room code.
          </p>
        )}
      </ImposterPanel>

      {isHost && (
        <ImposterPanel className="mb-6">
          <p className="mb-1 font-body text-sm font-bold text-text-hi">Rounds</p>
          <p className="mb-3 font-body text-[13px] text-text-mid">
            How many rounds before final standings.
          </p>
          <div className="grid grid-cols-4 gap-2.5">
            {ROUND_OPTIONS.map((count) => {
              const selected = room.totalRounds === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => void updateTotalRounds(count)}
                  aria-pressed={selected}
                  className={`flex min-h-12 items-center justify-center rounded-xl border font-display text-lg font-bold transition-[border-color,box-shadow,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember ${
                    selected
                      ? 'border-ember text-ember-bright shadow-[0_0_0_1px_#C2533B_inset]'
                      : 'border-line bg-surface text-text-mid hover:border-line-bright hover:text-text-hi'
                  }`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </ImposterPanel>
      )}

      <div className="flex flex-col gap-3">
        {isHost ? (
          <button
            type="button"
            disabled={!canStart}
            onClick={() => void startSyncedGame()}
            className="w-full rounded-xl border-none px-4 py-3.5 font-body text-[15px] font-bold text-void transition-opacity disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
            style={{ background: 'linear-gradient(180deg, #E07A5F, #C2533B 55%, #7A3526)' }}
          >
            Start game
          </button>
        ) : (
          <ImposterPanel>
            <p className="text-center font-body text-sm text-text-mid">
              Waiting for{' '}
              <span className="font-semibold text-text-hi">
                {roomPlayers.find((p) => p.id === room.hostPlayerId)?.name ?? 'host'}
              </span>{' '}
              to start…
            </p>
          </ImposterPanel>
        )}

        <button
          type="button"
          onClick={() => void leaveGame()}
          className="w-full rounded-xl border border-line px-4 py-2.5 font-body text-sm font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
        >
          Leave room
        </button>
      </div>
    </ImposterPageWrap>
  );
}
