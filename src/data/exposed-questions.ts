/**
 * "Exposed" question pool. Every prompt asks the current player to name one
 * of the other players. Deliberately savage/roast-toxic by design — this is
 * the entire point of the game. Kept to character/behavior-based jabs
 * (hygiene, laziness, honesty, loyalty, cringe, competence) rather than real
 * trauma, appearance-shaming, sexual content, or anything hateful.
 */
export const EXPOSED_QUESTIONS: string[] = [
  // Hygiene / gross
  'Who is most likely to not wash their hands after using the bathroom?',
  'Who has the worst body odor out of everyone here?',
  'Who is most likely to fart in public and blame someone else?',
  'Who probably hasn\u2019t changed their bedsheets in over a month?',
  'Who is most likely to have expired food sitting in their fridge right now?',
  'Who has the most disgusting phone screen?',
  'Who is most likely to pick their nose when they think no one\u2019s looking?',
  'Who is the least likely to ever floss?',
  'Who would survive the longest without a shower and genuinely not notice?',
  'Who is most likely to wear the same socks three days in a row?',
  'Who has the dirtiest car or room right now?',
  'Who is most likely to brush their teeth once a day, if that?',

  // Laziness / incompetence
  'Who contributes the least in every group project?',
  'Who is most likely to get fired within their first month at a new job?',
  'Who would fail a task literally designed for toddlers?',
  'Who is most likely to forget their own birthday?',
  'Who takes the longest to reply to texts on purpose?',
  'Who is most likely to show up an hour late to their own wedding?',
  'Who would fail a surprise quiz on basic life skills?',
  'Who is most likely to get lost using GPS?',
  'Who is most likely to burn water while "cooking"?',
  'Who would take credit for someone else\u2019s work without hesitation?',
  'Who is most likely to sleep through something genuinely important?',
  'Who is the most likely to quit something the second it gets hard?',

  // Dishonesty / pettiness
  'Who is most likely to lie about reading a book they never finished?',
  'Who would 100% snitch to save themselves?',
  'Who is most likely to fake being sick to get out of plans?',
  'Who has told the most obvious lie in this group?',
  'Who is most likely to secretly hate someone here but pretend not to?',
  'Who would sell out the whole group for fifty bucks?',
  'Who is most likely to ghost someone mid-conversation?',
  'Who talks the most behind everyone\u2019s back?',
  'Who is most likely to steal credit for a joke that wasn\u2019t theirs?',
  'Who is the fakest when it comes to social media?',
  'Who is most likely to lie about their salary?',
  'Who is most likely to get caught in a lie and just keep lying anyway?',

  // Dating / social cringe
  'Who is most likely to get catfished and not realize it for weeks?',
  'Who has the most embarrassing search history?',
  'Who is most likely to double text and regret it instantly?',
  'Who would cry over a breakup they caused themselves?',
  'Who is most likely to get left on read constantly?',
  'Who is most likely to simp the hardest for someone who doesn\u2019t care?',
  'Who has the cringiest dating app bio?',
  'Who is most likely to get dumped and genuinely not see it coming?',
  'Who would be the most annoying person to date?',
  'Who is the worst at taking a hint that someone isn\u2019t interested?',
  'Who is most likely to still be talking about their ex a year later?',
  'Who is most likely to fall for an obvious love-bomb?',

  // Money / cheapness
  'Who is the cheapest when splitting a bill?',
  'Who is most likely to "forget" their wallet every single time?',
  'Who is most likely to go broke buying things they don\u2019t need?',
  'Who would sell out a friend for a discount?',
  'Who is most likely to still be asking for money at 40?',
  'Who tips the worst at restaurants?',
  'Who is most likely to fall for a pyramid scheme?',
  'Who would blow their last dollar on something completely useless?',
  'Who is most likely to "invest" in something they clearly don\u2019t understand?',

  // Intelligence / competence roast
  'Who is most likely to fail a test they actually studied for?',
  'Who has said the dumbest thing out loud in this group?',
  'Who would struggle to survive a week without their phone?',
  'Who is most likely to get scammed by an obvious email?',
  'Who is the worst at giving directions?',
  'Who is most likely to argue confidently about something they\u2019re completely wrong about?',
  'Who would forget their own name under mild pressure?',
  'Who is most likely to trust a random stranger\u2019s advice over an actual expert?',
  'Who is most likely to not understand the joke and laugh anyway?',

  // Personality / social standing
  'Who is most likely to get talked about the second they leave the room?',
  'Who is most likely to get voted off first if this were a reality show?',
  'Who would be the villain in everyone else\u2019s story?',
  'Who is most likely to be the reason group chats go silent?',
  'Who is the most likely to overreact to literally nothing?',
  'Who is the most insufferable when they\u2019re actually right about something?',
  'Who is most likely to make everything about themselves?',
  'Who is the most likely to fake a whole personality just to fit in?',
  'Who would be the first to abandon ship the moment things get hard?',
  'Who is most likely to throw someone under the bus to look better?',
  'Who has the most punchable "resting face" in the group?',
  'Who is most likely to be secretly the most toxic one in every relationship they\u2019ve had?',

  // Vanity / online cringe
  'Who spends the most time trying to look good for people who don\u2019t care?',
  'Who is most likely to post a heavily filtered photo and deny it?',
  'Who takes the most selfies before finding "the one"?',
  'Who almost certainly has a mirror-selfie folder no one should ever see?',
  'Who is most likely to fish for compliments online?',

  // Dark hypothetical / future roast (light, non-graphic)
  'Who is most likely to end up on a true crime documentary as the person everyone should\u2019ve suspected?',
  'Who is most likely to get arrested for something incredibly stupid?',
  'Who is most likely to peak right now and never top it again?',
  'Who is most likely to end up alone with a dozen pets and zero regrets?',
  'Who is most likely to be forgotten by the group a year after moving away?',
  'Who is most likely to end up working for their own worst enemy?',
  'Who is most likely to be the reason a family group chat implodes?',
  'Who is most likely to get insufferable the moment they get a little bit of money?',
  'Who is most likely to fake their entire personality on a first date and still strike out?',
  'Who is most likely to become a conspiracy theorist by the time they\u2019re 40?',
  'Who is most likely to get "canceled" first?',
  'Who is most likely to be exposed for something they swore they\u2019d never get caught doing?',

  // Loyalty / friendship
  'Who would 100% skip your funeral if it was raining?',
  'Who is most likely to forget your birthday two years running?',
  'Who would take the last slice without even asking?',
  'Who is most likely to borrow money and just "forget"?',
  'Who is the least likely to actually show up when it matters?',
  'Who would trade this group chat for a better one in a heartbeat?',
  'Who is most likely to laugh at you instead of helping you up?',
  'Who is most likely to leave you on read during an actual emergency?',
  'Who would 100% throw the rest of the group under the bus to win a game show?',
  'Who is most likely to be the reason this exact game gets awkward?',
];
