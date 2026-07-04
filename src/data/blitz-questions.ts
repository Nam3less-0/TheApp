export interface BlitzQuestion {
  id: string;
  category: string;
  prompt: string;
  seconds: number;
}

interface CategorySeed {
  id: string;
  /** Plural noun phrase slotted into "Name N ___ in T seconds". */
  label: string;
  variants: { count: number; seconds: number }[];
}

/**
 * Broad → niche category bank. `variants` lets one category spawn multiple
 * distinct prompts (different counts/times) so the pool stays huge without
 * ever repeating the exact same question in a session.
 */
const CATEGORY_SEEDS: CategorySeed[] = [
  // ---- Easy / broad (quick, everyone knows several) ----
  { id: 'animals', label: 'animals', variants: [{ count: 5, seconds: 10 }, { count: 8, seconds: 15 }] },
  { id: 'colors', label: 'colors', variants: [{ count: 5, seconds: 8 }] },
  { id: 'fruits', label: 'fruits', variants: [{ count: 5, seconds: 10 }] },
  { id: 'vegetables', label: 'vegetables', variants: [{ count: 5, seconds: 10 }] },
  { id: 'countries', label: 'countries', variants: [{ count: 5, seconds: 10 }, { count: 8, seconds: 15 }] },
  { id: 'cities', label: 'cities', variants: [{ count: 5, seconds: 10 }] },
  { id: 'movies', label: 'movies', variants: [{ count: 4, seconds: 10 }] },
  { id: 'tv-shows', label: 'TV shows', variants: [{ count: 4, seconds: 10 }] },
  { id: 'sports', label: 'sports', variants: [{ count: 5, seconds: 10 }] },
  { id: 'car-brands', label: 'car brands', variants: [{ count: 5, seconds: 10 }] },
  { id: 'superheroes', label: 'superheroes', variants: [{ count: 5, seconds: 10 }] },
  { id: 'disney-movies', label: 'Disney movies', variants: [{ count: 4, seconds: 10 }] },
  { id: 'fast-food', label: 'fast food chains', variants: [{ count: 5, seconds: 10 }] },
  { id: 'social-apps', label: 'social media apps', variants: [{ count: 5, seconds: 10 }] },
  { id: 'board-games', label: 'board games', variants: [{ count: 4, seconds: 10 }] },
  { id: 'video-games', label: 'video games', variants: [{ count: 4, seconds: 10 }] },
  { id: 'music-genres', label: 'music genres', variants: [{ count: 5, seconds: 10 }] },
  { id: 'dance-moves', label: 'dance moves', variants: [{ count: 3, seconds: 10 }] },
  { id: 'school-subjects', label: 'school subjects', variants: [{ count: 5, seconds: 10 }] },
  { id: 'kitchen-utensils', label: 'kitchen utensils', variants: [{ count: 5, seconds: 10 }] },
  { id: 'fridge-items', label: 'things you\u2019d find in a fridge', variants: [{ count: 5, seconds: 10 }] },
  { id: 'red-things', label: 'things that are red', variants: [{ count: 5, seconds: 10 }] },
  { id: 'round-things', label: 'things that are round', variants: [{ count: 5, seconds: 10 }] },
  { id: 'jobs', label: 'jobs', variants: [{ count: 5, seconds: 10 }] },
  { id: 'shoe-types', label: 'types of shoes', variants: [{ count: 4, seconds: 10 }] },
  { id: 'planets', label: 'planets', variants: [{ count: 4, seconds: 8 }] },
  { id: 'beach-things', label: 'things you\u2019d find at a beach', variants: [{ count: 5, seconds: 10 }] },
  { id: 'pixar-movies', label: 'Pixar movies', variants: [{ count: 4, seconds: 10 }] },
  { id: 'ice-cream-flavors', label: 'ice cream flavors', variants: [{ count: 5, seconds: 10 }] },
  { id: 'pizza-toppings', label: 'pizza toppings', variants: [{ count: 5, seconds: 10 }] },
  { id: 'breakfast-foods', label: 'breakfast foods', variants: [{ count: 5, seconds: 10 }] },
  { id: 'christmas-movies', label: 'Christmas movies', variants: [{ count: 3, seconds: 10 }] },
  { id: 'horror-movies', label: 'horror movies', variants: [{ count: 4, seconds: 10 }] },

  // ---- Medium (need to think a bit) ----
  { id: 'nba-teams', label: 'NBA teams', variants: [{ count: 4, seconds: 12 }, { count: 6, seconds: 18 }] },
  { id: 'epl-clubs', label: 'English Premier League football clubs', variants: [{ count: 4, seconds: 12 }] },
  { id: 'anime', label: 'anime series', variants: [{ count: 3, seconds: 12 }] },
  { id: 'kpop-groups', label: 'K-pop groups', variants: [{ count: 3, seconds: 12 }] },
  { id: 'bond-actors', label: 'actors who\u2019ve played James Bond', variants: [{ count: 3, seconds: 15 }] },
  { id: 'marvel-movies', label: 'Marvel movies', variants: [{ count: 4, seconds: 12 }] },
  { id: 'cocktails', label: 'cocktails', variants: [{ count: 3, seconds: 12 }] },
  { id: 'pasta-types', label: 'types of pasta', variants: [{ count: 3, seconds: 12 }] },
  { id: 'cheese-types', label: 'types of cheese', variants: [{ count: 3, seconds: 12 }] },
  { id: 'chocolate-brands', label: 'chocolate brands', variants: [{ count: 4, seconds: 12 }] },
  { id: 'sneaker-brands', label: 'sneaker brands', variants: [{ count: 4, seconds: 12 }] },
  { id: 'europe-countries', label: 'countries in Europe', variants: [{ count: 4, seconds: 10 }] },
  { id: 'sea-countries', label: 'countries in Southeast Asia', variants: [{ count: 4, seconds: 10 }] },
  { id: 'us-states', label: 'US states', variants: [{ count: 4, seconds: 12 }] },
  { id: 'hawker-food', label: 'Singapore hawker dishes', variants: [{ count: 3, seconds: 12 }] },
  { id: 'tea-types', label: 'types of tea', variants: [{ count: 3, seconds: 12 }] },
  { id: 'coffee-drinks', label: 'coffee drinks', variants: [{ count: 3, seconds: 12 }] },
  { id: 'wine-grapes', label: 'wine grape varieties', variants: [{ count: 3, seconds: 15 }] },
  { id: 'whisky-types', label: 'types of whisky', variants: [{ count: 3, seconds: 15 }] },
  { id: 'programming-languages', label: 'programming languages', variants: [{ count: 4, seconds: 12 }] },
  { id: 'cryptocurrencies', label: 'cryptocurrencies', variants: [{ count: 3, seconds: 12 }] },
  { id: 'japanese-car-brands', label: 'Japanese car brands', variants: [{ count: 3, seconds: 12 }] },
  { id: 'f1-teams', label: 'F1 teams', variants: [{ count: 3, seconds: 12 }] },
  { id: 'boxing-weight-classes', label: 'boxing weight classes', variants: [{ count: 3, seconds: 15 }] },
  { id: 'poker-hands', label: 'poker hand rankings', variants: [{ count: 3, seconds: 15 }] },
  { id: 'grand-slams', label: 'Grand Slam tennis tournaments', variants: [{ count: 3, seconds: 10 }] },
  { id: 'avengers-characters', label: 'Avengers characters', variants: [{ count: 4, seconds: 12 }] },
  { id: 'star-wars-characters', label: 'Star Wars characters', variants: [{ count: 4, seconds: 12 }] },
  { id: 'hp-houses', label: 'Harry Potter houses', variants: [{ count: 4, seconds: 8 }] },
  { id: 'martial-arts', label: 'martial arts styles', variants: [{ count: 3, seconds: 12 }] },
  { id: 'mrt-lines', label: 'Singapore MRT lines', variants: [{ count: 3, seconds: 12 }] },
  { id: 'phone-brands', label: 'smartphone brands', variants: [{ count: 4, seconds: 10 }] },
  { id: 'laptop-brands', label: 'laptop brands', variants: [{ count: 4, seconds: 10 }] },
  { id: 'nba-legends-90s', label: 'NBA legends from the 90s', variants: [{ count: 3, seconds: 15 }] },
  { id: 'basketball-positions', label: 'basketball positions', variants: [{ count: 3, seconds: 10 }] },
  { id: 'gym-exercises', label: 'gym exercises', variants: [{ count: 4, seconds: 12 }] },
  { id: 'drinking-games', label: 'drinking games', variants: [{ count: 3, seconds: 12 }] },
  { id: 'rom-coms', label: 'romantic comedy movies', variants: [{ count: 3, seconds: 12 }] },
  { id: 'boy-bands', label: 'boy bands', variants: [{ count: 3, seconds: 12 }] },
  { id: 'girl-groups', label: 'girl groups', variants: [{ count: 3, seconds: 12 }] },
  { id: 'sitcoms', label: 'sitcoms', variants: [{ count: 3, seconds: 12 }] },

  // ---- Hard / niche (fewer needed, more time) ----
  { id: 'rolex-models', label: 'Rolex watch models', variants: [{ count: 2, seconds: 15 }, { count: 3, seconds: 20 }] },
  { id: 'luxury-watch-brands', label: 'luxury watch brands', variants: [{ count: 3, seconds: 15 }] },
  { id: 'scotch-regions', label: 'Scotch whisky regions', variants: [{ count: 2, seconds: 15 }] },
  { id: 'ikea-products', label: 'IKEA product names', variants: [{ count: 2, seconds: 15 }] },
  { id: 'sushi-types', label: 'types of sushi', variants: [{ count: 3, seconds: 15 }] },
  { id: 'f1-circuits', label: 'F1 circuits', variants: [{ count: 3, seconds: 18 }] },
  { id: 'ufc-weight-classes', label: 'UFC weight classes', variants: [{ count: 3, seconds: 15 }] },
  { id: 'olympic-hosts', label: 'cities that have hosted the Olympics', variants: [{ count: 3, seconds: 18 }] },
  { id: 'grammy-categories', label: 'Grammy Award categories', variants: [{ count: 2, seconds: 15 }] },
  { id: 'best-picture-winners', label: 'Best Picture Oscar winners', variants: [{ count: 2, seconds: 18 }] },
  { id: 'japanese-noodles', label: 'Japanese noodle dishes', variants: [{ count: 3, seconds: 15 }] },
  { id: 'europe-football-leagues', label: 'European football leagues', variants: [{ count: 3, seconds: 15 }] },
  { id: 'cheese-countries', label: 'countries famous for cheese', variants: [{ count: 3, seconds: 15 }] },
  { id: 'sea-national-dishes', label: 'national dishes of Southeast Asian countries', variants: [{ count: 3, seconds: 18 }] },
  { id: 'boxing-punches', label: 'boxing punches', variants: [{ count: 3, seconds: 15 }] },
  { id: 'crypto-exchanges', label: 'cryptocurrency exchanges', variants: [{ count: 2, seconds: 15 }] },
  { id: 'defunct-car-brands', label: 'car brands that no longer exist', variants: [{ count: 2, seconds: 15 }] },
  { id: 'constellations', label: 'constellations', variants: [{ count: 3, seconds: 15 }] },
  { id: 'wine-regions', label: 'famous wine regions', variants: [{ count: 3, seconds: 18 }] },
  { id: 'nba-mvp-eras', label: 'NBA MVPs from any era', variants: [{ count: 2, seconds: 15 }] },
];

export const BLITZ_QUESTIONS: BlitzQuestion[] = CATEGORY_SEEDS.flatMap((seed) =>
  seed.variants.map((variant, i) => ({
    id: `${seed.id}-${i}`,
    category: seed.label,
    prompt: `Name ${variant.count} ${seed.label} in ${variant.seconds} seconds`,
    seconds: variant.seconds,
  })),
);
