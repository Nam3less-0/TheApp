import { useEffect, useRef, useState } from 'react';
import { useJeopardy } from '../context';
import { COLORS } from '../utils';

type Confirm = 'end' | 'abandon' | null;

export default function GameControls() {
  const { state, dispatch } = useJeopardy();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Controls only make sense while a game is actually in progress.
  const inGame = state.phase !== 'setup' && state.phase !== 'final';

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

  if (!inGame) {
    return <span className="w-12" aria-hidden="true" />;
  }

  const soundOn = state.settings.soundEnabled;

  function close() {
    setOpen(false);
    setConfirm(null);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Game options"
        className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 font-mono text-[11px] text-text-mid transition-colors hover:border-steel-blue/40 hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
      >
        <span aria-hidden="true">⚙</span>
        Options
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-60 rounded-xl border border-line bg-surface p-1.5"
          style={{ boxShadow: '0 12px 32px -14px rgba(0,0,0,0.8)' }}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
            className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left font-body text-[13px] font-semibold text-text-hi transition-colors hover:bg-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
          >
            <span>Sound effects</span>
            <span
              className="font-mono text-[11px]"
              style={{ color: soundOn ? COLORS.good : COLORS.bad }}
            >
              {soundOn ? 'On' : 'Off'}
            </span>
          </button>

          <div className="my-1 h-px bg-line" />

          {confirm === 'end' ? (
            <div className="rounded-lg bg-deep p-2.5">
              <p className="mb-2 font-body text-[12px] text-text-mid">
                End now and jump to the current standings?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'END_GAME' });
                    close();
                  }}
                  className="flex-1 rounded-lg border px-2.5 py-2 font-body text-[12px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-good"
                  style={{ borderColor: COLORS.good, color: COLORS.good }}
                >
                  End game
                </button>
                <button
                  type="button"
                  onClick={() => setConfirm(null)}
                  className="flex-1 rounded-lg border border-line px-2.5 py-2 font-body text-[12px] font-semibold text-text-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              role="menuitem"
              onClick={() => setConfirm('end')}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left font-body text-[13px] font-semibold text-text-hi transition-colors hover:bg-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
            >
              End game &amp; see scores
            </button>
          )}

          {confirm === 'abandon' ? (
            <div className="mt-1 rounded-lg bg-deep p-2.5">
              <p className="mb-2 font-body text-[12px] text-text-mid">
                Abandon this game and return to setup? Scores will be lost.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'ABANDON_GAME' });
                    close();
                  }}
                  className="flex-1 rounded-lg border px-2.5 py-2 font-body text-[12px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bad"
                  style={{ borderColor: COLORS.bad, color: COLORS.bad }}
                >
                  Abandon
                </button>
                <button
                  type="button"
                  onClick={() => setConfirm(null)}
                  className="flex-1 rounded-lg border border-line px-2.5 py-2 font-body text-[12px] font-semibold text-text-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
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
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left font-body text-[13px] font-semibold transition-colors hover:bg-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bad"
              style={{ color: COLORS.bad }}
            >
              Abandon game
            </button>
          )}
        </div>
      )}
    </div>
  );
}
