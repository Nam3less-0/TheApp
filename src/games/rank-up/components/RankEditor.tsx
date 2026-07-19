import {
  AnimatePresence,
  Reorder,
  motion,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from 'framer-motion';
import { useMemo, useState, type ReactNode } from 'react';
import RankUpPanel from './Layout';
import { GripIcon } from './RankUpIcons';

interface RankOption {
  id: string;
  label: string;
}

export type RankEditorCtaTint = 'ranker' | 'guesser';

interface RankEditorProps {
  options: RankOption[];
  order: string[];
  onOrderChange: (order: string[]) => void;
  heading?: string;
  description?: string;
  hintText?: string;
  ctaLabel?: string;
  ctaIcon?: ReactNode;
  ctaTint?: RankEditorCtaTint;
  onSubmit?: () => void | Promise<void>;
  submitting?: boolean;
  submitDisabled?: boolean;
  confirmationMessage?: string;
}

const SPRING = { type: 'spring' as const, stiffness: 480, damping: 32 };
const REDUCED_MOTION_TRANSITION = { duration: 0.15 };

const CTA_GRADIENTS: Record<RankEditorCtaTint, string> = {
  ranker: 'linear-gradient(180deg, #8BB8D4, #6FA3C4 55%, #4E7F9C)',
  guesser: 'linear-gradient(180deg, #8FB8A8, #6E9E88 55%, #5C8878)',
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

function tierLabel(idx: number): string {
  if (idx === 0) return 'Best pick';
  if (idx === 1) return '2nd';
  if (idx === 2) return '3rd';
  return ordinal(idx + 1);
}

function tierStyles(idx: number) {
  switch (idx) {
    case 0:
      return {
        color: '#D8B36A',
        background: 'rgba(216, 179, 106, 0.14)',
        boxShadow: '0 0 14px rgba(216, 179, 106, 0.28)',
        borderColor: 'rgba(216, 179, 106, 0.45)',
      };
    case 1:
      return {
        color: '#C3C9D1',
        background: 'rgba(195, 201, 209, 0.12)',
        boxShadow: 'none',
        borderColor: 'rgba(195, 201, 209, 0.35)',
      };
    case 2:
      return {
        color: '#C08A5C',
        background: 'rgba(192, 138, 92, 0.12)',
        boxShadow: 'none',
        borderColor: 'rgba(192, 138, 92, 0.35)',
      };
    default:
      return {
        color: '#6B7280',
        background: 'rgba(107, 114, 128, 0.1)',
        boxShadow: 'none',
        borderColor: 'rgba(107, 114, 128, 0.3)',
      };
  }
}

function TierBadge({ idx }: { idx: number }) {
  const tier = tierStyles(idx);

  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold transition-[color,background-color,box-shadow,border-color] duration-[260ms] ease-out"
      style={{
        color: tier.color,
        background: tier.background,
        boxShadow: tier.boxShadow,
        borderColor: tier.borderColor,
      }}
      aria-hidden="true"
    >
      {idx + 1}
    </span>
  );
}

function RankRow({
  id,
  idx,
  label,
  reducedMotion,
}: {
  id: string;
  idx: number;
  label: string;
  reducedMotion: boolean;
}) {
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const tier = tierStyles(idx);

  function handleDrag(_event: PointerEvent, info: PanInfo) {
    if (reducedMotion) return;
    rotate.set(clamp(info.velocity.y * 0.015, -6, 6));
  }

  function handleDragEnd() {
    rotate.set(0);
  }

  return (
    <Reorder.Item
      value={id}
      layout
      transition={reducedMotion ? REDUCED_MOTION_TRANSITION : SPRING}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileDrag={
        reducedMotion
          ? { opacity: 0.88, zIndex: 50, cursor: 'grabbing' }
          : {
              scale: 1.035,
              boxShadow:
                '0 18px 30px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
              zIndex: 50,
              cursor: 'grabbing',
            }
      }
      className="rank-item relative flex cursor-grab items-center gap-3 rounded-2xl border bg-surface/90 px-3 py-3 transition-[border-color] duration-[260ms] ease-out active:cursor-grabbing"
      style={{
        y,
        rotate: reducedMotion ? 0 : rotate,
        borderColor: tier.borderColor,
      }}
    >
      <GripIcon className="pointer-events-none h-4 w-4 shrink-0 text-text-low/50" />
      <TierBadge idx={idx} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-sm font-semibold text-text-hi">{label}</p>
        <p
          className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-[260ms] ease-out"
          style={{ color: tier.color }}
        >
          {tierLabel(idx)}
        </p>
      </div>
    </Reorder.Item>
  );
}

export default function RankEditor({
  options,
  order,
  onOrderChange,
  heading = 'Your ranking',
  description = 'Drag to reorder from best to worst.',
  hintText,
  ctaLabel,
  ctaIcon,
  ctaTint = 'ranker',
  onSubmit,
  submitting = false,
  submitDisabled = false,
  confirmationMessage,
}: RankEditorProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const [showConfirmation, setShowConfirmation] = useState(false);

  const labelById = useMemo(
    () => new Map(options.map((option) => [option.id, option.label])),
    [options],
  );

  const isComplete = order.length === options.length && options.length > 0;
  const showCta = Boolean(onSubmit && ctaLabel);

  if (options.length === 0) return null;

  async function handleSubmit() {
    if (!onSubmit || submitDisabled || submitting) return;
    await onSubmit();
    if (confirmationMessage) {
      setShowConfirmation(true);
      window.setTimeout(() => setShowConfirmation(false), 4200);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-body text-sm font-bold text-text-hi">{heading}</h3>
        <p className="mt-1 font-body text-[13px] text-text-mid">{description}</p>
        {hintText ? (
          <p className="mt-2 font-body text-[12px] font-medium text-text-mid">{hintText}</p>
        ) : null}
      </div>

      <RankUpPanel compact className="border-line/80">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#6FA3C4]">
          Build your podium — drag to reorder
        </p>
        <Reorder.Group
          axis="y"
          values={order}
          onReorder={onOrderChange}
          layoutScroll
          className="rank-list flex flex-col gap-2.5"
        >
          {order.map((id, idx) => (
            <RankRow
              key={id}
              id={id}
              idx={idx}
              label={labelById.get(id) ?? id}
              reducedMotion={reducedMotion}
            />
          ))}
        </Reorder.Group>
      </RankUpPanel>

      {showCta ? (
        <div className="flex flex-col gap-2.5">
          <motion.button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitDisabled || submitting || !isComplete}
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-none px-4 py-[15px] font-body text-[15px] font-bold text-void transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: CTA_GRADIENTS[ctaTint],
            }}
          >
            {ctaIcon}
            {submitting ? 'Submitting…' : ctaLabel}
          </motion.button>

          <AnimatePresence>
            {showConfirmation && confirmationMessage ? (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: reducedMotion ? 0.1 : 0.28 }}
                className="text-center font-body text-[12px] text-text-mid"
              >
                {confirmationMessage}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      ) : isComplete ? (
        <p className="rounded-xl border border-good/30 bg-good/10 px-4 py-2.5 text-center font-mono text-[11px] text-good">
          All items ranked — ready to confirm.
        </p>
      ) : null}
    </div>
  );
}
