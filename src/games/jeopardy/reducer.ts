import type {
  AnswerRecord,
  FinalWager,
  GameSettings,
  JeopardyAction,
  JeopardySession,
} from './types';
import {
  boardShapeFor,
  commitBoardDraw,
  commitRerolledQuestion,
  defaultSettings,
  draftBoardFromTopics,
  drawFinalClue,
  freshLifelines,
  getAllTopicSummaries,
  getThemeBundle,
  isCellBlockedThisTurn,
  isPreviouslySeenQuestion,
  isWhatChoicesAllowed,
  loadRecentQuestionKeys,
  makeQuestionKey,
  maxDailyDoubleWager,
  maxFinalWager,
  pickPreviewTopics,
  rerollCellQuestion,
  rerollUnlockedPreviewTopics,
  shuffle,
  BOARD_COLUMNS,
  SNIPE_CORRECT_POINTS,
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
  const shape = boardShapeFor(settings);
  const preview = pickPreviewTopics(
    blacklistedTopicIds,
    previewSessionTopicIds,
    [],
    allowed,
  );
  const board = draftBoardFromTopics(
    preview.columns.map((column) => column.id),
    shape.difficulties,
    shape.doubleCount,
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

function freshPlayers(players: JeopardySession['players']) {
  return players.map((p) => ({
    ...p,
    score: 0,
    correct: 0,
    missed: 0,
    doublesHit: 0,
    lifelines: freshLifelines(),
  }));
}

/** Reset stats and randomize turn order before each new game. */
function preparePlayersForGame(players: JeopardySession['players']) {
  const reset = freshPlayers(players);
  return reset.length > 1 ? shuffle(reset) : reset;
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
    case 'PLAYERS_READY': {
      return {
        ...state,
        ...beginTopicPreview(action.players, action.settings),
      };
    }

    case 'BACK_TO_SETUP': {
      return {
        ...state,
        phase: 'setup',
        previewColumns: [],
        previewCells: [],
        blacklistedTopicIds: [],
        lockedPreviewSlots: emptyLockedSlots(),
        previewSessionTopicIds: [],
      };
    }

    case 'REROLL_TOPICS': {
      if (state.phase !== 'topic-preview') return state;
      const shape = boardShapeFor(state.settings);
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
      const board = draftBoardFromTopics(
        preview.columns.map((column) => column.id),
        shape.difficulties,
        shape.doubleCount,
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
      const shape = boardShapeFor(state.settings);
      const board = draftBoardFromTopics(
        state.previewColumns.map((column) => column.id),
        shape.difficulties,
        shape.doubleCount,
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
      const summary = getAllTopicSummaries().find((topic) => topic.id === topicId);
      if (!summary) return state;

      const shape = boardShapeFor(state.settings);
      const nextColumns = state.previewColumns.map((column, index) =>
        index === slotIndex ? { id: summary.id, name: summary.name } : column,
      );
      const board = draftBoardFromTopics(
        nextColumns.map((column) => column.id),
        shape.difficulties,
        shape.doubleCount,
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

      const shape = boardShapeFor(state.settings);
      const blacklistedTopicIds = [...state.blacklistedTopicIds, action.topicId];
      const preview = pickPreviewTopics(
        blacklistedTopicIds,
        state.previewSessionTopicIds,
        [],
        themeAllowedIds(state.settings),
      );
      const board = draftBoardFromTopics(
        preview.columns.map((column) => column.id),
        shape.difficulties,
        shape.doubleCount,
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

      const players = preparePlayersForGame(state.pendingPlayers);
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
        blacklistedTopicIds: [],
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
      };
    }

    case 'SELECT_CELL': {
      if (state.phase !== 'board') return state;
      const cell = state.cells.find((c) => c.id === action.cellId);
      if (!cell || cell.used) return state;
      if (isCellBlockedThisTurn(cell.value, state.turnPickedValues)) return state;

      const turnPickedValues = (TURN_LIMITED_VALUES as readonly number[]).includes(
        cell.value,
      )
        ? [...state.turnPickedValues, cell.value]
        : state.turnPickedValues;

      // A Daily Double with wagering enabled pauses for a bet before the clue.
      const goesToWager = state.settings.dailyDoubleWager && cell.isDouble;

      // Clear any lifeline state carried over from the previous clue.
      return {
        ...state,
        phase: goesToWager ? 'wager' : 'question',
        activeCellId: cell.id,
        revealedChoices: null,
        phoneFriendId: null,
        sniped: false,
        snipedFromPlayerIndex: null,
        turnPickedValues,
        activeWager: null,
        undoSnapshot: null,
        activeCellRerollKeys: [],
      };
    }

    case 'REROLL_QUESTION': {
      if (state.phase !== 'question' || !state.activeCellId) return state;
      const cell = state.cells.find((c) => c.id === state.activeCellId);
      if (!cell) return state;
      if (
        !isPreviouslySeenQuestion(
          state.columns,
          cell,
          state.priorRecentQuestionKeys,
          state.history,
        )
      ) {
        return state;
      }

      const topicId = state.columns[cell.columnIndex]?.id;
      if (!topicId) return state;
      const currentKey = makeQuestionKey(topicId, cell.difficulty, cell.question);
      const result = rerollCellQuestion(state.columns, state.cells, cell.id, [
        ...state.activeCellRerollKeys,
        currentKey,
      ]);
      if (!result) return state;

      commitRerolledQuestion(state.columns, result.cell, result.pickedKey);

      return {
        ...state,
        cells: state.cells.map((c) => (c.id === cell.id ? result.cell : c)),
        activeCellRerollKeys: [...state.activeCellRerollKeys, currentKey],
        revealedChoices: null,
        phoneFriendId: null,
        sniped: false,
        snipedFromPlayerIndex: null,
      };
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
      const topicId = state.columns[cell.columnIndex]?.id;
      if (!isWhatChoicesAllowed(topicId)) return state;
      const player = state.players[state.currentPlayerIndex];
      if (!player || player.lifelines.whatChoices <= 0) return state;

      const players = state.players.map((p) =>
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
      return { ...state, players, revealedChoices: shuffle(cell.choices) };
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

      const players = state.players.map((p) =>
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
      return { ...state, players, phoneFriendId: helper.id };
    }

    case 'USE_SNIPE': {
      if (state.phase !== 'question') return state;
      if (state.revealedChoices || state.phoneFriendId || state.sniped) return state;
      // Snipe is disabled on wagered Daily Doubles.
      if (state.activeWager !== null) return state;

      const activePlayer = state.players[state.currentPlayerIndex];
      const sniper = state.players.find((p) => p.id === action.playerId);
      if (!activePlayer || !sniper || sniper.id === activePlayer.id) return state;
      if (!sniper.lifelines.snipe) return state;

      const sniperIndex = state.players.findIndex((p) => p.id === sniper.id);
      if (sniperIndex < 0) return state;

      const players = state.players.map((p) =>
        p.id === sniper.id
          ? { ...p, lifelines: { ...p.lifelines, snipe: false } }
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
      return { ...state, phase: 'answer' };
    }

    case 'RESOLVE': {
      if (state.phase !== 'answer' || !state.activeCellId) return state;
      const cell = state.cells.find((c) => c.id === state.activeCellId);
      if (!cell) return state;

      const wager = state.activeWager;
      const points = cell.value * (cell.isDouble ? 2 : 1);
      const activePlayer = state.players[state.currentPlayerIndex];

      let activeShare: number;
      let helperShare = 0;
      const helperId = state.phoneFriendId;

      if (state.sniped) {
        activeShare = action.correct
          ? SNIPE_CORRECT_POINTS
          : -Math.round(points / 2);
      } else if (wager !== null) {
        // Daily Double wager: solo bet, always swings by the wagered amount.
        activeShare = action.correct ? wager : -wager;
      } else if (action.correct) {
        const splitWithHelper = helperId !== null;
        activeShare = splitWithHelper ? Math.round(points / 2) : points;
        helperShare = splitWithHelper ? points - activeShare : 0;
      } else {
        activeShare = state.settings.wrongAnswerPenalty ? -points : 0;
      }

      const players = state.players.map((p) => {
        if (p.id === activePlayer.id) {
          return {
            ...p,
            score: p.score + activeShare,
            correct: p.correct + (action.correct ? 1 : 0),
            missed: p.missed + (action.correct ? 0 : 1),
            doublesHit:
              p.doublesHit +
              (action.correct && !state.sniped && cell.isDouble ? 1 : 0),
          };
        }
        if (!state.sniped && helperShare > 0 && p.id === helperId) {
          return { ...p, score: p.score + helperShare };
        }
        return p;
      });

      const cells = state.cells.map((c) =>
        c.id === cell.id ? { ...c, used: true } : c,
      );

      const record: AnswerRecord = {
        cellId: cell.id,
        topicName: state.columns[cell.columnIndex]?.name ?? '',
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
      const nextPlayerIndex =
        state.sniped && state.snipedFromPlayerIndex !== null
          ? state.snipedFromPlayerIndex
          : action.correct || wager !== null
            ? state.currentPlayerIndex
            : (state.currentPlayerIndex + 1) % state.players.length;
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
        p.id === entry.playerId ? { ...p, score: p.score + delta } : p,
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
      };
    }

    case 'ABANDON_GAME': {
      // Drop the game and return to setup, keeping players and house rules.
      return {
        ...initialJeopardyState,
        settings: state.settings,
        pendingPlayers:
          state.players.length > 0
            ? freshPlayers(state.players)
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
      const pendingPlayers = freshPlayers(state.players);
      return {
        ...initialJeopardyState,
        ...beginTopicPreview(pendingPlayers, state.settings),
      };
    }

    default:
      return state;
  }
}
