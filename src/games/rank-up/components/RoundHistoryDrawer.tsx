import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useSessionUI } from '../sessionUi';
import { labelForOption } from '../utils';
import RankUpPanel, { RankUpSecondaryButton } from './Layout';
import { CrownIcon } from './RankUpIcons';

export default function RoundHistoryDrawer() {
  const { roundHistory } = useSessionUI();
  const [open, setOpen] = useState(false);

  if (roundHistory.length === 0) return null;

  return (
    <div className="mb-6">
      <RankUpSecondaryButton
        onClick={() => setOpen((value) => !value)}
        className="w-full text-center font-mono text-[11px] uppercase tracking-wider"
      >
        History ({roundHistory.length})
      </RankUpSecondaryButton>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <RankUpPanel compact className="mt-3">
              <ul className="flex max-h-64 flex-col gap-3 overflow-y-auto">
                {[...roundHistory].reverse().map((entry, index) => (
                  <li
                    key={`${entry.prompt}-${index}`}
                    className="rounded-xl border border-line bg-deep/40 p-3"
                  >
                    <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-pewter">
                      <CrownIcon className="h-3 w-3" />
                      {entry.rankerName}
                    </p>
                    <p className="mt-1 font-body text-[13px] font-semibold leading-snug text-text-hi">
                      {entry.prompt}
                    </p>
                    <ol className="mt-2 flex flex-col gap-0.5">
                      {entry.rankerOrder.map((id, rankIndex) => (
                        <li
                          key={id}
                          className="font-body text-[11px] text-text-mid"
                        >
                          <span className="font-mono text-text-low">{rankIndex + 1}.</span>{' '}
                          {labelForOption(entry.options, id)}
                        </li>
                      ))}
                    </ol>
                  </li>
                ))}
              </ul>
            </RankUpPanel>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
