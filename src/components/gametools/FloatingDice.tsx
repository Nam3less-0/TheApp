import { useEffect, useMemo, useRef, useState } from 'react';
import FloatingCard from './FloatingCard';
import { useDraggable } from './useDraggable';

const ACCENT = '#C9A44A';
const SIDES = [4, 6, 8, 10, 12, 20];
const MAX_DICE = 6;
const ROLL_MS = 950;

// Cube faces in order: front, back, right, left, top, bottom.
// Placement transform (relative to half the die size) + the cube rotation that
// brings that face to the front when the die settles.
const FACE_PLACEMENT = [
  (h: number) => `translateZ(${h}px)`,
  (h: number) => `rotateY(180deg) translateZ(${h}px)`,
  (h: number) => `rotateY(90deg) translateZ(${h}px)`,
  (h: number) => `rotateY(-90deg) translateZ(${h}px)`,
  (h: number) => `rotateX(90deg) translateZ(${h}px)`,
  (h: number) => `rotateX(-90deg) translateZ(${h}px)`,
];
const FACE_LANDING = [
  { x: 0, y: 0 },
  { x: 0, y: 180 },
  { x: 0, y: -90 },
  { x: 0, y: 90 },
  { x: -90, y: 0 },
  { x: 90, y: 0 },
];
// Real d6: opposite faces sum to 7 → front1/back6, right3/left4, top2/bottom5.
const D6_FACE_NUMBERS = [1, 6, 3, 4, 2, 5];

// 3×3 pip cell layout per face value.
const PIP_CELLS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function randInt(max: number): number {
  return 1 + Math.floor(Math.random() * max);
}

function rollValues(count: number, sides: number): number[] {
  return Array.from({ length: count }, () => randInt(sides));
}

function Pips({ value, size }: { value: number; size: number }) {
  const filled = new Set(PIP_CELLS[value] ?? []);
  const dot = Math.max(4, Math.round(size * 0.15));
  return (
    <div
      className="grid h-full w-full"
      style={{
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        padding: size * 0.13,
        gap: size * 0.04,
      }}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className="flex items-center justify-center">
          {filled.has(i) && (
            <span
              className="rounded-full"
              style={{
                width: dot,
                height: dot,
                background: 'radial-gradient(circle at 35% 30%, #3a3d44, #121317)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.25)',
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
}

function Die3D({
  value,
  sides,
  size,
  nonce,
}: {
  value: number;
  sides: number;
  size: number;
  nonce: number;
}) {
  // Pick which face shows the rolled value (fixed mapping for d6, random
  // otherwise) plus the numbers shown on the other faces, stable per roll.
  const { faceNumbers, landing } = useMemo(() => {
    if (sides === 6) {
      const target = D6_FACE_NUMBERS.indexOf(value);
      return { faceNumbers: D6_FACE_NUMBERS, landing: FACE_LANDING[target] };
    }
    const target = Math.floor(Math.random() * 6);
    const numbers = Array.from({ length: 6 }, () => randInt(sides));
    numbers[target] = value;
    return { faceNumbers: numbers, landing: FACE_LANDING[target] };
  }, [value, sides, nonce]);

  const half = size / 2;
  const isPips = sides === 6;

  return (
    <div className="dice-scene" style={{ width: size, height: size }}>
      <div
        key={nonce}
        className={`dice-cube ${nonce > 0 ? 'is-rolling' : ''}`}
        style={
          {
            width: size,
            height: size,
            '--fx': `${landing.x}deg`,
            '--fy': `${landing.y}deg`,
          } as React.CSSProperties
        }
      >
        {faceNumbers.map((num, i) => (
          <div
            key={i}
            className="dice-face"
            style={{ transform: FACE_PLACEMENT[i](half) }}
          >
            {isPips ? (
              <Pips value={num} size={size} />
            ) : (
              <span
                className="font-display font-extrabold text-void"
                style={{ fontSize: size * (num > 9 ? 0.34 : 0.42) }}
              >
                {num}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FloatingDice({ onClose }: { onClose: () => void }) {
  const { pos, onDragPointerDown } = useDraggable(() => ({
    x: Math.max(8, window.innerWidth - 240),
    y: 320,
  }));

  const [sides, setSides] = useState(6);
  const [count, setCount] = useState(1);
  const [values, setValues] = useState<number[]>(() => rollValues(1, 6));
  const [rolling, setRolling] = useState(false);
  const [nonce, setNonce] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function roll(nextCount = count, nextSides = sides) {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    setValues(rollValues(nextCount, nextSides));
    setNonce((n) => n + 1);
    setRolling(true);
    timeoutRef.current = window.setTimeout(() => {
      setRolling(false);
      timeoutRef.current = null;
    }, ROLL_MS);
  }

  function changeSides(next: number) {
    setSides(next);
    setValues(rollValues(count, next));
  }

  function changeCount(next: number) {
    const clamped = Math.max(1, Math.min(MAX_DICE, next));
    setCount(clamped);
    setValues(rollValues(clamped, sides));
  }

  const total = values.reduce((sum, v) => sum + v, 0);
  const dieSize = count <= 2 ? 52 : count <= 4 ? 42 : 34;

  return (
    <FloatingCard
      title="Dice"
      accent={ACCENT}
      pos={pos}
      width={216}
      onDragPointerDown={onDragPointerDown}
      onClose={onClose}
    >
      <div className="flex flex-col">
        <div className="flex min-h-[92px] flex-wrap items-end justify-center gap-3 pb-1">
          {values.map((v, i) => (
            <Die3D key={i} value={v} sides={sides} size={dieSize} nonce={nonce} />
          ))}
        </div>

        {count > 1 && (
          <p className="mb-1 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-text-low">
            Total <span className="text-gold-bright">{total}</span>
          </p>
        )}

        <div className="mb-1.5 grid grid-cols-6 gap-1">
          {SIDES.map((s) => {
            const active = sides === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => changeSides(s)}
                className={`rounded-md border py-1 font-mono text-[10px] tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  active
                    ? 'border-gold text-gold-bright'
                    : 'border-line bg-deep text-text-mid hover:border-line-bright hover:text-text-hi'
                }`}
              >
                d{s}
              </button>
            );
          })}
        </div>

        <div className="mb-1.5 flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={() => changeCount(count - 1)}
            disabled={count <= 1}
            className="flex h-7 w-9 items-center justify-center rounded-lg border border-line bg-deep font-mono text-sm text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-30"
          >
            −
          </button>
          <span className="font-mono text-[11px] text-text-mid">
            {count} {count === 1 ? 'die' : 'dice'}
          </span>
          <button
            type="button"
            onClick={() => changeCount(count + 1)}
            disabled={count >= MAX_DICE}
            className="flex h-7 w-9 items-center justify-center rounded-lg border border-line bg-deep font-mono text-sm text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-30"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => roll()}
          disabled={rolling}
          className="rounded-lg border-none py-2 font-body text-[13px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-70"
          style={{ background: 'linear-gradient(180deg, #EAC870, #C9A44A 55%, #7A6228)' }}
        >
          {rolling ? 'Rolling…' : 'Roll'}
        </button>
      </div>
    </FloatingCard>
  );
}
