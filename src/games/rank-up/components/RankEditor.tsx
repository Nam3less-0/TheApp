import { Reorder, motion, useMotionValue, useTransform } from 'framer-motion';
import { useMemo, useState } from 'react';
import RankUpPanel from './Layout';

interface RankOption {
  id: string;
  label: string;
}

interface RankEditorProps {
  options: RankOption[];
  order: string[];
  onOrderChange: (order: string[]) => void;
  heading?: string;
  description?: string;
}

function RankedItem({
  id,
  index,
  label,
  onDropPulse,
}: {
  id: string;
  index: number;
  label: string;
  onDropPulse: () => void;
}) {
  const y = useMotionValue(0);
  const boxShadow = useTransform(
    y,
    [-8, 0, 8],
    [
      '0 4px 12px rgba(155,147,168,0.15)',
      '0 8px 24px rgba(155,147,168,0.35)',
      '0 4px 12px rgba(155,147,168,0.15)',
    ],
  );

  return (
    <Reorder.Item
      value={id}
      style={{ y, boxShadow }}
      onDragEnd={onDropPulse}
      className="relative flex cursor-grab items-center gap-2 rounded-xl border border-pewter/40 bg-surface px-3 py-2.5 active:cursor-grabbing"
      whileDrag={{ scale: 1.03, zIndex: 10 }}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pewter/15 font-mono text-xs font-bold text-pewter">
        {index + 1}
      </span>
      <span className="min-w-0 flex-1 truncate font-body text-sm font-semibold text-text-hi">
        {label}
      </span>
    </Reorder.Item>
  );
}

export default function RankEditor({
  options,
  order,
  onOrderChange,
  heading = 'Your ranking',
  description = 'Drag to reorder from best (#1) to worst.',
}: RankEditorProps) {
  const [pulseKey, setPulseKey] = useState(0);

  const labelById = useMemo(
    () => new Map(options.map((option) => [option.id, option.label])),
    [options],
  );

  const isComplete = order.length === options.length && options.length > 0;

  function triggerDropPulse() {
    setPulseKey((key) => key + 1);
  }

  if (options.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-body text-sm font-bold text-text-hi">{heading}</h3>
        <p className="mt-1 font-body text-[13px] text-text-mid">{description}</p>
      </div>

      <RankUpPanel compact className="border-pewter/30">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-pewter">
          Ranked — drag to reorder
        </p>
        <div className="flex gap-3">
          <div className="sticky top-4 flex w-6 shrink-0 flex-col items-center self-start py-2">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-good">
              Best
            </span>
            <div
              className="my-2 w-px min-h-[3rem] flex-1"
              style={{
                background:
                  'linear-gradient(180deg, rgba(120,200,140,0.6) 0%, rgba(155,147,168,0.35) 50%, rgba(200,100,100,0.5) 100%)',
              }}
            />
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-bad/80">
              Worst
            </span>
          </div>

          <motion.div
            key={pulseKey}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.01, 1] }}
            transition={{ duration: 0.2 }}
            className="min-w-0 flex-1"
          >
            <Reorder.Group axis="y" values={order} onReorder={onOrderChange} className="flex flex-col gap-2">
              {order.map((id, index) => (
                <RankedItem
                  key={id}
                  id={id}
                  index={index}
                  label={labelById.get(id) ?? id}
                  onDropPulse={triggerDropPulse}
                />
              ))}
            </Reorder.Group>
          </motion.div>
        </div>
      </RankUpPanel>

      {isComplete && (
        <p className="rounded-xl border border-good/30 bg-good/10 px-4 py-2.5 text-center font-mono text-[11px] text-good">
          All items ranked — ready to confirm.
        </p>
      )}
    </div>
  );
}
