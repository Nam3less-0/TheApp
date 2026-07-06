import type { CardState, Suit, SuitTopic, Topic } from './types';

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

/** A topic is eligible only if all 13 rank buckets exist and each has ≥1 option. */
export function isTopicPlayable(topic: Topic): boolean {
  for (let rank = 1; rank <= 13; rank += 1) {
    const bucket = topic.difficulties[rank];
    if (!bucket || bucket.length === 0) return false;
  }
  return true;
}

export interface BuiltDeck {
  deck: CardState[];
  suitTopicMap: Record<Suit, SuitTopic>;
}

/**
 * Build a fresh 52-card deck:
 *   1. Filter to fully-populated topics (guards against stub topics).
 *   2. Shuffle and take 4 distinct topics.
 *   3. Assign them to a shuffled suit order.
 *   4. For each suit/rank, randomly pick one question option from that bucket.
 * Fully random per session — no seeding.
 */
export function buildDeck(topicPool: Topic[]): BuiltDeck {
  const eligible = topicPool.filter(isTopicPlayable);
  if (eligible.length < 4) {
    throw new Error(
      `House of Cards needs at least 4 fully-populated topics; found ${eligible.length}.`,
    );
  }

  const chosenTopics = shuffle(eligible).slice(0, 4);
  const shuffledSuits = shuffle(SUITS);

  const suitTopicMap = {} as Record<Suit, SuitTopic>;
  const deck: CardState[] = [];

  shuffledSuits.forEach((suit, suitIndex) => {
    const topic = chosenTopics[suitIndex];
    suitTopicMap[suit] = { id: topic.id, name: topic.name };

    for (let value = 1; value <= 13; value += 1) {
      const options = topic.difficulties[value];
      const option = options[Math.floor(Math.random() * options.length)];
      deck.push({
        suit,
        rank: rankLabel(value),
        value,
        topicId: topic.id,
        topicName: topic.name,
        question: option.question,
        answer: option.answer,
        used: false,
        result: null,
      });
    }
  });

  return { deck, suitTopicMap };
}
