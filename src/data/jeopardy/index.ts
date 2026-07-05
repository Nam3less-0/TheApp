import type { TopicData } from './types';
import history from './topics/history';
import modernHistory from './topics/modern-history';
import science from './topics/science';
import physics from './topics/physics';
import math from './topics/math';
import fieldsOfStudy from './topics/fields-of-study';
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
import drugs from './topics/drugs';
import boardGames from './topics/board-games';
import digitalCreatures from './topics/digital-creatures';
import neonOpenWorlds from './topics/neon-open-worlds';
import opulenceOddities from './topics/opulence-oddities';
import supesSatire from './topics/supes-satire';
import riddles from './topics/riddles';
import finishTheQuote from './topics/finish-the-quote';
import phobias from './topics/phobias';
import gamingHistory from './topics/gaming-history';
import planetEarth from './topics/planet-earth';
import brands from './topics/brands';
import recordBreakers from './topics/record-breakers';
import freakOfNature from './topics/freak-of-nature';
import favouritePick from './topics/favourite-pick';
import crime from './topics/crime';
import capitalCities from './topics/capital-cities';
import landmarks from './topics/landmarks';
import medicine from './topics/medicine';
import inventions from './topics/inventions';
import worldReligions from './topics/world-religions';
import transport from './topics/transport';
import languages from './topics/languages';
import exploration from './topics/exploration';
import worldLeaders from './topics/world-leaders';
import traditions from './topics/traditions';

/** 50 topics × 100 questions (20 per difficulty) = 5,000 total clues. */
export const JEOPARDY_TOPICS: TopicData[] = [
  history,
  modernHistory,
  science,
  physics,
  math,
  fieldsOfStudy,
  geography,
  capitalCities,
  landmarks,
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
  drugs,
  boardGames,
  digitalCreatures,
  neonOpenWorlds,
  opulenceOddities,
  supesSatire,
  riddles,
  finishTheQuote,
  phobias,
  gamingHistory,
  planetEarth,
  brands,
  recordBreakers,
  freakOfNature,
  favouritePick,
  crime,
  medicine,
  inventions,
  worldReligions,
  transport,
  languages,
  exploration,
  worldLeaders,
  traditions,
];

export type { Difficulty, RawQuestion, TopicData } from './types';
