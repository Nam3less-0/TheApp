import type { TopicData } from './types';
import history from './topics/history';
import modernHistory from './topics/modern-history';
import science from './topics/science';
import randomScienceTrivia from './topics/random-science-trivia';
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
import softwareEngineering from './topics/software-engineering';
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
import luxuryWatches from './topics/luxury-watches';
import cardGames from './topics/card-games';
import favouriteAnime from './topics/favourite-anime';
import favouriteSports from './topics/favourite-sports';
import allTimeSports from './topics/all-time-sports';
import favouriteBoardGames from './topics/favourite-board-games';
import modernDisney from './topics/modern-disney';
import supesSatire from './topics/supes-satire';
import cartoonClassics from './topics/cartoon-classics';
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
import citiesLandmarks from './topics/cities-landmarks';
import medicine from './topics/medicine';
import inventions from './topics/inventions';
import worldReligions from './topics/world-religions';
import transport from './topics/transport';
import languages from './topics/languages';
import exploration from './topics/exploration';
import worldLeaders from './topics/world-leaders';
import traditions from './topics/traditions';

/** 60 topics × 100 questions (20 per difficulty) = 6,000 total clues. */
export const JEOPARDY_TOPICS: TopicData[] = [
  history,
  modernHistory,
  science,
  randomScienceTrivia,
  physics,
  math,
  fieldsOfStudy,
  geography,
  capitalCities,
  landmarks,
  citiesLandmarks,
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
  softwareEngineering,
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
  luxuryWatches,
  cardGames,
  favouriteAnime,
  favouriteSports,
  allTimeSports,
  favouriteBoardGames,
  modernDisney,
  supesSatire,
  cartoonClassics,
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
