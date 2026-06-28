/** Generator — run with: node scripts/generate-codeword-pool.mjs */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const poolPath = join(root, 'src/data/codeword-pool.ts');

function loadExisting() {
  const src = readFileSync(poolPath, 'utf8');
  const exportIdx = src.indexOf('export const CODEWORD_POOL');
  const open = src.indexOf('[', exportIdx);
  const close = src.lastIndexOf('];');
  if (open === -1 || close === -1) return [];
  const body = src.slice(open + 1, close);
  const matches = [...body.matchAll(/'((?:\\'|[^'])*)'/g)];
  return matches.map((m) => m[1].replace(/\\'/g, "'"));
}

const seen = new Set();
const pool = [];

for (const word of loadExisting()) {
  const key = word.toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);
  pool.push(word);
}

const existingCount = pool.length;
const ADD = 1000;
const TARGET = existingCount + ADD;

function titleCase(word) {
  if (!word) return word;
  // Preserve multi-word phrases and hyphenated words sensibly.
  return word
   .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function addFromList(list) {
  for (const raw of list) {
    if (pool.length >= TARGET) return;
    const word = titleCase(raw.trim());
    if (!word) continue;
    const key = word.toLowerCase();
    if (seen.has(key) || word.length < 2) continue;
    seen.add(key);
    pool.push(word);
  }
}

const RAW = `
Apple Apricot Avocado Banana Blackberry Blueberry Cherry Coconut Cranberry Date Fig Grape Grapefruit
Guava Kiwi Lemon Lime Lychee Mango Melon Nectarine Olive Orange Papaya Peach Pear Pineapple Plum
Pomegranate Raspberry Strawberry Tangerine Watermelon Almond Cashew Chestnut Hazelnut Pecan Pistachio
Walnut Acorn Artichoke Asparagus Basil Bean Beet Broccoli Cabbage Carrot Cauliflower Celery Chive
Cinnamon Clove Coriander Corn Cucumber Dill Eggplant Fennel Garlic Ginger Hazelnut Kale Leek Lettuce
Mint Mushroom Mustard Nutmeg Oregano Parsley Pea Pepper Potato Pumpkin Radish Rosemary Sage Spinach
Squash Thyme Tomato Turnip Vanilla Wasabi Wheat Yam Zucchini Anchovy Bacon Bagel Biscuit Bread Brownie
Burger Burrito Butter Cabbage Candy Cereal Cheese Cheesecake Chili Chocolate Cider Cinnamon Clam
Cocoa Coconut Cookie Crackers Cream Crepe Croissant Crouton Cupcake Curry Custard Donut Dumpling
Edamame Egg Falafel Fudge Granola Gravy Ham Honey Hummus Jam Jelly Juice Kebab Ketchup Lasagna Latte
Lemonade Licorice Lobster Lollipop Macaroni Mackerel Malt Maple Marmalade Marshmallow Meatball Milk
Muffin Mustard Nacho Noodle Nut Oatmeal Omelette Onion Pancake Pasta Pastry Peanut Pickle Pie
Pizza Popcorn Porridge Pretzel Pudding Quinoa Radish Ramen Relish Rice Risotto Salad Salmon Salsa
Sandwich Sardine Sauce Sausage Scallop Scone Shrimp Smoothie Soda Soup Soybean Spaghetti Spice
Steak Stew Sugar Sushi Taco Tamale Tapioca Tea Toast Tofu Tuna Turmeric Waffle Wonton Yogurt
Ant Ape Bat Bear Beaver Bee Beetle Buffalo Butterfly Camel Cat Caterpillar Cheetah Chicken Chimpanzee
Clam Cobra Cougar Cow Coyote Crab Crane Crocodile Crow Deer Dinosaur Dog Dolphin Donkey Dove Dragonfly
Duck Eagle Eel Elephant Elk Falcon Ferret Finch Fish Flamingo Fly Fox Frog Gazelle Giraffe Goat Goose
Gorilla Hamster Hare Hawk Hedgehog Heron Hippo Horse Hummingbird Hyena Ibis Iguana Insect Jackal Jaguar
Jellyfish Kangaroo Koala Komodo Ladybug Lamb Lemur Leopard Lion Lizard Llama Lobster Locust Lynx Mackerel
Magpie Mallard Mantis Mole Monkey Moose Mosquito Moth Mouse Mule Newt Octopus Orca Ostrich Otter Owl
Ox Oyster Panda Panther Parrot Peacock Pelican Penguin Pheasant Pig Pigeon Pike Piranha Platypus Pony
Porcupine Possum Prawn Puffin Puppy Python Quail Rabbit Raccoon Ram Rat Raven Reindeer Rhino Robin
Salamander Salmon Scorpion Seal Shark Sheep Shrimp Skunk Sloth Snail Snake Sparrow Spider Squid Squirrel
Stingray Stork Swan Tadpole Termite Tiger Toad Tortoise Toucan Trout Turkey Turtle Viper Vulture Walrus
Wasp Whale Wolf Wombat Woodpecker Worm Yak Zebra Zoo
Acacia Alder Bamboo Bark Birch Blossom Branch Briar Bush Cactus Cedar Cherry Blossom Clover Daisy Dandelion
Fern Fir Flower Forest Garden Grass Hedge Ivy Jasmine Jungle Kelp Lavender Leaf Lily Lotus Magnolia Maple
Meadow Moss Oak Orchid Palm Petal Pine Pollen Poplar Redwood Reed Rose Seaweed Seed Shrub Stem Sunflower
Thistle Tree Tulip Vine Violet Weed Willow Wood
Avalanche Beach Blizzard Canyon Cave Cliff Cloud Coast Comet Crater Creek Desert Dune Earthquake Eclipse
Fjord Fog Forest Frost Glacier Gorge Geyser Hill Horizon Hurricane Ice Iceberg Island Jungle Lake Lava
Lightning Marsh Meadow Meteor Mist Moon Mountain Mud Oasis Ocean Peak Planet Pond Quicksand Rainbow
Rain Reef Ridge River Rock Sand Shore Sky Snow Star Storm Stream Sun Sunrise Sunset Swamp Thunder Tide
Tornado Valley Volcano Waterfall Wave Wind
Airplane Ambulance Anchor Balloon Bicycle Boat Bus Cab Canoe Car Caravan Cart Chariot Coach Ferry Glider
Helicopter Hovercraft Jet Kayak Locomotive Metro Minivan Motorcycle Paddleboat Parachute Rocket Sailboat
Scooter Ship Skateboard Sled Spaceship Submarine Taxi Train Tractor Tram Truck Van Wagon Yacht Zeppelin
Apron Armor Badge Bag Belt Beret Bib Blazer Boot Bowtie Bracelet Brim Cap Cloak Coat Collar Corset Crown
Diadem Dress Earring Fedora Glove Gown Hat Helmet Hood Jacket Jeans Jersey Kimono Locket Mask Mitten
Necklace Pajamas Pant Parka Pocket Poncho Ring Robe Sandal Sash Scarf Shawl Shoe Shorts Skirt Sleeve
Slipper Sock Sombrero Suit Sunglasses Sweater Tiara Tie Toga Trousers Turban Uniform Veil Vest Visor
Wallet Watch Wig
Anvil Axe Barrel Basket Battery Bell Bin Blanket Bolt Book Bottle Bowl Box Bucket Button Cabinet Cage
Calendar Camera Candle Cart Casket Chain Chair Chalk Chandelier Clock Closet Coin Comb Compass Cork
Couch Crate Crayon Cup Curtain Cushion Desk Dial Dice Dish Doll Door Drawer Drum Dumbbell Envelope Eraser
Fan Fence File Flag Flashlight Flask Frame Fridge Funnel Furnace Gadget Gauge Gem Globe Grater Grill
Hammer Handcuff Harness Hook Hose Ink Jar Jug Kettle Key Keyboard Knife Ladder Lamp Lantern Lens Lever
Lock Locket Magnet Map Marble Mask Mat Mirror Mug Nail Needle Notebook Nozzle Pad Paint Palette Pan
Paper Pen Pencil Pillow Pin Pipe Pitcher Plate Plug Pocket Pot Pouch Pulley Puzzle Quill Quilt Radio
Razor Ribbon Rope Rug Ruler Sack Safe Scale Scissors Screw Scroll Shelf Shield Sign Spade Sponge Spoon
Stamp Stapler Statue Stool String Sword Table Tank Tape Telescope Thermometer Thread Throne Tile Torch
Towel Toy Tray Trophy Trumpet Tub Tumbler Umbrella Vase Vault Wallet Wheel Whistle Window Wire Wrench
Yarn Zipper
Arch Arena Bakery Barn Barracks Basement Bathroom Bedroom Bridge Building Bunker Cabin Cafe Camp Castle
Cathedral Cellar Chapel Cinema Circus Clinic College Cottage Courtyard Den Dock Dome Factory Farm Fort
Garage Garden Gate Gym Harbor Hospital Hotel House Hut Igloo Inn Jail Kitchen Laboratory Library Lighthouse
Lobby Loft Mall Market Mosque Museum Office Palace Park Pavilion Pier Planetarium Plaza Pool Port Prison
Pub Pyramid Restaurant Roof Ruin School Shed Shop Stadium Store Studio Temple Theater Tower Tunnel
University Vault Warehouse Workshop Zoo
Archer Artist Astronaut Athlete Baker Barber Blacksmith Butler Captain Carpenter Chef Clown Cowboy Dancer
Detective Doctor Driver Emperor Farmer Firefighter Fisherman Gardener General Ghost Gladiator Guard
Guide Hero Hunter Inventor Jester Judge King Knight Librarian Magician Merchant Miner Monk Nurse Painter
Pilot Pirate Poet Priest Princess Queen Ranger Sailor Samurai Scholar Scout Sheriff Singer Soldier Spy
Student Teacher Thief Viking Warrior Wizard Writer
Accordion Bagpipe Banjo Bass Bell Clarinet Cymbal Drum Flute Gong Guitar Harmonica Harp Horn Keyboard
Lute Mandolin Maracas Microphone Oboe Organ Piano Piccolo Recorder Saxophone Tambourine Triangle Trombone
Trumpet Ukulele Violin Whistle Xylophone
Archery Badminton Baseball Basketball Billiards Bowling Boxing Cricket Curling Cycling Darts Fencing
Football Golf Gymnastics Hockey Judo Karate Lacrosse Polo Rugby Running Sailing Skating Skiing Soccer
Surfing Swimming Tennis Volleyball Wrestling
Alarm Antenna App Avatar Battery Browser Cable Calculator Camera Chip Circuit Clipboard Cloud Codec
Computer Console Cursor Database Desktop Disk Drone Email Engine Firewall Folder Gadget Harddrive
Headphones Icon Internet Joystick Keyboard Laptop Lens Microphone Modem Monitor Mouse Network Notebook
Pixel Plugin Printer Processor Router Scanner Screen Sensor Server Signal Smartphone Software Speaker
Tablet Terminal Token Touchscreen Upload Video Webcam Website Widget Wifi
Alchemist Amulet Anomaly Artifact Asteroid Aura Beacon Blade Blood Bomb Boomerang Bounty Bubble Bunker
Cape Catalyst Cipher Codex Colony Comet Compass Crystal Curse Dagger Dimension Dragon Dungeon Echo
Element Ember Empire Energy Entity Essence Expedition Explosion Fate Flame Fortune Galaxy Gate Gem
Ghost Glyph Grimoire Guardian Halo Hammer Harvest Haven Hazard Helix Herald Horizon Idol Illusion Impact
Impulse Inferno Infinity Inkwell Insight Instinct Intrigue Jewel Journey Keystone Kingdom Lantern Legacy
Legend Lens Leverage Lighthouse Limit Link Lore Machine Magic Magnet Manifesto Marble Mask Medal Memory
Meteor Miracle Mirror Mission Monument Moonlight Mystery Myth Nexus Nightfall Noble Nomad Oasis Obelisk
Obsidian Odyssey Oracle Orbit Origin Outpost Paradox Passage Pathway Pattern Phantom Phoenix Pilgrim
Pioneer Portal Prism Prophecy Pulse Pyramid Quest Radiance Realm Relic Resonance Riddle Ritual Rogue
Ruin Sanctuary Scroll Secret Sentinel Shadow Shard Shield Signal Silence Skeleton Skull Solstice Spark
Spectrum Spell Spirit Spire Starlight Statue Storm Summon Symbol Talisman Temple Threshold Thunder
Tide Totem Trail Treasure Triumph Tunnel Twilight Unity Valley Vanguard Vault Veil Vessel Vision Void
Vortex Voyage Warden Whisper Wonder
Badge Balloon Banner Barrel Basket Beacon Beaker Binoculars Blueprint Boardgame Bookmark Boomerang
Boulder Bouquet Bowtie Briefcase Brochure Bubble Bucket Bulletin Bulldozer Bunk Bed Butterfly Net
Cabinet Cactus Cage Calculator Calendar Camper Canoe Canvas Canteen Caravan Cardboard Carousel Cartwheel
Cassette Cauldron Caution Chain Chalkboard Chameleon Charm Chart Checkers Chimney Chisel Cholesterol
Cinnamon Circle Circus Clapperboard Clay Cleaver Clipboard Cloak Clothespin Clover Clownfish Club Coach
Coaster Cobra Cockpit Coconut Coil Colander Compass Cookie Jar Corkscorn Cornfield Corsage Cot Cotton
Counter Coupon Courtyard Cowbell Crayon Crib Cricket Croissant Crossbow Crowbar Crown Crutch Crystal
Cube Cuckoo Cucumber Cufflink Cupboard Curtain Cyclone Cymbal
`.trim().split(/\s+/);

const variedPath = join(root, 'scripts/codeword-varied-words.txt');
const variedWords = readFileSync(variedPath, 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

const EXTRA = `
Abacus Abalone Abyss Acorn Adapter Adhesive Aisle Altar Amethyst Ammonite Amphora Anemone Ankle
Anvil Apricot Arbor Arena Armchair Armpit Artery Artifact Ashtray Asphalt Asteroid Atlas Attic Attire
Aurora Autograph Axe Azure Badge Bagpipe Balcony Ballad Ballast Bandage Bandana Banister Banner Barbecue
Barbell Barcode Barnacle Barometer Barrel Basalt Basin Basket Bathtub Baton Battery Bayonet Beaker Beard
Bedspread Beehive Beet Belltower Belt Bench Beret Berry Beverage Bib Bicycle Bidet Binoculars Biography
Bison Blackboard Blade Blanket Blazer Blender Blimp Blinder Blister Blockboard Bloodstream Blouse Blueprint
Blizzard Boardwalk Bobcat Bolster Bonfire Bonnet Bookcase Bookend Booklet Bookmark Bookshelf Bootlace Borealis
Boulder Bougainvillea Bounty Bowler Boxer Boxspring Brace Bracket Braid Brake Branch Brand Brandy Brass
Breadbox Breakwater Breeze Brick Briefcase Broccoli Brochure Bronco Broomstick Brow Brush Bubblegum Bucket
Buckle Bud Budget Buffer Buggy Bulb Bulldog Bulwark Bumper Bun Bunker Buoy Bureau Burglar Burner Burrow
Bushel Butcher Buttercup Butterfly Buttonhole Cabinet Cactus Cadet Cage Cakestand Calamari Calculator Calender
Calligraphy Camcorder Camellia Camouflage Campfire Campsite Canal Canister Canopy Cantaloupe Canyon Caper
Capstone Capsule Caravan Cardigan Cargo Carillon Carriage Cartridge Carving Cascade Cashier Casserole
Cassock Castanet Caster Catapult Catfish Cattail Cauliflower Cavern Caviar Cedar Ceiling Celery Cellar
Cellphone Cement Centaur Cereal Chalice Chamber Chameleon Chandelier Chapbook Chaperone Chariot Charcoal
Charger Chartreuse Chassis Checkbook Checkpoint Cheetah Cheque Chessboard Chestnut Chiffon Chihuahua Chimney
Chisel Chive Cholesterol Chopstick Chorister Chromosome Chrysanthemum Churn Cider Cilantro Cinnamon Circle
Circuit Circus Citadel Citron Citrus Clam Clapper Clarinet Clasp Clay Cleaver Cliff Climber Clipper Cloak
Closet Clothespin Cloudburst Clover Clown Clump Coach Coal Coaster Cobblestone Cockatoo Cockpit Coconut
Codex Coffin Cog Coil Colander Coliseum Collar Collection Colonnade Colony Column Comb Comet Commode
Compass Compost Computer Conductor Conduit Cone Confetti Conga Conifer Console Constable Container Contrast
Cookbook Cookware Copier Coral Cord Corduroy Cork Corkscrew Cornfield Corral Corsage Corvette Cosmonaut
Costume Cottage Cotton Couch Cougar Counter Coupon Courtyard Cover Cowbell Coyote Cracker Cradle Craft
Crag Crane Crater Crayon Creche Credenza Creek Crepe Crib Cricket Crisp Crocodile Croissant Crossbow Crosswalk
Crowbar Crown Crucible Crutch Crystal Cubicle Cucumber Cufflink Cummerbund Cupboard Currant Curtain Cushion
Cutlery Cylinder Cymbal Dagger Dairy Damask Dandelion Dapper Dart Dashboard Database Daybreak Daylight Decade
Decanter Deck Deckchair Decor Deer Defibrillator Deli Delphinium Denim Dentist Derby Desert Desk Dessert
Detour Dew Diamond Diary Dice Diesel Dimple Diner Dingo Dinner Dinosaur Diploma Dishwasher Ditch Diver
Dock Document Doghouse Dollhouse Dolphin Dome Domino Donkey Doorbell Doorframe Doorhandle Doorknob Doorway
Doughnut Dragonfly Drainpipe Drapery Drawer Dresser Driftwood Drill Driveway Drone Dropcloth Drumstick Dryer
Duckling Dumbbell Dumpster Dune Duster Duvet Dweller Dynamite Eagle Earlobe Earring Earthworm Easel Eaves
Eclipse Ecosystem Edifice Eggplant Eiffel Elastic Elevator Elk Elm Embankment Ember Emerald Emblem Embroidery
Emerald Empire Enamel Enclosure Encyclopedia Engine Envelope Epaulette Equator Ermine Escalator Espresso
Essence Estuary Etching Eucalyptus Evaporator Evergreen Excerpt Exhibit Exit Expanse Explorer Eyebrow Eyelash
Fabric Factory Fairway Falcon Fallout Fanfare Farmhouse Fascia Fastener Faucet Feather Feature Fedora Fence
Fern Ferry Fertilizer Festival Fiddle Fieldstone Figurine Filament Filter Financier Fireplace Firework
Fishbowl Fishhook Fisherman Fishtank Fissure Flagpole Flamingo Flannel Flashlight Flask Flatbread Flax Fleece
Flicker Flippers Floodlight Floorboard Flour Flowerpot Flute Flypaper Flywheel Foam Fob Foghorn Foliage
Font Foodcourt Footbridge Footpath Footprint Footrest Footstool Forehead Forest Forge Forklift Formula
Fortress Fossil Fountain Foxglove Framework Freckle Freezer Fresco Fridge Frigate Frisbee Frog Frontage Frost
Fruitstand Fuchsia Fuel Funnel Furnace Furniture Fuselage Gadget Galleon Gallery Gallows Gameboard Gangplank
Garage Garbage Gardenia Gardener Garment Garrison Gasket Gatehouse Gateway Gazebo Gearbox Geisha Gemstone
Generator Genie Geography Geologist Geyser Gherkin Ghost Gimmick Ginger Girder Glacier Gladiator Glassware
Glider Glitter Globe Glockenspiel Glovebox Glossary Gnome Goalpost Goat Goblet Goggles Goldfish Gondola
Gong Goose Gopher Gorge Gourd Grackle Gradient Graffiti Grain Granary Grandstand Grapefruit Graph Gravel
Gravy Greenhouse Grenade Griffin Grille Grindstone Grocery Groove Groundhog Grove Grub Guardrail Guesthouse
Guidebook Guillotine Guitarist Gully Gymnasium Gypsum Gyroscope Haberdashery Hacksaw Hailstorm Hairbrush Hairclip
Hairpin Hallway Hamlet Hammock Hamster Handbag Handball Handcuff Handgrip Handkerchief Handle Handprint
Handrail Handshake Hangar Hangglider Harbor Hardcover Hardware Harmonica Harness Harpoon Harvester Hatbox
Hatchback Hatchet Haunch Haven Hawk Haystack Headband Headboard Headlight Headphone Headrest Headstone
Headwear Heartbeat Heater Hedgehog Heirloom Helicopter Helium Helmet Hemisphere Henhouse Herb Heron Hexagon
Hibiscus Hideaway Highway Hiker Hilltop Hinge Hippopotamus Histogram History Hobby Hobgoblin Hoe Hog Holster
Homestead Honeycomb Hoodie Hook Hoop Horizon Hornet Horsehair Horseshoe Hose Hospital Hostel Hotplate Hourglass
Houseboat Housefly Hovercraft Hubcap Hudson Hug Hydrant Hyena Hymn Hyphen Ibex Iceberg Icebox Icicle Icon
Igloo Illusion Image Impala Incense Incubator Index Indigo Industry Infant Infield Infrared Inkwell Inlet
Insect Insecticide Insignia Inspector Instep Instrument Insulation Intake Intercom Internet Intersection
Invention Invoice Iodine Iris Ironwork Islander Isotope Ivory Jackal Jacket Jackhammer Jacuzzi Jaguar Jalopy
Jam Jar Jasmine Jawbone Jaywalker Jazz Jeans Jeep Jellyfish Jester Jetpack Jeweler Jigsaw Jockey Jogger
Journal Journey Joystick Jubilee Judge Jug Juggler Juicebox Jukebox Jungle Juniper Junkyard Jurisdiction
Kangaroo Kayak Kebab Keeper Kennel Kettle Keycard Keyhole Keystone Khaki Kiosk Kitchen Kite Kitten Kiwi
Knapsack Kneepad Knickknack Knob Knot Knuckle Koala Koi Kraken Label Laboratory Ladder Ladles Lagoon Lakefront
Lamppost Landfill Landmark Landscape Lantern Lanyard Laptop Larch Lasso Lathe Lattice Launchpad Lava
Lavender Lawnmower Layout Leash Leather Lectern Ledger Legend Lemonade Lemur Lens Leopard Levee Lever Library
License Lifeboat Lifeguard Lifeline Lighthouse Lightning Lightship Lilac Limestone Limousine Linen Lioness
Lipstick Liquor Lizard Llama Loaf Lobby Lobster Locomotive Lodge Logbook Loggerhead Loggia Lollipop Longboat
Longitude Loop Lotion Lounger Luggage Lumberjack Luminary Lunchbox Luncheon Lung Lute Luxuriance Lynx Macaw
Machine Magazine Magnet Maiden Mailbox Mainframe Maintenance Maize Mallard Mallet Mammoth Manager Mandolin
Mango Manhole Mannequin Mansion Mantle Maple Marigold Marina Marker Marketplace Marmot Marquee Marshland
Martini Mask Masonry Mastiff Matador Matchbox Material Mattress Meadow Meerkat Megaphone Melody Melon Memoir
Mercury Meridian Mermaid Messenger Metal Meteorite Microchip Microphone Microscope Microwave Midfield Midnight
Milestone Milkshake Millstone Minaret Miner Mineral Minivan Mint Mirror Missile Mitten Moat Mobile Modem
Mohawk Molecule Monarch Monastery Money Mongoose Monitor Monkey Monocle Monolith Monument Moonbeam Mooring
Moose Morning Morse Mortar Mosaic Mosquito Motel Moth Motherboard Motor Motorbike Motorway Mound Mountain
Mousepad Mouthpiece Mudflat Muffin Mugshot Mulberry Mullet Mummy Mural Mushroom Musician Mustache Mustard
Muzzle Myriad Mystery Mythology Nailfile Nameplate Napkin Narrator Narrowneck Narwhal Nature Nautilus Navigator
Neckline Necklace Needle Neighbor Nemesis Neon Nest Netball Network Newsstand Nickel Nightfall Nightgown
Nightmare Nightstand Nobility Nomad Noodle Notebook Notepad Noticeboard Nucleus Nugget Numberplate Nunnery
Nursery Nutcracker Nutmeg Oak Oar Oasis Observatory Obelisk Oblivion Observatory Oceanographer Octagon Octopus
Odyssey Offender Officeholder Offspring Oilcloth Ointment Olive Omelette Onion Opal Opera Operetta Opponent
Optician Orangutan Orchard Orchestra Orchid Ore Oreo Organism Origami Ornament Orphanage Osprey Ostrich
Otter Outback Outfield Outhouse Outpost Oven Overcoat Overhang Overpass Owl Ox Oyster Pacemaker Paddle
Paddock Pagoda Paintbrush Paintroller Palace Palisade Palladium Palm Palomino Pamphlet Pantry Papaya Paperclip
Paperweight Parachute Paradigm Parakeet Parasol Parcel Parchment Parenthesis Parka Parking Parlor Parrot
Parsley Particle Partner Passageway Passport Pastry Pasture Patchwork Pathway Patio Patriot Patrol Pavement
Pavilion Pawnbroker Peach Peacock Peanut Pear Pearl Pebble Pedal Pedestal Pedigree Pelican Pencil Penguin
Peninsula Pennant Penny Peony Pepperoni Perch Perfume Periscope Permafrost Persona Pestle Petal Petunia
Pharaoh Phenomenon Philosopher Phonograph Photograph Physician Piccolo Pickaxe Pickle Picture Pier Pigeon
Pigment Pill Pillow Pilot Pinball Pineapple Pinewood Pingpong Pinion Pinnacle Pioneer Pipeline Piranha Pirate
Pistachio Pistol Pitcher Pitfall Pith Pizzeria Placemat Plankton Planner Plantations Plaster Plastic Plateau
Platinum Platoon Playground Playhouse Plough Plumber Plume Plunger Pocket Podium Poet Pointer Polaris Pole
Polish Politician Pollen Polo Polygon Pomade Pond Pony Popcorn Poppy Porcelain Porcupine Portal Portrait
Postage Postbox Poster Pottery Poultry Powder Powerplant Prairie Predator Prefecture Present Preserver Press
Pressure Pretzel Priest Primrose Printer Prism Prisoner Prize Prologue Promenade Prophet Prospect Protein
Province Prune Puberty Puddle Pulpit Pumpkin Punchline Puppet Puppy Purifier Purse Pyramid Quail Quarantine
Quarry Quarterback Quarters Quartz Quasar Quay Queen Quest Queue Quicksand Quill Quilt Quiver Quota Rabbit
Raccoon Racetrack Radar Radiator Radio Radish Raft Ragtime Railroad Raincoat Raindrop Rainforest Rake Ramp
Ranch Ranger Ransom Rapier Raptor Raspberry Ratchet Rattlesnake Ravine Razor Receipt Recipe Recliner Record
Recruit Rectangle Redwood Reef Referee Refinery Refrigerator Refuge Regatta Region Register Regulator Reindeer
Relay Relic Remedy Remnant Renaissance Rendezvous Repellent Reporter Reservoir Resin Restaurant Retainer
Retreat Revolver Rhinoceros Ribbon Rifle Rigging Rim Ring Roadster Robe Robin Robot Rockfall Rocket Rodent
Roller Rollerskate Rooftop Roommate Ropeway Rosebud Rosette Rotor Roundabout Rowboat Royalty Rubric Rudder
Rugby Ruler Rumor Runner Runway Rust Rutabaga Saddle Safari Safekeeping Sailor Salad Salmon Salon Saloon
Saltshaker Salvage Samurai Sandals Sandbar Sandcastle Sandpaper Sandwich Sapling Sardine Satellite Saucepan
Saucer Sauna Savannah Sawdust Saxophone Scaffolding Scarecrow Scarf Scatter Scenery Scholar Schoolhouse Scissors
Scooter Scorpio Scorpion Scout Scramble Scrapbook Scraper Screenplay Screwdriver Scribe Scroll Scrubland Scuba
Sculpture Scythe Seagull Seahorse Sealant Seaplane Searchlight Seashell Season Seatbelt Seaweed Seclusion
Secretary Sedan Seedling Seesaw Segway Seismograph Semaphore Semicolon Senator Seneca Sentinel Sepia Sequence
Serpent Servant Sesame Settee Sewer Shackle Shadow Shaft Shampoo Shanty Shark Sharpen Shatter Shed Sheepdog
Shepherd Sherbet Shield Shift Shimmer Shipyard Shirt Shockwave Shoehorn Shopkeeper Shoreline Shortbread Shotgun
Shoulder Shovel Showcase Shrapnel Shrubbery Shutter Shuttle Sickle Sidewalk Siesta Signal Signature Silhouette
Silk Silo Silverware Simulator Singularity Sink Siren Skeleton Sketchbook Skiing Skylight Skyline Skyscraper
Slalom Slate Sledge Sleet Sleeve Slingshot Slipper Sloth Slug Smokestack Snail Snake Snapper Snapshot Snowball
Snowboard Snowflake Snowman Snowstorm Soapbox Soccer Social Sock Socket Sod Softball Software Soil Solar
Soldier Solstice Sombrero Sonata Songbird Sonnet Sorcerer Souvenir Spade Sparrow Spatula Speaker Spear Spectacle
Spectrum Specimen Speedboat Sphere Sphinx Spice Spider Spindle Spiral Spire Spitfire Sponge Spoon Spotlight
Spray Spring Springboard Sprinkler Spruce Spur Spyglass Squash Squid Squirrel Stadium Stagecoach Stain Staircase
Stakeholder Stallion Stamp Standpoint Stapler Starboard Starfish Station Statue Steamboat Steeple Stem Stencil
Steppe Steward Stick Stiletto Stingray Stockade Stocking Stomach Stool Stormcloud Stove Strait Strawberry
Stream Streetcar Stretcher Strudel Studio Stump Submarine Suburb Subway Succulent Suitcase Sultan Summertime
Sunbeam Sunburn Sundial Sunflower Sunglasses Sunlight Sunrise Sunset Sunshade Supermarket Supper Surface
Surfboard Surgeon Surround Survey Suspenders Swamp Swan Sweater Sweeper Sweetener Swimmer Swing Switchboard
Swordfish Syllable Symphony Synagogue Synapse Syrup Tablecloth Tablespoon Tablet Tadpole Tailor Talc Tangerine
Tankard Tapestry Tarantula Target Tarmac Tarpaulin Tart Taskmaster Tassel Tattoo Tavern Taxidermy Teacup Teapot
Technician Teddy Teeter Telecast Telegraph Telescope Television Tempest Temple Tenant Tennis Tentacle Terminal
Terrace Terrarium Thatch Theater Thermometer Thermos Thicket Thimble Thorn Throne Thumbnail Thunder Thunderbolt
Tiara Ticket Tidal Tidbit Tiger Tightrope Tile Timber Timepiece Timetable Tinsel Tipper Tire Tissue Titan
Toad Toast Toaster Toboggan Toffee Tofu Tomato Tombstone Toolbox Toothbrush Toothpaste Topaz Topiary Tornado
Torpedo Tortoise Totem Toucan Tower Townhouse Toybox Tractor Traffic Trailblazer Trampoline Trance Transcript
Transformer Transit Trapdoor Trapeze Traveler Treadmill Treasure Treasury Treetop Trench Trestle Triangle Tribune
Tricycle Trident Trifle Trigger Trilogy Trim Trio Tripod Trolley Trombone Trophy Trough Trowel Truck Truffle
Trumpet Trunk Tsunami Tub Tuba Tugboat Tulip Tumbleweed Tunic Tunnel Turbine Turban Turf Turkey Turnip Turquoise
Turret Turtle Tuxedo Twig Twine Typhoon Tyre Udder Ukulele Ulcer Umbrella Underpass Undertaker Unicorn Uniform
Union Unit Universe University Uppercut Urchin Urn Utility Vacation Vaccine Vacuum Vale Valley Valor Vamp
Vanilla Vanish Vault Vellum Vendor Venturer Veranda Verdict Vermin Vestibule Vial Vicar Victim Victory Video
Vigil Village Vinegar Vineyard Violin Violet Viper Visitor Vista Vitality Vivid Vocabulary Volcano Volt
Volume Vortex Vote Voucher Voyage Wagon Waistcoat Waiter Walkway Wallaby Wallet Walnut Walrus Wardrobe Warehouse
Warden Warlock Warmth Warning Warrant Warrior Warship Wasp Watchtower Watercolor Waterfall Watermelon Waterway
Waveform Wax Wayfarer Weapon Weather Weathervane Weaver Webcam Wedding Wedge Weedkiller Weekend Weightlifter
Wellspring Werewolf Westward Whale Wharf Wheat Wheelbarrow Wheelchair Whirlpool Whisker Whisky Whisper Whistle
Whiteboard Widow Widget Wilderness Wildfire Willpower Willow Windmill Windowpane Windshield Winery Wingtip
Wintergreen Wire Wiretap Wisdom Wishbone Wisteria Wizard Wolfhound Womanhood Woodchuck Woodpecker Woodwind
Workbench Workshop Worldworm Wormhole Wreath Wrench Wrestler Wrinkle Wristwatch Writer Yacht Yardstick Yarn
Yearbook Yeast Yellowjacket Yield Yodel Yogurt Yoke Youth Yurt Zebra Zephyr Zero Zigzag Zinc Zinnia Zipper
Zodiac Zombie Zone Zookeeper Zucchini
`.trim().split(/\s+/);

addFromList(variedWords);
addFromList(RAW);
addFromList(EXTRA);

pool.sort((a, b) => a.localeCompare(b));

const finalPool = pool.slice(0, TARGET);
const lines = [];
for (let i = 0; i < finalPool.length; i += 8) {
  const chunk = finalPool.slice(i, i + 8).map((w) => `'${w.replace(/'/g, "\\'")}'`).join(', ');
  lines.push(`  ${chunk},`);
}

const out = `/**
 * Default word pool for the Codeword game (${finalPool.length} words).
 * Clue-friendly mix of objects, actions, movies, TV, subjects, games,
 * feelings, places, and ideas so random 4-word cards stay varied.
 */
export const CODEWORD_POOL: string[] = [
${lines.join('\n')}
];
`;

writeFileSync(poolPath, out, 'utf8');
console.log(
  `Wrote ${finalPool.length} words (${existingCount} kept + ${finalPool.length - existingCount} new) to src/data/codeword-pool.ts`,
);
