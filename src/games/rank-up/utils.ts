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

export type RoundPoints = 0 | 1 | 3;

export function ordersEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((id, index) => id === b[index]);
}

interface GuessCloseness {
  exactPositions: number;
  displacement: number;
}

function measureGuessCloseness(guessOrder: string[], rankerOrder: string[]): GuessCloseness {
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

/** Perfect match +3, closest non-perfect guess(es) +1, otherwise +0. */
export function scoreRoundPoints(
  guessOrder: string[],
  rankerOrder: string[],
  allGuessOrders: string[][],
): RoundPoints {
  if (ordersEqual(guessOrder, rankerOrder)) return 3;
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
  if (ordersEqual(guessOrder, rankerOrder)) return 3;
  return 1;
}

export function roundPointsLabel(points: RoundPoints): string {
  switch (points) {
    case 3:
      return 'Perfect match';
    case 1:
      return 'Closest guess';
    default:
      return 'Miss';
  }
}
