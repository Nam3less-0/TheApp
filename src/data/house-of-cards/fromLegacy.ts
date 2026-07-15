import { createTopic } from './createTopic';
import type { LegacyTopic } from './legacy';
import type { Topic } from './types';

type RankInput = Parameters<typeof createTopic>[2][number];

function legacySet(legacy: LegacyTopic, variantIndex: number): RankInput {
  const ranks: RankInput = {};
  for (let rank = 1; rank <= 13; rank += 1) {
    const options = legacy.difficulties[rank];
    const option = options?.[variantIndex];
    if (!option) {
      throw new Error(
        `[${legacy.id}] legacy rank ${rank} is missing variant index ${variantIndex}.`,
      );
    }
    ranks[rank] = { question: option.question, answer: option.answer };
  }
  return ranks;
}

/** Convert a legacy 3-variant topic plus two extra sets into a 5-set topic. */
export function topicFromLegacy(
  legacy: LegacyTopic,
  extraSets: [RankInput, RankInput],
): Topic {
  return createTopic(legacy.id, legacy.name, [
    legacySet(legacy, 0),
    legacySet(legacy, 1),
    legacySet(legacy, 2),
    extraSets[0],
    extraSets[1],
  ]);
}
