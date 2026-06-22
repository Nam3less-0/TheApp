/**
 * Category loader — each JSON file under this folder is one ranked list (100 items).
 * Regenerate with: node scripts/generate-categories.mjs
 */
import type { Category } from '../../games/top100/types';
import animeData from './most-popular-anime.json';
import gamesData from './best-selling-video-games.json';
import songsData from './most-streamed-songs.json';
import filmsData from './highest-grossing-films.json';
import tvShowsData from './most-popular-tv-shows.json';
import artistsData from './highest-grossing-artists.json';
import citiesData from './most-populous-cities.json';
import pokemonData from './most-popular-pokemon.json';
import landmarksData from './most-famous-landmarks.json';
import superheroesData from './most-popular-superheroes.json';
import booksData from './best-selling-books.json';
import foodBrandsData from './iconic-food-brands.json';
import athletesData from './greatest-athletes.json';
import boardGamesData from './most-popular-board-games.json';
import carBrandsData from './famous-car-brands.json';
import paintingsData from './most-famous-paintings.json';
import dogBreedsData from './most-popular-dog-breeds.json';
import historicalFiguresData from './famous-historical-figures.json';
import fastFoodData from './most-popular-fast-food.json';
import movieFranchisesData from './famous-movie-franchises.json';
import countriesData from './most-populous-countries.json';
import fashionBrandsData from './famous-fashion-brands.json';
import catBreedsData from './most-popular-cat-breeds.json';
import gameCharactersData from './iconic-video-game-characters.json';
import composersData from './famous-classical-composers.json';
import kpopGroupsData from './most-popular-k-pop-groups.json';
import inventionsData from './famous-inventions.json';
import footballClubsData from './most-popular-football-clubs.json';
import mythologyData from './famous-mythological-figures.json';
import candySnacksData from './most-popular-candy-snacks.json';
import skyscrapersData from './famous-skyscrapers.json';
import youtubersData from './most-popular-youtubers.json';
import scientistsData from './famous-scientists.json';
import themeParksData from './most-popular-theme-parks.json';
import disneyCharactersData from './famous-disney-characters.json';
import naturalWondersData from './famous-natural-wonders.json';
import mobileAppsData from './most-popular-mobile-apps.json';
import philosophersData from './famous-philosophers.json';
import cocktailsData from './most-popular-cocktails.json';
import spaceMissionsData from './famous-space-missions.json';
import iconic2000sTvData from './iconic-2000s-2010s-tv.json';
import viralMemesData from './viral-internet-memes.json';
import childhoodCartoonsData from './beloved-childhood-cartoons.json';
import iconicSneakersData from './iconic-sneakers.json';
import realityTvData from './famous-reality-tv.json';
import viralAnimeData from './anime-that-went-viral.json';
import esportsData from './popular-esports-games.json';
import tiktokTrendsData from './viral-tiktok-trends.json';
import romComsData from './iconic-rom-coms.json';
import cultClassicsData from './cult-classic-movies.json';
import marvelHeroesData from './most-iconic-marvel-heroes.json';
import dcHeroesData from './most-iconic-dc-heroes.json';
import marvelVillainsData from './greatest-marvel-villains.json';
import dcVillainsData from './greatest-dc-villains.json';
import superheroTeamsData from './iconic-superhero-teams.json';
import xMenData from './famous-x-men-characters.json';
import comicStorylinesData from './famous-comic-storylines.json';
import comicArtifactsData from './iconic-comic-artifacts.json';
import comicCreatorsData from './famous-comic-creators.json';
import comicLocationsData from './iconic-comic-locations.json';

const categories: Category[] = [
  animeData,
  gamesData,
  songsData,
  filmsData,
  tvShowsData,
  artistsData,
  citiesData,
  pokemonData,
  landmarksData,
  superheroesData,
  booksData,
  foodBrandsData,
  athletesData,
  boardGamesData,
  carBrandsData,
  paintingsData,
  dogBreedsData,
  historicalFiguresData,
  fastFoodData,
  movieFranchisesData,
  countriesData,
  fashionBrandsData,
  catBreedsData,
  gameCharactersData,
  composersData,
  kpopGroupsData,
  inventionsData,
  footballClubsData,
  mythologyData,
  candySnacksData,
  skyscrapersData,
  youtubersData,
  scientistsData,
  themeParksData,
  disneyCharactersData,
  naturalWondersData,
  mobileAppsData,
  philosophersData,
  cocktailsData,
  spaceMissionsData,
  iconic2000sTvData,
  viralMemesData,
  childhoodCartoonsData,
  iconicSneakersData,
  realityTvData,
  viralAnimeData,
  esportsData,
  tiktokTrendsData,
  romComsData,
  cultClassicsData,
  marvelHeroesData,
  dcHeroesData,
  marvelVillainsData,
  dcVillainsData,
  superheroTeamsData,
  xMenData,
  comicStorylinesData,
  comicArtifactsData,
  comicCreatorsData,
  comicLocationsData,
] as Category[];

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getAvailableCategories(usedIds: string[]): Category[] {
  return categories.filter((c) => !usedIds.includes(c.id));
}
