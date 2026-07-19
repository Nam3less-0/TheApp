import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { rankUpPlayerJoinUrl } from '../../../../lib/appUrl';
import { useRankUpHost } from '../context';
import RoomCodeDisplay from '../../components/RoomCodeDisplay';
import RankUpPanel, { RankUpPageWrap, RankUpPrimaryButton, RankUpSecondaryButton } from '../../components/Layout';
import { CrownIcon } from '../../components/RankUpIcons';
import { isAwaitingRoundStart } from '../../sync/types';

export default function HostLobbyScreen() {
  const { room, players, isGameroom, startNewRound, skipCurrentTurn } = useRankUpHost();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !room) return;

    void QRCode.toCanvas(canvas, rankUpPlayerJoinUrl(room.code), {
      width: 240,
      margin: 1,
      color: {
        dark: '#ECEEF2',
        light: '#00000000',
      },
    });
  }, [room?.code, room]);

  if (!room) return null;

  const ranker = players.find((player) => player.id === room.rankerPlayerId);
  const awaitingRoundStart = isAwaitingRoundStart(room);
  const rankerMissingFromRoom = Boolean(
    room.rankerPlayerId && !players.some((player) => player.id === room.rankerPlayerId),
  );

  return (
    <RankUpPageWrap variant="display">
      <header className="mb-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6FA3C4]">
          Host display — lobby
        </p>
        <h1 className="mt-2 font-display text-[32px] font-extrabold leading-tight text-text-hi sm:text-4xl">
          Scan to play on your phone
        </h1>
        <p className="mx-auto mt-3 max-w-lg font-body text-sm text-text-mid">
          {isGameroom
            ? 'Players scan the QR code to join on their phones. Start each round from this screen when everyone is ready.'
            : 'This screen runs the session — start rounds, reveal answers, and advance turns from here.'}
        </p>
      </header>

      <div className="mx-auto grid max-w-3xl gap-6 lg:grid-cols-[1fr_1.1fr]">
        <RankUpPanel compact className="flex flex-col items-center justify-center border-[#6FA3C4]/25">
          <canvas ref={canvasRef} className="rounded-xl" aria-label={`QR code to join room ${room.code}`} />
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
            Join link
          </p>
          <p className="mt-1 break-all px-2 text-center font-mono text-[11px] text-text-mid">
            {rankUpPlayerJoinUrl(room.code)}
          </p>
        </RankUpPanel>

        <div className="flex flex-col gap-6">
          <RoomCodeDisplay code={room.code} />

          <RankUpPanel compact>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
              Players ({players.length})
            </p>
            <ul className="flex flex-col gap-2">
              {players.map((player) => {
                const isCurrentRanker = player.id === room.rankerPlayerId;

                return (
                  <li
                    key={player.id}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                      isCurrentRanker ? 'border-pewter/50 bg-surface' : 'border-line'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-deep/60 font-mono text-xs font-bold text-text-mid">
                        {isCurrentRanker ? (
                          <CrownIcon className="h-3.5 w-3.5 text-pewter" />
                        ) : (
                          player.name.slice(0, 1).toUpperCase()
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-body text-sm font-semibold text-text-hi">
                          {player.name}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-text-low">
                          {isCurrentRanker ? 'Ranker' : 'Guesser'}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-sm text-pewter">{player.score}</span>
                  </li>
                );
              })}
            </ul>
          </RankUpPanel>

          {awaitingRoundStart ? (
            <>
              <RankUpPrimaryButton
                onClick={() => startNewRound()}
                disabled={players.length < 2}
                className="w-full"
              >
                Start Round 1
              </RankUpPrimaryButton>
              {players.length < 2 ? (
                <p className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-text-low">
                  Need at least 2 players to start
                </p>
              ) : null}
            </>
          ) : (
            <>
              <RankUpPanel compact>
                <p className="text-center font-body text-sm text-text-mid">
                  {ranker
                    ? `Waiting for ${ranker.name} to start their turn…`
                    : 'Waiting for the next turn…'}
                </p>
              </RankUpPanel>
              {rankerMissingFromRoom ? (
                <RankUpSecondaryButton
                  onClick={() => skipCurrentTurn()}
                  className="w-full text-center"
                >
                  Skip {ranker?.name ?? 'ranker'}&apos;s turn
                </RankUpSecondaryButton>
              ) : null}
            </>
          )}
        </div>
      </div>
    </RankUpPageWrap>
  );
}
