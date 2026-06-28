import type { AnswerRecord, JeopardyAction, JeopardySession } from './types';
import { buildBoard, freshLifelines, shuffle } from './utils';

export const initialJeopardyState: JeopardySession = {
  players: [],
  columns: [],
  cells: [],
  phase: 'setup',
  currentPlayerIndex: 0,
  activeCellId: null,
  questionsAnswered: 0,
  history: [],
  revealedChoices: null,
  phoneFriendId: null,
};

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
    case 'START_GAME': {
      const players = preparePlayersForGame(action.players);
      const { columns, cells } = buildBoard();

      return {
        players,
        columns,
        cells,
        phase: 'board',
        currentPlayerIndex: 0,
        activeCellId: null,
        questionsAnswered: 0,
        history: [],
        revealedChoices: null,
        phoneFriendId: null,
      };
    }

    case 'SELECT_CELL': {
      if (state.phase !== 'board') return state;
      const cell = state.cells.find((c) => c.id === action.cellId);
      if (!cell || cell.used) return state;
      // Clear any lifeline state carried over from the previous clue.
      return {
        ...state,
        phase: 'question',
        activeCellId: cell.id,
        revealedChoices: null,
        phoneFriendId: null,
      };
    }

    case 'USE_WHAT_CHOICES': {
      if (state.phase !== 'question' && state.phase !== 'answer') return state;
      if (state.revealedChoices) return state;
      const cell = state.cells.find((c) => c.id === state.activeCellId);
      if (!cell) return state;
      const player = state.players[state.currentPlayerIndex];
      if (!player?.lifelines.whatChoices) return state;

      const players = state.players.map((p) =>
        p.id === player.id
          ? { ...p, lifelines: { ...p.lifelines, whatChoices: false } }
          : p,
      );
      return { ...state, players, revealedChoices: shuffle(cell.choices) };
    }

    case 'USE_PHONE_A_FRIEND': {
      if (state.phase !== 'question' && state.phase !== 'answer') return state;
      if (state.phoneFriendId) return state;
      const player = state.players[state.currentPlayerIndex];
      if (!player?.lifelines.phoneAFriend) return state;
      const helper = state.players.find(
        (p) => p.id === action.helperId && p.id !== player.id,
      );
      if (!helper) return state;

      const players = state.players.map((p) =>
        p.id === player.id
          ? { ...p, lifelines: { ...p.lifelines, phoneAFriend: false } }
          : p,
      );
      return { ...state, players, phoneFriendId: helper.id };
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
      const awarded = action.correct ? points : 0;
      const activePlayer = state.players[state.currentPlayerIndex];

      // Phone a Friend splits a correct clue's points evenly between the active
      // player and the helper they called.
      const helperId = state.phoneFriendId;
      const splitWithHelper = action.correct && helperId !== null;
      const activeShare = splitWithHelper ? Math.round(awarded / 2) : awarded;
      const helperShare = splitWithHelper ? awarded - activeShare : 0;

      const players = state.players.map((p) => {
        if (p.id === activePlayer.id) {
          return {
            ...p,
            score: p.score + activeShare,
            correct: p.correct + (action.correct ? 1 : 0),
            missed: p.missed + (action.correct ? 0 : 1),
            doublesHit: p.doublesHit + (action.correct && cell.isDouble ? 1 : 0),
          };
        }
        if (splitWithHelper && p.id === helperId) {
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
      };

      const questionsAnswered = state.questionsAnswered + 1;
      const isOver = cells.every((c) => c.used);
      const nextPlayerIndex = action.correct
        ? state.currentPlayerIndex
        : (state.currentPlayerIndex + 1) % state.players.length;

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
      };
    }

    case 'PLAY_AGAIN': {
      const players = preparePlayersForGame(state.players);
      const { columns, cells } = buildBoard();
      return {
        ...initialJeopardyState,
        players,
        columns,
        cells,
        phase: 'board',
      };
    }

    default:
      return state;
  }
}
