import { useMemo } from 'react';
import RankUpPanel, { RankUpSecondaryButton } from './Layout';

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

export default function RankEditor({
  options,
  order,
  onOrderChange,
  heading = 'Your ranking',
  description = 'Tap items in order from best (#1) to worst.',
}: RankEditorProps) {
  const unranked = useMemo(
    () => options.filter((option) => !order.includes(option.id)),
    [options, order],
  );

  function addToOrder(id: string) {
    onOrderChange([...order, id]);
  }

  function removeFromOrder(id: string) {
    onOrderChange(order.filter((entry) => entry !== id));
  }

  function moveUp(id: string) {
    const index = order.indexOf(id);
    if (index <= 0) return;
    const next = [...order];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onOrderChange(next);
  }

  function moveDown(id: string) {
    const index = order.indexOf(id);
    if (index < 0 || index >= order.length - 1) return;
    const next = [...order];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onOrderChange(next);
  }

  const labelById = useMemo(
    () => new Map(options.map((option) => [option.id, option.label])),
    [options],
  );

  const isComplete = order.length === options.length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-body text-sm font-bold text-text-hi">{heading}</h3>
        <p className="mt-1 font-body text-[13px] text-text-mid">{description}</p>
      </div>

      {order.length > 0 && (
        <RankUpPanel compact className="border-pewter/30">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-pewter">
            Ranked
          </p>
          <ol className="flex flex-col gap-2">
            {order.map((id, index) => (
              <li
                key={id}
                className="flex items-center gap-2 rounded-xl border border-pewter/40 bg-surface px-3 py-2.5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pewter/15 font-mono text-xs font-bold text-pewter">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate font-body text-sm font-semibold text-text-hi">
                  {labelById.get(id)}
                </span>
                <div className="flex shrink-0 gap-1">
                  <RankUpSecondaryButton
                    onClick={() => moveUp(id)}
                    disabled={index === 0}
                    className="!px-2 !py-1.5 text-xs"
                  >
                    ↑
                  </RankUpSecondaryButton>
                  <RankUpSecondaryButton
                    onClick={() => moveDown(id)}
                    disabled={index === order.length - 1}
                    className="!px-2 !py-1.5 text-xs"
                  >
                    ↓
                  </RankUpSecondaryButton>
                  <RankUpSecondaryButton
                    onClick={() => removeFromOrder(id)}
                    className="!px-2 !py-1.5 text-xs text-bad hover:text-bad"
                  >
                    ✕
                  </RankUpSecondaryButton>
                </div>
              </li>
            ))}
          </ol>
        </RankUpPanel>
      )}

      {unranked.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-low">
            {order.length === 0 ? 'Tap to rank' : 'Remaining'}
          </p>
          <ul className="flex flex-col gap-2">
            {unranked.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() => addToOrder(option.id)}
                  className="flex w-full items-center rounded-xl border border-line bg-surface/80 px-4 py-3 text-left font-body text-sm font-semibold text-text-hi transition-colors hover:border-pewter/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pewter"
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isComplete && (
        <p className="font-mono text-[11px] text-good">All items ranked — ready to confirm.</p>
      )}
    </div>
  );
}
