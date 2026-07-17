import type { RankOption } from '../types';
import { labelForOption } from '../utils';

interface OrderListProps {
  order: string[];
  options: RankOption[];
  variant?: 'default' | 'compact';
  bestLabel?: string;
  worstLabel?: string;
  showRail?: boolean;
}

export default function OrderList({
  order,
  options,
  variant = 'default',
  bestLabel = 'Best',
  worstLabel = 'Worst',
  showRail = false,
}: OrderListProps) {
  const padding = variant === 'compact' ? 'px-3 py-2' : 'px-4 py-3';
  const textSize = variant === 'compact' ? 'text-[13px]' : 'text-sm';

  const list = (
    <ol className="flex flex-col gap-1.5">
      {order.map((id, index) => (
        <li
          key={id}
          className={`flex items-center gap-2 rounded-lg border border-line bg-deep/50 ${padding} font-body ${textSize} text-text-hi`}
        >
          <span className="w-5 shrink-0 font-mono text-[11px] font-bold text-pewter">
            {index + 1}
          </span>
          <span className="min-w-0 flex-1 truncate font-semibold">
            {labelForOption(options, id)}
          </span>
        </li>
      ))}
    </ol>
  );

  if (!showRail) return list;

  return (
    <div className="flex gap-3">
      <div className="flex w-5 shrink-0 flex-col items-center justify-between py-1">
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-good">
          {bestLabel}
        </span>
        <div className="my-1 w-px flex-1 bg-gradient-to-b from-good/50 via-pewter/30 to-bad/50" />
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-bad/80">
          {worstLabel}
        </span>
      </div>
      <div className="min-w-0 flex-1">{list}</div>
    </div>
  );
}
