import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { CopyIcon, ShareIcon } from './RankUpIcons';
import { RankUpSecondaryButton } from './Layout';

interface RoomCodeDisplayProps {
  code: string;
}

export default function RoomCodeDisplay({ code }: RoomCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const letters = code.split('');

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = code;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  async function shareCode() {
    const shareData = {
      title: 'Join my Rank Up game',
      text: `Join my Rank Up room with code: ${code}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share failed — fall through to copy
      }
    }

    await copyCode();
  }

  return (
    <div className="text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-pewter">Room code</p>
      <div className="mt-3 flex justify-center gap-2 sm:gap-2.5">
        {letters.map((letter, index) => (
          <motion.div
            key={`${letter}-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex h-14 w-11 items-center justify-center rounded-xl border border-pewter/40 bg-surface font-mono text-2xl font-bold text-text-hi shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.06)] sm:h-16 sm:w-12 sm:text-[28px]"
          >
            {letter}
          </motion.div>
        ))}
      </div>
      <p className="mt-3 font-body text-sm text-text-mid">
        Share this code so friends can join on their phones.
      </p>
      <div className="mt-4 flex justify-center gap-2">
        <RankUpSecondaryButton
          onClick={copyCode}
          className="inline-flex items-center gap-2 !px-4 !py-2.5"
        >
          <CopyIcon className="h-4 w-4" />
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-good"
              >
                Copied!
              </motion.span>
            ) : (
              <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </RankUpSecondaryButton>
        <RankUpSecondaryButton
          onClick={shareCode}
          className="inline-flex items-center gap-2 !px-4 !py-2.5"
        >
          <ShareIcon className="h-4 w-4" />
          Share
        </RankUpSecondaryButton>
      </div>
    </div>
  );
}
