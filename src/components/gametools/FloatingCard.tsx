import type { ReactNode } from 'react';
import type { Position } from './useDraggable';

interface FloatingCardProps {
  title: string;
  accent: string;
  pos: Position;
  width: number;
  onDragPointerDown: (e: React.PointerEvent) => void;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Shared chrome for the floating, draggable game-tool widgets: a header that
 * doubles as the drag handle plus a close button, over a dark glassy panel.
 */
export default function FloatingCard({
  title,
  accent,
  pos,
  width,
  onDragPointerDown,
  onClose,
  children,
}: FloatingCardProps) {
  return (
    <div
      className="fixed z-[55] overflow-hidden rounded-2xl border border-line-bright bg-surface/95 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md"
      style={{ left: pos.x, top: pos.y, width }}
    >
      <div
        className="flex cursor-move touch-none items-center justify-between gap-2 px-3 py-2"
        style={{ background: `linear-gradient(180deg, ${accent}26, transparent)` }}
        onPointerDown={onDragPointerDown}
      >
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-text-mid">
          <span aria-hidden="true">⠿</span>
          {title}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="flex h-6 w-6 items-center justify-center rounded-lg border border-line text-text-low transition-colors hover:border-line-bright hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-blue"
        >
          ✕
        </button>
      </div>
      <div className="px-3.5 pb-3.5 pt-1">{children}</div>
    </div>
  );
}
