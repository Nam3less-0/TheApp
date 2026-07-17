import { useEffect, useMemo, useRef, useState } from 'react';

const ITEM_H = 56;
const VISIBLE = 5;
const CENTER = Math.floor(VISIBLE / 2);
const STRIP_LEN = 40;
const TARGET_INDEX = 34;
const OVERSHOOT = 18;

const SPIN_MS = 2000;
const SETTLE_MS = 280;

export interface ReelPromptItem {
  id: string;
  text: string;
  tag: string;
}

function computeOffset(idx: number) {
  return (idx - CENTER) * ITEM_H;
}

function buildStrip(target: ReelPromptItem, pool: ReelPromptItem[]): ReelPromptItem[] {
  const others = pool.filter((item) => item.id !== target.id);
  const strip: ReelPromptItem[] = [];
  for (let i = 0; i < STRIP_LEN; i++) {
    if (i === TARGET_INDEX) {
      strip.push(target);
    } else {
      strip.push(others[Math.floor(Math.random() * others.length)]!);
    }
  }
  return strip;
}

interface PromptReelTrackProps {
  item: ReelPromptItem;
  pool: ReelPromptItem[];
  spinKey: number;
  onSettled?: (settled: boolean) => void;
}

export default function PromptReelTrack({ item, pool, spinKey, onSettled }: PromptReelTrackProps) {
  const strip = useMemo(() => buildStrip(item, pool), [item.id, spinKey, pool]);
  const onSettledRef = useRef(onSettled);
  onSettledRef.current = onSettled;

  const start = computeOffset(CENTER);
  const end = computeOffset(TARGET_INDEX);

  const [reel, setReel] = useState({ offset: start, transition: 'none' });
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    onSettledRef.current?.(false);

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setSpinning(false);
      setReel({ offset: end, transition: 'none' });
      onSettledRef.current?.(true);
      return;
    }

    let raf1 = 0;
    let raf2 = 0;

    setSpinning(true);
    setReel({ offset: start, transition: 'none' });

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setReel({
          offset: end + OVERSHOOT,
          transition: `transform ${SPIN_MS}ms cubic-bezier(0.16, 0.62, 0.12, 1)`,
        });
      });
    });

    const settle = setTimeout(() => {
      setSpinning(false);
      setReel({
        offset: end,
        transition: `transform ${SETTLE_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
      });
      onSettledRef.current?.(true);
    }, SPIN_MS);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(settle);
    };
  }, [item.id, spinKey, end, start]);

  return (
    <div className="relative w-full">
      <div
        className="relative overflow-hidden rounded-[18px] border border-pewter/40 shadow-[0_0_32px_rgba(155,147,168,0.1)]"
        style={{
          height: ITEM_H * VISIBLE,
          background: 'linear-gradient(165deg, #242228, #1C1A20 75%)',
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
          {strip.map((entry, i) => {
            const isCenter = i === TARGET_INDEX;
            return (
              <div
                key={`${entry.id}-${i}-${spinKey}`}
                className={`flex h-[56px] flex-col justify-center px-4 sm:px-5 ${
                  isCenter ? 'text-text-hi' : 'text-text-mid'
                }`}
              >
                <span
                  className={`line-clamp-2 font-body leading-snug ${
                    isCenter ? 'text-sm font-semibold sm:text-[15px]' : 'text-xs sm:text-[13px]'
                  }`}
                >
                  {entry.text}
                </span>
              </div>
            );
          })}
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#242228] to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1C1A20] to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 border-y border-pewter/50"
          style={{ top: ITEM_H * CENTER, height: ITEM_H }}
          aria-hidden="true"
        />
      </div>

      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-pewter">
        {item.tag}
      </p>
    </div>
  );
}
