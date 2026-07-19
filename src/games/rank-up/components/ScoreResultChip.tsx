import { motion } from 'framer-motion';
import { perfectPoints, revealScoreCaption, type RoundPoints } from '../utils';

interface ScoreResultChipProps {
  points: RoundPoints;
  guessOrder: string[];
  rankerOrder: string[];
  className?: string;
}

export default function ScoreResultChip({
  points,
  guessOrder,
  rankerOrder,
  className = '',
}: ScoreResultChipProps) {
  const perfect = perfectPoints(rankerOrder.length);
  const caption = revealScoreCaption(points, guessOrder, rankerOrder);

  let label = 'MISS';
  let value = '+0';
  let toneClass = 'border-line bg-deep/40 text-text-low';
  let valueClass = 'text-text-mid';

  if (points === perfect) {
    label = 'PERFECT';
    value = `+${points}`;
    toneClass = 'border-[#D8B36A]/40 bg-[#D8B36A]/10 text-[#D8B36A]';
    valueClass = 'text-[#D8B36A]';
  } else if (points === 1) {
    label = 'CLOSEST';
    value = '+1';
    toneClass = 'border-[#6FA3C4]/40 bg-[#6FA3C4]/10 text-[#6FA3C4]';
    valueClass = 'text-[#6FA3C4]';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`inline-flex flex-col items-center rounded-2xl border px-5 py-4 text-center ${toneClass} ${className}`}
    >
      <span className="font-mono text-[10px] font-bold tracking-[0.16em]">{label}</span>
      <span className={`mt-1 font-display text-3xl font-extrabold ${valueClass}`}>{value}</span>
      <span className="mt-1 font-body text-[12px] text-text-mid">{caption}</span>
    </motion.div>
  );
}
