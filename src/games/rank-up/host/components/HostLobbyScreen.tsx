import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { rankUpPlayerJoinUrl } from '../../../../lib/appUrl';
import { useRankUpHost } from '../context';
import HostLeaderboard from './HostLeaderboard';
import RankUpPanel, { RankUpPrimaryButton, RankUpSecondaryButton } from '../../components/Layout';
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

  if (!awaitingRoundStart) {
    return (
      <RankUpPanel compact className="mx-auto max-w-xl border-[#6FA3C4]/25">
        <p className="text-center font-body text-sm text-text-mid">
          {ranker
            ? `${ranker.name} is up next — waiting for them to start their turn on their phone.`
            : 'Waiting for the next turn…'}
        </p>
        {rankerMissingFromRoom ? (
          <RankUpSecondaryButton
            onClick={() => skipCurrentTurn()}
            className="mt-4 w-full text-center"
          >
            Skip {ranker?.name ?? 'ranker'}&apos;s turn
          </RankUpSecondaryButton>
        ) : null}
      </RankUpPanel>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6FA3C4]">
          Host display — setup
        </p>
        <h1 className="mt-2 font-display text-[32px] font-extrabold leading-tight text-text-hi sm:text-4xl">
          Scan to play on your phone
        </h1>
        <p className="mx-auto mt-3 max-w-lg font-body text-sm text-text-mid">
          {isGameroom
            ? 'Players join via QR code. Start the round when everyone is ready — then this screen switches to the leaderboard.'
            : 'Share the QR code. Start the round from here when ready.'}
        </p>
      </header>

      <div className="mx-auto grid w-full max-w-2xl gap-6 sm:grid-cols-2">
        <RankUpPanel compact className="flex flex-col items-center justify-center border-[#6FA3C4]/25">
          <canvas ref={canvasRef} className="rounded-xl" aria-label={`QR code to join room ${room.code}`} />
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
            Join link
          </p>
          <p className="mt-1 break-all px-2 text-center font-mono text-[11px] text-text-mid">
            {rankUpPlayerJoinUrl(room.code)}
          </p>
        </RankUpPanel>

        <div className="flex flex-col justify-center gap-4">
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
        </div>
      </div>

      {players.length > 0 ? (
        <div className="mx-auto w-full max-w-md">
          <HostLeaderboard variant="sidebar" />
        </div>
      ) : null}
    </div>
  );
}
