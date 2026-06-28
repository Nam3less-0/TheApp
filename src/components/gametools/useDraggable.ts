import { useEffect, useRef, useState } from 'react';

export interface Position {
  x: number;
  y: number;
}

/**
 * Pointer-based dragging for the floating game-tool widgets. Attach
 * `onDragPointerDown` to a drag handle (e.g. the card header); the widget is
 * kept inside the viewport bounds while moving.
 */
export function useDraggable(getInitial: () => Position) {
  const [pos, setPos] = useState<Position>(getInitial);
  const offset = useRef<{ dx: number; dy: number } | null>(null);

  function onDragPointerDown(e: React.PointerEvent) {
    offset.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
  }

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const o = offset.current;
      if (!o) return;
      e.preventDefault();
      const maxX = window.innerWidth - 56;
      const maxY = window.innerHeight - 56;
      setPos({
        x: Math.max(8, Math.min(maxX, e.clientX - o.dx)),
        y: Math.max(8, Math.min(maxY, e.clientY - o.dy)),
      });
    }
    function onUp() {
      offset.current = null;
    }
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return { pos, onDragPointerDown };
}
