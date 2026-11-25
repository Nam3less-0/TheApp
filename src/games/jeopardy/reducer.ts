import type {
  AnswerRecord,
  FinalWager,
  GameSettings,
  JeopardyAction,
  JeopardySession,
} from './types';
import {
  cellSourceTopicId,
  cellSourceTopicName,
  commitBoardDraw,
  commitRerolledQuestion,
  defaultSettings,
  draftBoardForSettings,
  drawFinalClue,
  freshLifelines,
  getAllTopicSummaries,
  getThemeBundle,
  boostedCluePoints,
  isCellBlockedThisTurn,
  isWhatChoicesAllowed,
  loadRecentQuestionKeys,
  lowestScoreIndex,
  makeQuestionKey,
  maxCellValue,
  maxDailyDoubleWager,
  maxFinalWager,
  pickPreviewTopics,
  rerollCellQuestion,
  rerollUnlockedPreviewTopics,
  shuffle,
  applyScoreDelta,
  isLastTileInColumn,
  jackpotBonus,
  tilePoints,
  BOARD_COLUMNS,
  LIFELINE_TAX,
  SWEEP_BONUS,
  SNIPE_CORRECT_POINTS,
  STREAK_BONUS,
  TURN_LIMITED_VALUES,
} from './utils';

export const initialJeopardyState: JeopardySession = {
  players: [],
  columns: [],
  cells: [],
  phase: 'setup',
  pendingPlayers: [],
  previewColumns: [],
  blacklistedTopicIds: [],
  banPickerIndex: 0,
  banStage: 'choice',
  lockedPreviewSlots: Array.from({ length: BOARD_COLUMNS }, () => false),
  previewSessionTopicIds: [],
  previewCells: [],
  currentPlayerIndex: 0,
  activeCellId: null,
  questionsAnswered: 0,
  history: [],
  revealedChoices: null,
  phoneFriendId: null,
  sniped: false,
  snipedFromPlayerIndex: null,
  turnPickedValues: [],
  settings: defaultSettings(),
  activeWager: null,
  finalClue: null,
  finalWagers: [],
  finalWagerIndex: 0,
  undoSnapshot: null,
  priorRecentQuestionKeys: [],
  activeCellRerollKeys: [],
  pendingSelfResult: null,
  revealedColumnIds: [],
  scorePot: 0,
};

function emptyLockedSlots(): boolean[] {
  return Array.from({ length: BOARD_COLUMNS }, () => false);
}

/** Allowed topic ids for the active theme (null = all topics). */
function themeAllowedIds(settings: GameSettings): string[] | null {
  const theme = getThemeBundle(settings.themeId);
  return theme ? theme.topicIds : null;
}

function beginTopicPreview(
  players: JeopardySession['players'],
  settings: GameSettings,
  blacklistedTopicIds: string[] = [],
  previewSessionTopicIds: string[] = [],
): Pick<
  JeopardySession,
  | 'pendingPlayers'
  | 'previewColumns'
  | 'previewCells'
  | 'blacklistedTopicIds'
  | 'lockedPreviewSlots'
  | 'previewSessionTopicIds'
  | 'phase'
  | 'settings'
> {
  const allowed = themeAllowedIds(settings);
  const preview = pickPreviewTopics(
    blacklistedTopicIds,
    previewSessionTopicIds,
    [],
    allowed,
  );
  const board = draftBoardForSettings(
    preview.columns.map((column) => column.id),
    settings,
  );
  return {
    pendingPlayers: players,
    previewColumns: board.columns,
    previewCells: board.cells,
    blacklistedTopicIds,
    lockedPreviewSlots: emptyLockedSlots(),
    previewSessionTopicIds: preview.sessionTopicIds,
    phase: 'topic-preview',
    settings,
  };
}

function freshPlayers(
  players: JeopardySession['players'],
  settings: GameSettings,
) {
  return players.map((p) => ({
    ...p,
    score: 0,
    correct: 0,
    missed: 0,
    doublesHit: 0,
    streak: 0,
    secondWind: settings.secondWind,
    lifelines: freshLifelines(settings),
  }));
}

function withLifelineTax(
  players: JeopardySession['players'],
  playerId: string,
  tax: boolean,
  floor: boolean,
): JeopardySession['players'] {
  if (!tax) return players;
  return players.map((p) =>
    p.id === playerId
      ? { ...p, score: applyScoreDelta(p.score, -LIFELINE_TAX, floor) }
      : p,
  );
}

/** Reset stats and randomize turn order before each new game. */
function preparePlayersForGame(
  players: JeopardySession['players'],
  settings: GameSettings,
) {
  const reset = freshPlayers(players, settings);
  return reset.length > 1 ? shuffle(reset) : reset;
}

/** Swap the active tile's clue; used by pre-reveal reroll and post-reveal contest. */
function rerollActiveCell(
  state: JeopardySession,
  restoreLifelines: boolean,
): JeopardySession | null {
  if (!state.activeCellId) return null;
  const cell = state.cells.find((c) => c.id === state.activeCellId);
  if (!cell) return null;

  const topicId = cellSourceTopicId(state.columns, cell);
  if (!topicId) return null;
  const currentKey = makeQuestionKey(topicId, cell.difficulty, cell.question);
  const result = rerollCellQuestion(state.columns, state.cells, cell.id, [
    ...state.activeCellRerollKeys,
    currentKey,
  ]);
  if (!result) return null;

  commitRerolledQuestion(state.columns, result.cell, result.pickedKey);

  const activePlayer = state.players[state.currentPlayerIndex];
  const restoreWhat = restoreLifelines && state.revealedChoices !== null;
  const restorePhone = restoreLifelines && state.phoneFriendId !== null;
  const players =
    activePlayer && (restoreWhat || restorePhone)
      ? state.players.map((p) =>
          p.id === activePlayer.id
            ? {
                ...p,
                lifelines: {
                  ...p.lifelines,
                  whatChoices: restoreWhat
                    ? Math.min(
                        state.settings.whatChoicesUses,
                        p.lifelines.whatChoices + 1,
                      )
                    : p.lifelines.whatChoices,
                  phoneAFriend: restorePhone
                    ? Math.min(
                        state.settings.phoneAFriendUses,
                        p.lifelines.phoneAFriend + 1,
                      )
                    : p.lifelines.phoneAFriend,
                },
              }
            : p,
        )
      : state.players;

  return {
    ...state,
    players,
    cells: state.cells.map((c) => (c.id === cell.id ? result.cell : c)),
    activeCellRerollKeys: [...state.activeCellRerollKeys, currentKey],
    revealedChoices: null,
    phoneFriendId: null,
    pendingSelfResult: null,
  };
}

/** Set up the Final Jeopardy round, or fall straight through to results. */
function enterFinalOrResults(state: JeopardySession): JeopardySession {
  if (!state.settings.finalJeopardy) {
    return { ...state, phase: 'final' };
  }
  const contenders = state.players.filter((p) => p.score > 0);
  if (contenders.length === 0) {
    return { ...state, phase: 'final' };
  }
  const finalClue = drawFinalClue(
    state.columns.map((column) => column.id),
    themeAllowedIds(state.settings),
  );
  const finalWagers: FinalWager[] = contenders.map((p) => ({
    playerId: p.id,
    wager: 0,
    correct: null,
  }));
  return {
    ...state,
    phase: 'final-wager',
    finalClue,
    finalWagers,
    finalWagerIndex: 0,
  };
}

export function jeopardyReducer(
  state: JeopardySession,
  action: JeopardyAction,
): JeopardySession {
  switch (action.type) {
    // Players are locked in; land on the ban menu (ban, skip, or keep last list).
    case 'PLAYERS_READY': {
      return {
        ...state,
        pendingPlayers: action.players,
        settings: action.settings,
        blacklistedTopicIds: [],
        banPickerIndex: 0,
        banStage: 'choice',
        phase: 'topic-ban',
      };
    }

    case 'SKIP_TOPIC_BAN': {
      if (state.phase !== 'topic-ban') return state;
      const bans = state.banStage === 'picking' ? state.blacklistedTopicIds : [];
      return {
        ...state,
        ...beginTopicPreview(state.pendingPlayers, state.settings, bans),
      };
    }

    case 'KEEP_TOPIC_BANS': {
      if (state.phase !== 'topic-ban') return state;
      return {
        ...state,
        ...beginTopicPreview(
          state.pendingPlayers,
          state.settings,
          state.blacklistedTopicIds,
        ),
      };
    }

    case 'START_TOPIC_BAN': {
      if (state.phase !== 'topic-ban') return state;
      return {
        ...state,
        blacklistedTopicIds: [],
        banPickerIndex: 0,
        banStage: 'picking',
      };
    }

    case 'BAN_TOPIC': {
      if (state.phase !== 'topic-ban' || state.banStage !== 'picking') return state;
      const already = state.blacklistedTopicIds.includes(action.topicId);
      if (already) {
        return {
          ...state,
          blacklistedTopicIds: state.blacklistedTopicIds.filter((id) => id !== action.topicId),
        };
      }
      // One ban each, so never let a player pick past their own slot.
      if (state.blacklistedTopicIds.length > state.banPickerIndex) return state;
      return {
        ...state,
        blacklistedTopicIds: [...state.blacklistedTopicIds, action.topicId],
      };
    }

    case 'CONFIRM_TOPIC_BAN': {
      if (state.phase !== 'topic-ban' || state.banStage !== 'picking') return state;
      // Require this player to have actually banned something.
      if (state.blacklistedTopicIds.length <= state.banPickerIndex) return state;
      if (state.banPickerIndex + 1 < state.pendingPlayers.length) {
        return { ...state, banPickerIndex: state.banPickerIndex + 1 };
      }
      return {
        ...state,
        ...beginTopicPreview(state.pendingPlayers, state.settings, state.blacklistedTopicIds),
      };
    }

    case 'BACK_TO_SETUP': {
      return {
        ...state,
        phase: 'setup',
        previewColumns: [],
        previewCells: [],
        blacklistedTopicIds: [],
        banPickerIndex: 0,
        banStage: 'choice',
        lockedPreviewSlots: emptyLockedSlots(),
        previewSessionTopicIds: [],
      };
    }

    case 'REROLL_TOPICS': {
      if (state.phase !== 'topic-preview') return state;
      const lockedSlots =
        state.lockedPreviewSlots.length === BOARD_COLUMNS
          ? state.lockedPreviewSlots
          : emptyLockedSlots();
      const preview = rerollUnlockedPreviewTopics(
        state.previewColumns,
        lockedSlots,
        state.blacklistedTopicIds,
        state.previewSessionTopicIds,
        themeAllowedIds(state.settings),
      );
      const board = draftBoardForSettings(
        preview.columns.map((column) => column.id),
        state.settings,
      );
      return {
        ...state,
        previewColumns: board.columns,
        previewCells: board.cells,
        previewSessionTopicIds: preview.sessionTopicIds,
        lockedPreviewSlots: lockedSlots,
      };
    }

    case 'TOGGLE_LOCK_PREVIEW_SLOT': {
      if (state.phase !== 'topic-preview') return state;
      const { slotIndex } = action;
      if (slotIndex < 0 || slotIndex >= state.previewColumns.length) return state;
      const lockedSlots =
        state.lockedPreviewSlots.length === BOARD_COLUMNS
          ? state.lockedPreviewSlots
          : emptyLockedSlots();
      const lockedPreviewSlots = lockedSlots.map((locked, index) =>
        index === slotIndex ? !locked : locked,
      );
      return { ...state, lockedPreviewSlots };
    }

    case 'RESHUFFLE_PREVIEW_QUESTIONS': {
      if (state.phase !== 'topic-preview' || state.previewColumns.length === 0) {
        return state;
      }
      const board = draftBoardForSettings(
        state.previewColumns.map((column) => column.id),
        state.settings,
      );
      return {
        ...state,
        previewColumns: board.columns,
        previewCells: board.cells,
      };
    }

    case 'SET_PREVIEW_TOPIC': {
      if (state.phase !== 'topic-preview') return state;
      const { slotIndex, topicId } = action;
      if (slotIndex < 0 || slotIndex >= state.previewColumns.length) return state;
      if (
        state.previewColumns.some(
          (column, index) => column.id === topicId && index !== slotIndex,
        )
      ) {
        return state;
      }
      // Never let a manual pick smuggle a banned topic onto the board.
      if (state.blacklistedTopicIds.includes(topicId)) return state;
      const summary = getAllTopicSummaries().find((topic) => topic.id === topicId);
      if (!summary) return state;

      const nextColumns = state.previewColumns.map((column, index) =>
        index === slotIndex ? { id: summary.id, name: summary.name } : column,
      );
      const board = draftBoardForSettings(
        nextColumns.map((column) => column.id),
        state.settings,
      );
      return {
        ...state,
        previewColumns: board.columns,
        previewCells: board.cells,
        previewSessionTopicIds: [
          ...new Set([...state.previewSessionTopicIds, topicId]),
        ],
      };
    }

    case 'BLACKLIST_TOPIC': {
      if (state.phase !== 'topic-preview') return state;
      if (state.blacklistedTopicIds.includes(action.topicId)) return state;

      const blacklistedTopicIds = [...state.blacklistedTopicIds, action.topicId];
      const preview = pickPreviewTopics(
        blacklistedTopicIds,
        state.previewSessionTopicIds,
        [],
        themeAllowedIds(state.settings),
      );
      const board = draftBoardForSettings(
        preview.columns.map((column) => column.id),
        state.settings,
      );
      return {
        ...state,
        blacklistedTopicIds,
        previewColumns: board.columns,
        previewCells: board.cells,
        previewSessionTopicIds: preview.sessionTopicIds,
      };
    }

    case 'UNBLACKLIST_TOPIC': {
      if (state.phase !== 'topic-preview') return state;
      const blacklistedTopicIds = state.blacklistedTopicIds.filter(
        (id) => id !== action.topicId,
      );
      if (blacklistedTopicIds.length === state.blacklistedTopicIds.length) {
        return state;
      }
      return { ...state, blacklistedTopicIds };
    }

    case 'CONFIRM_TOPICS': {
      if (
        state.phase !== 'topic-preview' ||
        state.previewColumns.length === 0 ||
        state.previewCells.length === 0
      ) {
        return state;
      }

      const players = preparePlayersForGame(state.pendingPlayers, state.settings);
      const columns = state.previewColumns;
      const cells = state.previewCells;
      const priorRecentQuestionKeys = loadRecentQuestionKeys();
      commitBoardDraw(columns, cells);

      return {
        ...state,
        players,
        columns,
        cells,
        phase: 'board',
        pendingPlayers: [],
        previewColumns: [],
        previewCells: [],
        lockedPreviewSlots: emptyLockedSlots(),
        previewSessionTopicIds: [],
        currentPlayerIndex: 0,
        activeCellId: null,
        questionsAnswered: 0,
        history: [],
        revealedChoices: null,
        phoneFriendId: null,
        sniped: false,
        snipedFromPlayerIndex: null,
        turnPickedValues: [],
        activeWager: null,
        finalClue: null,
        finalWagers: [],
        finalWagerIndex: 0,
        undoSnapshot: null,
        priorRecentQuestionKeys,
        activeCellRerollKeys: [],
        pendingSelfResult: null,
        revealedColumnIds: [],
        scorePot: 0,
      };
    }

    case 'SELECT_CELL': {
      if (state.phase !== 'board') return state;
      const cell = state.cells.find((c) => c.id === action.cellId);
      if (!cell || cell.used) return state;
      if (
        isCellBlockedThisTurn(
          cell.value,
          state.turnPickedValues,
          state.settings.freeLowTiles,
        )
      ) {
        return state;
      }

      const turnPickedValues = (TURN_LIMITED_VALUES as readonly number[]).includes(
        cell.value,
      )
        ? [...state.turnPickedValues, cell.value]
        : state.turnPickedValues;

      const topRow = cell.value === maxCellValue(state.cells);
      const wagerable =
        ((state.settings.dailyDoubleWager || state.settings.trueDailyDouble) &&
          cell.isDouble) ||
        (state.settings.topRowWager && topRow);
      const picker = state.players[state.currentPlayerIndex];
      const allIn = Boolean(
        wagerable && state.settings.trueDailyDouble && picker,
      );
      const lockedWager =
        allIn && picker
          ? maxDailyDoubleWager(picker.score, maxCellValue(state.cells))
          : null;

      // Clear any lifeline state carried over from the previous clue.
      return {
        ...state,
        phase: allIn ? 'question' : wagerable ? 'wager' : 'question',
        activeCellId: cell.id,
        revealedChoices: null,
        phoneFriendId: null,
        sniped: false,
        snipedFromPlayerIndex: null,
        turnPickedValues,
        activeWager: lockedWager,
        undoSnapshot: null,
        activeCellRerollKeys: [],
        pendingSelfResult: null,
      };
    }

    case 'SET_PICKER': {
      if (state.phase !== 'board' || !state.settings.openPicking) return state;
      const idx = state.players.findIndex((p) => p.id === action.playerId);
      if (idx < 0 || idx === state.currentPlayerIndex) return state;
      return {
        ...state,
        currentPlayerIndex: idx,
        turnPickedValues: [],
      };
    }

    case 'REROLL_QUESTION': {
      if (state.phase !== 'question' || !state.activeCellId) return state;
      return rerollActiveCell(state, false) ?? state;
    }

    case 'CONTEST_QUESTION': {
      if (state.phase !== 'answer' || !state.activeCellId) return state;
      const next = rerollActiveCell(state, true);
      if (!next) return state;
      return { ...next, phase: 'question' };
    }

    case 'SET_WAGER': {
      if (state.phase !== 'wager' || !state.activeCellId) return state;
      const player = state.players[state.currentPlayerIndex];
      if (!player) return state;
      const cap = maxDailyDoubleWager(player.score);
      const wager = Math.max(0, Math.min(Math.round(action.amount), cap));
      return { ...state, activeWager: wager, phase: 'question' };
    }

    case 'USE_WHAT_CHOICES': {
      if (state.phase !== 'question' && state.phase !== 'answer') return state;
      if (state.revealedChoices) return state;
      const cell = state.cells.find((c) => c.id === state.activeCellId);
      if (!cell) return state;
      const topicId = cellSourceTopicId(state.columns, cell);
      if (!isWhatChoicesAllowed(topicId)) return state;
      const player = state.players[state.currentPlayerIndex];
      if (!player || player.lifelines.whatChoices <= 0) return state;

      const spent = state.players.map((p) =>
        p.id === player.id
          ? {
              ...p,
              lifelines: {
                ...p.lifelines,
                whatChoices: p.lifelines.whatChoices - 1,
              },
            }
          : p,
      );
      return {
        ...state,
        players: withLifelineTax(
          spent,
          player.id,
          state.settings.lifelineTax,
          state.settings.scoreFloor,
        ),
        revealedChoices: shuffle(cell.choices),
      };
    }

    case 'USE_PHONE_A_FRIEND': {
      if (state.phase !== 'question' && state.phase !== 'answer') return state;
      if (state.phoneFriendId) return state;
      const player = state.players[state.currentPlayerIndex];
      if (!player || player.lifelines.phoneAFriend <= 0) return state;
      const helper = state.players.find(
        (p) => p.id === action.helperId && p.id !== player.id,
      );
      if (!helper) return state;

      const spent = state.players.map((p) =>
        p.id === player.id
          ? {
              ...p,
              lifelines: {
                ...p.lifelines,
                phoneAFriend: p.lifelines.phoneAFriend - 1,
              },
            }
          : p,
      );
      return {
        ...state,
        players: withLifelineTax(
          spent,
          player.id,
          state.settings.lifelineTax,
          state.settings.scoreFloor,
        ),
        phoneFriendId: helper.id,
      };
    }

    case 'USE_SNIPE': {
      if (state.phase !== 'question') return state;
      if (state.revealedChoices || state.phoneFriendId || state.sniped) return state;
      // Snipe is disabled on wagered Daily Doubles.
      if (state.activeWager !== null) return state;

      const activePlayer = state.players[state.currentPlayerIndex];
      const sniper = state.players.find((p) => p.id === action.playerId);
      if (!activePlayer || !sniper || sniper.id === activePlayer.id) return state;
      if (sniper.lifelines.snipe <= 0) return state;

      const sniperIndex = state.players.findIndex((p) => p.id === sniper.id);
      if (sniperIndex < 0) return state;

      const players = state.players.map((p) =>
        p.id === sniper.id
          ? { ...p, lifelines: { ...p.lifelines, snipe: p.lifelines.snipe - 1 } }
          : p,
      );

      return {
        ...state,
        players,
        currentPlayerIndex: sniperIndex,
        sniped: true,
        snipedFromPlayerIndex: state.currentPlayerIndex,
      };
    }

    case 'REVEAL_ANSWER': {
      if (state.phase !== 'question') return state;
      return {
        ...state,
        phase: 'answer',
        pendingSelfResult:
          typeof action.selfCorrect === 'boolean' ? action.selfCorrect : null,
      };
    }

    case 'RESOLVE': {
      if (state.phase !== 'answer' || !state.activeCellId) return state;
      const cell = state.cells.find((c) => c.id === state.activeCellId);
      if (!cell) return state;

      const wager = state.activeWager;
      const stake = tilePoints(cell, state.settings, wager, state.cells);
      const jackpot = action.correct ? jackpotBonus(cell) : 0;
      const rawPoints = stake + jackpot;
      const activePlayer = state.players[state.currentPlayerIndex];
      const points =
        action.correct && !state.sniped && wager === null
          ? boostedCluePoints(
              rawPoints,
              state.settings,
              state.players,
              activePlayer.id,
            )
          : rawPoints;
      const nextStreak = action.correct ? (activePlayer.streak ?? 0) + 1 : 0;
      const streakBonus =
        state.settings.hotStreak &&
        action.correct &&
        !state.sniped &&
        wager === null &&
        nextStreak >= 2
          ? STREAK_BONUS
          : 0;
      const usedSecondWind =
        !action.correct &&
        !state.sniped &&
        state.settings.secondWind &&
        activePlayer.secondWind;

      let activeShare: number;
      let helperShare = 0;
      const helperId = state.phoneFriendId;

      if (state.sniped) {
        activeShare = action.correct
          ? SNIPE_CORRECT_POINTS
          : -Math.round(stake / 2);
      } else if (wager !== null) {
        // Wagered tile: solo bet, plus jackpot on a hit.
        activeShare = action.correct ? wager + jackpot : -wager;
      } else if (action.correct) {
        const splitWithHelper = helperId !== null;
        activeShare = splitWithHelper ? Math.round(points / 2) : points;
        helperShare = splitWithHelper ? points - activeShare : 0;
        activeShare += streakBonus;
      } else {
        activeShare = state.settings.wrongAnswerPenalty ? -stake : 0;
      }

      const sweep =
        action.correct &&
        state.settings.categorySweep &&
        isLastTileInColumn(state.cells, cell)
          ? SWEEP_BONUS
          : 0;
      if (sweep > 0) activeShare += sweep;

      let nextPot = state.scorePot;
      if (state.settings.missPot) {
        if (action.correct) {
          activeShare += state.scorePot;
          nextPot = 0;
        } else {
          nextPot = state.scorePot + Math.max(0, stake);
        }
      }

      const floor = state.settings.scoreFloor;
      const players = state.players.map((p) => {
        if (p.id === activePlayer.id) {
          return {
            ...p,
            score: applyScoreDelta(p.score, activeShare, floor),
            correct: p.correct + (action.correct ? 1 : 0),
            missed: p.missed + (action.correct ? 0 : 1),
            doublesHit:
              p.doublesHit +
              (action.correct && !state.sniped && cell.isDouble ? 1 : 0),
            streak: nextStreak,
            secondWind: usedSecondWind ? false : p.secondWind,
          };
        }
        if (!state.sniped && helperShare > 0 && p.id === helperId) {
          return {
            ...p,
            score: applyScoreDelta(p.score, helperShare, floor),
          };
        }
        return p;
      });

      const cells = state.cells.map((c) =>
        c.id === cell.id ? { ...c, used: true } : c,
      );

      const record: AnswerRecord = {
        cellId: cell.id,
        topicName: cellSourceTopicName(state.columns, cell),
        question: cell.question,
        answer: cell.answer,
        value: cell.value,
        isDouble: cell.isDouble,
        playerId: activePlayer.id,
        correct: action.correct,
        awarded: activeShare,
        helperId: state.phoneFriendId,
        sniped: state.sniped,
        wager,
      };

      const questionsAnswered = state.questionsAnswered + 1;
      const isOver = cells.every((c) => c.used);
      const columnId = state.columns[cell.columnIndex]?.id;
      const revealedColumnIds =
        columnId && !state.revealedColumnIds.includes(columnId)
          ? [...state.revealedColumnIds, columnId]
          : state.revealedColumnIds;
      const nextPlayerIndex = (() => {
        if (state.sniped && state.snipedFromPlayerIndex !== null) {
          return state.snipedFromPlayerIndex;
        }
        if (usedSecondWind) return state.currentPlayerIndex;
        if (action.correct || wager !== null) {
          if (state.settings.strictRotation) {
            return (state.currentPlayerIndex + 1) % state.players.length;
          }
          return state.currentPlayerIndex;
        }
        if (state.settings.lowestPicksOnMiss) {
          return lowestScoreIndex(players, state.currentPlayerIndex);
        }
        return (state.currentPlayerIndex + 1) % state.players.length;
      })();
      const turnChanged = nextPlayerIndex !== state.currentPlayerIndex;

      // Snapshot lets the host undo a mis-tapped resolve from the board.
      const undoSnapshot: JeopardySession = { ...state, undoSnapshot: null };

      const resolved: JeopardySession = {
        ...state,
        players,
        cells,
        questionsAnswered,
        activeCellId: null,
        currentPlayerIndex: nextPlayerIndex,
        phase: 'board',
        history: [...state.history, record],
        revealedChoices: null,
        phoneFriendId: null,
        sniped: false,
        snipedFromPlayerIndex: null,
        turnPickedValues: turnChanged ? [] : state.turnPickedValues,
        activeWager: null,
        undoSnapshot,
        pendingSelfResult: null,
        revealedColumnIds,
        scorePot: nextPot,
      };

      return isOver ? enterFinalOrResults(resolved) : resolved;
    }

    case 'UNDO_RESOLVE': {
      if (!state.undoSnapshot) return state;
      return state.undoSnapshot;
    }

    case 'SET_FINAL_WAGER': {
      if (state.phase !== 'final-wager') return state;
      const entry = state.finalWagers[state.finalWagerIndex];
      if (!entry) return state;
      const player = state.players.find((p) => p.id === entry.playerId);
      if (!player) return state;

      const cap = maxFinalWager(player.score);
      const wager = Math.max(0, Math.min(Math.round(action.amount), cap));
      const finalWagers = state.finalWagers.map((w, index) =>
        index === state.finalWagerIndex ? { ...w, wager } : w,
      );
      const nextIndex = state.finalWagerIndex + 1;
      const done = nextIndex >= finalWagers.length;
      return {
        ...state,
        finalWagers,
        finalWagerIndex: done ? state.finalWagerIndex : nextIndex,
        phase: done ? 'final-clue' : 'final-wager',
      };
    }

    case 'RESOLVE_FINAL': {
      if (state.phase !== 'final-clue') return state;
      const idx = state.finalWagers.findIndex(
        (w) => w.playerId === action.playerId,
      );
      if (idx < 0) return state;
      if (state.finalWagers[idx].correct !== null) return state;

      const entry = state.finalWagers[idx];
      const finalWagers = state.finalWagers.map((w, index) =>
        index === idx ? { ...w, correct: action.correct } : w,
      );
      const delta = action.correct ? entry.wager : -entry.wager;
      const players = state.players.map((p) =>
        p.id === entry.playerId
          ? { ...p, score: applyScoreDelta(p.score, delta, state.settings.scoreFloor) }
          : p,
      );
      return { ...state, players, finalWagers };
    }

    case 'FINISH_FINAL': {
      if (state.phase !== 'final-clue') return state;
      if (state.finalWagers.some((w) => w.correct === null)) return state;
      return { ...state, phase: 'final' };
    }

    case 'END_GAME': {
      if (state.phase === 'setup' || state.phase === 'final') return state;
      // Jump straight to the standings with whatever has been scored so far.
      return {
        ...state,
        phase: 'final',
        activeCellId: null,
        activeWager: null,
        revealedChoices: null,
        phoneFriendId: null,
        sniped: false,
        snipedFromPlayerIndex: null,
        undoSnapshot: null,
        pendingSelfResult: null,
      };
    }

    case 'ABANDON_GAME': {
      // Drop the game and return to setup, keeping players and house rules.
      return {
        ...initialJeopardyState,
        settings: state.settings,
        pendingPlayers:
          state.players.length > 0
            ? freshPlayers(state.players, state.settings)
            : state.pendingPlayers,
        phase: 'setup',
      };
    }

    case 'TOGGLE_SOUND': {
      return {
        ...state,
        settings: { ...state.settings, soundEnabled: !state.settings.soundEnabled },
      };
    }

    case 'PLAY_AGAIN': {
      const pendingPlayers = freshPlayers(state.players, state.settings);
      return {
        ...initialJeopardyState,
        pendingPlayers,
        settings: state.settings,
        blacklistedTopicIds: state.blacklistedTopicIds,
        banPickerIndex: 0,
        banStage: 'choice',
        phase: 'topic-ban',
      };
    }

    default:
      return state;
  }
}
