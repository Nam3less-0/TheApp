import { motion, useReducedMotion } from 'framer-motion';
import { games, getInProgressCount, getPlayableCount } from '../data/games';
import GamePlate from './GamePlate';

export default function GameGrid() {
  const reducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.05,
      },
    },
  };

  const playable = getPlayableCount();
  const inProgress = getInProgressCount();

  return (
    <section id="shelf" className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-20">
      <div className="mb-6 flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-2xl font-bold text-text-hi md:text-3xl">
          The shelf
        </h2>
        <p className="font-mono text-xs text-text-low">
          {String(playable).padStart(2, '0')} playable
          {inProgress > 0
            ? ` · ${String(inProgress).padStart(2, '0')} in development`
            : ''}
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-5 min-[561px]:grid-cols-2 min-[981px]:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {games.map((game) => (
          <GamePlate key={game.id} game={game} />
        ))}
      </motion.div>
    </section>
  );
}
