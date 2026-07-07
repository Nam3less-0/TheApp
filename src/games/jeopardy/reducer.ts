import type { AnswerRecord, JeopardyAction, JeopardySession } from './types';
import {
  commitBoardDraw,
  draftBoardFromTopics,
  freshLifelines,
  isCellBlockedThisTurn,
  isWhatChoicesAllowed,
  pickPreviewTopics,
  shuffle,
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
};

function beginTopicPreview(
  players: JeopardySession['players'],
  blacklistedTopicIds: string[] = [],
  previewSessionTopicIds: string[] = [],
): Pick<
  JeopardySession,
  | 'pendingPlayers'
  | 'previewColumns'
  | 'previewCells'
  | 'blacklistedTopicIds'
  | 'previewSessionTopicIds'
  | 'phase'
> {
  const preview = pickPreviewTopics(blacklistedTopicIds, previewSessionTopicIds);
  const board = draftBoardFromTopics(preview.columns.map((column) => column.id));
  return {
    pendingPlayers: players,
    previewColumns: board.columns,
    previewCells: board.cells,
    blacklistedTopicIds,
    previewSessionTopicIds: preview.sessionTopicIds,
    phase: 'topic-preview',
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

export function jeopardyReducer(
  state: JeopardySession,
  action: JeopardyAction,
): JeopardySession {
  switch (action.type) {
    case 'PLAYERS_READY': {
      return {
        ...state,
        ...beginTopicPreview(action.players),
      };
    }

    case 'BACK_TO_SETUP': {
      return {
        ...state,
        phase: 'setup',
        previewColumns: [],
        previewCells: [],
        blacklistedTopicIds: [],
        previewSessionTopicIds: [],
      };
    }

    case 'REROLL_TOPICS': {
      if (state.phase !== 'topic-preview') return state;
      const preview = pickPreviewTopics(
        state.blacklistedTopicIds,
        state.previewSessionTopicIds,
        state.previewColumns.map((column) => column.id),
      );
      const board = draftBoardFromTopics(preview.columns.map((column) => column.id));
      return {
        ...state,
        previewColumns: board.columns,
        previewCells: board.cells,
        previewSessionTopicIds: preview.sessionTopicIds,
      };
    }

    case 'RESHUFFLE_PREVIEW_QUESTIONS': {
      if (state.phase !== 'topic-preview' || state.previewColumns.length === 0) {
        return state;
      }
      const board = draftBoardFromTopics(
        state.previewColumns.map((column) => column.id),
      );
      return {
        ...state,
        previewColumns: board.columns,
        previewCells: board.cells,
      };
    }

    case 'BLACKLIST_TOPIC': {
      if (state.phase !== 'topic-preview') return state;
      if (state.blacklistedTopicIds.includes(action.topicId)) return state;

      const blacklistedTopicIds = [...state.blacklistedTopicIds, action.topicId];
      const preview = pickPreviewTopics(
        blacklistedTopicIds,
        state.previewSessionTopicIds,
      );
      const board = draftBoardFromTopics(preview.columns.map((column) => column.id));
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

      // Clear any lifeline state carried over from the previous clue.
      return {
        ...state,
        phase: 'question',
        activeCellId: cell.id,
        revealedChoices: null,
        phoneFriendId: null,
        sniped: false,
        snipedFromPlayerIndex: null,
        turnPickedValues,
      };
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

      const points = cell.value * (cell.isDouble ? 2 : 1);
      const activePlayer = state.players[state.currentPlayerIndex];

      let activeShare: number;
      let helperShare = 0;
      const helperId = state.phoneFriendId;

      if (state.sniped) {
        activeShare = action.correct
          ? SNIPE_CORRECT_POINTS
          : -Math.round(points / 2);
      } else {
        const awarded = action.correct ? points : 0;
        // Phone a Friend splits a correct clue's points evenly between the active
        // player and the helper they called.
        const splitWithHelper = action.correct && helperId !== null;
        activeShare = splitWithHelper ? Math.round(awarded / 2) : awarded;
        helperShare = splitWithHelper ? awarded - activeShare : 0;
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
      };

      const questionsAnswered = state.questionsAnswered + 1;
      const isOver = cells.every((c) => c.used);
      const nextPlayerIndex =
        state.sniped && state.snipedFromPlayerIndex !== null
          ? state.snipedFromPlayerIndex
          : action.correct
            ? state.currentPlayerIndex
            : (state.currentPlayerIndex + 1) % state.players.length;
      const turnChanged = nextPlayerIndex !== state.currentPlayerIndex;

      return {
        ...state,
        players,
        cells,
        questionsAnswered,
        activeCellId: null,
        currentPlayerIndex: nextPlayerIndex,
        phase: isOver ? 'final' : 'board',
        history: [...state.history, record],
        revealedChoices: null,
        phoneFriendId: null,
        sniped: false,
        snipedFromPlayerIndex: null,
        turnPickedValues: turnChanged ? [] : state.turnPickedValues,
      };
    }

    case 'PLAY_AGAIN': {
      const pendingPlayers = state.players.map((player) => ({
        ...player,
        score: 0,
        correct: 0,
        missed: 0,
        doublesHit: 0,
        lifelines: freshLifelines(),
      }));
      return {
        ...initialJeopardyState,
        ...beginTopicPreview(pendingPlayers),
      };
    }

    default:
      return state;
  }
}
