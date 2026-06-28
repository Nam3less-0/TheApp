import { useEffect, useRef, useState } from 'react';
import { playTimerAlarm } from '../../games/the-bet/playTimerAlarm';
import FloatingCard from './FloatingCard';
import { useDraggable } from './useDraggable';

const ACCENT = '#6FA8DC';
const PRESETS = [30, 60, 180, 300];
const RING = 116;
const STROKE = 9;

function format(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function FloatingTimer({ onClose }: { onClose: () => void }) {
  const { pos, onDragPointerDown } = useDraggable(() => ({
    x: Math.max(8, window.innerWidth - 240),
    y: 64,
  }));

  const [duration, setDuration] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const stopAlarmRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          setDone(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!done) return;
    stopAlarmRef.current = playTimerAlarm();
    return () => {
      stopAlarmRef.current?.();
      stopAlarmRef.current = null;
    };
  }, [done]);

  function silenceAlarm() {
    stopAlarmRef.current?.();
    stopAlarmRef.current = null;
  }

  function setTime(sec: number) {
    silenceAlarm();
    const clamped = Math.max(5, Math.min(5999, sec));
    setRunning(false);
    setDone(false);
    setDuration(clamped);
    setRemaining(clamped);
  }

  function adjust(delta: number) {
    if (running) return;
    setTime((done ? duration : remaining) + delta);
  }

  function toggle() {
    if (done) {
      silenceAlarm();
      setDone(false);
      setRemaining(duration);
      setRunning(true);
      return;
    }
    if (remaining <= 0) return;
    setRunning((r) => !r);
  }

  function reset() {
    silenceAlarm();
    setRunning(false);
    setDone(false);
    setRemaining(duration);
  }

  const progress = duration > 0 ? remaining / duration : 0;
  const radius = (RING - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const danger = done || remaining <= 5;
  const ringColor = done ? '#E08B7A' : danger ? '#E07A5F' : ACCENT;

  return (
    <FloatingCard
      title="Timer"
      accent={ACCENT}
      pos={pos}
      width={216}
      onDragPointerDown={onDragPointerDown}
      onClose={onClose}
    >
      <div className="flex flex-col items-center">
        <div className="relative my-1 inline-flex items-center justify-center" style={{ width: RING, height: RING }}>
          <svg width={RING} height={RING} className="-rotate-90" aria-hidden="true">
            <circle cx={RING / 2} cy={RING / 2} r={radius} fill="none" stroke="rgba(220,224,232,0.10)" strokeWidth={STROKE} />
            <circle
              cx={RING / 2}
              cy={RING / 2}
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - Math.max(0, Math.min(1, progress)))}
              className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-1000 motion-safe:ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`font-display text-2xl font-extrabold tabular-nums ${done ? 'animate-pulse' : ''}`}
              style={{ color: done ? '#E08B7A' : '#ECEEF2' }}
            >
              {format(remaining)}
            </span>
            {done && (
              <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-bad">
                Time
              </span>
            )}
          </div>
        </div>

        <div className="mt-1 grid w-full grid-cols-4 gap-1">
          {PRESETS.map((sec) => {
            const active = duration === sec;
            return (
              <button
                key={sec}
                type="button"
                onClick={() => setTime(sec)}
                className={`rounded-lg border py-1 font-mono text-[10px] tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue ${
                  active
                    ? 'border-steel-blue text-steel-blue'
                    : 'border-line bg-deep text-text-mid hover:border-line-bright hover:text-text-hi'
                }`}
              >
                {format(sec)}
              </button>
            );
          })}
        </div>

        <div className="mt-1.5 flex w-full items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={() => adjust(-15)}
            disabled={running}
            className="flex-1 rounded-lg border border-line bg-deep py-1.5 font-mono text-[11px] text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-30"
          >
            −15s
          </button>
          <button
            type="button"
            onClick={() => adjust(15)}
            disabled={running}
            className="flex-1 rounded-lg border border-line bg-deep py-1.5 font-mono text-[11px] text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue disabled:cursor-not-allowed disabled:opacity-30"
          >
            +15s
          </button>
        </div>

        <div className="mt-1.5 flex w-full items-center gap-1.5">
          <button
            type="button"
            onClick={toggle}
            className="flex-[2] rounded-lg border-none py-2 font-body text-[13px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
            style={{ background: 'linear-gradient(180deg, #8FC0EC, #6FA8DC 55%, #3D6FA0)' }}
          >
            {done ? 'Restart' : running ? 'Pause' : 'Start'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex-1 rounded-lg border border-line bg-deep py-2 font-body text-[13px] font-semibold text-text-mid transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
          >
            Reset
          </button>
        </div>
      </div>
    </FloatingCard>
  );
}
