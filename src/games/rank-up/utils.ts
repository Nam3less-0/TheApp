import type { RankOption } from './types';

export function shuffleOptions<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function shuffleIds(ids: string[]): string[] {
  return shuffleOptions(ids);
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

export type RoundPoints = number;

export function perfectPoints(itemCount: number): number {
  return Math.min(3, Math.max(1, itemCount - 2));
}

export function ordersEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((id, index) => id === b[index]);
}

interface GuessCloseness {
  exactPositions: number;
  displacement: number;
}

export function measureGuessCloseness(
  guessOrder: string[],
  rankerOrder: string[],
): GuessCloseness {
  let exactPositions = 0;
  let displacement = 0;

  for (let index = 0; index < rankerOrder.length; index += 1) {
    const guessId = guessOrder[index];
    if (guessId === rankerOrder[index]) exactPositions += 1;
    const rankerIndex = rankerOrder.indexOf(guessId);
    if (rankerIndex >= 0) displacement += Math.abs(index - rankerIndex);
  }

  return { exactPositions, displacement };
}

function compareCloseness(a: GuessCloseness, b: GuessCloseness): number {
  if (b.exactPositions !== a.exactPositions) return b.exactPositions - a.exactPositions;
  return a.displacement - b.displacement;
}

/** Perfect match scales with item count; closest non-perfect guess(es) +1, otherwise +0. */
export function scoreRoundPoints(
  guessOrder: string[],
  rankerOrder: string[],
  allGuessOrders: string[][],
): RoundPoints {
  const perfect = perfectPoints(rankerOrder.length);
  if (ordersEqual(guessOrder, rankerOrder)) return perfect;
  if (guessOrder.length !== rankerOrder.length || rankerOrder.length === 0) return 0;

  const validGuesses = allGuessOrders.filter((order) => order.length === rankerOrder.length);
  if (validGuesses.length === 0) return 0;

  const mine = measureGuessCloseness(guessOrder, rankerOrder);
  let best = measureGuessCloseness(validGuesses[0]!, rankerOrder);

  for (const order of validGuesses.slice(1)) {
    const next = measureGuessCloseness(order, rankerOrder);
    if (compareCloseness(next, best) < 0) best = next;
  }

  if (compareCloseness(mine, best) > 0) return 0;
  return 1;
}

export function roundPointsLabel(points: RoundPoints, itemCount?: number): string {
  const perfect = itemCount != null ? perfectPoints(itemCount) : 3;
  if (points === perfect) return 'Perfect match';
  if (points === 1) return 'Closest guess';
  return 'Miss';
}

export function positionsOff(guessOrder: string[], rankerOrder: string[]): number {
  if (guessOrder.length !== rankerOrder.length || rankerOrder.length === 0) {
    return rankerOrder.length;
  }
  const { exactPositions } = measureGuessCloseness(guessOrder, rankerOrder);
  return rankerOrder.length - exactPositions;
}

export function revealScoreCaption(
  points: RoundPoints,
  guessOrder: string[],
  rankerOrder: string[],
): string {
  const itemCount = rankerOrder.length;
  const perfect = perfectPoints(itemCount);
  const off = positionsOff(guessOrder, rankerOrder);

  if (points === perfect) {
    return off === 0 ? '0 off · exact order' : `${off} off · exact order`;
  }
  if (points === 1) return `${off} off · closest guess`;
  return `${off} off`;
}
