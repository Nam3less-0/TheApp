import { JEOPARDY_TOPICS, type Difficulty, type TopicData } from '../../data/jeopardy-questions';
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

/** Topic ids where the What Choices lifeline is disabled (e.g. riddles). */
export const WHAT_CHOICES_BLOCKED_TOPIC_IDS = new Set(['riddles']);

export function isWhatChoicesAllowed(topicId: string | undefined): boolean {
  return topicId !== undefined && !WHAT_CHOICES_BLOCKED_TOPIC_IDS.has(topicId);
}

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

export const PHONE_A_FRIEND_MAX_USES = 2;
export const WHAT_CHOICES_MAX_USES = 2;
export const SNIPE_CORRECT_POINTS = 200;
/** Clue values a player may pick at most once per turn. */
export const TURN_LIMITED_VALUES = [200, 400] as const;

/** Fresh set of lifelines for a new game. */
export function freshLifelines(): Lifelines {
  return {
    phoneAFriend: PHONE_A_FRIEND_MAX_USES,
    whatChoices: WHAT_CHOICES_MAX_USES,
    snipe: true,
  };
}

export function isCellBlockedThisTurn(
  value: number,
  turnPickedValues: number[],
): boolean {
  return (
    (TURN_LIMITED_VALUES as readonly number[]).includes(value) &&
    turnPickedValues.includes(value)
  );
}

/** Snipe can fire only before any lifeline or reveal on the current clue. */
export function isSnipeWindowOpen(session: {
  phase: string;
  revealedChoices: string[] | null;
  phoneFriendId: string | null;
  sniped: boolean;
}): boolean {
  return (
    session.phase === 'question' &&
    session.revealedChoices === null &&
    session.phoneFriendId === null &&
    !session.sniped
  );
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

const RECENT_QUESTIONS_KEY = 'jeopardy-recent-questions';
const RECENT_TOPICS_KEY = 'jeopardy-recent-topics';
const MAX_RECENT_QUESTIONS = 400;
const MAX_RECENT_TOPICS = 36;
const RECENT_QUESTION_WEIGHT = 1;
const FRESH_QUESTION_WEIGHT = 10;
const RECENT_TOPIC_WEIGHT = 1;
const SESSION_TOPIC_WEIGHT = 2;
const FRESH_TOPIC_WEIGHT = 6;

/** Unbiased integer in [0, max) using crypto.getRandomValues. */
function randomInt(max: number): number {
  if (max <= 1) return 0;
  const array = new Uint32Array(1);
  const limit = Math.floor(0x1_0000_0000 / max) * max;
  let value: number;
  do {
    crypto.getRandomValues(array);
    value = array[0];
  } while (value >= limit);
  return value % max;
}

/** Extra shuffle pass — cheap variance without hurting uniformity. */
function shuffleDeep<T>(input: T[]): T[] {
  return shuffle(shuffle(input));
}

export function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Weighted pick without replacement. Falls back to uniform when weights are zero. */
function weightedSampleWithoutReplacement<T>(
  pool: T[],
  count: number,
  weightFor: (item: T) => number,
): T[] {
  const remaining = [...pool];
  const picked: T[] = [];

  while (picked.length < count && remaining.length > 0) {
    const weights = remaining.map(weightFor);
    const total = weights.reduce((sum, weight) => sum + Math.max(weight, 0), 0);
    if (total <= 0) {
      picked.push(...shuffle(remaining).slice(0, count - picked.length));
      break;
    }

    let roll = randomInt(total);
    let index = 0;
    for (; index < remaining.length; index += 1) {
      roll -= Math.max(weights[index], 0);
      if (roll < 0) break;
    }

    picked.push(remaining[index]);
    remaining.splice(index, 1);
  }

  return picked;
}

/** Weighted single pick — favors higher-weight items. */
function pickWeightedRandom<T>(
  items: T[],
  weightFor: (item: T) => number,
): T {
  if (items.length === 1) return items[0];
  const weights = items.map(weightFor);
  const total = weights.reduce((sum, weight) => sum + Math.max(weight, 0), 0);
  if (total <= 0) return shuffle(items)[0];

  let roll = randomInt(total);
  for (let index = 0; index < items.length; index += 1) {
    roll -= Math.max(weights[index], 0);
    if (roll < 0) return items[index];
  }
  return items[items.length - 1];
}

function loadRecentKeys(storageKey: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === 'string')
      : [];
  } catch {
    return [];
  }
}

function saveRecentKeys(storageKey: string, keys: string[], max: number) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(keys.slice(-max)));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function questionKey(
  topicId: string,
  difficulty: Difficulty,
  question: string,
): string {
  return `${topicId}|${difficulty}|${question}`;
}

/**
 * Prefer items with lower recent-use weight. When everything was seen recently,
 * fall back to the full pool so games never stall.
 */
function pickLeastRecent<T>(
  items: T[],
  keyFor: (item: T) => string,
  recentSet: Set<string>,
): T {
  return pickWeightedRandom(items, (item) =>
    recentSet.has(keyFor(item)) ? RECENT_QUESTION_WEIGHT : FRESH_QUESTION_WEIGHT,
  );
}

function topicWeight(
  topicId: string,
  recentTopicSet: Set<string>,
  sessionTopicSet: Set<string>,
): number {
  if (recentTopicSet.has(topicId)) return RECENT_TOPIC_WEIGHT;
  if (sessionTopicSet.has(topicId)) return SESSION_TOPIC_WEIGHT;
  return FRESH_TOPIC_WEIGHT;
}

export interface PreviewTopicsResult {
  columns: BoardColumn[];
  sessionTopicIds: string[];
  eligibleCount: number;
}

/** Pick six topics for the setup preview, honoring blacklist and session history. */
export function pickPreviewTopics(
  blacklistedTopicIds: string[],
  previewSessionTopicIds: string[],
  excludeTopicIds: string[] = [],
): PreviewTopicsResult {
  const blocked = new Set(blacklistedTopicIds);
  const excluded = new Set(excludeTopicIds);
  let eligible = JEOPARDY_TOPICS.filter((topic) => !blocked.has(topic.id));
  const withoutExcluded = eligible.filter((topic) => !excluded.has(topic.id));

  // On reroll, prefer a completely fresh set when enough topics remain.
  if (withoutExcluded.length >= BOARD_COLUMNS) {
    eligible = withoutExcluded;
  }

  const recentTopicSet = new Set(loadRecentKeys(RECENT_TOPICS_KEY));
  const sessionTopicSet = new Set(previewSessionTopicIds);
  const pickCount = Math.min(BOARD_COLUMNS, eligible.length);

  const picked = weightedSampleWithoutReplacement(
    shuffleDeep(eligible),
    pickCount,
    (topic) => topicWeight(topic.id, recentTopicSet, sessionTopicSet),
  );

  const nextSessionTopicIds = [
    ...new Set([...previewSessionTopicIds, ...picked.map((topic) => topic.id)]),
  ];

  return {
    columns: shuffleDeep(picked).map((topic) => ({
      id: topic.id,
      name: topic.name,
    })),
    sessionTopicIds: nextSessionTopicIds,
    eligibleCount: JEOPARDY_TOPICS.filter((topic) => !blocked.has(topic.id)).length,
  };
}

export function getAllTopicSummaries(): BoardColumn[] {
  return JEOPARDY_TOPICS.map((topic) => ({ id: topic.id, name: topic.name }));
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
 * Build multiple-choice options (correct first) for a clue. Authored choices win;
 * otherwise we draw plausible distractors from a pool of sibling answers in the
 * same topic — real answers that "sound reasonable" but are wrong.
 */
export function buildChoices(
  answer: string,
  choices: [string, string, string] | [string, string, string, string] | undefined,
  pool: string[],
  choiceCount = 4,
): [string, string, string] | [string, string, string, string] {
  if (choices) return choices;

  const correctKey = normalizeAnswer(answer);

  // True/False clues can only ever have two sensible options.
  if (correctKey === 'true' || correctKey === 'false') {
    const opposite = correctKey === 'true' ? 'False' : 'True';
    if (choiceCount === 3) {
      return [answer, opposite, "It's a myth"];
    }
    return [answer, opposite, "It's a myth", 'Both are correct'];
  }

  const seen = new Set<string>([correctKey]);
  const distractors: string[] = [];
  for (const candidate of shuffle(pool)) {
    if (distractors.length >= choiceCount - 1) break;
    const key = normalizeAnswer(candidate);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    distractors.push(candidate);
  }
  while (distractors.length < choiceCount - 1) {
    distractors.push('None of these');
  }

  return [answer, ...distractors] as
    | [string, string, string]
    | [string, string, string, string];
}

/**
 * Build a board from confirmed preview topics: shuffle column order, draw weighted
 * random questions per difficulty, and flag double-trouble tiles.
 */
export function buildBoardFromTopics(topicIds: string[]): BuiltBoard {
  const topics = topicIds
    .map((id) => JEOPARDY_TOPICS.find((topic) => topic.id === id))
    .filter((topic): topic is TopicData => topic !== undefined);

  if (topics.length === 0) {
    throw new Error('Cannot build a board without topics.');
  }

  const recentQuestions = loadRecentKeys(RECENT_QUESTIONS_KEY);
  const recentQuestionSet = new Set(recentQuestions);
  const newQuestionKeys: string[] = [];
  const shuffledTopics = shuffleDeep(topics);

  const columns: BoardColumn[] = shuffledTopics.map((topic) => ({
    id: topic.id,
    name: topic.name,
  }));
  const cells: BoardCell[] = [];

  shuffledTopics.forEach((topic, columnIndex) => {
    const topicAnswers = topic.questions.map((question) => question.answer);

    DIFFICULTIES.forEach((difficulty) => {
      const candidates = topic.questions.filter(
        (question) => question.difficulty === difficulty,
      );
      const chosen = pickLeastRecent(
        candidates,
        (question) => questionKey(topic.id, difficulty, question.question),
        recentQuestionSet,
      );
      newQuestionKeys.push(
        questionKey(topic.id, difficulty, chosen.question),
      );

      const choiceCount = topic.id === 'riddles' ? 3 : 4;
      const sameDiff = candidates.map((question) => question.answer);
      const pool = sameDiff.length >= choiceCount ? sameDiff : topicAnswers;

      cells.push({
        id: `${columnIndex}-${difficulty}`,
        columnIndex,
        difficulty,
        value: DIFFICULTY_VALUES[difficulty],
        question: chosen.question,
        answer: chosen.answer,
        choices: buildChoices(chosen.answer, chosen.choices, pool, choiceCount),
        isDouble: false,
        used: false,
      });
    });
  });

  saveRecentKeys(
    RECENT_QUESTIONS_KEY,
    [...recentQuestions, ...newQuestionKeys],
    MAX_RECENT_QUESTIONS,
  );
  saveRecentKeys(
    RECENT_TOPICS_KEY,
    [
      ...loadRecentKeys(RECENT_TOPICS_KEY),
      ...shuffledTopics.map((topic) => topic.id),
    ],
    MAX_RECENT_TOPICS,
  );

  const doubleIds = new Set(
    shuffleDeep(cells.map((cell) => cell.id)).slice(0, DOUBLE_TROUBLE_COUNT),
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
