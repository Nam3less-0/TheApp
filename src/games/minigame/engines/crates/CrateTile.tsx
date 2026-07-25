import { motion } from 'framer-motion';

interface CrateTileProps {
  label: string;
  opened?: boolean;
  rigged?: boolean;
  revealAll?: boolean;
}

export default function CrateTile({ label, opened, rigged, revealAll }: CrateTileProps) {
  const showRigged = revealAll && rigged;
  const accent = showRigged ? '#E8A33D' : '#7ED9A4';

  return (
    <motion.div
      initial={opened ? { rotateY: 0, scale: 1 } : false}
      animate={opened ? { rotateY: [0, 180, 360], scale: [1, 1.12, 1] } : {}}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl border-2"
      style={{
        borderColor: opened ? accent : revealAll && rigged ? `${accent}66` : 'rgba(220,224,232,0.16)',
        background: opened
          ? `radial-gradient(circle at 50% 35%, ${accent}2E, #131417 75%)`
          : 'rgba(26,28,32,0.6)',
        boxShadow: opened ? `0 0 20px -4px ${accent}` : undefined,
      }}
    >
      <span className="text-lg leading-none" aria-hidden="true">
        {opened ? (rigged ? '💥' : '✅') : revealAll && rigged ? '⚠️' : '📦'}
      </span>
      <span
        className="font-display text-[13px] font-extrabold"
        style={{ color: opened || (revealAll && rigged) ? accent : '#8B8F99' }}
      >
        {label}
      </span>
    </motion.div>
  );
}
