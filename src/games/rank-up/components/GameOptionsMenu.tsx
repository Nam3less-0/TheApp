import { useEffect, useRef, useState } from 'react';
import { useRankUp } from '../context';

type ConfirmAction = 'leave' | 'abandon' | null;

export default function GameOptionsMenu() {
  const { local, room, isHost, leaveGame, abandonGame } = useRankUp();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmAction>(null);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const inRoom = local.localPhase !== 'setup' && Boolean(local.roomCode);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
        setConfirm(null);
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) setConfirm(null);
  }, [open]);

  if (!inRoom) {
    return <span className="w-12" aria-hidden="true" />;
  }

  function close() {
    setOpen(false);
    setConfirm(null);
  }

  async function handleLeave() {
    setBusy(true);
    try {
      await leaveGame();
      close();
    } finally {
      setBusy(false);
    }
  }

  async function handleAbandonGame() {
    setBusy(true);
    try {
      await abandonGame();
      close();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Game options"
        className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 font-mono text-[11px] text-text-mid transition-colors hover:border-[#6FA3C4]/40 hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FA3C4]"
      >
        <span aria-hidden="true">⚙</span>
        Options
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-line bg-surface p-1.5 shadow-[0_12px_32px_-14px_rgba(0,0,0,0.8)]"
        >
          {confirm === 'leave' ? (
            <div className="rounded-lg bg-deep p-2.5">
              <p className="mb-2 font-body text-[12px] text-text-mid">
                Leave this room? You can rejoin with the same code.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void handleLeave()}
                  className="flex-1 rounded-lg border border-line px-2.5 py-2 font-body text-[12px] font-bold text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FA3C4] disabled:opacity-40"
                >
                  Leave
                </button>
                <button
                  type="button"
                  onClick={() => setConfirm(null)}
                  className="flex-1 rounded-lg border border-line px-2.5 py-2 font-body text-[12px] font-semibold text-text-mid"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              role="menuitem"
              onClick={() => setConfirm('leave')}
              className="flex w-full rounded-lg px-3 py-2.5 text-left font-body text-[13px] font-semibold text-text-hi transition-colors hover:bg-deep"
            >
              Leave room
            </button>
          )}

          {isHost ? (
            confirm === 'abandon' ? (
              <div className="mt-1 rounded-lg bg-deep p-2.5">
                <p className="mb-2 font-body text-[12px] text-text-mid">
                  Abandon the game for everyone? Scores reset and the room returns to the lobby.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void handleAbandonGame()}
                    className="flex-1 rounded-lg border border-bad px-2.5 py-2 font-body text-[12px] font-bold text-bad focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bad disabled:opacity-40"
                  >
                    Abandon
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirm(null)}
                    className="flex-1 rounded-lg border border-line px-2.5 py-2 font-body text-[12px] font-semibold text-text-mid"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                role="menuitem"
                onClick={() => setConfirm('abandon')}
                className="mt-1 flex w-full rounded-lg px-3 py-2.5 text-left font-body text-[13px] font-semibold text-bad transition-colors hover:bg-deep"
              >
                Abandon game
              </button>
            )
          ) : null}

          {room ? (
            <p className="mt-2 border-t border-line px-3 pt-2 font-mono text-[10px] uppercase tracking-wider text-text-low">
              Room {room.code}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
