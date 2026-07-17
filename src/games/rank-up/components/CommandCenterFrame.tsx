import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { CrownIcon } from './RankUpIcons';
import RankUpPanel from './Layout';

interface CommandCenterFrameProps {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export default function CommandCenterFrame({
  children,
  eyebrow,
  title,
  subtitle,
}: CommandCenterFrameProps) {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-3 rounded-[22px] opacity-60 sm:-inset-4"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(155,147,168,0.18) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <RankUpPanel
        compact
        className="relative border-pewter/45 shadow-[0_0_32px_rgba(155,147,168,0.12)]"
      >
        {(eyebrow || title) && (
          <header className="mb-6 text-center">
            {eyebrow ? (
              <p className="mb-2 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-pewter">
                <motion.span
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-pewter/15 text-pewter"
                >
                  <CrownIcon className="h-3.5 w-3.5" />
                </motion.span>
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h1 className="font-display text-2xl font-extrabold leading-tight text-text-hi sm:text-3xl">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="mt-2 font-body text-sm text-text-mid">{subtitle}</p>
            ) : null}
          </header>
        )}
        {children}
      </RankUpPanel>
    </div>
  );
}
