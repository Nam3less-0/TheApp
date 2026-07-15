import { JEOPARDY_TOPICS, type Difficulty, type TopicData } from '../../data/jeopardy-questions';
import type {
  AnswerRecord,
  BoardCell,
  BoardColumn,
  FinalClue,
  GameSettings,
  Lifelines,
  Player,
} from './types';

export const BOARD_COLUMNS = 6;
export const DIFFICULTIES: Difficulty[] = [1, 2, 3, 4, 5];
/** Reduced row set used by the quick-game house rule. */
export const QUICK_DIFFICULTIES: Difficulty[] = [1, 2, 3];
export const DOUBLE_TROUBLE_COUNT = 3;
export const QUICK_DOUBLE_TROUBLE_COUNT = 2;

/** Board size: 6 topics × 5 difficulties. */
export const BOARD_SIZE = BOARD_COLUMNS * DIFFICULTIES.length;

/** Rows/doubles for the active board, honoring the quick-game rule. */
export function boardShapeFor(settings: GameSettings): {
  difficulties: Difficulty[];
  doubleCount: number;
} {
  return settings.quickGame
    ? { difficulties: QUICK_DIFFICULTIES, doubleCount: QUICK_DOUBLE_TROUBLE_COUNT }
    : { difficulties: DIFFICULTIES, doubleCount: DOUBLE_TROUBLE_COUNT };
}

/** Default house rules — everything classic/off unless the host opts in. */
export function defaultSettings(): GameSettings {
  return {
    wrongAnswerPenalty: false,
    clueTimerSeconds: 0,
    quickGame: false,
    finalJeopardy: false,
    dailyDoubleWager: false,
    selfScore: false,
    soundEnabled: true,
    themeId: null,
  };
}

/** Curated topic bundles the host can restrict a board to. */
export interface ThemeBundle {
  id: string;
  name: string;
  description: string;
  topicIds: string[];
}

export const THEME_BUNDLES: ThemeBundle[] = [
  {
    id: 'movie-night',
    name: 'Movie Night',
    description: 'Screens, capes and cartoons',
    topicIds: ['movies-tv', 'disney', 'marvel', 'superheroes', 'anime', 'pop-culture', 'music', 'brands'],
  },
  {
    id: 'stem-night',
    name: 'STEM Night',
    description: 'Science, numbers and machines',
    topicIds: ['science', 'random-science-trivia', 'physics', 'math', 'computing', 'technology', 'space', 'medicine', 'inventions', 'fields-of-study'],
  },
  {
    id: 'gamer',
    name: 'Gamer',
    description: 'Controllers down for a sec',
    topicIds: ['video-games', 'gaming-history', 'board-games', 'digital-creatures', 'neon-open-worlds', 'anime', 'superheroes', 'marvel'],
  },
  {
    id: 'globe-trotter',
    name: 'Globe Trotter',
    description: 'Places, people and the past',
    topicIds: ['geography', 'capital-cities', 'landmarks', 'cities-landmarks', 'history', 'modern-history', 'world-leaders', 'exploration', 'languages', 'traditions', 'transport'],
  },
  {
    id: 'general-knowledge',
    name: 'Big Brain',
    description: 'A bit of everything hard',
    topicIds: ['literature', 'art', 'world-religions', 'mythology', 'crime', 'record-breakers', 'phobias', 'freak-of-nature', 'animals', 'planet-earth', 'food', 'drugs'],
  },
];

export function getThemeBundle(themeId: string | null): ThemeBundle | undefined {
  if (!themeId) return undefined;
  return THEME_BUNDLES.find((theme) => theme.id === themeId);
}

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

const RECENT_TOPICS_KEY = 'jeopardy-recent-topics';
const RECENT_QUESTIONS_KEY = 'jeopardy-recent-questions';
const QUESTION_DECK_KEY_PREFIX = 'jeopardy-deck-';
const MAX_RECENT_TOPICS = 36;
/**
 * How many recently-served clues to remember across games. A full board is 30
 * clues, so this keeps roughly the last six games out of the draw whenever a
 * topic/difficulty pool is large enough to allow it.
 */
const MAX_RECENT_QUESTIONS = 180;
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

export function makeQuestionKey(
  topicId: string,
  difficulty: Difficulty,
  question: string,
): string {
  return `${topicId}|${difficulty}|${question}`;
}

/** @deprecated internal alias */
function questionKey(
  topicId: string,
  difficulty: Difficulty,
  question: string,
): string {
  return makeQuestionKey(topicId, difficulty, question);
}

export function loadRecentQuestionKeys(): string[] {
  return loadRecentKeys(RECENT_QUESTIONS_KEY);
}

function slotKey(topicId: string, difficulty: Difficulty): string {
  return `${topicId}|${difficulty}`;
}

function loadQuestionDeck(slot: string): string[] {
  try {
    const raw = localStorage.getItem(`${QUESTION_DECK_KEY_PREFIX}${slot}`);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === 'string')
      : [];
  } catch {
    return [];
  }
}

function saveQuestionDeck(slot: string, deck: string[]) {
  try {
    localStorage.setItem(
      `${QUESTION_DECK_KEY_PREFIX}${slot}`,
      JSON.stringify(deck),
    );
  } catch {
    // Ignore quota / private-mode failures.
  }
}

interface QuestionDraw<T> {
  picked: T;
  /** The picked item's key, so callers can advance persistent state. */
  pickedKey: string;
}

/**
 * Pick the next clue for a topic/difficulty slot. This is a pure "peek": it
 * reads the persisted deck but never writes to storage, so it can be called
 * repeatedly (e.g. when the host reshuffles) without burning through the pool.
 *
 * Selection order, strongest first:
 *   1. clues still in the slot's deck that were NOT served in recent games,
 *   2. clues still in the deck but served recently,
 *   3. any unused clue as a last resort.
 * This means a full pool cycles once before anything repeats, and even after a
 * cycle we prefer whatever hasn't been seen in the last several games.
 */
function drawQuestion<T>(
  items: T[],
  keyFor: (item: T) => string,
  slot: string,
  currentDeck: string[],
  avoidKeys: Set<string>,
  recentKeys: Set<string>,
): QuestionDraw<T> {
  if (items.length === 0) {
    throw new Error(`No questions available for slot "${slot}".`);
  }

  const keysByItem = new Map(items.map((item) => [keyFor(item), item]));
  const allKeys = [...keysByItem.keys()];

  let deck = currentDeck.filter((key) => keysByItem.has(key));
  if (deck.length === 0) deck = [...allKeys];

  const eligible = deck.filter((key) => !avoidKeys.has(key));
  const fresh = shuffle(eligible.filter((key) => !recentKeys.has(key)));
  const stale = shuffle(eligible.filter((key) => recentKeys.has(key)));

  let pickedKey = fresh[0] ?? stale[0];

  if (!pickedKey) {
    // The deck only holds clues already used on this board — fall back to any
    // unused clue, still preferring ones not seen in recent games.
    const fallback = allKeys.filter((key) => !avoidKeys.has(key));
    const freshFallback = shuffle(fallback.filter((key) => !recentKeys.has(key)));
    pickedKey = freshFallback[0] ?? shuffle(fallback)[0];
  }

  if (!pickedKey) {
    throw new Error(`No unused questions available for slot "${slot}".`);
  }

  const picked = keysByItem.get(pickedKey);
  if (!picked) {
    throw new Error(`Question "${pickedKey}" missing from slot "${slot}".`);
  }
  return { picked, pickedKey };
}

/** Remove a drawn clue from a slot's persisted deck, resetting when exhausted. */
function advanceQuestionDeck(slot: string, allKeys: string[], drawnKey: string) {
  let deck = loadQuestionDeck(slot).filter((key) => allKeys.includes(key));
  if (deck.length === 0) deck = [...allKeys];
  saveQuestionDeck(
    slot,
    deck.filter((key) => key !== drawnKey),
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
  allowedTopicIds: string[] | null = null,
): PreviewTopicsResult {
  const blocked = new Set(blacklistedTopicIds);
  const excluded = new Set(excludeTopicIds);
  const allowed = allowedTopicIds ? new Set(allowedTopicIds) : null;
  const pool = allowed
    ? JEOPARDY_TOPICS.filter((topic) => allowed.has(topic.id))
    : JEOPARDY_TOPICS;
  let eligible = pool.filter((topic) => !blocked.has(topic.id));
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
    eligibleCount: pool.filter((topic) => !blocked.has(topic.id)).length,
  };
}

export function getAllTopicSummaries(): BoardColumn[] {
  return JEOPARDY_TOPICS.map((topic) => ({ id: topic.id, name: topic.name }));
}

/** Topic summaries limited to a theme bundle (or all topics when null). */
export function getTopicSummariesForTheme(themeId: string | null): BoardColumn[] {
  const theme = getThemeBundle(themeId);
  const allowed = theme ? new Set(theme.topicIds) : null;
  return JEOPARDY_TOPICS.filter((topic) => !allowed || allowed.has(topic.id)).map(
    (topic) => ({ id: topic.id, name: topic.name }),
  );
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
 * Draft a board from preview topics without committing anything to storage.
 *
 * Column order matches the given `topicIds` (which are already shuffled during
 * the preview step), one clue is drawn per difficulty per topic, and
 * double-trouble tiles are flagged. Because it never writes to storage, this
 * can be called as many times as the host likes to reshuffle the question set
 * before the game starts — the pool is only consumed at {@link commitBoardDraw}.
 */
export function draftBoardFromTopics(
  topicIds: string[],
  difficulties: Difficulty[] = DIFFICULTIES,
  doubleCount: number = DOUBLE_TROUBLE_COUNT,
): BuiltBoard {
  const topics = topicIds
    .map((id) => JEOPARDY_TOPICS.find((topic) => topic.id === id))
    .filter((topic): topic is TopicData => topic !== undefined);

  if (topics.length === 0) {
    throw new Error('Cannot build a board without topics.');
  }

  const recentKeys = new Set(loadRecentKeys(RECENT_QUESTIONS_KEY));
  const usedQuestionKeys = new Set<string>();

  const columns: BoardColumn[] = topics.map((topic) => ({
    id: topic.id,
    name: topic.name,
  }));
  const cells: BoardCell[] = [];

  topics.forEach((topic, columnIndex) => {
    const topicAnswers = topic.questions.map((question) => question.answer);

    difficulties.forEach((difficulty) => {
      const candidates = topic.questions.filter(
        (question) => question.difficulty === difficulty,
      );
      const slot = slotKey(topic.id, difficulty);
      const { picked, pickedKey } = drawQuestion(
        candidates,
        (question) => questionKey(topic.id, difficulty, question.question),
        slot,
        loadQuestionDeck(slot),
        usedQuestionKeys,
        recentKeys,
      );
      usedQuestionKeys.add(pickedKey);

      const choiceCount = topic.id === 'riddles' ? 3 : 4;
      const sameDiff = candidates.map((question) => question.answer);
      const pool = sameDiff.length >= choiceCount ? sameDiff : topicAnswers;

      cells.push({
        id: `${columnIndex}-${difficulty}`,
        columnIndex,
        difficulty,
        value: DIFFICULTY_VALUES[difficulty],
        question: picked.question,
        answer: picked.answer,
        choices: buildChoices(picked.answer, picked.choices, pool, choiceCount),
        isDouble: false,
        used: false,
      });
    });
  });

  const doubleIds = new Set(
    shuffleDeep(cells.map((cell) => cell.id)).slice(0, Math.max(0, doubleCount)),
  );
  for (const cell of cells) {
    if (doubleIds.has(cell.id)) cell.isDouble = true;
  }

  return { columns, cells };
}

/**
 * Draw a single hard clue for Final Jeopardy from a topic not already on the
 * board (falling back to any topic). Uses the highest difficulty available.
 */
export function drawFinalClue(
  boardTopicIds: string[],
  allowedTopicIds: string[] | null = null,
): FinalClue {
  const onBoard = new Set(boardTopicIds);
  const allowed = allowedTopicIds ? new Set(allowedTopicIds) : null;
  const pool = JEOPARDY_TOPICS.filter((topic) => !allowed || allowed.has(topic.id));
  const offBoard = pool.filter((topic) => !onBoard.has(topic.id));
  const candidates = offBoard.length > 0 ? offBoard : pool;
  const topic = shuffle(candidates)[0];

  const hardest = topic.questions.filter((q) => q.difficulty === 5);
  const questions = hardest.length > 0 ? hardest : topic.questions;
  const picked = shuffle(questions)[0];

  return {
    topicName: topic.name,
    question: picked.question,
    answer: picked.answer,
  };
}

/** Largest legal Final Jeopardy wager for a score (min 0). */
export function maxFinalWager(score: number): number {
  return Math.max(0, score);
}

/**
 * Largest legal Daily Double wager: the greater of the player's score or the
 * top clue value on the board, so a trailing player can still bet meaningfully.
 */
export function maxDailyDoubleWager(score: number, boardMax = 1000): number {
  return Math.max(score, boardMax);
}

/**
 * Persist the bookkeeping for a board the players committed to: advance each
 * slot's deck so its clue won't recur until the pool cycles, and record the
 * served clues + topics so future drafts steer away from them.
 */
export function commitBoardDraw(columns: BoardColumn[], cells: BoardCell[]): void {
  const drawnQuestionKeys: string[] = [];

  for (const cell of cells) {
    const topicId = columns[cell.columnIndex]?.id;
    if (!topicId) continue;
    const topic = JEOPARDY_TOPICS.find((entry) => entry.id === topicId);
    if (!topic) continue;

    const drawnKey = questionKey(topicId, cell.difficulty, cell.question);
    drawnQuestionKeys.push(drawnKey);

    const allKeys = topic.questions
      .filter((question) => question.difficulty === cell.difficulty)
      .map((question) => questionKey(topicId, cell.difficulty, question.question));
    advanceQuestionDeck(slotKey(topicId, cell.difficulty), allKeys, drawnKey);
  }

  saveRecentKeys(
    RECENT_QUESTIONS_KEY,
    [...loadRecentKeys(RECENT_QUESTIONS_KEY), ...drawnQuestionKeys],
    MAX_RECENT_QUESTIONS,
  );
  saveRecentKeys(
    RECENT_TOPICS_KEY,
    [...loadRecentKeys(RECENT_TOPICS_KEY), ...columns.map((column) => column.id)],
    MAX_RECENT_TOPICS,
  );
}

function boardQuestionKeys(columns: BoardColumn[], cells: BoardCell[]): Set<string> {
  const keys = new Set<string>();
  for (const cell of cells) {
    const topicId = columns[cell.columnIndex]?.id;
    if (!topicId) continue;
    keys.add(makeQuestionKey(topicId, cell.difficulty, cell.question));
  }
  return keys;
}

/** True when this clue was served in a session before the current board was built. */
export function isPreviouslySeenQuestion(
  columns: BoardColumn[],
  cell: BoardCell,
  priorRecentQuestionKeys: string[],
  history: AnswerRecord[],
): boolean {
  const topicId = columns[cell.columnIndex]?.id;
  if (!topicId) return false;
  const key = makeQuestionKey(topicId, cell.difficulty, cell.question);
  if (priorRecentQuestionKeys.includes(key)) return true;
  return history.some(
    (record) => record.question === cell.question && record.cellId !== cell.id,
  );
}

export interface RerollCellResult {
  cell: BoardCell;
  pickedKey: string;
}

/** Draw a replacement clue for one board tile, avoiding other tiles and reroll tries. */
export function rerollCellQuestion(
  columns: BoardColumn[],
  cells: BoardCell[],
  cellId: string,
  extraAvoidKeys: string[] = [],
): RerollCellResult | null {
  const cell = cells.find((c) => c.id === cellId);
  if (!cell) return null;

  const topicId = columns[cell.columnIndex]?.id;
  if (!topicId) return null;

  const topic = JEOPARDY_TOPICS.find((entry) => entry.id === topicId);
  if (!topic) return null;

  const avoidKeys = new Set(boardQuestionKeys(columns, cells));
  for (const key of extraAvoidKeys) avoidKeys.add(key);

  const recentKeys = new Set(loadRecentQuestionKeys());
  const candidates = topic.questions.filter(
    (question) => question.difficulty === cell.difficulty,
  );
  const slot = slotKey(topicId, cell.difficulty);
  const currentKey = makeQuestionKey(topicId, cell.difficulty, cell.question);
  avoidKeys.add(currentKey);

  try {
    const { picked, pickedKey } = drawQuestion(
      candidates,
      (question) => makeQuestionKey(topicId, cell.difficulty, question.question),
      slot,
      loadQuestionDeck(slot),
      avoidKeys,
      recentKeys,
    );
    if (pickedKey === currentKey) return null;

    const choiceCount = topic.id === 'riddles' ? 3 : 4;
    const topicAnswers = topic.questions.map((question) => question.answer);
    const sameDiff = candidates.map((question) => question.answer);
    const pool = sameDiff.length >= choiceCount ? sameDiff : topicAnswers;

    return {
      cell: {
        ...cell,
        question: picked.question,
        answer: picked.answer,
        choices: buildChoices(picked.answer, picked.choices, pool, choiceCount),
      },
      pickedKey,
    };
  } catch {
    return null;
  }
}

/** Persist deck + recent history for a clue swapped in via in-game reroll. */
export function commitRerolledQuestion(
  columns: BoardColumn[],
  cell: BoardCell,
  pickedKey: string,
): void {
  const topicId = columns[cell.columnIndex]?.id;
  if (!topicId) return;
  const topic = JEOPARDY_TOPICS.find((entry) => entry.id === topicId);
  if (!topic) return;

  const allKeys = topic.questions
    .filter((question) => question.difficulty === cell.difficulty)
    .map((question) => makeQuestionKey(topicId, cell.difficulty, question.question));
  advanceQuestionDeck(slotKey(topicId, cell.difficulty), allKeys, pickedKey);
  saveRecentKeys(
    RECENT_QUESTIONS_KEY,
    [...loadRecentQuestionKeys(), pickedKey],
    MAX_RECENT_QUESTIONS,
  );
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

/* ------------------------------------------------------------------ *
 * Sound — tiny WebAudio synth so we ship cues without any asset files.
 * ------------------------------------------------------------------ */

export type SoundName = 'select' | 'reveal' | 'correct' | 'wrong' | 'double' | 'final' | 'tick';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    }
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

function tone(
  ctx: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.14,
) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  env.gain.setValueAtTime(0, start);
  env.gain.linearRampToValueAtTime(gain, start + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(env).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** Play a short synthesized cue. No-op when sound is disabled or unsupported. */
export function playSound(name: SoundName, enabled = true): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime;

  switch (name) {
    case 'select':
      tone(ctx, 520, t, 0.12, 'triangle', 0.1);
      break;
    case 'reveal':
      tone(ctx, 300, t, 0.18, 'sine', 0.12);
      tone(ctx, 450, t + 0.06, 0.18, 'sine', 0.1);
      break;
    case 'correct':
      tone(ctx, 523.25, t, 0.14, 'triangle');
      tone(ctx, 659.25, t + 0.1, 0.14, 'triangle');
      tone(ctx, 783.99, t + 0.2, 0.22, 'triangle');
      break;
    case 'wrong':
      tone(ctx, 220, t, 0.22, 'sawtooth', 0.09);
      tone(ctx, 164.81, t + 0.12, 0.3, 'sawtooth', 0.09);
      break;
    case 'double':
      tone(ctx, 392, t, 0.1, 'square', 0.09);
      tone(ctx, 587.33, t + 0.09, 0.1, 'square', 0.09);
      tone(ctx, 880, t + 0.18, 0.18, 'square', 0.1);
      break;
    case 'final':
      tone(ctx, 440, t, 0.5, 'sine', 0.12);
      tone(ctx, 554.37, t, 0.5, 'sine', 0.08);
      tone(ctx, 659.25, t + 0.25, 0.5, 'sine', 0.08);
      break;
    case 'tick':
      tone(ctx, 900, t, 0.05, 'square', 0.05);
      break;
  }
}
