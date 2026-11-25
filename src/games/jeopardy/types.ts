import type { Difficulty } from '../../data/jeopardy-questions';

export type { Difficulty };

/** Per-player lifelines for a game. */
export interface Lifelines {
  /** Remaining Phone a Friend uses. */
  phoneAFriend: number;
  /** Remaining What Choices uses. */
  whatChoices: number;
  /** Remaining Snipe uses. */
  snipe: number;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  correct: number;
  missed: number;
  /** Number of double-trouble cards answered correctly. */
  doublesHit: number;
  /** Consecutive correct answers; used by the hot-streak house rule. */
  streak: number;
  /** True while this player still has a second-wind miss that keeps the turn. */
  secondWind: boolean;
  lifelines: Lifelines;
}

export interface BoardColumn {
  id: string;
  name: string;
}

export interface BoardCell {
  id: string;
  /** Index of the column (topic) this cell belongs to, 0-5. */
  columnIndex: number;
  difficulty: Difficulty;
  /** Base point value for the cell (200…1000). */
  value: number;
  question: string;
  answer: string;
  /** Multiple-choice options; index 0 is the correct one (3 for riddles, 4 otherwise). */
  choices: [string, string, string] | [string, string, string, string];
  isDouble: boolean;
  /** Hidden bonus tile; correct answers add a jackpot payout on top of the clue. */
  isJackpot: boolean;
  used: boolean;
  /**
   * When set, this tile's clue was drawn from another category at the same
   * dollar value (a misdirect). Rerolls stay in that new category.
   */
  misdirectFrom: { topicId: string; topicName: string } | null;
}

export interface AnswerRecord {
  cellId: string;
  topicName: string;
  question: string;
  answer: string;
  value: number;
  isDouble: boolean;
  playerId: string;
  correct: boolean;
  /** Points actually awarded to the active player (0 when wrong). */
  awarded: number;
  /** Helper id when Phone a Friend was used on this clue. */
  helperId: string | null;
  /** True when another player sniped this clue before it was answered. */
  sniped: boolean;
  /** Amount wagered on a Daily Double clue; null when not wagered. */
  wager: number | null;
}

/** House rules chosen during setup; tweak how a game plays. */
export interface GameSettings {
  /** Deduct the clue value from the picker's score on a miss. */
  wrongAnswerPenalty: boolean;
  /** Countdown per clue in seconds; 0 disables the timer. */
  clueTimerSeconds: number;
  /** Shorter board (3 rows instead of 5) for a faster game. */
  quickGame: boolean;
  /** Play a Final Jeopardy round with secret wagers after the board clears. */
  finalJeopardy: boolean;
  /** Let the picker wager on Double Trouble tiles instead of a fixed 2×. */
  dailyDoubleWager: boolean;
  /** Players tap their own answer; the app scores it automatically. */
  selfScore: boolean;
  /** Play synthesized sound cues. */
  soundEnabled: boolean;
  /** Restrict the topic pool to a themed bundle; null = all topics. */
  themeId: string | null;
  /** Phone a Friend uses granted to each player at game start. */
  phoneAFriendUses: number;
  /** What Choices uses granted to each player at game start. */
  whatChoicesUses: number;
  /** Snipe uses granted to each player at game start. */
  snipeUses: number;
  /** How many Double Trouble tiles to plant on the board. */
  doubleTroubleCount: number;
  /**
   * Chance each tile is drawn from another board category at the same
   * dollar value (0 = off).
   */
  misdirectChance: number;
  /** Double Trouble tiles pay 3× instead of 2×. */
  tripleTrouble: boolean;
  /** Consecutive correct answers after the first award a flat bonus. */
  hotStreak: boolean;
  /** Pass the pick after every clue, even on a correct answer. */
  strictRotation: boolean;
  /** Each player may miss once without losing the turn. */
  secondWind: boolean;
  /** Allow more than one $200 and $400 pick in the same turn. */
  freeLowTiles: boolean;
  /** Plant one hidden jackpot tile that pays a bonus on a correct answer. */
  jackpotTile: boolean;
  /** Trailing players score extra on correct, non-wager clues. */
  underdogBoost: boolean;
  /** Force a short timer once only a handful of tiles remain. */
  lightningFinish: boolean;
  /** After a miss, the lowest score picks next instead of the next seat. */
  lowestPicksOnMiss: boolean;
  /** Using Phone a Friend or What Choices costs points. */
  lifelineTax: boolean;
  /** Highest-value row always pauses for a wager, like a Daily Double. */
  topRowWager: boolean;
  /** On the board, tap a player to hand them the next pick. */
  openPicking: boolean;
  /** Column names stay hidden until a tile in that category is finished. */
  hiddenCategories: boolean;
  /** Hide dollar amounts on the board until a tile is opened. */
  hiddenValues: boolean;
  /** Flip the value ladder so easy tiles pay the most. */
  invertedValues: boolean;
  /** Remaining tiles pay more as the board empties. */
  boardInflation: boolean;
  /** Missed tile values pile into a pot; the next hit takes it. */
  missPot: boolean;
  /** Correctly finishing a category awards a bonus. */
  categorySweep: boolean;
  /** The player in first scores half on regular hits. */
  leaderTax: boolean;
  /** Scores cannot drop below zero. */
  scoreFloor: boolean;
  /** Wagered tiles are automatically all-in. */
  trueDailyDouble: boolean;
}

/** A single player's Final Jeopardy wager + outcome. */
export interface FinalWager {
  playerId: string;
  wager: number;
  /** null until the host marks it; true/false after. */
  correct: boolean | null;
}

export interface FinalClue {
  topicName: string;
  question: string;
  answer: string;
}

export type JeopardyPhase =
  | 'setup'
  | 'topic-ban'
  | 'topic-preview'
  | 'board'
  | 'wager'
  | 'question'
  | 'answer'
  | 'final-wager'
  | 'final-clue'
  | 'final';

export interface JeopardySession {
  players: Player[];
  columns: BoardColumn[];
  cells: BoardCell[];
  phase: JeopardyPhase;
  /** Players locked in during setup, before the board is built. */
  pendingPlayers: Player[];
  /** Six topics chosen during the preview step (before clues are drawn). */
  previewColumns: BoardColumn[];
  /**
   * Drafted clues for the preview topics. Populated before the game starts so
   * the host can inspect and reshuffle the question set; promoted to `cells`
   * (and committed to the deck history) on CONFIRM_TOPICS.
   */
  previewCells: BoardCell[];
  /** Topic ids excluded from preview rerolls for this game setup. */
  blacklistedTopicIds: string[];
  /** Whose turn it is during the per-player topic ban phase. */
  banPickerIndex: number;
  /** Choice menu vs per-player picking on the ban screen. */
  banStage: 'choice' | 'picking';
  /** Per-slot lock flags for the topic preview (length = board columns). */
  lockedPreviewSlots: boolean[];
  /** Topic ids already surfaced in preview this setup (lowers reroll weight). */
  previewSessionTopicIds: string[];
  currentPlayerIndex: number;
  activeCellId: string | null;
  questionsAnswered: number;
  history: AnswerRecord[];
  /**
   * Shuffled multiple-choice options shown for the current clue once the
   * "What Choices" lifeline is used; null when not active.
   */
  revealedChoices: string[] | null;
  /** Helper player chosen via "Phone a Friend" for the current clue; null otherwise. */
  phoneFriendId: string | null;
  /** True when a Snipe lifeline stole the current clue from the picker. */
  sniped: boolean;
  /** Turn returns here after a sniped clue resolves; null when not sniped. */
  snipedFromPlayerIndex: number | null;
  /** $200 / $400 values already picked during the active player's current turn. */
  turnPickedValues: number[];
  /** House rules for the active game. */
  settings: GameSettings;
  /** Wager locked in for the active Daily Double clue; null when not wagering. */
  activeWager: number | null;
  /** Final Jeopardy clue, drawn when the board clears (if enabled). */
  finalClue: FinalClue | null;
  /** Per-player Final Jeopardy wagers + outcomes. */
  finalWagers: FinalWager[];
  /** Index into finalWagers for the player currently entering a secret wager. */
  finalWagerIndex: number;
  /** Snapshot to restore when the host undoes the last resolve; null otherwise. */
  undoSnapshot: JeopardySession | null;
  /**
   * Recent-question keys loaded before this board was committed. Used to flag
   * clues the group may have seen in an earlier session.
   */
  priorRecentQuestionKeys: string[];
  /** Question keys already tried on the active clue via in-game reroll. */
  activeCellRerollKeys: string[];
  /**
   * Self-score result waiting for confirm/contest after reveal; null when the
   * host is marking the clue, or no pick has been made yet.
   */
  pendingSelfResult: boolean | null;
  /** Column ids that have had a finished clue (used by hidden-categories). */
  revealedColumnIds: string[];
  /** Running pot fed by misses when the miss-pot house rule is on. */
  scorePot: number;
}

export type JeopardyAction =
  | { type: 'PLAYERS_READY'; players: Player[]; settings: GameSettings }
  | { type: 'SKIP_TOPIC_BAN' }
  | { type: 'KEEP_TOPIC_BANS' }
  | { type: 'START_TOPIC_BAN' }
  | { type: 'BAN_TOPIC'; topicId: string }
  | { type: 'CONFIRM_TOPIC_BAN' }
  | { type: 'BACK_TO_SETUP' }
  | { type: 'REROLL_TOPICS' }
  | { type: 'RESHUFFLE_PREVIEW_QUESTIONS' }
  | { type: 'TOGGLE_LOCK_PREVIEW_SLOT'; slotIndex: number }
  | { type: 'BLACKLIST_TOPIC'; topicId: string }
  | { type: 'UNBLACKLIST_TOPIC'; topicId: string }
  | { type: 'SET_PREVIEW_TOPIC'; slotIndex: number; topicId: string }
  | { type: 'CONFIRM_TOPICS' }
  | { type: 'SELECT_CELL'; cellId: string }
  | { type: 'SET_PICKER'; playerId: string }
  | { type: 'SET_WAGER'; amount: number }
  | { type: 'REVEAL_ANSWER'; selfCorrect?: boolean }
  | { type: 'REROLL_QUESTION' }
  | { type: 'CONTEST_QUESTION' }
  | { type: 'RESOLVE'; correct: boolean }
  | { type: 'UNDO_RESOLVE' }
  | { type: 'USE_WHAT_CHOICES' }
  | { type: 'USE_PHONE_A_FRIEND'; helperId: string }
  | { type: 'USE_SNIPE'; playerId: string }
  | { type: 'SET_FINAL_WAGER'; amount: number }
  | { type: 'RESOLVE_FINAL'; playerId: string; correct: boolean }
  | { type: 'FINISH_FINAL' }
  | { type: 'END_GAME' }
  | { type: 'ABANDON_GAME' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'PLAY_AGAIN' };
