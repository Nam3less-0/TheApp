export type CellTone = 'exact' | 'near' | 'far';

export function cellTone(trueIndex: number, guessedIndex: number): CellTone {
  const diff = Math.abs(trueIndex - guessedIndex);
  if (diff === 0) return 'exact';
  if (diff <= 2) return 'near';
  return 'far';
}

export const CELL_TONE_STYLES: Record<
  CellTone,
  { bg: string; border: string; text: string; label: string }
> = {
  exact: {
    bg: 'rgba(127, 191, 156, 0.18)',
    border: 'rgba(127, 191, 156, 0.45)',
    text: '#7FBF9C',
    label: 'Exact',
  },
  near: {
    bg: 'rgba(216, 179, 106, 0.16)',
    border: 'rgba(216, 179, 106, 0.42)',
    text: '#D8B36A',
    label: 'Near',
  },
  far: {
    bg: 'rgba(201, 127, 127, 0.16)',
    border: 'rgba(201, 127, 127, 0.42)',
    text: '#C97F7F',
    label: 'Far',
  },
};

export function guessedPosition(guessOrder: string[] | null | undefined, itemId: string): number | null {
  if (!guessOrder?.length) return null;
  const index = guessOrder.indexOf(itemId);
  return index >= 0 ? index : null;
}
