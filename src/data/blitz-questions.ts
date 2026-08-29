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

/** Default — three things in 12s. Most of the bank uses only this. */
const N3: CategorySeed['variants'] = [{ count: 3, seconds: 12 }];
/** Easy lists you can keep going on. */
const N34: CategorySeed['variants'] = [
  { count: 3, seconds: 12 },
  { count: 4, seconds: 15 },
];
/** Everyday lists anyone can rattle off. Never more than 5. */
const N345: CategorySeed['variants'] = [
  { count: 3, seconds: 12 },
  { count: 4, seconds: 15 },
  { count: 5, seconds: 18 },
];

/**
 * Category bank for Blitz.
 *
 * Every prompt asks for 3–5 items on a timer of 12 / 15 / 18 seconds.
 * 3 is the default so a mixed party can actually finish before the buzzer;
 * 4 and 5 only appear on lists people can rattle off without specialist knowledge.
 */
const CATEGORY_SEEDS: CategorySeed[] = [
  // ---- Everyday ----
  { id: 'animals', label: 'animals', variants: N345 },
  { id: 'colors', label: 'colors', variants: N345 },
  { id: 'fruits', label: 'fruits', variants: N345 },
  { id: 'vegetables', label: 'vegetables', variants: N345 },
  { id: 'countries', label: 'countries', variants: N345 },
  { id: 'cities', label: 'cities', variants: N345 },
  { id: 'capital-cities', label: 'capital cities', variants: N34 },
  { id: 'sports', label: 'sports', variants: N345 },
  { id: 'jobs', label: 'jobs', variants: N34 },
  { id: 'school-subjects', label: 'school subjects', variants: N34 },
  { id: 'body-parts', label: 'body parts', variants: N345 },
  { id: 'shapes', label: 'shapes', variants: N345 },
  { id: 'languages', label: 'languages', variants: N34 },
  { id: 'currencies', label: 'world currencies', variants: N34 },
  { id: 'planets', label: 'planets', variants: N34 },
  { id: 'zodiac-signs', label: 'zodiac signs', variants: N34 },
  { id: 'dog-breeds', label: 'dog breeds', variants: N34 },
  { id: 'cat-breeds', label: 'cat breeds', variants: N34 },
  { id: 'birds', label: 'types of birds', variants: N34 },
  { id: 'ocean-animals', label: 'ocean animals', variants: N345 },
  { id: 'insects', label: 'insects', variants: N34 },
  { id: 'flowers', label: 'types of flowers', variants: N34 },
  { id: 'trees', label: 'types of trees', variants: N34 },
  { id: 'dinosaurs', label: 'dinosaurs', variants: N34 },
  { id: 'farm-animals', label: 'farm animals', variants: N345 },

  // ---- Things around you ----
  { id: 'kitchen-utensils', label: 'kitchen utensils', variants: N34 },
  { id: 'kitchen-appliances', label: 'kitchen appliances', variants: N34 },
  { id: 'bathroom-items', label: 'things in a bathroom', variants: N345 },
  { id: 'school-supplies', label: 'school supplies', variants: N34 },
  { id: 'office-supplies', label: 'office supplies', variants: N34 },
  { id: 'things-in-a-wallet', label: 'things in a wallet', variants: N345 },
  { id: 'things-in-a-backpack', label: 'things in a backpack', variants: N345 },
  { id: 'things-in-a-gym-bag', label: 'things in a gym bag', variants: N345 },
  { id: 'things-in-a-toolbox', label: 'things in a toolbox', variants: N34 },
  { id: 'birthday-party-things', label: 'things at a birthday party', variants: N345 },
  { id: 'wedding-things', label: 'things at a wedding', variants: N34 },
  { id: 'camping-gear', label: 'camping gear', variants: N34 },
  { id: 'airport-things', label: 'things you see at an airport', variants: N345 },
  { id: 'red-things', label: 'things that are red', variants: N345 },
  { id: 'round-things', label: 'things that are round', variants: N345 },
  { id: 'cold-things', label: 'cold things', variants: N34 },
  { id: 'hot-things', label: 'hot things', variants: N34 },
  { id: 'things-that-fly', label: 'things that fly', variants: N345 },
  { id: 'things-with-wheels', label: 'things with wheels', variants: N345 },
  { id: 'things-that-come-in-pairs', label: 'things that come in pairs', variants: N345 },
  { id: 'shoe-types', label: 'types of shoes', variants: N34 },
  { id: 'musical-instruments', label: 'musical instruments', variants: N34 },
  { id: 'dance-styles', label: 'styles of dance', variants: N34 },
  { id: 'weather-phenomena', label: 'kinds of weather', variants: N34 },
  { id: 'modes-of-transport', label: 'modes of transport', variants: N345 },
  { id: 'sports-with-a-ball', label: 'sports played with a ball', variants: N345 },
  { id: 'jobs-that-wear-uniforms', label: 'jobs that wear a uniform', variants: N34 },

  // ---- Food & drink ----
  { id: 'fast-food', label: 'fast food chains', variants: N34 },
  { id: 'ice-cream-flavors', label: 'ice cream flavors', variants: N34 },
  { id: 'pizza-toppings', label: 'pizza toppings', variants: N345 },
  { id: 'breakfast-foods', label: 'breakfast foods', variants: N345 },
  { id: 'soda-brands', label: 'soft drink brands', variants: N34 },
  { id: 'chocolate-brands', label: 'chocolate brands', variants: N345 },
  { id: 'coffee-drinks', label: 'coffee drinks', variants: N34 },
  { id: 'tea-types', label: 'types of tea', variants: N34 },
  { id: 'cocktails', label: 'cocktails', variants: N34 },
  { id: 'pasta-types', label: 'types of pasta', variants: N34 },
  { id: 'cheese-types', label: 'types of cheese', variants: N34 },
  { id: 'sushi-types', label: 'types of sushi', variants: N34 },
  { id: 'japanese-noodles', label: 'Japanese noodle dishes', variants: N34 },
  { id: 'protein-sources', label: 'high-protein foods', variants: N345 },
  { id: 'hawker-food', label: 'Singapore hawker dishes', variants: N34 },
  { id: 'sg-drinks', label: 'kopitiam drink orders', variants: N34 },
  { id: 'sg-bubble-tea-brands', label: 'bubble tea brands', variants: N34 },

  // ---- Movies, TV, Disney ----
  { id: 'movies', label: 'movies', variants: N34 },
  { id: 'tv-shows', label: 'TV shows', variants: N34 },
  { id: 'sitcoms', label: 'sitcoms', variants: N34 },
  { id: 'netflix-shows', label: 'Netflix shows', variants: N34 },
  { id: 'disney-movies', label: 'Disney movies', variants: N34 },
  { id: 'disney-princesses', label: 'Disney princesses', variants: N34 },
  { id: 'disney-villains', label: 'Disney villains', variants: N34 },
  { id: 'pixar-movies', label: 'Pixar movies', variants: N34 },
  { id: 'pixar-characters', label: 'Pixar movie characters', variants: N34 },
  { id: 'ghibli-movies', label: 'Studio Ghibli movies', variants: N3 },
  { id: 'animated-movies', label: 'animated movies', variants: N34 },
  { id: 'christmas-movies', label: 'Christmas movies', variants: N34 },
  { id: 'horror-movies', label: 'horror movies', variants: N3 },
  { id: 'rom-coms', label: 'romantic comedy movies', variants: N3 },
  { id: 'superhero-movies', label: 'superhero movies', variants: N34 },
  { id: 'k-dramas', label: 'K-dramas', variants: N3 },
  { id: 'friends-characters', label: 'characters from Friends', variants: N34 },
  { id: 'office-characters', label: 'characters from The Office', variants: N34 },
  { id: 'stranger-things-characters', label: 'Stranger Things characters', variants: N34 },
  { id: 'breaking-bad-characters', label: 'Breaking Bad characters', variants: N3 },

  // ---- Star Wars ----
  { id: 'sw-characters', label: 'Star Wars characters', variants: N34 },
  { id: 'sw-jedi', label: 'Jedi from Star Wars', variants: N34 },
  { id: 'sw-sith', label: 'Sith from Star Wars', variants: N3 },
  { id: 'sw-planets', label: 'Star Wars planets', variants: N34 },
  { id: 'sw-ships', label: 'Star Wars ships', variants: N34 },
  { id: 'sw-droids', label: 'Star Wars droids', variants: N3 },
  { id: 'sw-movies', label: 'Star Wars movies', variants: N34 },
  { id: 'sw-weapons', label: 'Star Wars weapons', variants: N34 },
  { id: 'sw-species', label: 'Star Wars alien species', variants: N3 },
  { id: 'sw-lightsaber-colors', label: 'lightsaber colors', variants: N34 },
  { id: 'sw-quotes', label: 'famous Star Wars quotes', variants: N3 },
  { id: 'sw-bounty', label: 'Star Wars bounty hunters', variants: N3 },

  // ---- Marvel & DC ----
  { id: 'avengers-characters', label: 'Avengers', variants: N34 },
  { id: 'avengers-powers', label: 'superpowers used by the Avengers', variants: N34 },
  { id: 'marvel-movies', label: 'Marvel movies', variants: N34 },
  { id: 'marvel-villains', label: 'Marvel villains', variants: N34 },
  { id: 'infinity-stones', label: 'Infinity Stones', variants: N34 },
  { id: 'xmen-characters', label: 'X-Men', variants: N34 },
  { id: 'xmen-powers', label: 'X-Men mutant powers', variants: N34 },
  { id: 'dc-heroes', label: 'DC superheroes', variants: N34 },
  { id: 'dc-villains', label: 'DC villains', variants: N34 },
  { id: 'dc-movies', label: 'DC movies', variants: N3 },
  { id: 'justice-league', label: 'Justice League members', variants: N34 },
  { id: 'batman-villains', label: 'Batman villains', variants: N34 },
  { id: 'batman-gadgets', label: 'Batman gadgets', variants: N34 },
  { id: 'superhero-teams', label: 'superhero teams', variants: N3 },
  { id: 'superhero-weaknesses', label: 'superhero weaknesses', variants: N3 },

  // ---- Genshin & similar games ----
  { id: 'genshin-characters', label: 'Genshin Impact characters', variants: N34 },
  { id: 'genshin-pyro', label: 'Pyro characters from Genshin Impact', variants: N34 },
  { id: 'genshin-hydro', label: 'Hydro characters from Genshin Impact', variants: N34 },
  { id: 'genshin-electro', label: 'Electro characters from Genshin Impact', variants: N34 },
  { id: 'genshin-anemo', label: 'Anemo characters from Genshin Impact', variants: N34 },
  { id: 'genshin-geo', label: 'Geo characters from Genshin Impact', variants: N34 },
  { id: 'genshin-dendro', label: 'Dendro characters from Genshin Impact', variants: N34 },
  { id: 'genshin-cryo', label: 'Cryo characters from Genshin Impact', variants: N34 },
  { id: 'genshin-elements', label: 'Genshin Impact elements', variants: N34 },
  { id: 'genshin-nations', label: 'Genshin Impact nations', variants: N34 },
  { id: 'genshin-weapons', label: 'Genshin Impact weapon types', variants: N34 },
  { id: 'hsr-characters', label: 'Honkai: Star Rail characters', variants: N3 },
  { id: 'zzz-characters', label: 'Zenless Zone Zero characters', variants: N3 },

  // ---- Video games ----
  { id: 'video-games', label: 'video games', variants: N34 },
  { id: 'video-game-franchises', label: 'video game franchises', variants: N34 },
  { id: 'game-consoles', label: 'video game consoles', variants: N34 },
  { id: 'nintendo-characters', label: 'Nintendo characters', variants: N34 },
  { id: 'mario-characters', label: 'Mario characters', variants: N34 },
  { id: 'mario-games', label: 'Mario games', variants: N34 },
  { id: 'pokemon', label: 'Pokémon', variants: N345 },
  { id: 'pokemon-types', label: 'Pokémon types', variants: N345 },
  { id: 'pokemon-starters', label: 'Pokémon starter Pokémon', variants: N34 },
  { id: 'pokemon-legendaries', label: 'legendary Pokémon', variants: N34 },
  { id: 'zelda-games', label: 'Legend of Zelda games', variants: N3 },
  { id: 'zelda-characters', label: 'Legend of Zelda characters', variants: N34 },
  { id: 'gta-games', label: 'GTA games', variants: N3 },
  { id: 'cod-games', label: 'Call of Duty games', variants: N3 },
  { id: 'minecraft-mobs', label: 'Minecraft mobs', variants: N34 },
  { id: 'minecraft-items', label: 'Minecraft items or blocks', variants: N345 },
  { id: 'valorant-agents', label: 'Valorant agents', variants: N34 },
  { id: 'lol-champions', label: 'League of Legends champions', variants: N34 },
  { id: 'overwatch-heroes', label: 'Overwatch heroes', variants: N34 },
  { id: 'fortnite', label: 'Fortnite weapons or items', variants: N34 },
  { id: 'roblox-games', label: 'popular Roblox games', variants: N34 },
  { id: 'fighting-games', label: 'fighting games', variants: N34 },
  { id: 'open-world-games', label: 'open-world video games', variants: N34 },
  { id: 'esports-titles', label: 'esports games', variants: N34 },
  { id: 'playstation-exclusives', label: 'PlayStation exclusive games', variants: N3 },
  { id: 'souls-games', label: 'Soulsborne games', variants: N3 },
  { id: 'final-fantasy', label: 'Final Fantasy games', variants: N3 },
  { id: 'board-games', label: 'board games', variants: N34 },
  { id: 'card-games', label: 'card games', variants: N34 },
  { id: 'chess-pieces', label: 'chess pieces', variants: N34 },
  { id: 'monopoly-things', label: 'things on a Monopoly board', variants: N34 },
  { id: 'uno-cards', label: 'Uno card types', variants: N34 },

  // ---- Anime ----
  { id: 'anime', label: 'anime series', variants: N34 },
  { id: 'shonen-protagonists', label: 'shonen anime protagonists', variants: N34 },
  { id: 'anime-villains', label: 'anime villains', variants: N34 },
  { id: 'naruto-characters', label: 'Naruto characters', variants: N34 },
  { id: 'naruto-jutsu', label: 'Naruto jutsu or techniques', variants: N34 },
  { id: 'one-piece-characters', label: 'One Piece characters', variants: N34 },
  { id: 'one-piece-crews', label: 'One Piece pirate crews', variants: N3 },
  { id: 'one-piece-devil-fruits', label: 'One Piece Devil Fruits', variants: N34 },
  { id: 'demon-slayer-characters', label: 'Demon Slayer characters', variants: N34 },
  { id: 'jujutsu-kaisen-characters', label: 'Jujutsu Kaisen characters', variants: N34 },
  { id: 'attack-on-titan-characters', label: 'Attack on Titan characters', variants: N34 },
  { id: 'mha-characters', label: 'My Hero Academia characters', variants: N34 },
  { id: 'mha-quirks', label: 'My Hero Academia quirks', variants: N34 },
  { id: 'one-punch-man-characters', label: 'One Punch Man characters', variants: N3 },
  { id: 'dragon-ball-characters', label: 'Dragon Ball characters', variants: N34 },
  { id: 'spy-x-family-characters', label: 'Spy x Family characters', variants: N3 },

  // ---- Books & fantasy ----
  { id: 'hp-characters', label: 'Harry Potter characters', variants: N34 },
  { id: 'hp-houses', label: 'Harry Potter houses', variants: N3 },
  { id: 'hp-spells', label: 'Harry Potter spells', variants: N34 },
  { id: 'hp-subjects', label: 'Hogwarts subjects', variants: N34 },
  { id: 'lotr-characters', label: 'Lord of the Rings characters', variants: N34 },
  { id: 'got-characters', label: 'Game of Thrones characters', variants: N34 },
  { id: 'got-houses', label: 'Game of Thrones houses', variants: N3 },
  { id: 'greek-gods', label: 'Greek gods', variants: N34 },
  { id: 'norse-gods', label: 'Norse gods', variants: N3 },
  { id: 'percy-jackson', label: 'Percy Jackson characters', variants: N3 },

  // ---- Tech & computers ----
  { id: 'computer-parts', label: 'computer parts', variants: N345 },
  { id: 'computer-peripherals', label: 'computer peripherals', variants: N34 },
  { id: 'phone-parts', label: 'parts of a smartphone', variants: N34 },
  { id: 'operating-systems', label: 'operating systems', variants: N34 },
  { id: 'web-browsers', label: 'web browsers', variants: N34 },
  { id: 'programming-languages', label: 'programming languages', variants: N34 },
  { id: 'tech-companies', label: 'tech companies', variants: N34 },
  { id: 'social-apps', label: 'social media apps', variants: N34 },
  { id: 'streaming-services', label: 'streaming services', variants: N34 },
  { id: 'phone-brands', label: 'smartphone brands', variants: N345 },
  { id: 'laptop-brands', label: 'laptop brands', variants: N34 },
  { id: 'ai-products', label: 'AI apps or chatbots', variants: N34 },
  { id: 'email-providers', label: 'email providers', variants: N34 },
  { id: 'music-streaming-apps', label: 'music streaming apps', variants: N34 },
  { id: 'file-types', label: 'computer file types', variants: N34 },
  { id: 'keyboard-keys', label: 'keys on a keyboard', variants: N345 },
  { id: 'website-types', label: 'kinds of websites', variants: N34 },

  // ---- Sports ----
  { id: 'nba-teams', label: 'NBA teams', variants: N34 },
  { id: 'nba-players', label: 'NBA players', variants: N34 },
  { id: 'basketball-positions', label: 'basketball positions', variants: N34 },
  { id: 'epl-clubs', label: 'Premier League football clubs', variants: N34 },
  { id: 'soccer-legends', label: 'legendary football players', variants: N34 },
  { id: 'world-cup-countries', label: 'countries that have won the World Cup', variants: N34 },
  { id: 'f1-teams', label: 'F1 teams', variants: N34 },
  { id: 'f1-drivers', label: 'F1 drivers', variants: N34 },
  { id: 'olympic-sports', label: 'Olympic sports', variants: N345 },
  { id: 'gym-exercises', label: 'gym exercises', variants: N34 },
  { id: 'workout-equipment', label: 'gym equipment', variants: N34 },
  { id: 'swimming-strokes', label: 'swimming strokes', variants: N3 },
  { id: 'martial-arts', label: 'martial arts', variants: N34 },
  { id: 'tennis-players', label: 'famous tennis players', variants: N34 },
  { id: 'car-brands', label: 'car brands', variants: N345 },
  { id: 'japanese-car-brands', label: 'Japanese car brands', variants: N34 },
  { id: 'sneaker-brands', label: 'sneaker brands', variants: N345 },

  // ---- Music ----
  { id: 'music-genres', label: 'music genres', variants: N345 },
  { id: 'boy-bands', label: 'boy bands', variants: N34 },
  { id: 'girl-groups', label: 'girl groups', variants: N34 },
  { id: 'kpop-groups', label: 'K-pop groups', variants: N34 },
  { id: 'rap-artists', label: 'rap artists', variants: N34 },
  { id: 'pop-stars', label: 'pop singers', variants: N34 },
  { id: 'disney-songs', label: 'Disney songs', variants: N34 },

  // ---- Singapore ----
  { id: 'sg-landmarks', label: 'Singapore landmarks', variants: N34 },
  { id: 'sg-malls', label: 'shopping malls in Singapore', variants: N34 },
  { id: 'sg-neighborhoods', label: 'neighbourhoods in Singapore', variants: N34 },
  { id: 'sg-slang', label: 'Singlish words', variants: N34 },
  { id: 'mrt-lines', label: 'Singapore MRT lines', variants: N34 },
  { id: 'sg-banks', label: 'banks in Singapore', variants: N3 },
  { id: 'sg-food-delivery-apps', label: 'food delivery apps', variants: N34 },
  { id: 'sg-taxi-apps', label: 'ride-hailing apps', variants: N3 },
  { id: 'sg-convenience-stores', label: 'convenience store chains', variants: N34 },
  { id: 'budget-airlines', label: 'budget airlines', variants: N3 },

  // ---- Geography & world ----
  { id: 'europe-countries', label: 'countries in Europe', variants: N345 },
  { id: 'asian-countries', label: 'countries in Asia', variants: N345 },
  { id: 'sea-countries', label: 'countries in Southeast Asia', variants: N34 },
  { id: 'african-countries', label: 'countries in Africa', variants: N34 },
  { id: 'us-states', label: 'US states', variants: N34 },
  { id: 'islands', label: 'islands', variants: N34 },
  { id: 'rivers', label: 'famous rivers', variants: N34 },
  { id: 'mountains', label: 'famous mountains', variants: N34 },
  { id: 'oceans-and-seas', label: 'oceans or seas', variants: N34 },
  { id: 'world-landmarks', label: 'world landmarks', variants: N34 },
  { id: 'continents', label: 'continents', variants: N34 },

  // ---- Easy knowledge ----
  { id: 'chemical-elements', label: 'chemical elements', variants: N34 },
  { id: 'human-organs', label: 'human organs', variants: N345 },
  { id: 'world-religions', label: 'world religions', variants: N34 },
  { id: 'religious-holidays', label: 'religious holidays', variants: N34 },
  { id: 'places-of-worship', label: 'places of worship', variants: N34 },
  { id: 'us-presidents', label: 'US presidents', variants: N34 },
  { id: 'world-leaders', label: 'world leaders', variants: N3 },
  { id: 'inventions', label: 'famous inventions', variants: N34 },
  { id: 'gemstones', label: 'gemstones', variants: N34 },
  { id: 'metals', label: 'metals', variants: N34 },
];

export const BLITZ_QUESTIONS: BlitzQuestion[] = CATEGORY_SEEDS.flatMap((seed) =>
  seed.variants.map((variant, i) => ({
    id: `${seed.id}-${i}`,
    category: seed.label,
    prompt: `Name ${variant.count} ${seed.label} in ${variant.seconds} seconds`,
    seconds: variant.seconds,
  })),
);

/** Distinct category labels, used by the setup screen's ban phase. */
export const BLITZ_CATEGORIES: { id: string; label: string }[] = CATEGORY_SEEDS.map(
  ({ id, label }) => ({ id, label }),
);
