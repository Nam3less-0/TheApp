import { EXTRA_SETS } from '../extraSets';
import { topicFromLegacy } from '../fromLegacy';
import { LEGACY_TOPIC_POOL } from '../legacyPool';
import type { Topic } from '../types';
import boardGames from './board-games';
import brands from './brands';
import buildings from './buildings';
import childhood from './childhood';
import cities from './cities';
import computing from './computing';
import crime from './crime';
import disney from './disney';
import exploration from './exploration';
import famousPeople from './famous-people';
import fashion from './fashion';
import health from './health';
import holidays from './holidays';
import humanBody from './human-body';
import inventions from './inventions';
import jobs from './jobs';
import languages from './languages';
import law from './law';
import marvel from './marvel';
import media from './media';
import medicine from './medicine';
import military from './military';
import money from './money';
import nature from './nature';
import politics from './politics';
import popCulture from './pop-culture';
import school from './school';
import superheroes from './superheroes';
import transport from './transport';
import travel from './travel';
import weather from './weather';
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
  nature,
  travel,
  politics,
  medicine,
  military,
  famousPeople,
  brands,
  transport,
  humanBody,
  cities,
  law,
  school,
  holidays,
  jobs,
  money,
  buildings,
  exploration,
  childhood,
  health,
  media,
  fashion,
  crime,
  weather,
  languages,
];

/** 48 topics × 5 Ace–King sets = 240 complete question lines. */
export const TOPIC_POOL: Topic[] = [...legacyTopics, ...newTopics];
