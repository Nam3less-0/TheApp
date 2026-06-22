import { useEffect, useRef, useState } from 'react';
import type { CodeTriple, TeamCard } from '../types';
import { generateCode } from '../utils';
import CodewordCard from './CodewordCard';
import CodewordPanel from './CodewordPanel';

export interface OurDraft {
  code: CodeTriple | null;
  concealed: boolean;
  hints: [string, string, string];
}

export const emptyOurDraft: OurDraft = {
  code: null,
  concealed: false,
  hints: ['', '', ''],
};

interface OurTurnScreenProps {
  card: TeamCard;
  round: number;
  draft: OurDraft;
  onDraftChange: (draft: OurDraft) => void;
  onResolve: (outcome: 'correct' | 'wrong') => void;
}

const COPPER = '#C99A7A';
const HOLD_PEEK_MS = 450;

function CodeVault({
  code,
  concealed,
  onHide,
  onReveal,
}: {
  code: CodeTriple;
  concealed: boolean;
  onHide: () => void;
  onReveal: () => void;
}) {
  const [peeking, setPeeking] = useState(false);
  const [confirmReveal, setConfirmReveal] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const holdActiveRef = useRef(false);

  const showDigits = !concealed || peeking;

  function clearHoldTimer() {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }

  function stopPeek() {
    clearHoldTimer();
    holdActiveRef.current = false;
    setPeeking(false);
  }

  function startHoldPeek() {
    if (!concealed) return;
    clearHoldTimer();
    holdActiveRef.current = true;
    holdTimerRef.current = window.setTimeout(() => {
      if (holdActiveRef.current) setPeeking(true);
    }, HOLD_PEEK_MS);
  }

  function confirmPermanentReveal() {
    onReveal();
    setConfirmReveal(false);
    stopPeek();
  }

  useEffect(() => {
    if (concealed) {
      setConfirmReveal(false);
      stopPeek();
    }
  }, [concealed]);

  function renderDigits() {
    return code.map((digit, i) => (
      <div
        key={i}
        className="relative flex flex-1 items-center justify-center py-4 sm:py-[18px]"
        style={{
          background: showDigits
            ? 'linear-gradient(180deg, #131417 0%, #0A0B0D 42%, #131417 100%)'
            : 'repeating-linear-gradient(-45deg, #1A1C20, #1A1C20 5px, #222428 5px, #222428 10px)',
        }}
      >
        {i > 0 && (
          <span
            className="pointer-events-none absolute left-0 top-[18%] bottom-[18%] w-px bg-white/10"
            aria-hidden="true"
          />
        )}
        {showDigits ? (
          <span
            className="font-display text-[2rem] font-extrabold leading-none tabular-nums sm:text-[2.25rem]"
            style={{ color: COPPER }}
          >
            {digit}
          </span>
        ) : (
          <span className="font-mono text-base tracking-[0.35em] text-text-low">•••</span>
        )}
      </div>
    ));
  }

  const vaultFrame = (
    <div
      className="flex overflow-hidden rounded-xl border transition-colors"
      style={{
        borderColor: showDigits
          ? 'rgba(201,154,122,0.45)'
          : 'rgba(220,224,232,0.14)',
        boxShadow: showDigits
          ? 'inset 0 2px 12px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,154,122,0.08)'
          : 'inset 0 2px 10px rgba(0,0,0,0.35)',
      }}
    >
      {renderDigits()}
    </div>
  );

  if (!concealed) {
    return (
      <div>
        <button
          type="button"
          onClick={onHide}
          aria-label="Hide code"
          className="group w-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
        >
          {vaultFrame}
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-text-low transition-colors group-hover:text-text-mid">
            Tap code to hide
          </p>
        </button>

        <button
          type="button"
          onClick={onHide}
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-copper/35 bg-copper/10 px-4 py-2 font-body text-[13px] font-bold text-copper transition-colors hover:border-copper/55 hover:bg-copper/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
        >
          Hide &amp; pass phone
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Hold to peek at code"
        className="w-full select-none rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
        style={{ touchAction: 'none' }}
        onPointerDown={(e) => {
          e.preventDefault();
          startHoldPeek();
        }}
        onPointerUp={stopPeek}
        onPointerLeave={stopPeek}
        onPointerCancel={stopPeek}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setPeeking(true);
          }
        }}
        onKeyUp={(e) => {
          if (e.key === ' ' || e.key === 'Enter') stopPeek();
        }}
        onBlur={stopPeek}
      >
        {vaultFrame}
        <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-text-low">
          {peeking ? 'Release to hide' : 'Hold to peek · won\u2019t stay visible'}
        </p>
      </div>

      {confirmReveal ? (
        <div
          className="mt-3 rounded-xl border border-line-bright/25 px-3.5 py-3"
          style={{ background: 'linear-gradient(165deg, #1E2024, #181A1E)' }}
        >
          <p className="mb-3 font-body text-sm text-text-mid">
            Only show the code if opponents can&apos;t see this screen.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmReveal(false)}
              className="flex-1 rounded-xl border border-line px-3 py-2 font-body text-[13px] font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmPermanentReveal}
              className="flex-1 rounded-xl border border-copper/40 bg-copper/10 px-3 py-2 font-body text-[13px] font-bold text-copper transition-colors hover:bg-copper/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
            >
              Show code
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmReveal(true)}
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-line bg-surface/60 px-4 py-2 font-body text-[13px] font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
        >
          Need to show code again?
        </button>
      )}
    </div>
  );
}

export default function OurTurnScreen({
  card,
  round,
  draft,
  onDraftChange,
  onResolve,
}: OurTurnScreenProps) {
  const hasCode = draft.code !== null;

  function rollCode() {
    onDraftChange({
      ...draft,
      code: generateCode(),
      concealed: false,
    });
  }

  function hideCode() {
    onDraftChange({ ...draft, concealed: true });
  }

  function revealCode() {
    onDraftChange({ ...draft, concealed: false });
  }

  function setHint(index: number, value: string) {
    const hints = [...draft.hints] as [string, string, string];
    hints[index] = value;
    onDraftChange({ ...draft, hints });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        <CodewordPanel>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">
            Round {round} · Secret code
          </p>

          {hasCode ? (
            <>
              <CodeVault
                code={draft.code!}
                concealed={draft.concealed}
                onHide={hideCode}
                onReveal={revealCode}
              />
              <button
                type="button"
                onClick={rollCode}
                className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-line bg-surface/60 px-4 py-2 font-body text-[13px] font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
              >
                <span aria-hidden="true">↻</span>
                New code
              </button>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-line-bright/30 px-4 py-6 text-center">
              <p className="mb-4 font-body text-sm text-text-mid">
                Roll a three-digit code, then clue each digit aloud.
              </p>
              <button
                type="button"
                onClick={rollCode}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border-none px-5 py-2.5 font-body text-sm font-bold text-void transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
                style={{
                  background:
                    'linear-gradient(180deg, #E2C0A8, #C99A7A 55%, #A87C5E)',
                }}
              >
                Generate code
              </button>
            </div>
          )}
        </CodewordPanel>

        <CodewordPanel className="h-full">
          <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-text-low">
            Your codeword reference
          </p>
          <CodewordCard card={card} compact />
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-text-low">
            Hide before passing the phone — concealed codes need a hold or confirmation to show again.
          </p>
        </CodewordPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <CodewordPanel>
          <p className="mb-2.5 font-body text-sm font-bold text-text-hi">
            Hints given <span className="font-normal text-text-low">(optional)</span>
          </p>
          <div className="flex flex-col gap-2">
            {draft.hints.map((hint, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[12px] font-bold text-void"
                  style={{ backgroundColor: COPPER }}
                >
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => setHint(i, e.target.value)}
                  placeholder={`Hint for digit ${i + 1}`}
                  className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 font-body text-sm text-text-hi placeholder:text-text-low focus-visible:border-copper focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-copper"
                />
              </div>
            ))}
          </div>
        </CodewordPanel>

        <div className="grid grid-cols-2 gap-2.5 lg:w-[280px] lg:grid-cols-1">
          <button
            type="button"
            disabled={!hasCode}
            onClick={() => onResolve('correct')}
            className="flex min-h-[50px] items-center justify-center rounded-xl border border-good bg-good/5 px-3 font-body text-sm font-bold text-good transition-colors hover:bg-good/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-good disabled:cursor-not-allowed disabled:opacity-40"
          >
            ✓ Correct
          </button>
          <button
            type="button"
            disabled={!hasCode}
            onClick={() => onResolve('wrong')}
            className="flex min-h-[50px] items-center justify-center rounded-xl border border-bad bg-bad/5 px-3 font-body text-sm font-bold text-bad transition-colors hover:bg-bad/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bad disabled:cursor-not-allowed disabled:opacity-40"
          >
            ✕ Wrong — log a miss
          </button>
        </div>
      </div>
    </div>
  );
}
