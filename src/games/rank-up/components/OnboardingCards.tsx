import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { CrownIcon, EyeIcon } from './RankUpIcons';
import { RankUpPageWrap, RankUpPrimaryButton, RankUpSecondaryButton } from './Layout';

const ONBOARDING_KEY = 'rankup_onboarded';

export function isRankUpOnboarded(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === '1';
  } catch {
    return false;
  }
}

export function markRankUpOnboarded() {
  try {
    localStorage.setItem(ONBOARDING_KEY, '1');
  } catch {
    // Ignore storage failures
  }
}

const CARDS = [
  {
    title: 'Rank Up',
    tagline: 'Read the ranker\'s mind.',
    body: 'One player ranks a secret order. Everyone else guesses how they ranked it — then scores themselves on the honor system.',
    icon: null,
  },
  {
    title: 'Two roles',
    tagline: 'Crown vs eye',
    body: 'The ranker wears the crown and sets the order in secret. Guessers watch with the eye and try to match the ranker\'s mind.',
    icon: 'roles' as const,
  },
  {
    title: 'Scoring',
    tagline: 'Honor system',
    body: 'After the reveal, tap how you did: Perfect match +3, Closest guess +1, Miss +0. Be honest — it\'s more fun that way.',
    icon: 'score' as const,
  },
];

interface OnboardingCardsProps {
  onComplete: () => void;
}

export default function OnboardingCards({ onComplete }: OnboardingCardsProps) {
  const [index, setIndex] = useState(0);
  const card = CARDS[index]!;
  const isLast = index === CARDS.length - 1;

  function finish() {
    markRankUpOnboarded();
    onComplete();
  }

  return (
    <RankUpPageWrap>
      <div className="mx-auto max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="rounded-[18px] border border-line p-6 sm:p-8"
            style={{
              background: 'linear-gradient(165deg, #242228, #1C1A20 75%)',
            }}
          >
            {card.icon === 'roles' ? (
              <div className="mb-6 flex justify-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-pewter/50 bg-pewter/15 text-pewter">
                    <CrownIcon className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-pewter">
                    Ranker
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-surface text-text-mid">
                    <EyeIcon className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-mid">
                    Guessers
                  </span>
                </div>
              </div>
            ) : card.icon === 'score' ? (
              <div className="mb-6 flex flex-col gap-2">
                {[
                  { badge: '+3', label: 'Perfect match', className: 'border-good/40 text-good' },
                  { badge: '+1', label: 'Closest guess', className: 'border-pewter/40 text-pewter' },
                  { badge: '+0', label: 'Miss', className: 'border-line text-text-mid' },
                ].map((row) => (
                  <div
                    key={row.badge}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 ${row.className}`}
                  >
                    <span className="font-mono text-sm font-bold">{row.badge}</span>
                    <span className="font-body text-sm">{row.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-pewter">
                {card.tagline}
              </p>
            )}

            <h1 className="font-display text-[28px] font-extrabold text-text-hi">{card.title}</h1>
            {card.icon !== 'roles' && card.icon !== 'score' ? (
              <p className="mt-1 font-display text-lg font-bold text-pewter">{card.tagline}</p>
            ) : null}
            <p className="mt-4 font-body text-sm leading-relaxed text-text-mid">{card.body}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex items-center justify-center gap-1.5">
          {CARDS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-pewter' : 'w-1.5 bg-line'
              }`}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {isLast ? (
            <RankUpPrimaryButton onClick={finish}>Got it</RankUpPrimaryButton>
          ) : (
            <RankUpPrimaryButton onClick={() => setIndex((i) => i + 1)}>Next</RankUpPrimaryButton>
          )}
          <RankUpSecondaryButton onClick={finish} className="w-full text-center">
            Skip
          </RankUpSecondaryButton>
        </div>
      </div>
    </RankUpPageWrap>
  );
}
