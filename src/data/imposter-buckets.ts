/**
 * Default word-bucket pool for the Imposter game.
 * Each bucket holds four mainstream, closely related words — everyday things
 * or household-name pop culture — so everyone at the table knows them and
 * one-word clues genuinely overlap.
 *
 * Vetting rules:
 * 1. Words should be recognisable to the group playing (mainstream + shared
 *    niche interests like Marvel, K-pop, The Boys, computers, etc.).
 * 2. All four words must share the same narrow category (same show, species,
 *    food type, etc.) so the imposter isn't obvious.
 */
export const IMPOSTER_BUCKETS: { words: [string, string, string, string] }[] = [
  // ── Superheroes (household names only) ───────────────────────────
  { words: ['Iron Man', 'Captain America', 'Thor', 'Hulk'] },
  { words: ['Batman', 'Superman', 'Wonder Woman', 'Flash'] },
  { words: ['Spider-Man', 'Wolverine', 'Deadpool', 'Black Panther'] },
  { words: ['Joker', 'Riddler', 'Penguin', 'Two-Face'] },
  { words: ['Thanos', 'Loki', 'Ultron', 'Venom'] },

  // ── Marvel — deeper cuts (still widely known) ────────────────────
  { words: ['Doctor Strange', 'Scarlet Witch', 'Vision', 'Wong'] },
  { words: ['Black Widow', 'Hawkeye', 'Falcon', 'Winter Soldier'] },
  { words: ['Star-Lord', 'Gamora', 'Drax', 'Rocket'] },
  { words: ['Wolverine', 'Cyclops', 'Storm', 'Jean Grey'] },
  { words: ['Green Goblin', 'Doctor Octopus', 'Venom', 'Sandman'] },
  { words: ['Magneto', 'Mystique', 'Sabretooth', 'Juggernaut'] },
  { words: ['Captain Marvel', 'Ms. Marvel', 'She-Hulk', 'Nick Fury'] },

  // ── DC — deeper cuts ─────────────────────────────────────────────
  { words: ['Aquaman', 'Mera', 'Ocean Master', 'Black Manta'] },
  { words: ['Green Lantern', 'Green Arrow', 'Shazam', 'Black Adam'] },
  { words: ['Robin', 'Nightwing', 'Batgirl', 'Red Hood'] },
  { words: ['Lex Luthor', 'Darkseid', 'Doomsday', 'Brainiac'] },
  { words: ['Harley Quinn', 'Catwoman', 'Poison Ivy', 'Bane'] },
  { words: ['Flash', 'Reverse Flash', 'Supergirl', 'Cyborg'] },

  // ── Star Wars (original trilogy icons) ───────────────────────────
  { words: ['Luke Skywalker', 'Princess Leia', 'Han Solo', 'Chewbacca'] },
  { words: ['Darth Vader', 'Yoda', 'Obi-Wan', 'Emperor Palpatine'] },

  // ── Harry Potter (main cast) ─────────────────────────────────────
  { words: ['Harry Potter', 'Hermione', 'Ron Weasley', 'Dumbledore'] },
  { words: ['Voldemort', 'Snape', 'Hagrid', 'Dobby'] },

  // ── Disney & Pixar (biggest hits) ────────────────────────────────
  { words: ['Mickey Mouse', 'Minnie Mouse', 'Donald Duck', 'Goofy'] },
  { words: ['Elsa', 'Anna', 'Olaf', 'Kristoff'] },
  { words: ['Simba', 'Mufasa', 'Timon', 'Pumbaa'] },
  { words: ['Woody', 'Buzz Lightyear', 'Jessie', 'Mr. Potato Head'] },
  { words: ['Nemo', 'Dory', 'Marlin', 'Bruce'] },
  { words: ['Cinderella', 'Belle', 'Ariel', 'Snow White'] },
  { words: ['Aladdin', 'Jasmine', 'Genie', 'Jafar'] },

  // ── TV — sitcoms everyone knows ──────────────────────────────────
  { words: ['Homer Simpson', 'Marge Simpson', 'Bart Simpson', 'Lisa Simpson'] },
  { words: ['Ross', 'Rachel', 'Monica', 'Chandler'] },
  { words: ['Jerry', 'George', 'Elaine', 'Kramer'] },
  { words: ['Michael Scott', 'Dwight', 'Jim', 'Pam'] },
  { words: ['Sheldon', 'Leonard', 'Penny', 'Raj'] },

  // ── TV — other mainstream ────────────────────────────────────────
  { words: ['Walter White', 'Jesse Pinkman', 'Saul Goodman', 'Mike'] },
  { words: ['Jon Snow', 'Daenerys', 'Tyrion', 'Arya'] },
  { words: ['Eleven', 'Mike', 'Dustin', 'Lucas'] },

  // ── TV — shared niche (still tight per show) ─────────────────────
  { words: ['Homelander', 'Butcher', 'Starlight', 'Hughie'] },
  { words: ['A-Train', 'The Deep', 'Maeve', 'Black Noir'] },
  { words: ['Invincible', 'Omni-Man', 'Atom Eve', 'Red Rush'] },
  { words: ['Rick', 'Morty', 'Summer', 'Beth'] },
  { words: ['Naruto', 'Sasuke', 'Sakura', 'Kakashi'] },
  { words: ['Goku', 'Vegeta', 'Gohan', 'Trunks'] },
  { words: ['Luffy', 'Zoro', 'Nami', 'Sanji'] },
  { words: ['Aang', 'Katara', 'Sokka', 'Zuko'] },

  // ── Cartoons & kids ──────────────────────────────────────────────
  { words: ['SpongeBob', 'Patrick', 'Squidward', 'Mr. Krabs'] },
  { words: ['Pikachu', 'Charizard', 'Bulbasaur', 'Squirtle'] },
  { words: ['Mario', 'Luigi', 'Bowser', 'Peach'] },
  { words: ['Sonic', 'Mario', 'Link', 'Kirby'] },

  // ── Music — global megastars ─────────────────────────────────────
  { words: ['Taylor Swift', 'Beyoncé', 'Rihanna', 'Adele'] },
  { words: ['Michael Jackson', 'Elvis Presley', 'Prince', 'Madonna'] },
  { words: ['Drake', 'Kanye West', 'Eminem', 'Jay-Z'] },
  { words: ['Ed Sheeran', 'Justin Bieber', 'Bruno Mars', 'The Weeknd'] },
  { words: ['The Beatles', 'Queen', 'ABBA', 'Coldplay'] },

  // ── Music — K-pop & current pop ──────────────────────────────────
  { words: ['Blackpink', 'BTS', 'Twice', 'Stray Kids'] },
  { words: ['NewJeans', 'IVE', 'aespa', 'LE SSERAFIM'] },
  { words: ['Ed Sheeran', 'Bruno Mars', 'Shawn Mendes', 'Charlie Puth'] },
  { words: ['Billie Eilish', 'Olivia Rodrigo', 'Dua Lipa', 'Doja Cat'] },
  { words: ['Ariana Grande', 'Selena Gomez', 'Miley Cyrus', 'Demi Lovato'] },
  { words: ['Post Malone', 'Travis Scott', 'Lil Nas X', 'Bad Bunny'] },
  { words: ['Harry Styles', 'Zayn Malik', 'Liam Payne', 'Niall Horan'] },

  // ── Sports — legends ─────────────────────────────────────────────
  { words: ['Michael Jordan', 'LeBron James', 'Kobe Bryant', 'Stephen Curry'] },
  { words: ['Messi', 'Ronaldo', 'Neymar', 'Mbappé'] },
  { words: ['Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Serena Williams'] },

  // ── Sports — the games themselves ────────────────────────────────
  { words: ['Soccer', 'Basketball', 'Tennis', 'Golf'] },
  { words: ['Baseball', 'Football', 'Hockey', 'Boxing'] },
  { words: ['Swimming', 'Running', 'Cycling', 'Skiing'] },
  { words: ['Cricket', 'Rugby', 'Volleyball', 'Badminton'] },

  // ── Fast food & chains ───────────────────────────────────────────
  { words: ['McDonald\'s', 'Burger King', 'KFC', 'Subway'] },
  { words: ['Starbucks', 'Dunkin\'', 'Domino\'s', 'Pizza Hut'] },
  { words: ['Taco Bell', 'Wendy\'s', 'Chipotle', 'Five Guys'] },

  // ── Drinks ───────────────────────────────────────────────────────
  { words: ['Coffee', 'Tea', 'Espresso', 'Latte'] },
  { words: ['Coke', 'Pepsi', 'Sprite', 'Fanta'] },
  { words: ['Beer', 'Wine', 'Whisky', 'Vodka'] },
  { words: ['Orange Juice', 'Apple Juice', 'Lemonade', 'Milkshake'] },

  // ── Breakfast & bakery ───────────────────────────────────────────
  { words: ['Pancake', 'Waffle', 'French Toast', 'Cereal'] },
  { words: ['Bagel', 'Donut', 'Muffin', 'Croissant'] },
  { words: ['Eggs', 'Bacon', 'Toast', 'Oatmeal'] },

  // ── Fast food meals ──────────────────────────────────────────────
  { words: ['Pizza', 'Burger', 'Hot Dog', 'Fries'] },
  { words: ['Taco', 'Burrito', 'Nachos', 'Quesadilla'] },
  { words: ['Sandwich', 'Wrap', 'Sub', 'Panini'] },
  { words: ['Fried Chicken', 'Nuggets', 'Wings', 'Tenders'] },

  // ── Pasta & Italian ──────────────────────────────────────────────
  { words: ['Spaghetti', 'Penne', 'Lasagna', 'Mac and Cheese'] },
  { words: ['Pepperoni Pizza', 'Cheese Pizza', 'Margherita', 'Hawaiian Pizza'] },

  // ── Asian food (well known) ──────────────────────────────────────
  { words: ['Sushi', 'Ramen', 'Fried Rice', 'Dumplings'] },
  { words: ['Pad Thai', 'Curry', 'Noodles', 'Spring Rolls'] },

  // ── Desserts & sweets ────────────────────────────────────────────
  { words: ['Ice Cream', 'Cake', 'Cookies', 'Brownies'] },
  { words: ['Chocolate', 'Candy', 'Gummy Bears', 'Lollipop'] },
  { words: ['Apple Pie', 'Cheesecake', 'Cupcake', 'Donut'] },

  // ── Fruit ────────────────────────────────────────────────────────
  { words: ['Apple', 'Banana', 'Orange', 'Grape'] },
  { words: ['Strawberry', 'Blueberry', 'Raspberry', 'Watermelon'] },
  { words: ['Mango', 'Pineapple', 'Peach', 'Cherry'] },
  { words: ['Lemon', 'Lime', 'Grapefruit', 'Kiwi'] },

  // ── Vegetables ───────────────────────────────────────────────────
  { words: ['Carrot', 'Broccoli', 'Corn', 'Peas'] },
  { words: ['Potato', 'Tomato', 'Onion', 'Lettuce'] },
  { words: ['Cucumber', 'Pepper', 'Celery', 'Spinach'] },
  { words: ['Pumpkin', 'Mushroom', 'Garlic', 'Avocado'] },

  // ── Snacks ───────────────────────────────────────────────────────
  { words: ['Chips', 'Popcorn', 'Pretzels', 'Crackers'] },
  { words: ['Peanuts', 'Almonds', 'Cashews', 'Pistachios'] },
  { words: ['Granola Bar', 'Trail Mix', 'Jerky', 'Cheese Puffs'] },

  // ── Pets & common animals ──────────────────────────────────────────
  { words: ['Dog', 'Cat', 'Fish', 'Hamster'] },
  { words: ['Golden Retriever', 'Labrador', 'Poodle', 'Bulldog'] },
  { words: ['Kitten', 'Puppy', 'Bunny', 'Guinea Pig'] },

  // ── Farm animals ─────────────────────────────────────────────────
  { words: ['Cow', 'Pig', 'Sheep', 'Chicken'] },
  { words: ['Horse', 'Goat', 'Duck', 'Turkey'] },

  // ── Wild animals — zoo favourites ────────────────────────────────
  { words: ['Lion', 'Tiger', 'Bear', 'Elephant'] },
  { words: ['Giraffe', 'Zebra', 'Monkey', 'Gorilla'] },
  { words: ['Panda', 'Koala', 'Kangaroo', 'Penguin'] },
  { words: ['Dolphin', 'Shark', 'Whale', 'Octopus'] },
  { words: ['Eagle', 'Owl', 'Parrot', 'Flamingo'] },
  { words: ['Snake', 'Crocodile', 'Frog', 'Turtle'] },

  // ── Insects & small creatures ────────────────────────────────────
  { words: ['Butterfly', 'Bee', 'Ladybug', 'Ant'] },
  { words: ['Spider', 'Mosquito', 'Fly', 'Worm'] },

  // ── Vehicles ─────────────────────────────────────────────────────
  { words: ['Car', 'Bus', 'Train', 'Airplane'] },
  { words: ['Bicycle', 'Motorcycle', 'Scooter', 'Skateboard'] },
  { words: ['Truck', 'Van', 'Taxi', 'Ambulance'] },
  { words: ['Boat', 'Ship', 'Submarine', 'Helicopter'] },

  // ── Car brands everyone knows ────────────────────────────────────
  { words: ['Toyota', 'Honda', 'Ford', 'BMW'] },
  { words: ['Mercedes', 'Tesla', 'Ferrari', 'Porsche'] },

  // ── Jobs ─────────────────────────────────────────────────────────
  { words: ['Doctor', 'Nurse', 'Teacher', 'Police Officer'] },
  { words: ['Chef', 'Waiter', 'Pilot', 'Firefighter'] },
  { words: ['Lawyer', 'Engineer', 'Artist', 'Scientist'] },
  { words: ['Actor', 'Singer', 'Athlete', 'Writer'] },

  // ── School & office ──────────────────────────────────────────────
  { words: ['Pencil', 'Pen', 'Eraser', 'Ruler'] },
  { words: ['Notebook', 'Backpack', 'Calculator', 'Scissors'] },
  { words: ['Computer', 'Phone', 'Tablet', 'Printer'] },

  // ── Household rooms & furniture ────────────────────────────────────
  { words: ['Bed', 'Sofa', 'Chair', 'Table'] },
  { words: ['Kitchen', 'Bedroom', 'Bathroom', 'Living Room'] },
  { words: ['Fridge', 'Oven', 'Microwave', 'Dishwasher'] },
  { words: ['Lamp', 'Mirror', 'Clock', 'Carpet'] },

  // ── Clothing ─────────────────────────────────────────────────────
  { words: ['T-Shirt', 'Jeans', 'Jacket', 'Sweater'] },
  { words: ['Shoes', 'Sneakers', 'Boots', 'Sandals'] },
  { words: ['Hat', 'Cap', 'Scarf', 'Gloves'] },
  { words: ['Dress', 'Skirt', 'Shorts', 'Socks'] },

  // ── Colours ──────────────────────────────────────────────────────
  { words: ['Red', 'Blue', 'Green', 'Yellow'] },
  { words: ['Black', 'White', 'Grey', 'Brown'] },
  { words: ['Pink', 'Purple', 'Orange', 'Gold'] },

  // ── Weather ──────────────────────────────────────────────────────
  { words: ['Sun', 'Rain', 'Snow', 'Cloud'] },
  { words: ['Thunder', 'Lightning', 'Wind', 'Fog'] },
  { words: ['Hot', 'Cold', 'Warm', 'Windy'] },

  // ── Seasons & holidays ───────────────────────────────────────────
  { words: ['Spring', 'Summer', 'Autumn', 'Winter'] },
  { words: ['Christmas', 'Halloween', 'Easter', 'Thanksgiving'] },
  { words: ['Birthday', 'Wedding', 'New Year', 'Valentine\'s Day'] },

  // ── Places ───────────────────────────────────────────────────────
  { words: ['Beach', 'Mountain', 'Forest', 'Desert'] },
  { words: ['Park', 'Mall', 'Airport', 'Hospital'] },
  { words: ['School', 'Library', 'Museum', 'Stadium'] },
  { words: ['Restaurant', 'Hotel', 'Cinema', 'Gym'] },

  // ── Countries (very well known) ──────────────────────────────────
  { words: ['USA', 'Canada', 'Mexico', 'Brazil'] },
  { words: ['England', 'France', 'Germany', 'Italy'] },
  { words: ['Spain', 'China', 'Japan', 'India'] },
  { words: ['Australia', 'Egypt', 'Greece', 'Russia'] },

  // ── Cities (iconic) ──────────────────────────────────────────────
  { words: ['New York', 'Los Angeles', 'London', 'Paris'] },
  { words: ['Tokyo', 'Sydney', 'Dubai', 'Rome'] },
  { words: ['Las Vegas', 'Miami', 'Chicago', 'San Francisco'] },

  // ── Landmarks ────────────────────────────────────────────────────
  { words: ['Eiffel Tower', 'Statue of Liberty', 'Big Ben', 'Colosseum'] },
  { words: ['Great Wall', 'Pyramids', 'Taj Mahal', 'Stonehenge'] },

  // ── Planets & space (school-level) ───────────────────────────────
  { words: ['Mercury', 'Venus', 'Mars', 'Jupiter'] },
  { words: ['Saturn', 'Neptune', 'Uranus', 'Pluto'] },
  { words: ['Sun', 'Moon', 'Stars', 'Earth'] },

  // ── Body parts ───────────────────────────────────────────────────
  { words: ['Head', 'Hand', 'Foot', 'Arm'] },
  { words: ['Eye', 'Ear', 'Nose', 'Mouth'] },
  { words: ['Heart', 'Brain', 'Lungs', 'Stomach'] },

  // ── Emotions ─────────────────────────────────────────────────────
  { words: ['Happy', 'Sad', 'Angry', 'Scared'] },
  { words: ['Excited', 'Tired', 'Bored', 'Surprised'] },
  { words: ['Love', 'Hate', 'Jealous', 'Proud'] },

  // ── Hobbies & activities ─────────────────────────────────────────
  { words: ['Reading', 'Gaming', 'Cooking', 'Dancing'] },
  { words: ['Swimming', 'Hiking', 'Camping', 'Fishing'] },
  { words: ['Drawing', 'Photography', 'Shopping', 'Traveling'] },

  // ── Video games (mainstream) ─────────────────────────────────────
  { words: ['Minecraft', 'Fortnite', 'Roblox', 'Among Us'] },
  { words: ['Mario', 'Zelda', 'Pokémon', 'Call of Duty'] },
  { words: ['GTA', 'FIFA', 'Pac-Man', 'Tetris'] },

  // ── Social media & tech brands ───────────────────────────────────
  { words: ['Instagram', 'TikTok', 'YouTube', 'Facebook'] },
  { words: ['Google', 'Apple', 'Amazon', 'Netflix'] },
  { words: ['iPhone', 'iPad', 'PlayStation', 'Xbox'] },

  // ── Computers & tech (friend-group niche) ────────────────────────
  { words: ['Python', 'JavaScript', 'Java', 'C++'] },
  { words: ['TypeScript', 'Rust', 'Go', 'Swift'] },
  { words: ['Windows', 'macOS', 'Linux', 'Chrome OS'] },
  { words: ['Chrome', 'Firefox', 'Safari', 'Edge'] },
  { words: ['CPU', 'GPU', 'RAM', 'SSD'] },
  { words: ['Keyboard', 'Mouse', 'Monitor', 'Headphones'] },
  { words: ['ChatGPT', 'Claude', 'Gemini', 'Copilot'] },
  { words: ['GitHub', 'GitLab', 'VS Code', 'Stack Overflow'] },
  { words: ['Wi-Fi', 'Bluetooth', 'USB-C', 'HDMI'] },
  { words: ['Intel', 'AMD', 'NVIDIA', 'Apple Silicon'] },
  { words: ['Docker', 'Kubernetes', 'AWS', 'Azure'] },

  // ── Movies (blockbusters) ────────────────────────────────────────
  { words: ['Titanic', 'Avatar', 'Jurassic Park', 'The Lion King'] },
  { words: ['Frozen', 'Toy Story', 'Shrek', 'Finding Nemo'] },

  // ── Board & card games ───────────────────────────────────────────
  { words: ['Monopoly', 'Scrabble', 'Chess', 'Checkers'] },
  { words: ['Uno', 'Poker', 'Blackjack', 'Solitaire'] },
  { words: ['Jenga', 'Twister', 'Clue', 'Risk'] },

  // ── Musical instruments (common) ─────────────────────────────────
  { words: ['Piano', 'Guitar', 'Drums', 'Violin'] },
  { words: ['Trumpet', 'Flute', 'Saxophone', 'Microphone'] },

  // ── Fairy tales & fantasy (universal) ────────────────────────────
  { words: ['Dragon', 'Unicorn', 'Princess', 'Knight'] },
  { words: ['Wizard', 'Witch', 'Fairy', 'Giant'] },
  { words: ['Vampire', 'Werewolf', 'Zombie', 'Ghost'] },
  { words: ['Santa Claus', 'Tooth Fairy', 'Easter Bunny', 'Elf'] },

  // ── Greek mythology (school basics) ────────────────────────────────
  { words: ['Zeus', 'Poseidon', 'Hades', 'Athena'] },
  { words: ['Hercules', 'Medusa', 'Minotaur', 'Pegasus'] },

  // ── Shapes & numbers ─────────────────────────────────────────────
  { words: ['Circle', 'Square', 'Triangle', 'Rectangle'] },
  { words: ['One', 'Two', 'Three', 'Four'] },

  // ── Time ─────────────────────────────────────────────────────────
  { words: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'] },
  { words: ['Morning', 'Afternoon', 'Evening', 'Night'] },
  { words: ['Today', 'Tomorrow', 'Yesterday', 'Weekend'] },

  // ── Family ───────────────────────────────────────────────────────
  { words: ['Mother', 'Father', 'Sister', 'Brother'] },
  { words: ['Grandma', 'Grandpa', 'Aunt', 'Uncle'] },
  { words: ['Baby', 'Child', 'Teenager', 'Adult'] },

  // ── Money & shopping ─────────────────────────────────────────────
  { words: ['Dollar', 'Euro', 'Pound', 'Credit Card'] },
  { words: ['Cash', 'Wallet', 'Receipt', 'Sale'] },

  // ── Nature ───────────────────────────────────────────────────────
  { words: ['Tree', 'Flower', 'Grass', 'Leaf'] },
  { words: ['Rose', 'Sunflower', 'Tulip', 'Daisy'] },
  { words: ['River', 'Lake', 'Ocean', 'Waterfall'] },
  { words: ['Rock', 'Sand', 'Mud', 'Ice'] },

  // ── Tools & hardware ─────────────────────────────────────────────
  { words: ['Hammer', 'Screwdriver', 'Wrench', 'Saw'] },
  { words: ['Nail', 'Screw', 'Tape', 'Glue'] },

  // ── Bathroom & personal care ───────────────────────────────────────
  { words: ['Toothbrush', 'Toothpaste', 'Shampoo', 'Soap'] },
  { words: ['Towel', 'Mirror', 'Comb', 'Perfume'] },

  // ── Supermarket aisles ───────────────────────────────────────────
  { words: ['Bread', 'Milk', 'Butter', 'Eggs'] },
  { words: ['Rice', 'Pasta', 'Flour', 'Sugar'] },
  { words: ['Salt', 'Pepper', 'Ketchup', 'Mustard'] },
  { words: ['Cereal', 'Soup', 'Tuna', 'Peanut Butter'] },

  // ── Pizza & toppings ─────────────────────────────────────────────
  { words: ['Pepperoni', 'Mushroom', 'Olives', 'Pineapple'] },
  { words: ['Cheese', 'Sausage', 'Bacon', 'Onion'] },

  // ── Ice cream flavours ─────────────────────────────────────────────
  { words: ['Vanilla', 'Chocolate', 'Strawberry', 'Mint'] },
  { words: ['Cookie Dough', 'Rocky Road', 'Caramel', 'Neapolitan'] },

  // ── Coffee shop menu ─────────────────────────────────────────────
  { words: ['Latte', 'Cappuccino', 'Americano', 'Mocha'] },
  { words: ['Iced Coffee', 'Frappuccino', 'Hot Chocolate', 'Smoothie'] },

  // ── Airport & travel ─────────────────────────────────────────────
  { words: ['Passport', 'Luggage', 'Ticket', 'Boarding Pass'] },
  { words: ['Pilot', 'Flight Attendant', 'Customs', 'Gate'] },

  // ── Beach & pool ─────────────────────────────────────────────────
  { words: ['Swimsuit', 'Sunscreen', 'Towel', 'Sunglasses'] },
  { words: ['Surfboard', 'Sandcastle', 'Seashell', 'Flip-Flops'] },

  // ── Camping ──────────────────────────────────────────────────────
  { words: ['Tent', 'Sleeping Bag', 'Campfire', 'Flashlight'] },
  { words: ['Backpack', 'Compass', 'Map', 'Marshmallow'] },

  // ── Wedding ──────────────────────────────────────────────────────
  { words: ['Bride', 'Groom', 'Ring', 'Cake'] },
  { words: ['Flowers', 'Dress', 'Tuxedo', 'Honeymoon'] },

  // ── Baby things ──────────────────────────────────────────────────
  { words: ['Diaper', 'Bottle', 'Stroller', 'Crib'] },
  { words: ['Pacifier', 'Rattle', 'Blanket', 'Lullaby'] },

  // ── Gym & fitness ────────────────────────────────────────────────
  { words: ['Dumbbell', 'Treadmill', 'Yoga', 'Push-ups'] },
  { words: ['Protein Shake', 'Gym Bag', 'Sweat', 'Stretching'] },

  // ── Meme & mascot characters ─────────────────────────────────────
  { words: ['Minions', 'Gru', 'Bob', 'Kevin'] },
  { words: ['Garfield', 'Odie', 'Jon', 'Nermal'] },
  { words: ['Snoopy', 'Charlie Brown', 'Woodstock', 'Linus'] },
  { words: ['Hello Kitty', 'Keroppi', 'My Melody', 'Kuromi'] },
];
