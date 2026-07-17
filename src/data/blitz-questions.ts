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
  { id: 'animals', label: 'animals', variants: [{ count: 5, seconds: 14 }, { count: 8, seconds: 21 }] },
  { id: 'colors', label: 'colors', variants: [{ count: 5, seconds: 11 }] },
  { id: 'fruits', label: 'fruits', variants: [{ count: 5, seconds: 14 }] },
  { id: 'vegetables', label: 'vegetables', variants: [{ count: 5, seconds: 14 }] },
  { id: 'countries', label: 'countries', variants: [{ count: 5, seconds: 14 }, { count: 8, seconds: 21 }] },
  { id: 'cities', label: 'cities', variants: [{ count: 5, seconds: 14 }] },
  { id: 'movies', label: 'movies', variants: [{ count: 4, seconds: 14 }] },
  { id: 'tv-shows', label: 'TV shows', variants: [{ count: 4, seconds: 14 }] },
  { id: 'sports', label: 'sports', variants: [{ count: 5, seconds: 14 }] },
  { id: 'car-brands', label: 'car brands', variants: [{ count: 5, seconds: 14 }] },
  { id: 'superheroes', label: 'superheroes', variants: [{ count: 5, seconds: 14 }] },
  { id: 'disney-movies', label: 'Disney movies', variants: [{ count: 4, seconds: 14 }] },
  { id: 'fast-food', label: 'fast food chains', variants: [{ count: 5, seconds: 14 }] },
  { id: 'social-apps', label: 'social media apps', variants: [{ count: 5, seconds: 14 }] },
  { id: 'board-games', label: 'board games', variants: [{ count: 4, seconds: 14 }] },
  { id: 'video-games', label: 'video games', variants: [{ count: 4, seconds: 14 }] },
  { id: 'music-genres', label: 'music genres', variants: [{ count: 5, seconds: 14 }] },
  { id: 'dance-moves', label: 'dance moves', variants: [{ count: 3, seconds: 14 }] },
  { id: 'school-subjects', label: 'school subjects', variants: [{ count: 5, seconds: 14 }] },
  { id: 'kitchen-utensils', label: 'kitchen utensils', variants: [{ count: 5, seconds: 14 }] },
  { id: 'fridge-items', label: 'things you\u2019d find in a fridge', variants: [{ count: 5, seconds: 14 }] },
  { id: 'red-things', label: 'things that are red', variants: [{ count: 5, seconds: 14 }] },
  { id: 'round-things', label: 'things that are round', variants: [{ count: 5, seconds: 14 }] },
  { id: 'jobs', label: 'jobs', variants: [{ count: 5, seconds: 14 }] },
  { id: 'shoe-types', label: 'types of shoes', variants: [{ count: 4, seconds: 14 }] },
  { id: 'planets', label: 'planets', variants: [{ count: 4, seconds: 11 }] },
  { id: 'beach-things', label: 'things you\u2019d find at a beach', variants: [{ count: 5, seconds: 14 }] },
  { id: 'pixar-movies', label: 'Pixar movies', variants: [{ count: 4, seconds: 14 }] },
  { id: 'ice-cream-flavors', label: 'ice cream flavors', variants: [{ count: 5, seconds: 14 }] },
  { id: 'pizza-toppings', label: 'pizza toppings', variants: [{ count: 5, seconds: 14 }] },
  { id: 'breakfast-foods', label: 'breakfast foods', variants: [{ count: 5, seconds: 14 }] },
  { id: 'christmas-movies', label: 'Christmas movies', variants: [{ count: 3, seconds: 14 }] },
  { id: 'horror-movies', label: 'horror movies', variants: [{ count: 4, seconds: 14 }] },

  // ---- Medium (need to think a bit) ----
  { id: 'nba-teams', label: 'NBA teams', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 25 }] },
  { id: 'epl-clubs', label: 'English Premier League football clubs', variants: [{ count: 4, seconds: 17 }] },
  { id: 'anime', label: 'anime series', variants: [{ count: 3, seconds: 17 }] },
  { id: 'kpop-groups', label: 'K-pop groups', variants: [{ count: 3, seconds: 17 }] },
  { id: 'bond-actors', label: 'actors who\u2019ve played James Bond', variants: [{ count: 3, seconds: 21 }] },
  { id: 'marvel-movies', label: 'Marvel movies', variants: [{ count: 4, seconds: 17 }] },
  { id: 'cocktails', label: 'cocktails', variants: [{ count: 3, seconds: 17 }] },
  { id: 'pasta-types', label: 'types of pasta', variants: [{ count: 3, seconds: 17 }] },
  { id: 'cheese-types', label: 'types of cheese', variants: [{ count: 3, seconds: 17 }] },
  { id: 'chocolate-brands', label: 'chocolate brands', variants: [{ count: 4, seconds: 17 }] },
  { id: 'sneaker-brands', label: 'sneaker brands', variants: [{ count: 4, seconds: 17 }] },
  { id: 'europe-countries', label: 'countries in Europe', variants: [{ count: 4, seconds: 14 }] },
  { id: 'sea-countries', label: 'countries in Southeast Asia', variants: [{ count: 4, seconds: 14 }] },
  { id: 'us-states', label: 'US states', variants: [{ count: 4, seconds: 17 }] },
  { id: 'hawker-food', label: 'Singapore hawker dishes', variants: [{ count: 3, seconds: 17 }] },
  { id: 'tea-types', label: 'types of tea', variants: [{ count: 3, seconds: 17 }] },
  { id: 'coffee-drinks', label: 'coffee drinks', variants: [{ count: 3, seconds: 17 }] },
  { id: 'wine-grapes', label: 'wine grape varieties', variants: [{ count: 3, seconds: 21 }] },
  { id: 'whisky-types', label: 'types of whisky', variants: [{ count: 3, seconds: 21 }] },
  { id: 'programming-languages', label: 'programming languages', variants: [{ count: 4, seconds: 17 }] },
  { id: 'cryptocurrencies', label: 'cryptocurrencies', variants: [{ count: 3, seconds: 17 }] },
  { id: 'japanese-car-brands', label: 'Japanese car brands', variants: [{ count: 3, seconds: 17 }] },
  { id: 'f1-teams', label: 'F1 teams', variants: [{ count: 3, seconds: 17 }] },
  { id: 'boxing-weight-classes', label: 'boxing weight classes', variants: [{ count: 3, seconds: 21 }] },
  { id: 'poker-hands', label: 'poker hand rankings', variants: [{ count: 3, seconds: 21 }] },
  { id: 'grand-slams', label: 'Grand Slam tennis tournaments', variants: [{ count: 3, seconds: 14 }] },
  { id: 'avengers-characters', label: 'Avengers characters', variants: [{ count: 4, seconds: 17 }] },
  { id: 'star-wars-characters', label: 'Star Wars characters', variants: [{ count: 4, seconds: 17 }] },
  { id: 'hp-houses', label: 'Harry Potter houses', variants: [{ count: 4, seconds: 11 }] },
  { id: 'martial-arts', label: 'martial arts styles', variants: [{ count: 3, seconds: 17 }] },
  { id: 'mrt-lines', label: 'Singapore MRT lines', variants: [{ count: 3, seconds: 17 }] },
  { id: 'phone-brands', label: 'smartphone brands', variants: [{ count: 4, seconds: 14 }] },
  { id: 'laptop-brands', label: 'laptop brands', variants: [{ count: 4, seconds: 14 }] },
  { id: 'nba-legends-90s', label: 'NBA legends from the 90s', variants: [{ count: 3, seconds: 21 }] },
  { id: 'basketball-positions', label: 'basketball positions', variants: [{ count: 3, seconds: 14 }] },
  { id: 'gym-exercises', label: 'gym exercises', variants: [{ count: 4, seconds: 17 }] },
  { id: 'drinking-games', label: 'drinking games', variants: [{ count: 3, seconds: 17 }] },
  { id: 'rom-coms', label: 'romantic comedy movies', variants: [{ count: 3, seconds: 17 }] },
  { id: 'boy-bands', label: 'boy bands', variants: [{ count: 3, seconds: 17 }] },
  { id: 'girl-groups', label: 'girl groups', variants: [{ count: 3, seconds: 17 }] },
  { id: 'sitcoms', label: 'sitcoms', variants: [{ count: 3, seconds: 17 }] },

  // ---- Hard / niche (fewer needed, more time) ----
  { id: 'rolex-models', label: 'Rolex watch models', variants: [{ count: 2, seconds: 21 }, { count: 3, seconds: 28 }] },
  { id: 'luxury-watch-brands', label: 'luxury watch brands', variants: [{ count: 3, seconds: 21 }] },
  { id: 'scotch-regions', label: 'Scotch whisky regions', variants: [{ count: 2, seconds: 21 }] },
  { id: 'ikea-products', label: 'IKEA product names', variants: [{ count: 2, seconds: 21 }] },
  { id: 'sushi-types', label: 'types of sushi', variants: [{ count: 3, seconds: 21 }] },
  { id: 'f1-circuits', label: 'F1 circuits', variants: [{ count: 3, seconds: 25 }] },
  { id: 'ufc-weight-classes', label: 'UFC weight classes', variants: [{ count: 3, seconds: 21 }] },
  { id: 'olympic-hosts', label: 'cities that have hosted the Olympics', variants: [{ count: 3, seconds: 25 }] },
  { id: 'grammy-categories', label: 'Grammy Award categories', variants: [{ count: 2, seconds: 21 }] },
  { id: 'best-picture-winners', label: 'Best Picture Oscar winners', variants: [{ count: 2, seconds: 25 }] },
  { id: 'japanese-noodles', label: 'Japanese noodle dishes', variants: [{ count: 3, seconds: 21 }] },
  { id: 'europe-football-leagues', label: 'European football leagues', variants: [{ count: 3, seconds: 21 }] },
  { id: 'cheese-countries', label: 'countries famous for cheese', variants: [{ count: 3, seconds: 21 }] },
  { id: 'sea-national-dishes', label: 'national dishes of Southeast Asian countries', variants: [{ count: 3, seconds: 25 }] },
  { id: 'boxing-punches', label: 'boxing punches', variants: [{ count: 3, seconds: 21 }] },
  { id: 'crypto-exchanges', label: 'cryptocurrency exchanges', variants: [{ count: 2, seconds: 21 }] },
  { id: 'defunct-car-brands', label: 'car brands that no longer exist', variants: [{ count: 2, seconds: 21 }] },
  { id: 'constellations', label: 'constellations', variants: [{ count: 3, seconds: 21 }] },
  { id: 'wine-regions', label: 'famous wine regions', variants: [{ count: 3, seconds: 25 }] },
  { id: 'nba-mvp-eras', label: 'NBA MVPs from any era', variants: [{ count: 2, seconds: 21 }] },

  // ---- Anime (One Piece / MHA / One Punch Man / Fairy Tail / HxH crowd) ----
  { id: 'one-piece-characters', label: 'One Piece characters', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 21 }] },
  { id: 'one-piece-crews', label: 'pirate crews from One Piece', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'mha-characters', label: 'My Hero Academia characters', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'mha-quirks', label: 'quirks from My Hero Academia', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'one-punch-man-characters', label: 'One Punch Man characters', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'fairy-tail-characters', label: 'Fairy Tail characters', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'hxh-characters', label: 'Hunter \u00d7 Hunter characters', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'black-clover-characters', label: 'Black Clover characters', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'avatar-characters', label: 'Avatar: The Last Airbender characters', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'attack-on-titan-characters', label: 'Attack on Titan characters', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'naruto-characters', label: 'Naruto characters', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'demon-slayer-characters', label: 'Demon Slayer characters', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'jujutsu-kaisen-characters', label: 'Jujutsu Kaisen characters', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'shonen-protagonists', label: 'shonen anime main characters', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 23 }] },
  { id: 'anime-villains', label: 'anime villains', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'anime-openings', label: 'anime you\u2019ve actually finished watching', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },

  // ---- Combat sports (UFC / boxing crowd) ----
  { id: 'ufc-fighters', label: 'UFC fighters', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 25 }] },
  { id: 'ufc-moves', label: 'UFC submission moves', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'boxing-legends', label: 'legendary boxers', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 23 }] },
  { id: 'mma-orgs', label: 'MMA promotions', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'boxing-terms', label: 'boxing terms', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 23 }] },

  // ---- Basketball / soccer ----
  { id: 'nba-players', label: 'current NBA players', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 23 }] },
  { id: 'basketball-terms', label: 'basketball terms', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'world-cup-countries', label: 'countries that have won the World Cup', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'soccer-legends', label: 'legendary soccer players', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 23 }] },
  { id: 'soccer-terms', label: 'soccer terms', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },

  // ---- Board & card games (Monopoly / chess / poker / Mahjong / Splendor crowd) ----
  { id: 'chess-pieces', label: 'chess pieces', variants: [{ count: 4, seconds: 11 }, { count: 6, seconds: 17 }] },
  { id: 'chess-terms', label: 'chess terms', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'poker-terms', label: 'poker terms', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'mahjong-terms', label: 'Mahjong terms', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'monopoly-things', label: 'things on a Monopoly board', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'catan-things', label: 'resources or things from Catan', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'card-game-names', label: 'card games', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'uno-rules', label: 'Uno card types or rules', variants: [{ count: 3, seconds: 14 }, { count: 5, seconds: 20 }] },
  { id: 'euro-board-games', label: 'strategy board games', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },

  // ---- Marvel / superheroes ----
  { id: 'xmen-characters', label: 'X-Men characters', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'marvel-villains', label: 'Marvel villains', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 23 }] },
  { id: 'dc-characters', label: 'DC characters', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 23 }] },
  { id: 'superhero-movies', label: 'superhero movies', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'infinity-stones', label: 'Infinity Stones', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'spiderman-actors', label: 'actors who\u2019ve played Spider-Man', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },

  // ---- Luxury watches ----
  { id: 'watch-brands-extra', label: 'watch brands', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 23 }] },
  { id: 'watch-complications', label: 'watch complications', variants: [{ count: 2, seconds: 21 }, { count: 4, seconds: 27 }] },
  { id: 'watch-collections', label: 'Rolex watch collections', variants: [{ count: 3, seconds: 21 }, { count: 5, seconds: 27 }] },

  // ---- Computing / tech / gaming ----
  { id: 'tech-companies', label: 'big tech companies', variants: [{ count: 5, seconds: 14 }, { count: 7, seconds: 20 }] },
  { id: 'video-game-franchises', label: 'video game franchises', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'game-consoles', label: 'video game consoles', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'esports-titles', label: 'esports games', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'coding-languages-extra', label: 'programming languages or frameworks', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 23 }] },
  { id: 'ai-companies', label: 'AI companies or AI products', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
  { id: 'social-media-ceos', label: 'tech company founders or CEOs', variants: [{ count: 3, seconds: 21 }, { count: 5, seconds: 27 }] },
  { id: 'open-world-games', label: 'open-world video games', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },

  // ---- Disney ----
  { id: 'disney-princesses', label: 'Disney princesses', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'disney-villains', label: 'Disney villains', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'pixar-characters', label: 'Pixar movie characters', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },

  // ---- Singapore-specific ----
  { id: 'sg-hawker-dishes-extra', label: 'Singapore hawker dishes', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 23 }] },
  { id: 'sg-landmarks', label: 'Singapore landmarks', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'sg-malls', label: 'shopping malls in Singapore', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'sg-neighborhoods', label: 'neighbourhoods or estates in Singapore', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'sg-slang', label: 'Singlish words or phrases', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 23 }] },
  { id: 'sg-drinks', label: 'kopitiam drink orders', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },

  // ---- World religions ----
  { id: 'world-religions-list', label: 'major world religions', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'religious-holidays', label: 'religious holidays or festivals', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 23 }] },
  { id: 'places-of-worship', label: 'types of places of worship', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },

  // ---- Misc high-replay filler (broad, everyone can play) ----
  { id: 'things-in-a-gym-bag', label: 'things in a gym bag', variants: [{ count: 5, seconds: 14 }, { count: 7, seconds: 20 }] },
  { id: 'things-you-say-at-a-poker-table', label: 'things you\u2019d say at a poker table', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 23 }] },
  { id: 'things-at-a-bbq', label: 'things you\u2019d find at a BBQ', variants: [{ count: 5, seconds: 14 }, { count: 7, seconds: 20 }] },
  { id: 'things-in-a-toolbox', label: 'things in a toolbox', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'excuses-for-being-late', label: 'excuses for being late', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 23 }] },
  { id: 'things-you-do-before-sleeping', label: 'things people do before sleeping', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'weird-phobias', label: 'unusual phobias', variants: [{ count: 3, seconds: 21 }, { count: 5, seconds: 27 }] },
  { id: 'things-in-space', label: 'things you\u2019d find in space', variants: [{ count: 4, seconds: 14 }, { count: 6, seconds: 20 }] },
  { id: 'greek-gods', label: 'Greek gods', variants: [{ count: 4, seconds: 17 }, { count: 6, seconds: 23 }] },
  { id: 'norse-gods', label: 'Norse gods', variants: [{ count: 3, seconds: 17 }, { count: 5, seconds: 23 }] },
];

export const BLITZ_QUESTIONS: BlitzQuestion[] = CATEGORY_SEEDS.flatMap((seed) =>
  seed.variants.map((variant, i) => ({
    id: `${seed.id}-${i}`,
    category: seed.label,
    prompt: `Name ${variant.count} ${seed.label} in ${variant.seconds} seconds`,
    seconds: variant.seconds,
  })),
);
