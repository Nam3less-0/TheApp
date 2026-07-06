import type { Topic } from '../../games/house-of-cards/types';

export const TOPIC_POOL: Topic[] = [
  {
    id: 'geography',
    name: 'Geography',
    difficulties: {
      1: [
        { id: 'geo-1-a', question: 'What is the largest ocean on Earth?', answer: 'Pacific Ocean' },
        { id: 'geo-1-b', question: 'On which continent is the Sahara Desert?', answer: 'Africa' },
        { id: 'geo-1-c', question: 'What is the tallest mountain on Earth?', answer: 'Mount Everest' },
      ],
      2: [
        { id: 'geo-2-a', question: 'What is the capital of France?', answer: 'Paris' },
        { id: 'geo-2-b', question: 'What is the capital of Japan?', answer: 'Tokyo' },
        { id: 'geo-2-c', question: 'What is the capital of Italy?', answer: 'Rome' },
      ],
      3: [
        { id: 'geo-3-a', question: 'What is the capital of Canada?', answer: 'Ottawa' },
        { id: 'geo-3-b', question: 'What is the largest country in the world by area?', answer: 'Russia' },
        { id: 'geo-3-c', question: 'What is the capital of Australia?', answer: 'Canberra' },
      ],
      4: [
        { id: 'geo-4-a', question: 'What is the smallest country in the world by area?', answer: 'Vatican City' },
        { id: 'geo-4-b', question: 'What is the largest hot desert in the world?', answer: 'The Sahara' },
        { id: 'geo-4-c', question: 'What is the capital of Spain?', answer: 'Madrid' },
      ],
      5: [
        { id: 'geo-5-a', question: 'What is the capital of Brazil?', answer: 'Brasília' },
        { id: 'geo-5-b', question: 'Which strait separates Spain from Morocco?', answer: 'Strait of Gibraltar' },
        { id: 'geo-5-c', question: 'What is the largest island in the world?', answer: 'Greenland' },
      ],
      6: [
        { id: 'geo-6-a', question: 'What is the capital of Turkey?', answer: 'Ankara' },
        { id: 'geo-6-b', question: 'What is the capital of New Zealand?', answer: 'Wellington' },
        { id: 'geo-6-c', question: 'What is the longest mountain range above sea level?', answer: 'The Andes' },
      ],
      7: [
        { id: 'geo-7-a', question: 'What is the capital of Switzerland?', answer: 'Bern' },
        { id: 'geo-7-b', question: 'What is the capital of Kazakhstan?', answer: 'Astana' },
        { id: 'geo-7-c', question: 'What is the deepest oceanic trench?', answer: 'The Mariana Trench' },
      ],
      8: [
        { id: 'geo-8-a', question: 'What is the capital of Norway?', answer: 'Oslo' },
        { id: 'geo-8-b', question: 'Which country is entirely surrounded by South Africa?', answer: 'Lesotho' },
        { id: 'geo-8-c', question: 'Which country has the longest coastline in the world?', answer: 'Canada' },
      ],
      9: [
        { id: 'geo-9-a', question: 'What is the capital of Mongolia?', answer: 'Ulaanbaatar' },
        { id: 'geo-9-b', question: 'What is the largest lake in the world by area?', answer: 'The Caspian Sea' },
        { id: 'geo-9-c', question: 'The Iguazu Falls sit on the border of Brazil and which country?', answer: 'Argentina' },
      ],
      10: [
        { id: 'geo-10-a', question: 'What is the capital of Bhutan?', answer: 'Thimphu' },
        { id: 'geo-10-b', question: 'What is the highest de facto capital city in the world?', answer: 'La Paz' },
        { id: 'geo-10-c', question: 'What is the longest river in Asia?', answer: 'The Yangtze' },
      ],
      11: [
        { id: 'geo-11-a', question: 'What is the largest landlocked country by area?', answer: 'Kazakhstan' },
        { id: 'geo-11-b', question: 'What is the capital of Nigeria?', answer: 'Abuja' },
        { id: 'geo-11-c', question: 'Lake Baikal, the deepest lake, is located in which country?', answer: 'Russia' },
      ],
      12: [
        { id: 'geo-12-a', question: 'Which country has the most time zones, counting its territories?', answer: 'France' },
        { id: 'geo-12-b', question: 'What is the deepest lake in the world?', answer: 'Lake Baikal' },
        { id: 'geo-12-c', question: 'What has been the capital of Myanmar since 2006?', answer: 'Naypyidaw' },
      ],
      13: [
        { id: 'geo-13-a', question: 'What is the world\u2019s newest widely recognized country, formed in 2011?', answer: 'South Sudan' },
        { id: 'geo-13-b', question: 'The Atacama, the driest desert on Earth, lies mainly in which country?', answer: 'Chile' },
        { id: 'geo-13-c', question: 'Point Nemo, the most remote ocean point, lies in which ocean?', answer: 'The Pacific Ocean' },
      ],
    },
  },
  {
    id: 'gaming',
    name: 'Gaming',
    difficulties: {
      1: [
        { id: 'game-1-a', question: 'Which company makes the PlayStation?', answer: 'Sony' },
        { id: 'game-1-b', question: 'What is the name of Nintendo\u2019s plumber mascot?', answer: 'Mario' },
        { id: 'game-1-c', question: 'What does Pac-Man eat as he moves through the maze?', answer: 'Dots' },
      ],
      2: [
        { id: 'game-2-a', question: 'What colour is Sonic the Hedgehog?', answer: 'Blue' },
        { id: 'game-2-b', question: 'Which company makes the Xbox?', answer: 'Microsoft' },
        { id: 'game-2-c', question: 'What green exploding creature is famous in Minecraft?', answer: 'The Creeper' },
      ],
      3: [
        { id: 'game-3-a', question: 'What is the name of Mario\u2019s brother?', answer: 'Luigi' },
        { id: 'game-3-b', question: 'Which Pokémon is number 001 in the Pokédex?', answer: 'Bulbasaur' },
        { id: 'game-3-c', question: 'Which block-building game is made by Mojang?', answer: 'Minecraft' },
      ],
      4: [
        { id: 'game-4-a', question: 'Which princess does Mario usually rescue?', answer: 'Princess Peach' },
        { id: 'game-4-b', question: 'What is the name of the hero in The Legend of Zelda?', answer: 'Link' },
        { id: 'game-4-c', question: 'Which battle royale game features a \u201CVictory Royale\u201D?', answer: 'Fortnite' },
      ],
      5: [
        { id: 'game-5-a', question: 'What type is Pikachu in Pokémon?', answer: 'Electric' },
        { id: 'game-5-b', question: 'Who is the main character of the Halo series?', answer: 'Master Chief' },
        { id: 'game-5-c', question: 'What is the best-selling video game of all time?', answer: 'Minecraft' },
      ],
      6: [
        { id: 'game-6-a', question: 'Which studio developed The Witcher 3?', answer: 'CD Projekt Red' },
        { id: 'game-6-b', question: 'In what year was the original Super Mario Bros. released?', answer: '1985' },
        { id: 'game-6-c', question: 'In Among Us, what are the villains called?', answer: 'Impostors' },
      ],
      7: [
        { id: 'game-7-a', question: 'Who is the recurring antagonist of The Legend of Zelda?', answer: 'Ganon' },
        { id: 'game-7-b', question: 'What 1972 arcade game was the first commercial hit?', answer: 'Pong' },
        { id: 'game-7-c', question: 'Which studio created the Dark Souls series?', answer: 'FromSoftware' },
      ],
      8: [
        { id: 'game-8-a', question: 'What does the abbreviation \u201CNPC\u201D stand for?', answer: 'Non-Player Character' },
        { id: 'game-8-b', question: 'What is the name of the AI antagonist in Portal?', answer: 'GLaDOS' },
        { id: 'game-8-c', question: 'Which 1998 game is the classic 3D entry in the Zelda series?', answer: 'Ocarina of Time' },
      ],
      9: [
        { id: 'game-9-a', question: 'Which company developed Half-Life?', answer: 'Valve' },
        { id: 'game-9-b', question: 'Who is the protagonist of the Metal Gear Solid series?', answer: 'Solid Snake' },
        { id: 'game-9-c', question: 'In what year did the original PlayStation launch in Japan?', answer: '1994' },
      ],
      10: [
        { id: 'game-10-a', question: 'What is the name of Link\u2019s horse in The Legend of Zelda?', answer: 'Epona' },
        { id: 'game-10-b', question: 'Which company made the Dreamcast console?', answer: 'Sega' },
        { id: 'game-10-c', question: 'Who composed the music for the Super Mario series?', answer: 'Koji Kondo' },
      ],
      11: [
        { id: 'game-11-a', question: 'Which Pokémon was actually the first ever created in development?', answer: 'Rhydon' },
        { id: 'game-11-b', question: 'Which company made the Atari 2600?', answer: 'Atari' },
        { id: 'game-11-c', question: 'Which 1982 licensed game is blamed for the video game crash?', answer: 'E.T. the Extra-Terrestrial' },
      ],
      12: [
        { id: 'game-12-a', question: 'What is the best-selling home console of all time?', answer: 'PlayStation 2' },
        { id: 'game-12-b', question: 'Who created Mario, Zelda, and Donkey Kong?', answer: 'Shigeru Miyamoto' },
        { id: 'game-12-c', question: 'Which game engine powers Fortnite and Gears of War?', answer: 'Unreal Engine' },
      ],
      13: [
        { id: 'game-13-a', question: 'What was the first home video game console, released in 1972?', answer: 'The Magnavox Odyssey' },
        { id: 'game-13-b', question: 'Who designed the game Tetris?', answer: 'Alexey Pajitnov' },
        { id: 'game-13-c', question: 'Nintendo was founded in 1889 originally making what product?', answer: 'Playing cards' },
      ],
    },
  },
  {
    id: 'movies-tv',
    name: 'Movies & TV',
    difficulties: {
      1: [
        { id: 'mov-1-a', question: 'What green ogre is the title character of a DreamWorks franchise?', answer: 'Shrek' },
        { id: 'mov-1-b', question: 'What kind of animal is Simba in The Lion King?', answer: 'A lion' },
        { id: 'mov-1-c', question: 'What is the name of the toy cowboy in Toy Story?', answer: 'Woody' },
      ],
      2: [
        { id: 'mov-2-a', question: 'Which boy wizard has a lightning-bolt scar?', answer: 'Harry Potter' },
        { id: 'mov-2-b', question: 'What is the name of the snowman in Frozen?', answer: 'Olaf' },
        { id: 'mov-2-c', question: 'Which clownfish does a Pixar dad search for?', answer: 'Nemo' },
      ],
      3: [
        { id: 'mov-3-a', question: 'Who directed Jaws and E.T.?', answer: 'Steven Spielberg' },
        { id: 'mov-3-b', question: 'Which sci-fi franchise is set \u201Ca long time ago in a galaxy far, far away\u201D?', answer: 'Star Wars' },
        { id: 'mov-3-c', question: 'In The Matrix, which pill does Neo take, red or blue?', answer: 'The red pill' },
      ],
      4: [
        { id: 'mov-4-a', question: 'Which film features the line \u201CI\u2019ll be back\u201D?', answer: 'The Terminator' },
        { id: 'mov-4-b', question: 'Who played Jack in the 1997 film Titanic?', answer: 'Leonardo DiCaprio' },
        { id: 'mov-4-c', question: 'Which TV show follows chemistry teacher Walter White?', answer: 'Breaking Bad' },
      ],
      5: [
        { id: 'mov-5-a', question: 'Who played the title role in the 1994 film Forrest Gump?', answer: 'Tom Hanks' },
        { id: 'mov-5-b', question: 'What is the name of the fictional nation in Black Panther?', answer: 'Wakanda' },
        { id: 'mov-5-c', question: 'Which sitcom is set around the coffee shop Central Perk?', answer: 'Friends' },
      ],
      6: [
        { id: 'mov-6-a', question: 'Who directed Pulp Fiction and Kill Bill?', answer: 'Quentin Tarantino' },
        { id: 'mov-6-b', question: 'Which 1972 crime film centres on the Corleone family?', answer: 'The Godfather' },
        { id: 'mov-6-c', question: 'Which noble house raised Jon Snow in Game of Thrones?', answer: 'House Stark' },
      ],
      7: [
        { id: 'mov-7-a', question: 'Who directed Inception and Interstellar?', answer: 'Christopher Nolan' },
        { id: 'mov-7-b', question: 'What was Disney\u2019s first feature-length animated film, from 1937?', answer: 'Snow White and the Seven Dwarfs' },
        { id: 'mov-7-c', question: 'What word does \u201CREDRUM\u201D spell backwards in The Shining?', answer: 'Murder' },
      ],
      8: [
        { id: 'mov-8-a', question: 'Who composed the scores for Star Wars and Jurassic Park?', answer: 'John Williams' },
        { id: 'mov-8-b', question: 'Which 1941 Orson Welles film is often called the greatest ever made?', answer: 'Citizen Kane' },
        { id: 'mov-8-c', question: 'Which actor played the Joker in The Dark Knight (2008)?', answer: 'Heath Ledger' },
      ],
      9: [
        { id: 'mov-9-a', question: 'Which 1927 film won the first Best Picture Oscar?', answer: 'Wings' },
        { id: 'mov-9-b', question: 'Who directed Psycho and Vertigo?', answer: 'Alfred Hitchcock' },
        { id: 'mov-9-c', question: 'Which film is set at the Overlook Hotel?', answer: 'The Shining' },
      ],
      10: [
        { id: 'mov-10-a', question: 'Which 1927 film was the first major \u201Ctalkie\u201D?', answer: 'The Jazz Singer' },
        { id: 'mov-10-b', question: 'Who directed the 2019 film Parasite?', answer: 'Bong Joon-ho' },
        { id: 'mov-10-c', question: 'What is the longest-running American primetime scripted series?', answer: 'The Simpsons' },
      ],
      11: [
        { id: 'mov-11-a', question: 'Who was the first Black man to win the Best Actor Oscar?', answer: 'Sidney Poitier' },
        { id: 'mov-11-b', question: 'Which 1975 film is considered the first summer blockbuster?', answer: 'Jaws' },
        { id: 'mov-11-c', question: 'Which director has won the most Best Director Oscars, with four?', answer: 'John Ford' },
      ],
      12: [
        { id: 'mov-12-a', question: 'What was the first film to gross over one billion dollars worldwide?', answer: 'Titanic' },
        { id: 'mov-12-b', question: 'Who directed the 1966 western The Good, the Bad and the Ugly?', answer: 'Sergio Leone' },
        { id: 'mov-12-c', question: 'Which silent-film star was famous as \u201CThe Tramp\u201D?', answer: 'Charlie Chaplin' },
      ],
      13: [
        { id: 'mov-13-a', question: 'Which film first won the Oscar for Best Animated Feature, in 2001?', answer: 'Shrek' },
        { id: 'mov-13-b', question: 'Who directed the 1927 silent sci-fi film Metropolis?', answer: 'Fritz Lang' },
        { id: 'mov-13-c', question: 'Which 1902 Georges Méliès film is a landmark of early cinema?', answer: 'A Trip to the Moon' },
      ],
    },
  },
  {
    id: 'music',
    name: 'Music',
    difficulties: {
      1: [
        { id: 'mus-1-a', question: 'Which instrument has 88 keys?', answer: 'The piano' },
        { id: 'mus-1-b', question: 'How many strings does a standard guitar have?', answer: 'Six' },
        { id: 'mus-1-c', question: 'Which K-pop group recorded \u201CDynamite\u201D and \u201CButter\u201D?', answer: 'BTS' },
      ],
      2: [
        { id: 'mus-2-a', question: 'Which British band recorded \u201CHey Jude\u201D?', answer: 'The Beatles' },
        { id: 'mus-2-b', question: 'Who is known as the \u201CKing of Pop\u201D?', answer: 'Michael Jackson' },
        { id: 'mus-2-c', question: 'Which instrument was Jimi Hendrix famous for playing?', answer: 'The guitar' },
      ],
      3: [
        { id: 'mus-3-a', question: 'Which singer released the albums \u201C1989\u201D and \u201CFolklore\u201D?', answer: 'Taylor Swift' },
        { id: 'mus-3-b', question: 'Who sang \u201CRolling in the Deep\u201D and \u201CHello\u201D?', answer: 'Adele' },
        { id: 'mus-3-c', question: 'What is the highest female singing voice type?', answer: 'Soprano' },
      ],
      4: [
        { id: 'mus-4-a', question: 'How many musicians perform in a quartet?', answer: 'Four' },
        { id: 'mus-4-b', question: 'Which composer wrote the \u201COde to Joy\u201D?', answer: 'Beethoven' },
        { id: 'mus-4-c', question: 'Who was the lead singer of Queen?', answer: 'Freddie Mercury' },
      ],
      5: [
        { id: 'mus-5-a', question: 'Which famous classical composer became deaf later in life?', answer: 'Beethoven' },
        { id: 'mus-5-b', question: 'Which genre did Bob Marley help popularise?', answer: 'Reggae' },
        { id: 'mus-5-c', question: 'How many lines make up a standard musical staff?', answer: 'Five' },
      ],
      6: [
        { id: 'mus-6-a', question: 'Who composed \u201CThe Four Seasons\u201D?', answer: 'Vivaldi' },
        { id: 'mus-6-b', question: 'Which Austrian child prodigy composed from age five?', answer: 'Mozart' },
        { id: 'mus-6-c', question: 'Which US city is regarded as the birthplace of jazz?', answer: 'New Orleans' },
      ],
      7: [
        { id: 'mus-7-a', question: 'Who wrote the opera \u201CThe Magic Flute\u201D?', answer: 'Mozart' },
        { id: 'mus-7-b', question: 'What Italian term means \u201Cgradually getting louder\u201D?', answer: 'Crescendo' },
        { id: 'mus-7-c', question: 'Which band released \u201CBohemian Rhapsody\u201D?', answer: 'Queen' },
      ],
      8: [
        { id: 'mus-8-a', question: 'How many symphonies did Beethoven complete?', answer: 'Nine' },
        { id: 'mus-8-b', question: 'What Italian term indicates a fast tempo?', answer: 'Allegro' },
        { id: 'mus-8-c', question: 'Which composer wrote \u201CThe Rite of Spring\u201D?', answer: 'Stravinsky' },
      ],
      9: [
        { id: 'mus-9-a', question: 'Who composed the \u201CBrandenburg Concertos\u201D?', answer: 'Johann Sebastian Bach' },
        { id: 'mus-9-b', question: 'What is the lowest male singing voice type?', answer: 'Bass' },
        { id: 'mus-9-c', question: 'Which instrument is Yo-Yo Ma famous for playing?', answer: 'The cello' },
      ],
      10: [
        { id: 'mus-10-a', question: 'How many black keys are on a standard piano?', answer: '36' },
        { id: 'mus-10-b', question: 'Who composed \u201CClair de Lune\u201D?', answer: 'Debussy' },
        { id: 'mus-10-c', question: 'What is a piece performed by a single musician called?', answer: 'A solo' },
      ],
      11: [
        { id: 'mus-11-a', question: 'Who composed \u201CSwan Lake\u201D and \u201CThe Nutcracker\u201D?', answer: 'Tchaikovsky' },
        { id: 'mus-11-b', question: 'What Italian dynamic marking means \u201Cvery soft\u201D?', answer: 'Pianissimo' },
        { id: 'mus-11-c', question: 'Who is credited with inventing the piano around 1700?', answer: 'Bartolomeo Cristofori' },
      ],
      12: [
        { id: 'mus-12-a', question: 'Which composer created the twelve-tone (serial) technique?', answer: 'Arnold Schoenberg' },
        { id: 'mus-12-b', question: 'How many movements are typically in a classical symphony?', answer: 'Four' },
        { id: 'mus-12-c', question: 'What note value lasts twice as long as a half note?', answer: 'A whole note' },
      ],
      13: [
        { id: 'mus-13-a', question: 'Who composed the opera cycle \u201CThe Ring of the Nibelung\u201D?', answer: 'Richard Wagner' },
        { id: 'mus-13-b', question: 'What is the 12-note scale using every semitone called?', answer: 'The chromatic scale' },
        { id: 'mus-13-c', question: 'Concert \u201CA\u201D above middle C is standardly tuned to what frequency?', answer: '440 Hz' },
      ],
    },
  },
  {
    id: 'history',
    name: 'History',
    difficulties: {
      1: [
        { id: 'his-1-a', question: 'Who was the first President of the United States?', answer: 'George Washington' },
        { id: 'his-1-b', question: 'In which country were the Pyramids of Giza built?', answer: 'Egypt' },
        { id: 'his-1-c', question: 'Which ship sank in 1912 after hitting an iceberg?', answer: 'The Titanic' },
      ],
      2: [
        { id: 'his-2-a', question: 'Who was Britain\u2019s Prime Minister for most of World War II?', answer: 'Winston Churchill' },
        { id: 'his-2-b', question: 'What wall divided a German city until 1989?', answer: 'The Berlin Wall' },
        { id: 'his-2-c', question: 'Which ancient civilization built the Colosseum?', answer: 'The Romans' },
      ],
      3: [
        { id: 'his-3-a', question: 'In which year did World War II end?', answer: '1945' },
        { id: 'his-3-b', question: 'Which Egyptian queen allied with Caesar and Mark Antony?', answer: 'Cleopatra' },
        { id: 'his-3-c', question: 'Which document begins \u201CWe the People\u201D?', answer: 'The US Constitution' },
      ],
      4: [
        { id: 'his-4-a', question: 'In which year did World War I begin?', answer: '1914' },
        { id: 'his-4-b', question: 'Who led India\u2019s independence movement through nonviolence?', answer: 'Mahatma Gandhi' },
        { id: 'his-4-c', question: 'Which empire was founded by Genghis Khan?', answer: 'The Mongol Empire' },
      ],
      5: [
        { id: 'his-5-a', question: 'Who reached the Americas for Europe in 1492?', answer: 'Christopher Columbus' },
        { id: 'his-5-b', question: 'What ship carried the Pilgrims to America in 1620?', answer: 'The Mayflower' },
        { id: 'his-5-c', question: 'Which French leader was defeated at Waterloo in 1815?', answer: 'Napoleon' },
      ],
      6: [
        { id: 'his-6-a', question: 'Which US president was assassinated in Dallas in 1963?', answer: 'John F. Kennedy' },
        { id: 'his-6-b', question: 'In which year did the French Revolution begin?', answer: '1789' },
        { id: 'his-6-c', question: 'Which wall did ancient China build to keep out invaders?', answer: 'The Great Wall' },
      ],
      7: [
        { id: 'his-7-a', question: 'Which treaty ended World War I in 1919?', answer: 'The Treaty of Versailles' },
        { id: 'his-7-b', question: 'Which queen ruled England from 1558 to 1603?', answer: 'Elizabeth I' },
        { id: 'his-7-c', question: 'Which US president issued the Emancipation Proclamation?', answer: 'Abraham Lincoln' },
      ],
      8: [
        { id: 'his-8-a', question: 'Who nailed the \u201CNinety-Five Theses\u201D and sparked the Reformation?', answer: 'Martin Luther' },
        { id: 'his-8-b', question: 'What name is given to Europe\u2019s cultural rebirth from the 14th\u201317th centuries?', answer: 'The Renaissance' },
        { id: 'his-8-c', question: 'In which year did the Berlin Wall fall?', answer: '1989' },
      ],
      9: [
        { id: 'his-9-a', question: 'Who was the first emperor of Rome?', answer: 'Augustus' },
        { id: 'his-9-b', question: 'Which Greek city-state was famed for its warriors?', answer: 'Sparta' },
        { id: 'his-9-c', question: 'Which 1066 battle led to Norman rule of England?', answer: 'The Battle of Hastings' },
      ],
      10: [
        { id: 'his-10-a', question: 'Which British queen reigned from 1837 to 1901?', answer: 'Queen Victoria' },
        { id: 'his-10-b', question: 'Which plague killed roughly a third of Europe in the 14th century?', answer: 'The Black Death' },
        { id: 'his-10-c', question: 'Which Chinese dynasty built most of the Great Wall as it stands today?', answer: 'The Ming Dynasty' },
      ],
      11: [
        { id: 'his-11-a', question: 'In which year was the Magna Carta signed?', answer: '1215' },
        { id: 'his-11-b', question: 'Which Byzantine emperor codified Roman law in the 6th century?', answer: 'Justinian I' },
        { id: 'his-11-c', question: 'Which explorer\u2019s expedition first circumnavigated the globe?', answer: 'Ferdinand Magellan' },
      ],
      12: [
        { id: 'his-12-a', question: 'Who was the female pharaoh who ruled Egypt in her own right?', answer: 'Hatshepsut' },
        { id: 'his-12-b', question: 'Which 1648 treaty ended the Thirty Years\u2019 War?', answer: 'The Peace of Westphalia' },
        { id: 'his-12-c', question: 'What was the capital of the Byzantine Empire?', answer: 'Constantinople' },
      ],
      13: [
        { id: 'his-13-a', question: 'Which Babylonian king is known for an early written law code?', answer: 'Hammurabi' },
        { id: 'his-13-b', question: 'Which 1494 treaty divided the New World between Spain and Portugal?', answer: 'The Treaty of Tordesillas' },
        { id: 'his-13-c', question: 'Which ancient wonder was a giant statue at the harbor of Rhodes?', answer: 'The Colossus of Rhodes' },
      ],
    },
  },
  {
    id: 'science',
    name: 'Science',
    difficulties: {
      1: [
        { id: 'sci-1-a', question: 'What gas do humans need to breathe to stay alive?', answer: 'Oxygen' },
        { id: 'sci-1-b', question: 'What is H2O more commonly known as?', answer: 'Water' },
        { id: 'sci-1-c', question: 'What force pulls objects toward the Earth?', answer: 'Gravity' },
      ],
      2: [
        { id: 'sci-2-a', question: 'What is the closest star to Earth?', answer: 'The Sun' },
        { id: 'sci-2-b', question: 'How many legs does an insect have?', answer: 'Six' },
        { id: 'sci-2-c', question: 'Which organ pumps blood around the body?', answer: 'The heart' },
      ],
      3: [
        { id: 'sci-3-a', question: 'What is the chemical symbol for gold?', answer: 'Au' },
        { id: 'sci-3-b', question: 'Which gas do plants absorb from the air for photosynthesis?', answer: 'Carbon dioxide' },
        { id: 'sci-3-c', question: 'Which planet is known as the Red Planet?', answer: 'Mars' },
      ],
      4: [
        { id: 'sci-4-a', question: 'Which organelle is called the powerhouse of the cell?', answer: 'The mitochondria' },
        { id: 'sci-4-b', question: 'What is the hardest known natural substance?', answer: 'Diamond' },
        { id: 'sci-4-c', question: 'How many bones are in the adult human body?', answer: '206' },
      ],
      5: [
        { id: 'sci-5-a', question: 'What is the chemical symbol for sodium?', answer: 'Na' },
        { id: 'sci-5-b', question: 'Who proposed the theory of evolution by natural selection?', answer: 'Charles Darwin' },
        { id: 'sci-5-c', question: 'What is the most abundant gas in Earth\u2019s atmosphere?', answer: 'Nitrogen' },
      ],
      6: [
        { id: 'sci-6-a', question: 'Roughly how fast does light travel in a vacuum?', answer: 'About 300,000 km/s' },
        { id: 'sci-6-b', question: 'Who developed the theory of general relativity?', answer: 'Albert Einstein' },
        { id: 'sci-6-c', question: 'What is the study of living organisms called?', answer: 'Biology' },
      ],
      7: [
        { id: 'sci-7-a', question: 'What is the pH of a neutral solution?', answer: '7' },
        { id: 'sci-7-b', question: 'Which subatomic particle carries a negative charge?', answer: 'The electron' },
        { id: 'sci-7-c', question: 'What is the SI unit of electric current?', answer: 'The ampere' },
      ],
      8: [
        { id: 'sci-8-a', question: 'What is the chemical symbol for potassium?', answer: 'K' },
        { id: 'sci-8-b', question: 'What kind of energy does a moving object possess?', answer: 'Kinetic energy' },
        { id: 'sci-8-c', question: 'Which element has the atomic number 1?', answer: 'Hydrogen' },
      ],
      9: [
        { id: 'sci-9-a', question: 'Who formulated the three laws of motion?', answer: 'Isaac Newton' },
        { id: 'sci-9-b', question: 'What is the process by which plants make food from sunlight?', answer: 'Photosynthesis' },
        { id: 'sci-9-c', question: 'What is the most common element in the universe?', answer: 'Hydrogen' },
      ],
      10: [
        { id: 'sci-10-a', question: 'What molecule stores and carries energy within cells?', answer: 'ATP' },
        { id: 'sci-10-b', question: 'Which particle was confirmed at CERN in 2012?', answer: 'The Higgs boson' },
        { id: 'sci-10-c', question: 'Who is credited with discovering penicillin?', answer: 'Alexander Fleming' },
      ],
      11: [
        { id: 'sci-11-a', question: 'What is the chemical symbol for tungsten?', answer: 'W' },
        { id: 'sci-11-b', question: 'What quantity does the second law of thermodynamics say always increases?', answer: 'Entropy' },
        { id: 'sci-11-c', question: 'What is the term for an atom with a different number of neutrons?', answer: 'An isotope' },
      ],
      12: [
        { id: 'sci-12-a', question: 'Which particle is the force carrier of electromagnetism?', answer: 'The photon' },
        { id: 'sci-12-b', question: 'Who is credited with creating the modern periodic table?', answer: 'Dmitri Mendeleev' },
        { id: 'sci-12-c', question: 'What is the name of the outer boundary of a black hole?', answer: 'The event horizon' },
      ],
      13: [
        { id: 'sci-13-a', question: 'What is the approximate value of Avogadro\u2019s number?', answer: 'About 6.022 x 10^23' },
        { id: 'sci-13-b', question: 'Who first proposed what became the Big Bang theory?', answer: 'Georges Lema\u00EEtre' },
        { id: 'sci-13-c', question: 'What is the densest stellar remnant short of a black hole?', answer: 'A neutron star' },
      ],
    },
  },
  {
    id: 'sports',
    name: 'Sports',
    difficulties: {
      1: [
        { id: 'spo-1-a', question: 'How many players from one soccer team are on the field?', answer: 'Eleven' },
        { id: 'spo-1-b', question: 'Which sport is played at Wimbledon?', answer: 'Tennis' },
        { id: 'spo-1-c', question: 'How many rings are on the Olympic flag?', answer: 'Five' },
      ],
      2: [
        { id: 'spo-2-a', question: 'In which sport would you perform a slam dunk?', answer: 'Basketball' },
        { id: 'spo-2-b', question: 'Which sport uses a shuttlecock?', answer: 'Badminton' },
        { id: 'spo-2-c', question: 'How many points is a touchdown worth in American football?', answer: 'Six' },
      ],
      3: [
        { id: 'spo-3-a', question: 'In which country is the Tour de France mainly held?', answer: 'France' },
        { id: 'spo-3-b', question: 'In tennis, what is a score of zero called?', answer: 'Love' },
        { id: 'spo-3-c', question: 'How often are the Summer Olympic Games held?', answer: 'Every four years' },
      ],
      4: [
        { id: 'spo-4-a', question: 'What is the maximum score in ten-pin bowling?', answer: '300' },
        { id: 'spo-4-b', question: 'Which sport is Muhammad Ali associated with?', answer: 'Boxing' },
        { id: 'spo-4-c', question: 'How many players from one basketball team are on the court?', answer: 'Five' },
      ],
      5: [
        { id: 'spo-5-a', question: 'In which sport is the Ryder Cup contested?', answer: 'Golf' },
        { id: 'spo-5-b', question: 'How many Grand Slam tennis tournaments are there each year?', answer: 'Four' },
        { id: 'spo-5-c', question: 'Which country won the first FIFA World Cup, in 1930?', answer: 'Uruguay' },
      ],
      6: [
        { id: 'spo-6-a', question: 'How many holes are played in a standard round of golf?', answer: 'Eighteen' },
        { id: 'spo-6-b', question: 'Which country has won the most FIFA World Cups?', answer: 'Brazil' },
        { id: 'spo-6-c', question: 'What is the term for one player scoring three goals in a game?', answer: 'A hat-trick' },
      ],
      7: [
        { id: 'spo-7-a', question: 'How many players are on a cricket team?', answer: 'Eleven' },
        { id: 'spo-7-b', question: 'Which boxer was nicknamed \u201CIron Mike\u201D?', answer: 'Mike Tyson' },
        { id: 'spo-7-c', question: 'In rugby union, how many points is a try worth?', answer: 'Five' },
      ],
      8: [
        { id: 'spo-8-a', question: 'Who holds the record for most career Olympic gold medals?', answer: 'Michael Phelps' },
        { id: 'spo-8-b', question: 'In Formula 1, which flag signals the end of a race?', answer: 'The chequered flag' },
        { id: 'spo-8-c', question: 'How many players are on an ice hockey team on the ice per side?', answer: 'Six' },
      ],
      9: [
        { id: 'spo-9-a', question: 'Who holds the world record for the 100m sprint?', answer: 'Usain Bolt' },
        { id: 'spo-9-b', question: 'In which sport is the Stanley Cup awarded?', answer: 'Ice hockey' },
        { id: 'spo-9-c', question: 'How long is a marathon, to the nearest kilometre?', answer: '42 km' },
      ],
      10: [
        { id: 'spo-10-a', question: 'Which country invented the martial art of judo?', answer: 'Japan' },
        { id: 'spo-10-b', question: 'Which gymnast was the first to score a perfect 10 at the Olympics?', answer: 'Nadia Com\u0103neci' },
        { id: 'spo-10-c', question: 'What is the national sport of Japan?', answer: 'Sumo' },
      ],
      11: [
        { id: 'spo-11-a', question: 'In what year were the first modern Olympic Games held?', answer: '1896' },
        { id: 'spo-11-b', question: 'Which country has won the most Olympic gold medals of all time?', answer: 'The United States' },
        { id: 'spo-11-c', question: 'What is the highest possible break in snooker?', answer: '147' },
      ],
      12: [
        { id: 'spo-12-a', question: 'In which city were the first modern Olympic Games held?', answer: 'Athens' },
        { id: 'spo-12-b', question: 'Which chess piece can only move diagonally?', answer: 'The bishop' },
        { id: 'spo-12-c', question: 'Which fish is considered the fastest in the ocean?', answer: 'The sailfish' },
      ],
      13: [
        { id: 'spo-13-a', question: 'Which jockey-less race is \u201Cthe most famous two minutes in sports\u201D?', answer: 'The Kentucky Derby' },
        { id: 'spo-13-b', question: 'What is the diameter of a basketball hoop, in inches?', answer: '18 inches' },
        { id: 'spo-13-c', question: 'Which country hosted and won the first Rugby World Cup, in 1987?', answer: 'New Zealand' },
      ],
    },
  },
  {
    id: 'mythology',
    name: 'Mythology',
    difficulties: {
      1: [
        { id: 'myt-1-a', question: 'Who is the Greek king of the gods?', answer: 'Zeus' },
        { id: 'myt-1-b', question: 'What creature is half-man and half-horse in Greek myth?', answer: 'A centaur' },
        { id: 'myt-1-c', question: 'Who is the Roman god of war?', answer: 'Mars' },
      ],
      2: [
        { id: 'myt-2-a', question: 'Who is the Greek god of the sea?', answer: 'Poseidon' },
        { id: 'myt-2-b', question: 'What winged horse appears in Greek mythology?', answer: 'Pegasus' },
        { id: 'myt-2-c', question: 'Who is the Norse god of thunder?', answer: 'Thor' },
      ],
      3: [
        { id: 'myt-3-a', question: 'Who is the Greek goddess of love?', answer: 'Aphrodite' },
        { id: 'myt-3-b', question: 'Who is the Greek god of the underworld?', answer: 'Hades' },
        { id: 'myt-3-c', question: 'What one-eyed giant did Odysseus blind?', answer: 'The Cyclops' },
      ],
      4: [
        { id: 'myt-4-a', question: 'Who flew too close to the sun on wax wings?', answer: 'Icarus' },
        { id: 'myt-4-b', question: 'What is the name of Thor\u2019s hammer?', answer: 'Mj\u00F6lnir' },
        { id: 'myt-4-c', question: 'Which jackal-headed Egyptian god is linked to the dead?', answer: 'Anubis' },
      ],
      5: [
        { id: 'myt-5-a', question: 'Who is the winged Greek messenger god?', answer: 'Hermes' },
        { id: 'myt-5-b', question: 'What snake-haired woman turns onlookers to stone?', answer: 'Medusa' },
        { id: 'myt-5-c', question: 'Who is the chief god in Norse mythology?', answer: 'Odin' },
      ],
      6: [
        { id: 'myt-6-a', question: 'Which Greek hero completed twelve labors?', answer: 'Heracles' },
        { id: 'myt-6-b', question: 'Who is the Greek goddess of wisdom?', answer: 'Athena' },
        { id: 'myt-6-c', question: 'Who is the Egyptian sun god?', answer: 'Ra' },
      ],
      7: [
        { id: 'myt-7-a', question: 'Who is the Norse trickster god?', answer: 'Loki' },
        { id: 'myt-7-b', question: 'Which Hindu god has an elephant head?', answer: 'Ganesha' },
        { id: 'myt-7-c', question: 'What three-headed dog guards the Greek underworld?', answer: 'Cerberus' },
      ],
      8: [
        { id: 'myt-8-a', question: 'Who opened a jar releasing the world\u2019s evils in Greek myth?', answer: 'Pandora' },
        { id: 'myt-8-b', question: 'Which Greek hero was invulnerable except for his heel?', answer: 'Achilles' },
        { id: 'myt-8-c', question: 'Who is the Roman king of the gods?', answer: 'Jupiter' },
      ],
      9: [
        { id: 'myt-9-a', question: 'What river do souls cross into the Greek underworld?', answer: 'The Styx' },
        { id: 'myt-9-b', question: 'In Norse myth, what is the rainbow bridge to Asgard called?', answer: 'Bifr\u00F6st' },
        { id: 'myt-9-c', question: 'Who stole fire from the gods to give to humanity?', answer: 'Prometheus' },
      ],
      10: [
        { id: 'myt-10-a', question: 'What half-man, half-bull creature lived in the Labyrinth?', answer: 'The Minotaur' },
        { id: 'myt-10-b', question: 'What is the Norse apocalypse event called?', answer: 'Ragnar\u00F6k' },
        { id: 'myt-10-c', question: 'Who is the Greek goddess of the harvest?', answer: 'Demeter' },
      ],
      11: [
        { id: 'myt-11-a', question: 'What was the ship in the quest for the Golden Fleece?', answer: 'The Argo' },
        { id: 'myt-11-b', question: 'Which multi-headed serpent did Heracles slay?', answer: 'The Hydra' },
        { id: 'myt-11-c', question: 'Who is the Egyptian goddess of magic and motherhood?', answer: 'Isis' },
      ],
      12: [
        { id: 'myt-12-a', question: 'Who is the Greek primordial goddess of the Earth?', answer: 'Gaia' },
        { id: 'myt-12-b', question: 'What is the Norse world tree called?', answer: 'Yggdrasil' },
        { id: 'myt-12-c', question: 'Who is the hero of the ancient Mesopotamian epic?', answer: 'Gilgamesh' },
      ],
      13: [
        { id: 'myt-13-a', question: 'What collective name is given to the three Greek Fates?', answer: 'The Moirai' },
        { id: 'myt-13-b', question: 'Which hall receives slain warriors in Norse myth?', answer: 'Valhalla' },
        { id: 'myt-13-c', question: 'Who is the Egyptian god who murdered Osiris?', answer: 'Set' },
      ],
    },
  },
  {
    id: 'food-drink',
    name: 'Food & Drink',
    difficulties: {
      1: [
        { id: 'fd-1-a', question: 'Which fruit is traditionally used to make wine?', answer: 'Grapes' },
        { id: 'fd-1-b', question: 'What is the main ingredient in guacamole?', answer: 'Avocado' },
        { id: 'fd-1-c', question: 'What hot drink is made from roasted beans?', answer: 'Coffee' },
      ],
      2: [
        { id: 'fd-2-a', question: 'What Italian dish is a flatbread topped with cheese and sauce?', answer: 'Pizza' },
        { id: 'fd-2-b', question: 'Which spice gives curry its yellow colour?', answer: 'Turmeric' },
        { id: 'fd-2-c', question: 'What is a dried grape called?', answer: 'A raisin' },
      ],
      3: [
        { id: 'fd-3-a', question: 'Which country did sushi originate in?', answer: 'Japan' },
        { id: 'fd-3-b', question: 'What plant produces the beans used to make chocolate?', answer: 'The cacao plant' },
        { id: 'fd-3-c', question: 'What is the main ingredient in hummus?', answer: 'Chickpeas' },
      ],
      4: [
        { id: 'fd-4-a', question: 'What French pastry is crescent-shaped?', answer: 'A croissant' },
        { id: 'fd-4-b', question: 'What is the Japanese dish of sliced raw fish without rice called?', answer: 'Sashimi' },
        { id: 'fd-4-c', question: 'Which spirit is distilled from the agave plant?', answer: 'Tequila' },
      ],
      5: [
        { id: 'fd-5-a', question: 'Which Mexican dish is a folded tortilla with filling?', answer: 'A taco' },
        { id: 'fd-5-b', question: 'What is tofu made from?', answer: 'Soybeans' },
        { id: 'fd-5-c', question: 'Which country is famous for inventing champagne?', answer: 'France' },
      ],
      6: [
        { id: 'fd-6-a', question: 'What herb is the main ingredient in traditional pesto?', answer: 'Basil' },
        { id: 'fd-6-b', question: 'What Italian rice dish is cooked slowly with broth?', answer: 'Risotto' },
        { id: 'fd-6-c', question: 'What is the most consumed meat in the world?', answer: 'Pork' },
      ],
      7: [
        { id: 'fd-7-a', question: 'What is the most expensive spice in the world by weight?', answer: 'Saffron' },
        { id: 'fd-7-b', question: 'What fermented Korean side dish is made from cabbage?', answer: 'Kimchi' },
        { id: 'fd-7-c', question: 'Which grain is used to make Italian polenta?', answer: 'Corn' },
      ],
      8: [
        { id: 'fd-8-a', question: 'What is the Japanese word for the savory \u201Cfifth taste\u201D?', answer: 'Umami' },
        { id: 'fd-8-b', question: 'Which part of a chili pepper is the hottest?', answer: 'The white membrane' },
        { id: 'fd-8-c', question: 'What acid gives lemons their sour taste?', answer: 'Citric acid' },
      ],
      9: [
        { id: 'fd-9-a', question: 'What French kitchen phrase means \u201Ceverything in its place\u201D?', answer: 'Mise en place' },
        { id: 'fd-9-b', question: 'Which Japanese rice wine is served with meals?', answer: 'Sake' },
        { id: 'fd-9-c', question: 'What cut of beef is used for a classic filet mignon?', answer: 'The tenderloin' },
      ],
      10: [
        { id: 'fd-10-a', question: 'What fermented soybean paste is central to Japanese cuisine?', answer: 'Miso' },
        { id: 'fd-10-b', question: 'What mold gives blue cheese its veins?', answer: 'Penicillium' },
        { id: 'fd-10-c', question: 'What French term means to cut vegetables into fine strips?', answer: 'Julienne' },
      ],
      11: [
        { id: 'fd-11-a', question: 'What is the French term for a pastry chef?', answer: 'A p\u00E2tissier' },
        { id: 'fd-11-b', question: 'What two main ingredients form a hollandaise sauce?', answer: 'Egg yolk and butter' },
        { id: 'fd-11-c', question: 'From which bird\u2019s fattened liver is foie gras made?', answer: 'A goose or duck' },
      ],
      12: [
        { id: 'fd-12-a', question: 'What French term describes browning food quickly at high heat?', answer: 'Searing' },
        { id: 'fd-12-b', question: 'What is the base thickening mixture of flour and fat called?', answer: 'A roux' },
        { id: 'fd-12-c', question: 'Which spice is derived from the dried stigmas of a crocus flower?', answer: 'Saffron' },
      ],
      13: [
        { id: 'fd-13-a', question: 'What luxury coffee is made from beans digested by a civet?', answer: 'Kopi Luwak' },
        { id: 'fd-13-b', question: 'Which potentially poisonous pufferfish is a Japanese delicacy?', answer: 'Fugu' },
        { id: 'fd-13-c', question: 'What \u201Cnoble rot\u201D fungus is used to make sweet Sauternes wine?', answer: 'Botrytis' },
      ],
    },
  },
  {
    id: 'anime',
    name: 'Anime',
    difficulties: {
      1: [
        { id: 'ani-1-a', question: 'Which ninja wants to become Hokage in his namesake series?', answer: 'Naruto' },
        { id: 'ani-1-b', question: 'Which yellow electric mouse is Pokémon\u2019s mascot?', answer: 'Pikachu' },
        { id: 'ani-1-c', question: 'What is the Japanese word for animation?', answer: 'Anime' },
      ],
      2: [
        { id: 'ani-2-a', question: 'In Dragon Ball, what is the spiky-haired Saiyan hero\u2019s name?', answer: 'Goku' },
        { id: 'ani-2-b', question: 'Which anime features titans devouring humans behind giant walls?', answer: 'Attack on Titan' },
        { id: 'ani-2-c', question: 'What is a Japanese comic book called?', answer: 'Manga' },
      ],
      3: [
        { id: 'ani-3-a', question: 'Which straw-hat pirate wants to become King of the Pirates?', answer: 'Monkey D. Luffy' },
        { id: 'ani-3-b', question: 'Which studio made \u201CSpirited Away\u201D?', answer: 'Studio Ghibli' },
        { id: 'ani-3-c', question: 'What notebook kills anyone whose name is written in it?', answer: 'The Death Note' },
      ],
      4: [
        { id: 'ani-4-a', question: 'Who directed \u201CSpirited Away\u201D and \u201CMy Neighbor Totoro\u201D?', answer: 'Hayao Miyazaki' },
        { id: 'ani-4-b', question: 'Which anime follows a boy training at U.A. High to be a hero?', answer: 'My Hero Academia' },
        { id: 'ani-4-c', question: 'Which demon-slaying anime follows Tanjiro after his family is killed?', answer: 'Demon Slayer' },
      ],
      5: [
        { id: 'ani-5-a', question: 'In One Piece, what is the ultimate treasure called?', answer: 'The One Piece' },
        { id: 'ani-5-b', question: 'What is the name of the death god who drops the notebook in Death Note?', answer: 'Ryuk' },
        { id: 'ani-5-c', question: 'Who created the manga \u201CDragon Ball\u201D?', answer: 'Akira Toriyama' },
      ],
      6: [
        { id: 'ani-6-a', question: 'Which teenager becomes a Soul Reaper in \u201CBleach\u201D?', answer: 'Ichigo Kurosaki' },
        { id: 'ani-6-b', question: 'What principle of \u201Cequivalent exchange\u201D governs Fullmetal Alchemist?', answer: 'Alchemy' },
        { id: 'ani-6-c', question: 'Which term describes Japanese comics aimed at young boys?', answer: 'Sh\u014Dnen' },
      ],
      7: [
        { id: 'ani-7-a', question: 'Which mecha anime features robots called \u201CEvangelions\u201D?', answer: 'Neon Genesis Evangelion' },
        { id: 'ani-7-b', question: 'Which 1988 film is a landmark of anime set in Neo-Tokyo?', answer: 'Akira' },
        { id: 'ani-7-c', question: 'What fruit gives Luffy his rubber powers in One Piece?', answer: 'The Gum-Gum Fruit' },
      ],
      8: [
        { id: 'ani-8-a', question: 'Who directed the 2016 hit film \u201CYour Name\u201D?', answer: 'Makoto Shinkai' },
        { id: 'ani-8-b', question: 'Who wrote and illustrated the manga \u201COne Piece\u201D?', answer: 'Eiichiro Oda' },
        { id: 'ani-8-c', question: 'What is the name of the Nine-Tailed Fox sealed inside Naruto?', answer: 'Kurama' },
      ],
      9: [
        { id: 'ani-9-a', question: 'Which anime series follows bounty hunter Spike Spiegel?', answer: 'Cowboy Bebop' },
        { id: 'ani-9-b', question: 'Which 1995 film features the cyborg Motoko Kusanagi?', answer: 'Ghost in the Shell' },
        { id: 'ani-9-c', question: 'What term describes Japanese comics aimed at young girls?', answer: 'Sh\u014Djo' },
      ],
      10: [
        { id: 'ani-10-a', question: 'Which studio produced the first seasons of \u201CAttack on Titan\u201D?', answer: 'Wit Studio' },
        { id: 'ani-10-b', question: 'Who co-founded Studio Ghibli alongside Hayao Miyazaki?', answer: 'Isao Takahata' },
        { id: 'ani-10-c', question: 'Which anime is often cited as the first TV anime series, from 1963?', answer: 'Astro Boy' },
      ],
      11: [
        { id: 'ani-11-a', question: 'Who created \u201CAstro Boy\u201D and is called the \u201CGod of Manga\u201D?', answer: 'Osamu Tezuka' },
        { id: 'ani-11-b', question: 'What is the best-selling manga series of all time?', answer: 'One Piece' },
        { id: 'ani-11-c', question: 'Which 1974 anime pioneered the space-opera genre with a battleship?', answer: 'Space Battleship Yamato' },
      ],
      12: [
        { id: 'ani-12-a', question: 'Who directed the acclaimed 1997 psychological film \u201CPerfect Blue\u201D?', answer: 'Satoshi Kon' },
        { id: 'ani-12-b', question: 'What term describes Japanese comics aimed at adult women?', answer: 'Josei' },
        { id: 'ani-12-c', question: 'Which 1979 Miyazaki-directed film features the thief Lupin III?', answer: 'The Castle of Cagliostro' },
      ],
      13: [
        { id: 'ani-13-a', question: 'Which studio produced \u201CCowboy Bebop\u201D?', answer: 'Sunrise' },
        { id: 'ani-13-b', question: 'Which 1963 series was the first to use the now-standard \u201Climited animation\u201D style on TV?', answer: 'Astro Boy' },
        { id: 'ani-13-c', question: 'Who directed the World War II drama \u201CGrave of the Fireflies\u201D?', answer: 'Isao Takahata' },
      ],
    },
  },
  {
    id: 'internet-culture',
    name: 'Internet Culture',
    difficulties: {
      1: [
        { id: 'net-1-a', question: 'What does \u201CLOL\u201D stand for?', answer: 'Laughing Out Loud' },
        { id: 'net-1-b', question: 'What term describes a funny image or video that spreads online?', answer: 'A meme' },
        { id: 'net-1-c', question: 'Which video platform, owned by Google, has a red play-button logo?', answer: 'YouTube' },
      ],
      2: [
        { id: 'net-2-a', question: 'What does \u201CDM\u201D stand for on social media?', answer: 'Direct Message' },
        { id: 'net-2-b', question: 'Which bird was the original logo of the site now called X?', answer: 'Twitter\u2019s bluebird' },
        { id: 'net-2-c', question: 'Which app is known for short vertical dance and video clips?', answer: 'TikTok' },
      ],
      3: [
        { id: 'net-3-a', question: 'What does \u201CFOMO\u201D stand for?', answer: 'Fear Of Missing Out' },
        { id: 'net-3-b', question: 'Which Meta-owned platform focuses on photo sharing?', answer: 'Instagram' },
        { id: 'net-3-c', question: 'What symbol precedes a hashtag?', answer: 'The hash sign (#)' },
      ],
      4: [
        { id: 'net-4-a', question: 'What does \u201CGIF\u201D stand for?', answer: 'Graphics Interchange Format' },
        { id: 'net-4-b', question: 'What does \u201CAMA\u201D stand for on Reddit?', answer: 'Ask Me Anything' },
        { id: 'net-4-c', question: 'What phrase means content is becoming hugely popular fast?', answer: 'Going viral' },
      ],
      5: [
        { id: 'net-5-a', question: 'What does \u201CSMH\u201D stand for?', answer: 'Shaking My Head' },
        { id: 'net-5-b', question: 'Which 2012 song was one of the first YouTube videos to hit a billion views?', answer: 'Gangnam Style' },
        { id: 'net-5-c', question: 'What does \u201CIRL\u201D stand for?', answer: 'In Real Life' },
      ],
      6: [
        { id: 'net-6-a', question: 'Which 2014 charity trend involved dumping ice water?', answer: 'The Ice Bucket Challenge' },
        { id: 'net-6-b', question: 'What does \u201CTL;DR\u201D mean?', answer: 'Too Long; Didn\u2019t Read' },
        { id: 'net-6-c', question: 'What short looping video app was shut down in 2017?', answer: 'Vine' },
      ],
      7: [
        { id: 'net-7-a', question: 'The \u201CDoge\u201D meme features which dog breed?', answer: 'Shiba Inu' },
        { id: 'net-7-b', question: 'What is the term for deliberately provoking others online?', answer: 'Trolling' },
        { id: 'net-7-c', question: 'What does \u201CGG\u201D mean in gaming?', answer: 'Good Game' },
      ],
      8: [
        { id: 'net-8-a', question: 'What was the title of the first-ever YouTube video?', answer: 'Me at the zoo' },
        { id: 'net-8-b', question: 'Which Rick Astley song powers the \u201CRickroll\u201D?', answer: 'Never Gonna Give You Up' },
        { id: 'net-8-c', question: 'What is a coordinated fake-grassroots online campaign called?', answer: 'Astroturfing' },
      ],
      9: [
        { id: 'net-9-a', question: 'What food is the body of the \u201CNyan Cat\u201D meme made of?', answer: 'A Pop-Tart' },
        { id: 'net-9-b', question: 'Which image board is credited with originating many early memes?', answer: '4chan' },
        { id: 'net-9-c', question: 'What term describes an online identity picture or persona?', answer: 'An avatar' },
      ],
      10: [
        { id: 'net-10-a', question: 'Which broken item was the first thing ever sold on eBay in 1995?', answer: 'A broken laser pointer' },
        { id: 'net-10-b', question: 'What 2001 phrase came from a mistranslated video game intro?', answer: 'All your base are belong to us' },
        { id: 'net-10-c', question: 'What does \u201CCAPTCHA\u201D broadly test for?', answer: 'Whether a user is human' },
      ],
      11: [
        { id: 'net-11-a', question: 'What 2007 \u201Clolcat\u201D caption asks about a cheeseburger?', answer: 'I can has cheezburger?' },
        { id: 'net-11-b', question: 'Which green cartoon frog became a widely used meme?', answer: 'Pepe the Frog' },
        { id: 'net-11-c', question: 'What does the \u201CStreisand Effect\u201D describe?', answer: 'Suppressing information makes it spread more' },
      ],
      12: [
        { id: 'net-12-a', question: 'Who coined the word \u201Cmeme\u201D in his 1976 book?', answer: 'Richard Dawkins' },
        { id: 'net-12-b', question: 'What emoticon did Scott Fahlman propose in 1982?', answer: 'The smiley :-)' },
        { id: 'net-12-c', question: 'Which 1990s dancing 3D animation is an early viral meme?', answer: 'The Dancing Baby' },
      ],
      13: [
        { id: 'net-13-a', question: 'What does \u201CGodwin\u2019s Law\u201D say online arguments eventually reach?', answer: 'A comparison to Hitler or the Nazis' },
        { id: 'net-13-b', question: 'What term describes a regularly updated online journal or diary?', answer: 'A blog' },
        { id: 'net-13-c', question: 'What is the term for content that pretends to be news but is fabricated for clicks?', answer: 'Fake news' },
      ],
    },
  },
  {
    id: 'literature',
    name: 'Literature',
    difficulties: {
      1: [
        { id: 'lit-1-a', question: 'Who wrote the Harry Potter series?', answer: 'J.K. Rowling' },
        { id: 'lit-1-b', question: 'Who wrote \u201CRomeo and Juliet\u201D?', answer: 'William Shakespeare' },
        { id: 'lit-1-c', question: 'What is a book of maps called?', answer: 'An atlas' },
      ],
      2: [
        { id: 'lit-2-a', question: 'Who wrote \u201CThe Adventures of Tom Sawyer\u201D?', answer: 'Mark Twain' },
        { id: 'lit-2-b', question: 'Which wooden puppet\u2019s nose grows when he lies?', answer: 'Pinocchio' },
        { id: 'lit-2-c', question: 'What is the first book of the Bible?', answer: 'Genesis' },
      ],
      3: [
        { id: 'lit-3-a', question: 'Who wrote \u201CPride and Prejudice\u201D?', answer: 'Jane Austen' },
        { id: 'lit-3-b', question: 'Which Dickens novel features Ebenezer Scrooge?', answer: 'A Christmas Carol' },
        { id: 'lit-3-c', question: 'Which Greek poet is credited with the Iliad and the Odyssey?', answer: 'Homer' },
      ],
      4: [
        { id: 'lit-4-a', question: 'Who wrote the dystopian novel \u201C1984\u201D?', answer: 'George Orwell' },
        { id: 'lit-4-b', question: 'What is the name of the hobbit in \u201CThe Hobbit\u201D?', answer: 'Bilbo Baggins' },
        { id: 'lit-4-c', question: 'Who wrote \u201CThe Great Gatsby\u201D?', answer: 'F. Scott Fitzgerald' },
      ],
      5: [
        { id: 'lit-5-a', question: 'Who wrote the Sherlock Holmes stories?', answer: 'Arthur Conan Doyle' },
        { id: 'lit-5-b', question: 'What is a word that reads the same forwards and backwards called?', answer: 'A palindrome' },
        { id: 'lit-5-c', question: 'Who wrote \u201CCrime and Punishment\u201D?', answer: 'Fyodor Dostoevsky' },
      ],
      6: [
        { id: 'lit-6-a', question: 'Which Shakespeare play features \u201CTo be, or not to be\u201D?', answer: 'Hamlet' },
        { id: 'lit-6-b', question: 'Who wrote \u201CThe Old Man and the Sea\u201D?', answer: 'Ernest Hemingway' },
        { id: 'lit-6-c', question: 'Who wrote \u201CWar and Peace\u201D?', answer: 'Leo Tolstoy' },
      ],
      7: [
        { id: 'lit-7-a', question: 'How many lines does a sonnet have?', answer: 'Fourteen' },
        { id: 'lit-7-b', question: 'Who wrote \u201CMoby-Dick\u201D?', answer: 'Herman Melville' },
        { id: 'lit-7-c', question: 'Who wrote \u201COne Hundred Years of Solitude\u201D?', answer: 'Gabriel Garc\u00EDa M\u00E1rquez' },
      ],
      8: [
        { id: 'lit-8-a', question: 'Who wrote \u201CThe Divine Comedy\u201D?', answer: 'Dante Alighieri' },
        { id: 'lit-8-b', question: 'What is the repetition of initial consonant sounds called?', answer: 'Alliteration' },
        { id: 'lit-8-c', question: 'Who wrote \u201CThe Canterbury Tales\u201D?', answer: 'Geoffrey Chaucer' },
      ],
      9: [
        { id: 'lit-9-a', question: 'Who wrote \u201CDon Quixote\u201D?', answer: 'Miguel de Cervantes' },
        { id: 'lit-9-b', question: 'Which English poet wrote \u201CParadise Lost\u201D?', answer: 'John Milton' },
        { id: 'lit-9-c', question: 'What is a Japanese three-line poem of 5-7-5 syllables called?', answer: 'A haiku' },
      ],
      10: [
        { id: 'lit-10-a', question: 'Who wrote \u201CUlysses\u201D?', answer: 'James Joyce' },
        { id: 'lit-10-b', question: 'Who wrote \u201CThe Brothers Karamazov\u201D?', answer: 'Fyodor Dostoevsky' },
        { id: 'lit-10-c', question: 'Which Roman poet wrote the \u201CAeneid\u201D?', answer: 'Virgil' },
      ],
      11: [
        { id: 'lit-11-a', question: 'Who wrote \u201CIn Search of Lost Time\u201D?', answer: 'Marcel Proust' },
        { id: 'lit-11-b', question: 'What is the term for a poem mourning the dead?', answer: 'An elegy' },
        { id: 'lit-11-c', question: 'Who wrote the tragic play \u201CFaust\u201D?', answer: 'Johann Wolfgang von Goethe' },
      ],
      12: [
        { id: 'lit-12-a', question: 'Which Mesopotamian work is often called the oldest surviving epic poem?', answer: 'The Epic of Gilgamesh' },
        { id: 'lit-12-b', question: 'What literary term gives human traits to non-human things?', answer: 'Personification' },
        { id: 'lit-12-c', question: 'Who wrote the modernist novel \u201CTo the Lighthouse\u201D?', answer: 'Virginia Woolf' },
      ],
      13: [
        { id: 'lit-13-a', question: 'Who wrote \u201CThe Tale of Genji,\u201D often called the first novel?', answer: 'Murasaki Shikibu' },
        { id: 'lit-13-b', question: 'Who wrote the notoriously complex novel \u201CGravity\u2019s Rainbow\u201D?', answer: 'Thomas Pynchon' },
        { id: 'lit-13-c', question: 'What Greek term describes a hero\u2019s fatal flaw?', answer: 'Hamartia' },
      ],
    },
  },
  {
    id: 'art',
    name: 'Art',
    difficulties: {
      1: [
        { id: 'art-1-a', question: 'Who painted the Mona Lisa?', answer: 'Leonardo da Vinci' },
        { id: 'art-1-b', question: 'What are the three primary colours?', answer: 'Red, yellow, and blue' },
        { id: 'art-1-c', question: 'What flat board do painters mix colours on?', answer: 'A palette' },
      ],
      2: [
        { id: 'art-2-a', question: 'Who painted \u201CThe Starry Night\u201D?', answer: 'Vincent van Gogh' },
        { id: 'art-2-b', question: 'Which Italian artist painted the Sistine Chapel ceiling?', answer: 'Michelangelo' },
        { id: 'art-2-c', question: 'What colour do you get by mixing blue and yellow?', answer: 'Green' },
      ],
      3: [
        { id: 'art-3-a', question: 'Which art movement is Pablo Picasso credited with founding?', answer: 'Cubism' },
        { id: 'art-3-b', question: 'Which Dutch painter created \u201CGirl with a Pearl Earring\u201D?', answer: 'Johannes Vermeer' },
        { id: 'art-3-c', question: 'What is the art of beautiful handwriting called?', answer: 'Calligraphy' },
      ],
      4: [
        { id: 'art-4-a', question: 'Who painted \u201CThe Persistence of Memory\u201D with melting clocks?', answer: 'Salvador Dal\u00ED' },
        { id: 'art-4-b', question: 'Which art movement, featuring Monet, emphasised light?', answer: 'Impressionism' },
        { id: 'art-4-c', question: 'Who painted the \u201CCampbell\u2019s Soup Cans\u201D?', answer: 'Andy Warhol' },
      ],
      5: [
        { id: 'art-5-a', question: 'Who sculpted the statue of \u201CDavid\u201D in Florence?', answer: 'Michelangelo' },
        { id: 'art-5-b', question: 'Which French artist is famous for paintings of ballet dancers?', answer: 'Edgar Degas' },
        { id: 'art-5-c', question: 'What technique involves painting onto wet plaster?', answer: 'Fresco' },
      ],
      6: [
        { id: 'art-6-a', question: 'Who painted \u201CThe Scream\u201D?', answer: 'Edvard Munch' },
        { id: 'art-6-b', question: 'Which Paris museum houses the Mona Lisa?', answer: 'The Louvre' },
        { id: 'art-6-c', question: 'Which Renaissance artist painted \u201CThe Birth of Venus\u201D?', answer: 'Sandro Botticelli' },
      ],
      7: [
        { id: 'art-7-a', question: 'Who painted \u201CGuernica\u201D?', answer: 'Pablo Picasso' },
        { id: 'art-7-b', question: 'Which style did Jackson Pollock\u2019s drip paintings belong to?', answer: 'Abstract Expressionism' },
        { id: 'art-7-c', question: 'Who painted \u201CThe Last Supper\u201D?', answer: 'Leonardo da Vinci' },
      ],
      8: [
        { id: 'art-8-a', question: 'Who painted \u201CThe Night Watch\u201D?', answer: 'Rembrandt' },
        { id: 'art-8-b', question: 'Which Mexican artist is known for self-portraits and a signature unibrow?', answer: 'Frida Kahlo' },
        { id: 'art-8-c', question: 'What is the Italian term for the contrast of light and dark?', answer: 'Chiaroscuro' },
      ],
      9: [
        { id: 'art-9-a', question: 'Which movement, featuring Dal\u00ED and Magritte, explored dreamlike imagery?', answer: 'Surrealism' },
        { id: 'art-9-b', question: 'Who created the bronze sculpture \u201CThe Thinker\u201D?', answer: 'Auguste Rodin' },
        { id: 'art-9-c', question: 'Who painted the \u201CWater Lilies\u201D series?', answer: 'Claude Monet' },
      ],
      10: [
        { id: 'art-10-a', question: 'Who painted \u201CLas Meninas\u201D?', answer: 'Diego Vel\u00E1zquez' },
        { id: 'art-10-b', question: 'Which technique builds images from tiny dots of colour, as used by Seurat?', answer: 'Pointillism' },
        { id: 'art-10-c', question: 'Which art movement, meaning \u201Cnew art,\u201D featured flowing lines around 1900?', answer: 'Art Nouveau' },
      ],
      11: [
        { id: 'art-11-a', question: 'Which anti-art movement did Marcel Duchamp\u2019s \u201CFountain\u201D belong to?', answer: 'Dada' },
        { id: 'art-11-b', question: 'Which Japanese artist created \u201CThe Great Wave off Kanagawa\u201D?', answer: 'Hokusai' },
        { id: 'art-11-c', question: 'Who painted the fantastical triptych \u201CThe Garden of Earthly Delights\u201D?', answer: 'Hieronymus Bosch' },
      ],
      12: [
        { id: 'art-12-a', question: 'Which Baroque Italian painter was famous for dramatic light and a violent life?', answer: 'Caravaggio' },
        { id: 'art-12-b', question: 'Who painted the \u201CHaystacks\u201D and \u201CRouen Cathedral\u201D series?', answer: 'Claude Monet' },
        { id: 'art-12-c', question: 'Which Austrian painter created the gold-leaf work \u201CThe Kiss\u201D?', answer: 'Gustav Klimt' },
      ],
      13: [
        { id: 'art-13-a', question: 'Which Spanish painter created \u201CThe Third of May 1808\u201D?', answer: 'Francisco Goya' },
        { id: 'art-13-b', question: 'Which artist pioneered the \u201Cready-made\u201D and \u201CFountain\u201D?', answer: 'Marcel Duchamp' },
        { id: 'art-13-c', question: 'Who painted \u201CThe Arnolfini Portrait\u201D in 1434?', answer: 'Jan van Eyck' },
      ],
    },
  },
  {
    id: 'space',
    name: 'Space',
    difficulties: {
      1: [
        { id: 'spc-1-a', question: 'Which star is at the centre of our solar system?', answer: 'The Sun' },
        { id: 'spc-1-b', question: 'What is Earth\u2019s only natural satellite?', answer: 'The Moon' },
        { id: 'spc-1-c', question: 'Which planet is known as the Red Planet?', answer: 'Mars' },
      ],
      2: [
        { id: 'spc-2-a', question: 'How many planets are in our solar system?', answer: 'Eight' },
        { id: 'spc-2-b', question: 'Which galaxy do we live in?', answer: 'The Milky Way' },
        { id: 'spc-2-c', question: 'Which is the largest planet in our solar system?', answer: 'Jupiter' },
      ],
      3: [
        { id: 'spc-3-a', question: 'Who was the first human in space?', answer: 'Yuri Gagarin' },
        { id: 'spc-3-b', question: 'Which US agency landed humans on the Moon?', answer: 'NASA' },
        { id: 'spc-3-c', question: 'Which planet is closest to the Sun?', answer: 'Mercury' },
      ],
      4: [
        { id: 'spc-4-a', question: 'Which mission first landed humans on the Moon in 1969?', answer: 'Apollo 11' },
        { id: 'spc-4-b', question: 'Which planet has the most famous ring system?', answer: 'Saturn' },
        { id: 'spc-4-c', question: 'What was the first artificial satellite, launched in 1957?', answer: 'Sputnik 1' },
      ],
      5: [
        { id: 'spc-5-a', question: 'What do we call a chunk of rock burning up in Earth\u2019s atmosphere?', answer: 'A meteor' },
        { id: 'spc-5-b', question: 'Who was the first woman in space?', answer: 'Valentina Tereshkova' },
        { id: 'spc-5-c', question: 'Which dwarf planet was reclassified from a planet in 2006?', answer: 'Pluto' },
      ],
      6: [
        { id: 'spc-6-a', question: 'Which is the hottest planet in the solar system?', answer: 'Venus' },
        { id: 'spc-6-b', question: 'What is the term for an exploding star at the end of its life?', answer: 'A supernova' },
        { id: 'spc-6-c', question: 'What is the nearest large spiral galaxy to the Milky Way?', answer: 'Andromeda' },
      ],
      7: [
        { id: 'spc-7-a', question: 'Which telescope, launched in 1990, orbits Earth?', answer: 'The Hubble Space Telescope' },
        { id: 'spc-7-b', question: 'What is the boundary of a black hole called?', answer: 'The event horizon' },
        { id: 'spc-7-c', question: 'What is a group of stars forming a recognisable pattern called?', answer: 'A constellation' },
      ],
      8: [
        { id: 'spc-8-a', question: 'What is the largest moon of Jupiter?', answer: 'Ganymede' },
        { id: 'spc-8-b', question: 'What is the name of the Sun\u2019s outer atmosphere?', answer: 'The corona' },
        { id: 'spc-8-c', question: 'What is a cloud of gas and dust where stars are born called?', answer: 'A nebula' },
      ],
      9: [
        { id: 'spc-9-a', question: 'Which space telescope launched in 2021 to succeed Hubble?', answer: 'The James Webb Space Telescope' },
        { id: 'spc-9-b', question: 'Roughly how old is the universe?', answer: 'About 13.8 billion years' },
        { id: 'spc-9-c', question: 'What kind of star will the Sun swell into late in its life?', answer: 'A red giant' },
      ],
      10: [
        { id: 'spc-10-a', question: 'What is the point in an orbit closest to the Sun called?', answer: 'Perihelion' },
        { id: 'spc-10-b', question: 'Which was the first human-made object to reach interstellar space?', answer: 'Voyager 1' },
        { id: 'spc-10-c', question: 'What unit is the distance light travels in one year?', answer: 'A light-year' },
      ],
      11: [
        { id: 'spc-11-a', question: 'What distant shell of icy bodies is thought to surround the solar system?', answer: 'The Oort Cloud' },
        { id: 'spc-11-b', question: 'What leftover radiation is evidence of the Big Bang?', answer: 'The cosmic microwave background' },
        { id: 'spc-11-c', question: 'What is the term for the brightness of a star?', answer: 'Magnitude' },
      ],
      12: [
        { id: 'spc-12-a', question: 'What is the name of the supermassive black hole at the Milky Way\u2019s centre?', answer: 'Sagittarius A*' },
        { id: 'spc-12-b', question: 'What is the maximum mass of a white dwarf, a famous limit, named after whom?', answer: 'Chandrasekhar' },
        { id: 'spc-12-c', question: 'What is the ring of rocky bodies between Mars and Jupiter called?', answer: 'The asteroid belt' },
      ],
      13: [
        { id: 'spc-13-a', question: 'Who first calculated that the Earth orbits the Sun in a heliocentric model?', answer: 'Nicolaus Copernicus' },
        { id: 'spc-13-b', question: 'What rapidly spinning neutron star emits beams of radiation?', answer: 'A pulsar' },
        { id: 'spc-13-c', question: 'What is the theoretical opposite of a black hole, from which nothing can enter?', answer: 'A white hole' },
      ],
    },
  },
  {
    id: 'animals',
    name: 'Animals',
    difficulties: {
      1: [
        { id: 'anm-1-a', question: 'What is the largest land animal?', answer: 'The elephant' },
        { id: 'anm-1-b', question: 'Which animal is known as \u201Cman\u2019s best friend\u201D?', answer: 'The dog' },
        { id: 'anm-1-c', question: 'What do bees make?', answer: 'Honey' },
      ],
      2: [
        { id: 'anm-2-a', question: 'What is the fastest land animal?', answer: 'The cheetah' },
        { id: 'anm-2-b', question: 'What is the tallest animal in the world?', answer: 'The giraffe' },
        { id: 'anm-2-c', question: 'What do you call a baby dog?', answer: 'A puppy' },
      ],
      3: [
        { id: 'anm-3-a', question: 'What is the largest animal on Earth?', answer: 'The blue whale' },
        { id: 'anm-3-b', question: 'How many legs does a spider have?', answer: 'Eight' },
        { id: 'anm-3-c', question: 'What is a group of lions called?', answer: 'A pride' },
      ],
      4: [
        { id: 'anm-4-a', question: 'What is the only mammal capable of true flight?', answer: 'The bat' },
        { id: 'anm-4-b', question: 'What is the largest species of shark?', answer: 'The whale shark' },
        { id: 'anm-4-c', question: 'What is a baby kangaroo called?', answer: 'A joey' },
      ],
      5: [
        { id: 'anm-5-a', question: 'What is the largest of the big cats?', answer: 'The tiger' },
        { id: 'anm-5-b', question: 'Which bird can fly backwards?', answer: 'The hummingbird' },
        { id: 'anm-5-c', question: 'How many hearts does an octopus have?', answer: 'Three' },
      ],
      6: [
        { id: 'anm-6-a', question: 'What is the largest living reptile?', answer: 'The saltwater crocodile' },
        { id: 'anm-6-b', question: 'Which mammal lays eggs and has a duck-like bill?', answer: 'The platypus' },
        { id: 'anm-6-c', question: 'What is the fastest animal in the world in a dive?', answer: 'The peregrine falcon' },
      ],
      7: [
        { id: 'anm-7-a', question: 'What is the study of birds called?', answer: 'Ornithology' },
        { id: 'anm-7-b', question: 'What is a group of crows called?', answer: 'A murder' },
        { id: 'anm-7-c', question: 'What is the largest species of penguin?', answer: 'The emperor penguin' },
      ],
      8: [
        { id: 'anm-8-a', question: 'How many chambers does a cow\u2019s stomach have?', answer: 'Four' },
        { id: 'anm-8-b', question: 'What is the term for an animal that is active at night?', answer: 'Nocturnal' },
        { id: 'anm-8-c', question: 'Which land animal has the largest brain?', answer: 'The elephant' },
      ],
      9: [
        { id: 'anm-9-a', question: 'What colour is a polar bear\u2019s skin beneath its fur?', answer: 'Black' },
        { id: 'anm-9-b', question: 'What is the smallest bird in the world?', answer: 'The bee hummingbird' },
        { id: 'anm-9-c', question: 'What is the collective noun for a group of flamingos?', answer: 'A flamboyance' },
      ],
      10: [
        { id: 'anm-10-a', question: 'What is the largest rodent in the world?', answer: 'The capybara' },
        { id: 'anm-10-b', question: 'Which animal\u2019s fingerprints are nearly identical to a human\u2019s?', answer: 'The koala' },
        { id: 'anm-10-c', question: 'What is the study of insects called?', answer: 'Entomology' },
      ],
      11: [
        { id: 'anm-11-a', question: 'Which amphibian can regrow lost limbs and stays in its larval form?', answer: 'The axolotl' },
        { id: 'anm-11-b', question: 'Which scaly mammal is the world\u2019s most trafficked?', answer: 'The pangolin' },
        { id: 'anm-11-c', question: 'What is the only bird known to hibernate?', answer: 'The common poorwill' },
      ],
      12: [
        { id: 'anm-12-a', question: 'Which is the only mammal that cannot jump?', answer: 'The elephant' },
        { id: 'anm-12-b', question: 'Which venomous box-shaped jellyfish is among the deadliest animals?', answer: 'The box jellyfish' },
        { id: 'anm-12-c', question: 'What is the loudest animal on Earth?', answer: 'The sperm whale' },
      ],
      13: [
        { id: 'anm-13-a', question: 'Which deep-sea creature has the largest eyes in the animal kingdom?', answer: 'The colossal squid' },
        { id: 'anm-13-b', question: 'Which shark is the longest-living vertebrate, reaching over 200 years?', answer: 'The Greenland shark' },
        { id: 'anm-13-c', question: 'What is the only continent with no native reptiles or snakes?', answer: 'Antarctica' },
      ],
    },
  },
  {
    id: 'technology',
    name: 'Technology',
    difficulties: {
      1: [
        { id: 'tec-1-a', question: 'Which company makes the iPhone?', answer: 'Apple' },
        { id: 'tec-1-b', question: 'What does \u201Cwww\u201D stand for?', answer: 'World Wide Web' },
        { id: 'tec-1-c', question: 'Which search engine is the most popular in the world?', answer: 'Google' },
      ],
      2: [
        { id: 'tec-2-a', question: 'Which company created the Windows operating system?', answer: 'Microsoft' },
        { id: 'tec-2-b', question: 'What is the \u201Cbrain\u201D chip of a computer usually called?', answer: 'The CPU' },
        { id: 'tec-2-c', question: 'Which social network did Mark Zuckerberg create?', answer: 'Facebook' },
      ],
      3: [
        { id: 'tec-3-a', question: 'Who co-founded Apple with Steve Wozniak?', answer: 'Steve Jobs' },
        { id: 'tec-3-b', question: 'What does \u201CPDF\u201D stand for?', answer: 'Portable Document Format' },
        { id: 'tec-3-c', question: 'Which company owns the Android operating system?', answer: 'Google' },
      ],
      4: [
        { id: 'tec-4-a', question: 'What does \u201CUSB\u201D stand for?', answer: 'Universal Serial Bus' },
        { id: 'tec-4-b', question: 'Who founded Microsoft with Paul Allen?', answer: 'Bill Gates' },
        { id: 'tec-4-c', question: 'In which year did the first iPhone launch?', answer: '2007' },
      ],
      5: [
        { id: 'tec-5-a', question: 'What does \u201CAI\u201D stand for?', answer: 'Artificial Intelligence' },
        { id: 'tec-5-b', question: 'What does \u201CURL\u201D stand for?', answer: 'Uniform Resource Locator' },
        { id: 'tec-5-c', question: 'Which company developed the ChatGPT chatbot?', answer: 'OpenAI' },
      ],
      6: [
        { id: 'tec-6-a', question: 'Who founded Tesla and SpaceX?', answer: 'Elon Musk' },
        { id: 'tec-6-b', question: 'What does \u201CHTTP\u201D stand for?', answer: 'HyperText Transfer Protocol' },
        { id: 'tec-6-c', question: 'What does \u201CRAM\u201D stand for?', answer: 'Random Access Memory' },
      ],
      7: [
        { id: 'tec-7-a', question: 'Who is credited with inventing the World Wide Web?', answer: 'Tim Berners-Lee' },
        { id: 'tec-7-b', question: 'What does \u201CGPU\u201D stand for?', answer: 'Graphics Processing Unit' },
        { id: 'tec-7-c', question: 'What does \u201CHTML\u201D stand for?', answer: 'HyperText Markup Language' },
      ],
      8: [
        { id: 'tec-8-a', question: 'Who invented the telephone?', answer: 'Alexander Graham Bell' },
        { id: 'tec-8-b', question: 'Which programming language, made in 1995, runs in web browsers?', answer: 'JavaScript' },
        { id: 'tec-8-c', question: 'Who created the Linux kernel?', answer: 'Linus Torvalds' },
      ],
      9: [
        { id: 'tec-9-a', question: 'What law says transistor counts roughly double every two years?', answer: 'Moore\u2019s Law' },
        { id: 'tec-9-b', question: 'What does \u201CSSD\u201D stand for?', answer: 'Solid State Drive' },
        { id: 'tec-9-c', question: 'What is the distributed ledger technology behind Bitcoin called?', answer: 'Blockchain' },
      ],
      10: [
        { id: 'tec-10-a', question: 'What was the name of the first electronic general-purpose computer, from 1945?', answer: 'ENIAC' },
        { id: 'tec-10-b', question: 'Which company made the first mass-market personal computer, the 1981 PC?', answer: 'IBM' },
        { id: 'tec-10-c', question: 'What 1969 network was the precursor to the internet?', answer: 'ARPANET' },
      ],
      11: [
        { id: 'tec-11-a', question: 'Who is considered the first computer programmer?', answer: 'Ada Lovelace' },
        { id: 'tec-11-b', question: 'What does \u201CTCP/IP\u201D primarily do?', answer: 'Route and deliver data across networks' },
        { id: 'tec-11-c', question: 'Which Taiwanese company makes most of the world\u2019s advanced chips?', answer: 'TSMC' },
      ],
      12: [
        { id: 'tec-12-a', question: 'What does \u201CASCII\u201D stand for?', answer: 'American Standard Code for Information Interchange' },
        { id: 'tec-12-b', question: 'Who designed the first mechanical general-purpose computer, the Analytical Engine?', answer: 'Charles Babbage' },
        { id: 'tec-12-c', question: 'What is the smallest unit of digital information?', answer: 'A bit' },
      ],
      13: [
        { id: 'tec-13-a', question: 'Whose 1936 \u201Cmachine\u201D concept forms the basis of modern computing theory?', answer: 'Alan Turing' },
        { id: 'tec-13-b', question: 'What architecture stores program instructions and data in the same memory?', answer: 'The von Neumann architecture' },
        { id: 'tec-13-c', question: 'What is the name of the first known computer \u201Cbug,\u201D found in 1947?', answer: 'A moth' },
      ],
    },
  },
];
