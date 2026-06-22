import { useState } from 'react';
import type { InterceptLogEntry } from '../types';
import {
  aggregateIntelByDigit,
  formatCode,
  normalizeHintsHeard,
} from '../intel-utils';

type IntelView = 'round' | 'digit';

const BRASS = '#C99A7A';
const INK = '#2A2520';
const INK_MID = '#5C5348';
const INK_FAINT = '#8A8074';
const PAPER = '#E8E3D8';
const PAPER_SHADOW = '#D5CFC2';

function NotebookPage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-[3px_5px_16px_rgba(0,0,0,0.4)]"
      style={{
        background: `linear-gradient(180deg, ${PAPER} 0%, ${PAPER_SHADOW} 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `repeating-linear-gradient(
            transparent,
            transparent 25px,
            rgba(100, 120, 150, 0.15) 25px,
            rgba(100, 120, 150, 0.15) 26px
          )`,
          backgroundPosition: '0 10px',
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-[26px] top-0 w-[2px]"
        style={{ background: 'rgba(180, 72, 62, 0.45)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-3 left-2 top-3 flex w-3 flex-col justify-between"
        aria-hidden="true"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-full border"
            style={{
              borderColor: 'rgba(60,55,48,0.25)',
              background: 'radial-gradient(circle at 40% 35%, #F5F2EC, #C8C2B6)',
            }}
          />
        ))}
      </div>
      <div className="relative z-[1] py-4 pl-10 pr-4">{children}</div>
    </div>
  );
}

function RoundIntelCard({ entry }: { entry: InterceptLogEntry }) {
  const hints = normalizeHintsHeard(entry.hintsHeard);
  const pairs = hints
    .map((hint, i) => {
      const trimmed = hint.trim();
      if (!trimmed) return null;
      return { hint: trimmed, digit: entry.actualCode[i] };
    })
    .filter(Boolean) as { hint: string; digit: number }[];

  const hit = entry.outcome === 'intercepted';

  return (
    <li
      className="border-b py-3.5 last:border-b-0 last:pb-0"
      style={{ borderColor: 'rgba(100,120,150,0.2)' }}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span
          className="font-mono text-[10px] font-bold uppercase tracking-wider"
          style={{ color: INK_MID }}
        >
          R{entry.round}
        </span>
        <span
          className="rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase"
          style={{
            color: hit ? '#3D7A52' : INK_FAINT,
            borderColor: hit ? 'rgba(61,122,82,0.35)' : 'rgba(100,95,88,0.3)',
          }}
        >
          {hit ? 'Got it' : 'Missed'}
        </span>
      </div>
      <p className="mb-1.5 font-mono text-base font-bold tabular-nums" style={{ color: INK }}>
        {formatCode(entry.actualCode)}
      </p>
      {pairs.length > 0 && (
        <p className="font-body text-[13px] leading-relaxed" style={{ color: INK_MID }}>
          {pairs.map(({ hint, digit }, i) => (
            <span key={i}>
              {i > 0 && ' · '}
              <span className="font-mono text-[11px]" style={{ color: BRASS }}>
                {digit}
              </span>{' '}
              {hint}
            </span>
          ))}
        </p>
      )}
    </li>
  );
}

function DigitIntelSection({
  digit,
  entries,
}: {
  digit: number;
  entries: { hint: string; round: number }[];
}) {
  if (entries.length === 0) return null;

  return (
    <section
      className="rounded-lg border px-3.5 py-3.5"
      style={{
        borderColor: 'rgba(201,154,122,0.35)',
        background: 'rgba(255,255,255,0.4)',
      }}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold text-void"
          style={{ background: BRASS }}
        >
          {digit}
        </span>
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: INK_MID }}>
          Code {digit}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {entries.map(({ hint, round }, i) => (
          <li
            key={`${hint}-${round}-${i}`}
            className="flex items-center justify-between gap-3 rounded-md px-2.5 py-2"
            style={{ background: 'rgba(255,255,255,0.55)' }}
          >
            <span className="min-w-0 font-body text-sm font-semibold leading-snug" style={{ color: INK }}>
              {hint}
            </span>
            <span
              className="shrink-0 rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide"
              style={{
                color: INK_MID,
                borderColor: 'rgba(100,95,88,0.25)',
                background: 'rgba(255,255,255,0.7)',
              }}
            >
              R{round}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PriorIntel({
  log,
  emptyMessage,
}: {
  log: InterceptLogEntry[];
  emptyMessage?: string;
}) {
  const [view, setView] = useState<IntelView>('round');

  if (log.length === 0) {
    if (!emptyMessage) return null;
    return (
      <div
        className="rounded-xl p-2.5"
        style={{
          background: 'linear-gradient(165deg, rgba(26,28,32,0.6), rgba(10,11,13,0.8))',
        }}
      >
        <NotebookPage>
          <div
            className="mb-1.5 inline-block rounded border-2 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{
              color: '#B84A3A',
              borderColor: 'rgba(184,74,58,0.45)',
              transform: 'rotate(-1.5deg)',
            }}
          >
            Prior intel
          </div>
          <p className="mt-2 font-body text-[12px] italic" style={{ color: INK_FAINT }}>
            {emptyMessage}
          </p>
        </NotebookPage>
      </div>
    );
  }

  const byDigit = aggregateIntelByDigit(log);

  return (
    <div
      className="rounded-xl p-2.5"
      style={{
        background: 'linear-gradient(165deg, rgba(26,28,32,0.6), rgba(10,11,13,0.8))',
      }}
    >
      <NotebookPage>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div
              className="mb-1 inline-block rounded border-2 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{
                color: '#B84A3A',
                borderColor: 'rgba(184,74,58,0.45)',
                transform: 'rotate(-1.5deg)',
              }}
            >
              Prior intel
            </div>
            <p className="font-body text-[12px]" style={{ color: INK_MID }}>
              Decode their card from clues gathered
            </p>
          </div>
          <div
            className="flex shrink-0 gap-0.5 rounded-md border p-0.5"
            role="tablist"
            aria-label="Organise prior intel"
            style={{ borderColor: 'rgba(100,95,88,0.25)' }}
          >
            {(
              [
                { id: 'round' as const, label: 'By round' },
                { id: 'digit' as const, label: 'By digit' },
              ] as const
            ).map((tab) => {
              const active = view === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setView(tab.id)}
                  className="rounded px-2.5 py-1 font-body text-[12px] font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-copper"
                  style={{
                    color: active ? INK : INK_FAINT,
                    background: active ? 'rgba(255,255,255,0.55)' : 'transparent',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {view === 'round' ? (
          <ul className="flex flex-col">
            {[...log].reverse().map((entry) => (
              <RoundIntelCard key={entry.round} entry={entry} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col gap-3">
            {byDigit.map(({ digit, entries }) => (
              <DigitIntelSection key={digit} digit={digit} entries={entries} />
            ))}
            {byDigit.every((d) => d.entries.length === 0) && (
              <p className="font-body text-[11px] italic" style={{ color: INK_FAINT }}>
                No clues yet
              </p>
            )}
          </div>
        )}
      </NotebookPage>
    </div>
  );
}
