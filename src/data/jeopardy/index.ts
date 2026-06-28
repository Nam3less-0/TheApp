import type { TopicData } from './types';
import history from './topics/history';
import science from './topics/science';
import geography from './topics/geography';
import music from './topics/music';
import sports from './topics/sports';
import popCulture from './topics/pop-culture';
import moviesTv from './topics/movies-tv';
import food from './topics/food';
import literature from './topics/literature';
import art from './topics/art';
import technology from './topics/technology';
import space from './topics/space';
import computing from './topics/computing';
import videoGames from './topics/video-games';
import superheroes from './topics/superheroes';
import marvel from './topics/marvel';
import mythology from './topics/mythology';
import animals from './topics/animals';
import anime from './topics/anime';
import disney from './topics/disney';
import boardGames from './topics/board-games';
import digitalCreatures from './topics/digital-creatures';
import neonOpenWorlds from './topics/neon-open-worlds';
import opulenceOddities from './topics/opulence-oddities';
import supesSatire from './topics/supes-satire';

/** 25 topics × 50 questions (10 per difficulty) = 1,250 total clues. */
export const JEOPARDY_TOPICS: TopicData[] = [
  history,
  science,
  geography,
  music,
  sports,
  popCulture,
  moviesTv,
  food,
  literature,
  art,
  technology,
  space,
  computing,
  videoGames,
  superheroes,
  marvel,
  mythology,
  animals,
  anime,
  disney,
  boardGames,
  digitalCreatures,
  neonOpenWorlds,
  opulenceOddities,
  supesSatire,
];

export type { Difficulty, RawQuestion, TopicData } from './types';
