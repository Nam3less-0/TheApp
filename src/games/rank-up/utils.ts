import type { RankOption } from './types';

export function shuffleOptions<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function labelForOption(options: RankOption[], optionId: string): string {
  return options.find((option) => option.id === optionId)?.label ?? optionId;
}

export function optionsFromLabels(labels: string[]): RankOption[] {
  return labels
    .map((label) => label.trim())
    .filter((label) => label.length > 0)
    .map((label, index) => ({ id: `opt-${index}`, label }));
}

export function defaultRankOrder(options: RankOption[]): string[] {
  return options.map((option) => option.id);
}
