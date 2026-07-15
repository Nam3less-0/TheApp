import type { QuestionOption } from './types';

/** Legacy shape: 13 rank buckets, each with multiple question variants. */
export interface LegacyTopic {
  id: string;
  name: string;
  difficulties: Record<number, QuestionOption[]>;
}

export { LEGACY_TOPIC_POOL } from './legacyPool';
