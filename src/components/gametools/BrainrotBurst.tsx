import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJI_POOL = ['💀', '🔥', '😭', '📈', '🗿', '🧢', '💯', '🚨', '😈', '🎉', '⚡', '👹', '🤯', '💥', '🐐', '😵‍💫'];

const IMPACT_PHRASES = [
  'BRAINROT ACTIVATED',
  'LOCKED IN 🔒',
  'SIGMA 🗿',
  'NO CAP 🧢',
  'GYATT 💀',
  'AURA +9000',
  'MOGGED 🔥',
  'OHIO FR FR',
  'FANUM TAX 💸',
  'SKIBIDI RIZZ',
  'W TAKEN 🐐',
  'TUNG TUNG TUNG',
];

interface Particle {
  id: number;
  emoji: string;
  angle: number;
  distance: number;
  size: number;
  delay: number;
  spin: number;
}

function makeParticles(seed: number): Particle[] {
  const count = 22;
  return Array.from({ length: count }, (_, i) => {
    // deterministic-ish pseudo-random per burst using seed + index
    const r = (n: number) => {
      const x = Math.sin(seed * 999 + i * 57 + n * 13.7) * 10000;
      return x - Math.floor(x);
    };
    return {
      id: i,
      emoji: EMOJI_POOL[Math.floor(r(1) * EMOJI_POOL.length)],
      angle: r(2) * 360,
      distance: 90 + r(3) * 190,
      size: 18 + r(4) * 20,
      delay: r(5) * 0.12,
      spin: (r(6) - 0.5) * 720,
    };
  });
}

export default function BrainrotBurst({ triggerKey }: { triggerKey: number }) {
  const particles = useMemo(() => makeParticles(triggerKey), [triggerKey]);
  const phrase = useMemo(
    () => IMPACT_PHRASES[Math.floor(Math.random() * IMPACT_PHRASES.length)],
    [triggerKey],
  );

  if (triggerKey === 0) return null;

  return (
    <AnimatePresence>
      <div key={triggerKey} className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
        {/* Strobe flash */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle, #FFFFFF, #FF6FB0 55%, transparent 75%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.55, 0, 0.3, 0] }}
          transition={{ duration: 0.45, times: [0, 0.1, 0.25, 0.35, 1] }}
        />

        {/* Siren red vignette pulse around edges */}
        <motion.div
          className="absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 0 0px #FF2D55',
          }}
          initial={{ boxShadow: 'inset 0 0 0px 0px rgba(255,45,85,0)' }}
          animate={{
            boxShadow: [
              'inset 0 0 0px 0px rgba(255,45,85,0)',
              'inset 0 0 90px 30px rgba(255,45,85,0.85)',
              'inset 0 0 0px 0px rgba(255,45,85,0)',
              'inset 0 0 70px 24px rgba(255,45,85,0.6)',
              'inset 0 0 0px 0px rgba(255,45,85,0)',
            ],
          }}
          transition={{ duration: 0.8, times: [0, 0.15, 0.4, 0.55, 1] }}
        />

        {/* Emoji particle explosion, centered on screen */}
        <div className="absolute left-1/2 top-1/2 h-0 w-0">
          {particles.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const dx = Math.cos(rad) * p.distance;
            const dy = Math.sin(rad) * p.distance;
            return (
              <motion.span
                key={p.id}
                className="absolute select-none"
                style={{ fontSize: p.size, left: 0, top: 0 }}
                initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
                animate={{
                  x: dx,
                  y: dy + 40,
                  scale: [0, 1.3, 1],
                  rotate: p.spin,
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 1.1, delay: p.delay, ease: 'easeOut' }}
              >
                {p.emoji}
              </motion.span>
            );
          })}
        </div>

        {/* Impact text */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
          initial={{ scale: 0.3, opacity: 0, rotate: -6 }}
          animate={{
            scale: [0.3, 1.35, 1, 1.08, 1],
            opacity: [0, 1, 1, 1, 0],
            rotate: [-6, 3, -2, 1, 0],
            x: [0, -6, 5, -3, 0],
          }}
          transition={{ duration: 1.0, times: [0, 0.18, 0.3, 0.5, 1], ease: 'easeOut' }}
        >
          <span
            className="whitespace-nowrap font-display text-[clamp(28px,8vw,56px)] font-black uppercase tracking-tight text-white"
            style={{
              WebkitTextStroke: '2.5px #131417',
              textShadow: '0 0 18px rgba(255,111,176,0.9), 3px 4px 0 #131417',
            }}
          >
            {phrase}
          </span>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
