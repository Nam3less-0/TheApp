import { useState } from 'react';
import type { CodeTriple, InterceptLogEntry } from '../types';
import type { HintTriple } from '../intel-utils';
import InterceptRoomBackdrop from './InterceptRoomBackdrop';
import PriorIntel from './PriorIntel';
import SideDrawer from './SideDrawer';

export interface TheirDraft {
  hints: [string, string, string];
  actualCode: CodeTriple;
}

export const emptyTheirDraft: TheirDraft = {
  hints: ['', '', ''],
  actualCode: [1, 1, 1],
};

interface InterceptScreenProps {
  round: number;
  interceptLog: InterceptLogEntry[];
  draft: TheirDraft;
  onDraftChange: (draft: TheirDraft) => void;
  onResolve: (outcome: 'intercepted' | 'missed') => void;
}

const BRASS = '#C99A7A';
const SILVER = '#C9CDD6';

const HINT_PLACEHOLDERS = [
  'First clue spoken…',
  'Second clue spoken…',
  'Third clue spoken…',
] as const;

const INTEL_EMPTY =
  'Log a round to start building your case file — hints and codes appear here.';

function MagnifierIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M15 15l5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M4 10l4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CombinationDial({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
}) {
  function step(delta: number) {
    let next = value + delta;
    if (next < 1) next = 4;
    if (next > 4) next = 1;
    onChange(next);
  }

  return (
    <div className="flex flex-1 flex-col items-center">
      <button
        type="button"
        onClick={() => step(1)}
        aria-label={`Increase ${label}`}
        className="flex h-8 w-full items-center justify-center rounded-t-lg border border-line-bright/20 text-text-mid transition-colors hover:border-copper/40 hover:text-copper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
        style={{ background: 'linear-gradient(180deg, #2A2C32, #1E2024)' }}
      >
        <ChevronUp />
      </button>
      <div
        className="flex w-full items-center justify-center border-x border-line-bright/15 py-3"
        style={{
          background:
            'linear-gradient(180deg, #131417 0%, #0A0B0D 40%, #131417 100%)',
          boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.6)',
        }}
        aria-label={`${label}: ${value}`}
      >
        <span
          className="font-display text-3xl font-extrabold tabular-nums"
          style={{ color: BRASS }}
        >
          {value}
        </span>
      </div>
      <button
        type="button"
        onClick={() => step(-1)}
        aria-label={`Decrease ${label}`}
        className="flex h-8 w-full items-center justify-center rounded-b-lg border border-line-bright/20 text-text-mid transition-colors hover:border-copper/40 hover:text-copper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
        style={{ background: 'linear-gradient(180deg, #1E2024, #2A2C32)' }}
      >
        <ChevronDown />
      </button>
    </div>
  );
}

function InterceptMainPanel({
  round,
  draft,
  onDraftChange,
  onResolve,
}: {
  round: number;
  draft: TheirDraft;
  onDraftChange: (draft: TheirDraft) => void;
  onResolve: (outcome: 'intercepted' | 'missed') => void;
}) {
  function setHint(index: number, value: string) {
    const hints = [...draft.hints] as TheirDraft['hints'];
    hints[index] = value;
    onDraftChange({ ...draft, hints });
  }

  function setDial(index: number, value: number) {
    const actualCode = [...draft.actualCode] as CodeTriple;
    actualCode[index] = value;
    onDraftChange({ ...draft, actualCode });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-void"
          style={{
            background: 'linear-gradient(145deg, #E2C0A8, #C99A7A 55%, #8B6B52)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.3)',
          }}
          aria-hidden="true"
        >
          <MagnifierIcon />
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-copper">
            Case file · Round {round}
          </p>
          <h2 className="font-display text-lg font-bold text-text-hi">
            Hints overheard
          </h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        <div
          className="relative rounded-xl border px-3.5 pb-3.5 pt-5"
          style={{
            borderColor: 'rgba(201,154,122,0.2)',
            background:
              'linear-gradient(165deg, rgba(34,36,40,0.92), rgba(19,20,23,0.95))',
          }}
        >
          <div
            className="absolute -top-px left-4 rounded-t border border-b-0 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-copper"
            style={{
              borderColor: 'rgba(201,154,122,0.25)',
              background: 'rgba(26,28,32,0.95)',
            }}
          >
            Evidence
          </div>

          <ul className="relative flex flex-col gap-2">
            <div
              className="absolute bottom-4 left-[13px] top-4 w-px border-l border-dashed border-line-bright/35"
              aria-hidden="true"
            />
            {draft.hints.map((hint, i) => (
              <li key={i} className="relative flex items-center gap-2.5">
                <span
                  className="relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold text-void"
                  style={{
                    background: `linear-gradient(145deg, ${SILVER}, #8B8F99)`,
                  }}
                >
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => setHint(i, e.target.value)}
                  placeholder={HINT_PLACEHOLDERS[i]}
                  className="min-w-0 flex-1 rounded-xl border border-line bg-surface/80 px-3 py-2 font-body text-sm text-text-hi placeholder:text-text-low focus-visible:border-copper focus-visible:outline-none"
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
              Their actual code
            </p>
            <div
              className="rounded-xl border border-line p-3"
              style={{
                background: 'linear-gradient(180deg, #131417, #0A0B0D)',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              <p className="mb-2.5 text-center font-body text-[12px] text-text-mid">
                Dial in the code once they reveal it
              </p>
              <div className="flex gap-2.5">
                {draft.actualCode.map((digit, i) => (
                  <CombinationDial
                    key={i}
                    value={digit}
                    label={`digit ${i + 1}`}
                    onChange={(value) => setDial(i, value)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onResolve('intercepted')}
              className="flex min-h-[50px] items-center justify-center rounded-xl border border-good bg-good/5 px-3 font-body text-sm font-bold text-good transition-colors hover:bg-good/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-good"
            >
              ✓ Intercepted
            </button>
            <button
              type="button"
              onClick={() => onResolve('missed')}
              className="flex min-h-[50px] items-center justify-center rounded-xl border border-bad bg-bad/5 px-3 font-body text-sm font-bold text-bad transition-colors hover:bg-bad/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bad"
            >
              ✕ Missed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InterceptScreen({
  round,
  interceptLog,
  draft,
  onDraftChange,
  onResolve,
}: InterceptScreenProps) {
  const [intelOpen, setIntelOpen] = useState(false);
  const intelCount = interceptLog.length;

  return (
    <InterceptRoomBackdrop>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start lg:gap-6">
        <InterceptMainPanel
          round={round}
          draft={draft}
          onDraftChange={onDraftChange}
          onResolve={onResolve}
        />

        <aside className="hidden lg:block">
          <div className="sticky top-4">
            <PriorIntel log={interceptLog} emptyMessage={INTEL_EMPTY} />
          </div>
        </aside>
      </div>

      <button
        type="button"
        onClick={() => setIntelOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full border border-copper/50 px-4 py-3 font-body text-sm font-bold text-text-hi shadow-[0_4px_20px_rgba(0,0,0,0.45)] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper lg:hidden"
        style={{
          background: 'linear-gradient(165deg, #2A2520, #1A1C20)',
        }}
        aria-label={`Open case notes${intelCount > 0 ? `, ${intelCount} rounds logged` : ''}`}
      >
        <MagnifierIcon />
        Case notes
        {intelCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-copper px-1.5 font-mono text-[10px] font-bold text-void">
            {intelCount}
          </span>
        )}
      </button>

      <SideDrawer
        open={intelOpen}
        onClose={() => setIntelOpen(false)}
        title="Prior intel"
      >
        <PriorIntel log={interceptLog} emptyMessage={INTEL_EMPTY} />
      </SideDrawer>
    </InterceptRoomBackdrop>
  );
}

export function buildInterceptPayload(draft: TheirDraft) {
  return {
    hintsHeard: draft.hints.map((h) => h.trim()) as HintTriple,
    actualCode: draft.actualCode,
  };
}
