import { pickNextSetIndex, markSetPlayed } from './setProgress';
import type { CardState, Suit, SuitTopic, Topic } from './types';
import { RANK_COUNT } from './types';

export const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];

export interface SuitMeta {
  symbol: string;
  label: string;
  /** True for hearts/diamonds — rendered in crimson; false suits render in bone. */
  isRed: boolean;
}

export const SUIT_META: Record<Suit, SuitMeta> = {
  spades: { symbol: '\u2660', label: 'Spades', isRed: false },
  hearts: { symbol: '\u2665', label: 'Hearts', isRed: true },
  diamonds: { symbol: '\u2666', label: 'Diamonds', isRed: true },
  clubs: { symbol: '\u2663', label: 'Clubs', isRed: false },
};

/** Display label for a rank value (Ace=1 … King=13). */
export function rankLabel(value: number): string {
  if (value === 1) return 'A';
  if (value === 11) return 'J';
  if (value === 12) return 'Q';
  if (value === 13) return 'K';
  return String(value);
}

/** In-place Fisher–Yates shuffle on a copy of the input array. */
function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** A topic is eligible when all five Ace–King sets are fully populated. */
export function isTopicPlayable(topic: Topic): boolean {
  if (topic.sets.length !== 5) return false;
  for (const set of topic.sets) {
    for (let rank = 1; rank <= RANK_COUNT; rank += 1) {
      const option = set.ranks[rank];
      if (!option?.question || !option?.answer) return false;
    }
  }
  return true;
}

export interface BuiltDeck {
  deck: CardState[];
  suitTopicMap: Record<Suit, SuitTopic>;
  /** Set assignments to persist when the host confirms categories. */
  setCommits: Array<{ topicId: string; setIndex: number }>;
}

export interface LockedSuitAssignment {
  topicId: string;
  setIndex: number;
}

export interface DraftDeckOptions {
  /** Preserve these suit assignments; only open suits are redrawn. */
  locked?: Partial<Record<Suit, LockedSuitAssignment>>;
  /** Prefer topics not in this list when filling open suits (falls back if pool is too small). */
  excludeTopicIds?: string[];
}

function buildSuitCards(
  suit: Suit,
  topic: Topic,
  setIndex: number,
): { cards: CardState[]; suitTopic: SuitTopic; commit: LockedSuitAssignment } {
  const questionSet = topic.sets[setIndex];
  const cards: CardState[] = [];

  for (let value = 1; value <= RANK_COUNT; value += 1) {
    const option = questionSet.ranks[value];
    cards.push({
      suit,
      rank: rankLabel(value),
      value,
      topicId: topic.id,
      topicName: topic.name,
      setLabel: questionSet.label,
      question: option.question,
      answer: option.answer,
      used: false,
      result: null,
    });
  }

  return {
    cards,
    suitTopic: { id: topic.id, name: topic.name, setLabel: questionSet.label },
    commit: { topicId: topic.id, setIndex },
  };
}

/**
 * Draft a 52-card deck without committing question-set progress.
 * Call commitDeckDraft() once the host confirms the categories.
 */
export function draftDeck(topicPool: Topic[], options?: DraftDeckOptions): BuiltDeck {
  const eligible = topicPool.filter(isTopicPlayable);
  if (eligible.length < 4) {
    throw new Error(
      `House of Cards needs at least 4 fully-populated topics; found ${eligible.length}.`,
    );
  }

  const topicById = new Map(eligible.map((topic) => [topic.id, topic]));
  const locked = options?.locked ?? {};
  const openSuits = SUITS.filter((suit) => !locked[suit]);

  const reservedTopicIds = new Set(
    SUITS.filter((suit) => locked[suit]).map((suit) => locked[suit]!.topicId),
  );

  let pool = eligible.filter((topic) => !reservedTopicIds.has(topic.id));
  const exclude = new Set(options?.excludeTopicIds ?? []);
  const preferred = pool.filter((topic) => !exclude.has(topic.id));
  if (preferred.length >= openSuits.length) pool = preferred;
  if (pool.length < openSuits.length) {
    pool = eligible.filter((topic) => !reservedTopicIds.has(topic.id));
  }

  const chosenTopics = shuffle(pool).slice(0, openSuits.length);

  const suitTopicMap = {} as Record<Suit, SuitTopic>;
  const deck: CardState[] = [];
  const setCommits: BuiltDeck['setCommits'] = [];
  let nextTopicIndex = 0;

  for (const suit of SUITS) {
    const pin = locked[suit];
    let topic: Topic | undefined;
    let setIndex: number;

    if (pin) {
      topic = topicById.get(pin.topicId);
      if (!topic) {
        throw new Error(`Locked topic "${pin.topicId}" is not in the topic pool.`);
      }
      setIndex = pin.setIndex;
    } else {
      topic = chosenTopics[nextTopicIndex];
      nextTopicIndex += 1;
      if (!topic) {
        throw new Error('Not enough topics available to fill open suits.');
      }
      setIndex = pickNextSetIndex(topic.id);
    }

    const built = buildSuitCards(suit, topic, setIndex);
    suitTopicMap[suit] = built.suitTopic;
    setCommits.push(built.commit);
    deck.push(...built.cards);
  }

  return { deck, suitTopicMap, setCommits };
}

/** Persist question-set progress after the host locks in categories. */
export function commitDeckDraft(setCommits: BuiltDeck['setCommits']): void {
  for (const { topicId, setIndex } of setCommits) {
    markSetPlayed(topicId, setIndex);
  }
}

/** @deprecated Use draftDeck + commitDeckDraft for preview/confirm flow. */
export function buildDeck(topicPool: Topic[]): BuiltDeck {
  const draft = draftDeck(topicPool);
  commitDeckDraft(draft.setCommits);
  return draft;
}
