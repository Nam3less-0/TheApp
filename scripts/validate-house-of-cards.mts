/**
 * Validates every House of Cards topic has five complete Ace–King sets.
 * Run: npx tsx scripts/validate-house-of-cards.mts
 */
import { TOPIC_POOL } from '../src/data/house-of-cards';
import { isTopicPlayable } from '../src/games/house-of-cards/deck';
import { RANK_COUNT, SET_COUNT } from '../src/data/house-of-cards/types';

let errors = 0;

for (const topic of TOPIC_POOL) {
  if (!isTopicPlayable(topic)) {
    console.error(`FAIL: ${topic.id} is not fully playable`);
    errors += 1;
    continue;
  }
  if (topic.sets.length !== SET_COUNT) {
    console.error(`FAIL: ${topic.id} has ${topic.sets.length} sets (expected ${SET_COUNT})`);
    errors += 1;
  }
  for (const set of topic.sets) {
    for (let rank = 1; rank <= RANK_COUNT; rank += 1) {
      const q = set.ranks[rank];
      if (!q?.question || !q?.answer) {
        console.error(`FAIL: ${topic.id} / ${set.label} / rank ${rank} is incomplete`);
        errors += 1;
      }
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} validation error(s).`);
  process.exit(1);
}

console.log(
  `OK: ${TOPIC_POOL.length} topics, each with ${SET_COUNT} sets × ${RANK_COUNT} ranks.`,
);
