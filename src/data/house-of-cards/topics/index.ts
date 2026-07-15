import { EXTRA_SETS } from '../extraSets';
import { topicFromLegacy } from '../fromLegacy';
import { LEGACY_TOPIC_POOL } from '../legacyPool';
import type { Topic } from '../types';
import boardGames from './board-games';
import computing from './computing';
import disney from './disney';
import inventions from './inventions';
import marvel from './marvel';
import popCulture from './pop-culture';
import superheroes from './superheroes';
import worldReligions from './world-religions';

const legacyTopics: Topic[] = LEGACY_TOPIC_POOL.map((legacy) => {
  const extra = EXTRA_SETS[legacy.id];
  if (!extra) {
    throw new Error(`[${legacy.id}] missing Ten/King extra sets in EXTRA_SETS.`);
  }
  return topicFromLegacy(legacy, extra);
});

const newTopics: Topic[] = [
  popCulture,
  superheroes,
  boardGames,
  worldReligions,
  inventions,
  marvel,
  disney,
  computing,
];

/** 24 topics × 5 Ace–King sets = 120 complete question lines. */
export const TOPIC_POOL: Topic[] = [...legacyTopics, ...newTopics];
