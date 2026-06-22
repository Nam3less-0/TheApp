import type { CodeTriple, InterceptLogEntry } from './types';

export type HintTriple = [string, string, string];

/** Pad or trim to exactly 3 hint slots for positional digit mapping. */
export function normalizeHintsHeard(
  hints: [string, string, string] | string[],
): HintTriple {
  return [hints[0] ?? '', hints[1] ?? '', hints[2] ?? ''];
}

export interface DigitIntel {
  digit: number;
  entries: { hint: string; round: number }[];
}

export function aggregateIntelByDigit(log: InterceptLogEntry[]): DigitIntel[] {
  const buckets = new Map<number, { hint: string; round: number }[]>([
    [1, []],
    [2, []],
    [3, []],
    [4, []],
  ]);

  for (const entry of log) {
    const hints = normalizeHintsHeard(entry.hintsHeard);
    hints.forEach((hint, i) => {
      const trimmed = hint.trim();
      if (!trimmed) return;
      const digit = entry.actualCode[i];
      buckets.get(digit)?.push({ hint: trimmed, round: entry.round });
    });
  }

  return [1, 2, 3, 4].map((digit) => ({
    digit,
    entries: buckets.get(digit) ?? [],
  }));
}

export function formatCode(code: CodeTriple): string {
  return code.join(' ');
}
