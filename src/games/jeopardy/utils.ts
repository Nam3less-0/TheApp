import { JEOPARDY_TOPICS, type Difficulty } from '../../data/jeopardy-questions';
import type { BoardCell, BoardColumn, Lifelines, Player } from './types';

export const BOARD_COLUMNS = 6;
export const DIFFICULTIES: Difficulty[] = [1, 2, 3, 4, 5];
export const DOUBLE_TROUBLE_COUNT = 3;

/** Board size: 6 topics × 5 difficulties. */
export const BOARD_SIZE = BOARD_COLUMNS * DIFFICULTIES.length;

/** Difficulty → point value mapping shown on the board. */
export const DIFFICULTY_VALUES: Record<Difficulty, number> = {
  1: 200,
  2: 400,
  3: 600,
  4: 800,
  5: 1000,
};

/** Mockup palette — kept here so screens stay consistent with the design. */
export const COLORS = {
  sapphire: '#3A6FCC',
  sapphireBright: '#5B8FE8',
  sapphireDim: '#1E3D6E',
  gold: '#C9A44A',
  goldBright: '#E8C96A',
  goldDim: '#7A6030',
  double: '#C2883B',
  doubleBright: '#E8A850',
  good: '#7ED9A4',
  bad: '#E08B7A',
} as const;

export const SILVER_BUTTON =
  'linear-gradient(180deg, #F2F4F8, #C9CDD6 50%, #8B8F99)';

const DEFAULT_PLAYER_NAMES = ['Belford', 'Joshua', 'Matthew', 'Kai Jie'];
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 8;

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

/** Fresh set of lifelines (both available) for a new game. */
export function freshLifelines(): Lifelines {
  return { phoneAFriend: true, whatChoices: true };
}

export function createDefaultPlayers(count = 4): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `player-${i + 1}`,
    name: DEFAULT_PLAYER_NAMES[i] ?? `Player ${i + 1}`,
    score: 0,
    correct: 0,
    missed: 0,
    doublesHit: 0,
    lifelines: freshLifelines(),
  }));
}

export function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Total formatted score with thousands separators (e.g. 1,400). */
export function formatScore(value: number): string {
  return value.toLocaleString('en-US');
}

export interface BuiltBoard {
  columns: BoardColumn[];
  cells: BoardCell[];
}

/** Normalize an answer for de-duping distractors (case/punctuation-insensitive). */
function normalizeAnswer(answer: string): string {
  return answer.toLowerCase().replace(/\s*\([^)]*\)\s*/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
}

/**
 * Build three multiple-choice options (correct first) for a clue. Authored
 * choices win; otherwise we draw two plausible distractors from a pool of sibling
 * answers in the same topic — real answers that "sound reasonable" but are wrong.
 */
export function buildChoices(
  answer: string,
  choices: [string, string, string] | undefined,
  pool: string[],
): [string, string, string] {
  if (choices) return choices;

  const correctKey = normalizeAnswer(answer);

  // True/False clues can only ever have two sensible options.
  if (correctKey === 'true' || correctKey === 'false') {
    const opposite = correctKey === 'true' ? 'False' : 'True';
    return [answer, opposite, "It's a myth"];
  }

  const seen = new Set<string>([correctKey]);
  const distractors: string[] = [];
  for (const candidate of shuffle(pool)) {
    if (distractors.length >= 2) break;
    const key = normalizeAnswer(candidate);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    distractors.push(candidate);
  }
  while (distractors.length < 2) distractors.push('None of these');

  return [answer, distractors[0], distractors[1]];
}

/**
 * Build a fresh board: pick 6 random topics, then draw one random question per
 * difficulty for each topic, and flag 3 random cells as double-trouble.
 */
export function buildBoard(): BuiltBoard {
  const topics = shuffle(JEOPARDY_TOPICS).slice(0, BOARD_COLUMNS);

  const columns: BoardColumn[] = topics.map((t) => ({ id: t.id, name: t.name }));
  const cells: BoardCell[] = [];

  topics.forEach((topic, columnIndex) => {
    const topicAnswers = topic.questions.map((q) => q.answer);

    DIFFICULTIES.forEach((difficulty) => {
      const candidates = topic.questions.filter((q) => q.difficulty === difficulty);
      const chosen = pickOne(candidates);

      // Prefer same-difficulty siblings as distractors, widen to the whole topic
      // if there aren't enough distinct ones.
      const sameDiff = candidates.map((q) => q.answer);
      const pool = sameDiff.length >= 3 ? sameDiff : topicAnswers;

      cells.push({
        id: `${columnIndex}-${difficulty}`,
        columnIndex,
        difficulty,
        value: DIFFICULTY_VALUES[difficulty],
        question: chosen.question,
        answer: chosen.answer,
        choices: buildChoices(chosen.answer, chosen.choices, pool),
        isDouble: false,
        used: false,
      });
    });
  });

  const doubleIds = new Set(
    shuffle(cells.map((c) => c.id)).slice(0, DOUBLE_TROUBLE_COUNT),
  );
  for (const cell of cells) {
    if (doubleIds.has(cell.id)) cell.isDouble = true;
  }

  return { columns, cells };
}

/** Clues still available on the board. */
export function countRemainingCells(cells: BoardCell[]): number {
  return cells.filter((c) => !c.used).length;
}

export function getCellByColumnAndDifficulty(
  cells: BoardCell[],
  columnIndex: number,
  difficulty: Difficulty,
): BoardCell | undefined {
  return cells.find(
    (c) => c.columnIndex === columnIndex && c.difficulty === difficulty,
  );
}

export function getPlayerById(
  players: Player[],
  id: string | null,
): Player | undefined {
  if (!id) return undefined;
  return players.find((p) => p.id === id);
}
