import { useEffect, useMemo, useState } from 'react';
import { BET_CATEGORIES } from '../data';
import type { BetCategory } from '../data';

const ITEM_H = 52;
const VISIBLE = 5;
const CENTER = Math.floor(VISIBLE / 2);
const STRIP_LEN = 40;
const TARGET_INDEX = 34;
const OVERSHOOT = 18;

// Base spin time; each reel stops a beat after the previous for a cascade.
const SPIN_MS = 2000;
const STAGGER_MS = 260;
const SETTLE_MS = 280;

function computeOffset(idx: number) {
  return (idx - CENTER) * ITEM_H;
}

function buildStrip(target: BetCategory): BetCategory[] {
  const others = BET_CATEGORIES.filter((c) => c.id !== target.id);
  const strip: BetCategory[] = [];
  for (let i = 0; i < STRIP_LEN; i++) {
    if (i === TARGET_INDEX) {
      strip.push(target);
    } else {
      strip.push(others[Math.floor(Math.random() * others.length)]);
    }
  }
  return strip;
}

interface ReelTrackProps {
  index: 0 | 1 | 2;
  category: BetCategory;
  spinKey: number;
  selected: boolean;
  onSelect: () => void;
}

export default function ReelTrack({
  index,
  category,
  spinKey,
  selected,
  onSelect,
}: ReelTrackProps) {
  const strip = useMemo(() => buildStrip(category), [category.id, spinKey]);

  const start = computeOffset(CENTER);
  const end = computeOffset(TARGET_INDEX);

  const [reel, setReel] = useState({ offset: start, transition: 'none' });
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setSpinning(false);
      setReel({ offset: end, transition: 'none' });
      return;
    }

    const spinMs = SPIN_MS + index * STAGGER_MS;
    let raf1 = 0;
    let raf2 = 0;

    // 1. Snap to the top of the strip with no transition.
    setSpinning(true);
    setReel({ offset: start, transition: 'none' });

    // 2. After the snap commits, kick off the long decelerating scroll. It
    //    lands slightly past the target (the overshoot) to settle back from.
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setReel({
          offset: end + OVERSHOOT,
          transition: `transform ${spinMs}ms cubic-bezier(0.16, 0.62, 0.12, 1)`,
        });
      });
    });

    // 3. When the spin finishes, settle back into the detent with a tiny
    //    spring — the mechanical "clunk". The motion blur clears here too.
    const settle = setTimeout(() => {
      setSpinning(false);
      setReel({
        offset: end,
        transition: `transform ${SETTLE_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
      });
    }, spinMs);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(settle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category.id, spinKey]);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Select category ${index + 1}: ${category.text}`}
      className={`group relative w-full text-left transition-transform motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
        selected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
      }`}
    >
      <span className="mb-2 block text-center font-mono text-[10px] text-gold-dim">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div
        className={`relative overflow-hidden rounded-xl border transition-colors motion-safe:duration-200 ${
          selected
            ? 'border-gold shadow-[0_0_24px_rgba(201,164,74,0.15)]'
            : 'border-line group-hover:border-line-bright'
        }`}
        style={{
          height: ITEM_H * VISIBLE,
          background: 'linear-gradient(165deg, #222428, #1A1C20 75%)',
        }}
      >
        <div
          className="bet-reel-track will-change-transform"
          style={{
            transform: `translateY(-${reel.offset}px)`,
            transition: reel.transition,
            filter: spinning ? 'blur(1.4px)' : 'blur(0px)',
            transitionProperty: spinning ? 'transform' : 'transform, filter',
          }}
        >
          {strip.map((item, i) => {
            const isCenter = i === TARGET_INDEX;
            return (
              <div
                key={`${item.id}-${i}-${spinKey}`}
                className={`flex h-[52px] flex-col justify-center px-2 sm:px-3 ${
                  isCenter ? 'text-text-hi' : 'text-text-mid'
                }`}
              >
                <span
                  className={`line-clamp-2 font-body leading-tight ${
                    isCenter
                      ? 'text-xs font-semibold sm:text-sm'
                      : 'text-[11px] sm:text-xs'
                  }`}
                >
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-surface-raised to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-surface-raised to-transparent"
          aria-hidden="true"
        />
        <div
          className={`pointer-events-none absolute inset-x-0 border-y motion-safe:transition-colors ${
            selected ? 'border-gold' : 'border-gold/50'
          }`}
          style={{ top: ITEM_H * CENTER, height: ITEM_H }}
          aria-hidden="true"
        />

        {selected ? (
          <span
            className="pointer-events-none absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-void"
            aria-hidden="true"
          >
            ✓
          </span>
        ) : null}
      </div>

      <span className="mt-2 block text-center font-mono text-[9px] uppercase tracking-wide text-text-low">
        {category.tag}
      </span>
    </button>
  );
}
