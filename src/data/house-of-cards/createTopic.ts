import {
  RANK_COUNT,
  SET_COUNT,
  SET_LABELS,
  type QuestionOption,
  type QuestionSet,
  type RankBucket,
  type Topic,
} from './types';

type RankInput = Record<number, Omit<QuestionOption, 'id'> | Omit<QuestionOption, 'id'>[]>;

function normalizeRank(
  topicId: string,
  setIndex: number,
  rank: number,
  input: Omit<QuestionOption, 'id'> | Omit<QuestionOption, 'id'>[],
): QuestionOption {
  const option = Array.isArray(input) ? input[0] : input;
  if (!option?.question?.trim() || !option?.answer?.trim()) {
    throw new Error(
      `[${topicId}] set ${setIndex + 1} rank ${rank}: question and answer are required.`,
    );
  }
  return {
    id: `${topicId}-s${setIndex + 1}-r${rank}`,
    question: option.question.trim(),
    answer: option.answer.trim(),
  };
}

function buildSet(topicId: string, setIndex: number, ranks: RankInput): QuestionSet {
  const bucket: RankBucket = {};
  for (let rank = 1; rank <= RANK_COUNT; rank += 1) {
    const input = ranks[rank];
    if (!input) {
      throw new Error(`[${topicId}] set ${setIndex + 1} is missing rank ${rank}.`);
    }
    bucket[rank] = normalizeRank(topicId, setIndex, rank, input);
  }
  return { label: SET_LABELS[setIndex], ranks: bucket };
}

/**
 * Build a House of Cards topic with exactly five Ace–King question sets.
 * Each set must define one question per rank (1 = Ace … 13 = King).
 */
export function createTopic(
  id: string,
  name: string,
  sets: RankInput[],
): Topic {
  if (sets.length !== SET_COUNT) {
    throw new Error(
      `[${id}] expected ${SET_COUNT} question sets, received ${sets.length}.`,
    );
  }

  const builtSets = sets.map((ranks, index) => buildSet(id, index, ranks));

  const seenIds = new Set<string>();
  for (const set of builtSets) {
    for (const option of Object.values(set.ranks)) {
      if (seenIds.has(option.id)) {
        throw new Error(`[${id}] duplicate question id "${option.id}".`);
      }
      seenIds.add(option.id);
    }
  }

  return { id, name, sets: builtSets };
}
