import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrainrotBurst from './BrainrotBurst';

const ACCENT_A = '#FF6FB0';
const ACCENT_B = '#FF9142';
const SIZE = 68;
const DRAG_THRESHOLD = 6;

const CLIPS = [
  '/sounds/clip-2.mp3',
  '/sounds/clip-3.mp3',
  '/sounds/clip-4.mp3',
  '/sounds/clip-5.mp3',
  '/sounds/clip-6.mp3',
];

function pickRandomClip(excludeIndex: number | null): number {
  if (CLIPS.length <= 1) return 0;
  let next = Math.floor(Math.random() * CLIPS.length);
  while (next === excludeIndex) {
    next = Math.floor(Math.random() * CLIPS.length);
  }
  return next;
}

function EqualizerIcon({ active }: { active: boolean }) {
  const bars = [0, 1, 2, 3];
  return (
    <div className="flex h-5 items-end gap-[3px]" aria-hidden="true">
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-[3.5px] rounded-full bg-void"
          animate={
            active
              ? { height: ['30%', '100%', '45%', '85%', '30%'] }
              : { height: '35%' }
          }
          transition={
            active
              ? {
                  duration: 0.7 + i * 0.09,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : { duration: 0.25 }
          }
        />
      ))}
    </div>
  );
}

export default function FloatingSoundboard({ onClose }: { onClose: () => void }) {
  const [pos, setPos] = useState(() => ({
    x: Math.max(8, window.innerWidth - 96),
    y: Math.max(8, window.innerHeight - 200),
  }));
  const [playing, setPlaying] = useState(false);
  const [pulse, setPulse] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastIndexRef = useRef<number | null>(null);
  const dragState = useRef<{ startX: number; startY: number; moved: boolean } | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;
    const handleEnded = () => setPlaying(false);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  const playRandomClip = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const index = pickRandomClip(lastIndexRef.current);
    lastIndexRef.current = index;
    audio.src = CLIPS[index];
    audio.currentTime = 0;
    void audio.play();
    setPlaying(true);
    setPulse((p) => p + 1);
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    dragState.current = { startX: e.clientX, startY: e.clientY, moved: false };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    const d = dragState.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      d.moved = true;
    }
    if (d.moved) {
      const maxX = window.innerWidth - SIZE;
      const maxY = window.innerHeight - SIZE;
      setPos((prev) => ({
        x: Math.max(8, Math.min(maxX, prev.x + dx)),
        y: Math.max(8, Math.min(maxY, prev.y + dy)),
      }));
      dragState.current = { startX: e.clientX, startY: e.clientY, moved: true };
    }
  }

  function handlePointerUp() {
    const d = dragState.current;
    dragState.current = null;
    if (d && !d.moved) {
      playRandomClip();
    }
  }

  return (
    <div
      className="fixed z-[55] touch-none select-none"
      style={{ left: pos.x, top: pos.y, width: SIZE, height: SIZE }}
    >
      <BrainrotBurst triggerKey={pulse} />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Remove soundboard button"
        className="absolute -right-1.5 -top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-line-bright bg-surface text-[10px] text-text-low shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-colors hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        ✕
      </button>

      {/* Breathing / playing glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle, ${ACCENT_A}55, transparent 70%)` }}
        animate={
          playing
            ? { scale: [1, 1.55, 1], opacity: [0.7, 0.15, 0.7] }
            : { scale: [1, 1.18, 1], opacity: [0.45, 0.15, 0.45] }
        }
        transition={{ duration: playing ? 0.9 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Ping ring on each tap */}
      <AnimatePresence>
        <motion.span
          key={pulse}
          className="pointer-events-none absolute inset-0 rounded-full border-2"
          style={{ borderColor: ACCENT_B }}
          initial={{ scale: 0.85, opacity: 0.6 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </AnimatePresence>

      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Play a random sound clip"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragState.current = null;
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            playRandomClip();
          }
        }}
        animate={playing ? { rotate: [0, -4, 4, -3, 3, 0] } : { rotate: 0 }}
        transition={{ duration: 0.5 }}
        whileTap={{ scale: 0.92 }}
        className="relative flex h-full w-full cursor-pointer items-center justify-center rounded-full border shadow-[0_10px_26px_-6px_rgba(255,111,176,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        style={{
          background: `linear-gradient(155deg, ${ACCENT_A}, ${ACCENT_B} 70%)`,
          borderColor: 'rgba(255,255,255,0.35)',
        }}
      >
        {playing ? (
          <EqualizerIcon active={playing} />
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 9.5v5a1 1 0 0 0 1 1h2.6l4.1 3.28a.6.6 0 0 0 .97-.47V5.69a.6.6 0 0 0-.97-.47L7.6 8.5H5a1 1 0 0 0-1 1Z"
              fill="#131417"
            />
            <path
              d="M16.2 8.2a5 5 0 0 1 0 7.6M18.6 5.8a8.5 8.5 0 0 1 0 12.4"
              stroke="#131417"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        )}
      </motion.div>
    </div>
  );
}
