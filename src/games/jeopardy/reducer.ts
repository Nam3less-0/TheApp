import type { AnswerRecord, JeopardyAction, JeopardySession } from './types';
import { buildBoard, computeTotalQuestions } from './utils';

export const initialJeopardyState: JeopardySession = {
  players: [],
  columns: [],
  cells: [],
  phase: 'setup',
  currentPlayerIndex: 0,
  activeCellId: null,
  questionsAnswered: 0,
  totalQuestions: 0,
  history: [],
};

function freshPlayers(players: JeopardySession['players']) {
  return players.map((p) => ({
    ...p,
    score: 0,
    correct: 0,
    missed: 0,
    doublesHit: 0,
  }));
}

export function jeopardyReducer(
  state: JeopardySession,
  action: JeopardyAction,
): JeopardySession {
  switch (action.type) {
    case 'START_GAME': {
      const players = freshPlayers(action.players);
      const { columns, cells } = buildBoard();

      return {
        players,
        columns,
        cells,
        phase: 'board',
        currentPlayerIndex: 0,
        activeCellId: null,
        questionsAnswered: 0,
        totalQuestions: computeTotalQuestions(players.length),
        history: [],
      };
    }

    case 'SELECT_CELL': {
      if (state.phase !== 'board') return state;
      const cell = state.cells.find((c) => c.id === action.cellId);
      if (!cell || cell.used) return state;
      return { ...state, phase: 'question', activeCellId: cell.id };
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

      const players = state.players.map((p) => {
        if (p.id !== activePlayer.id) return p;
        return {
          ...p,
          score: p.score + awarded,
          correct: p.correct + (action.correct ? 1 : 0),
          missed: p.missed + (action.correct ? 0 : 1),
          doublesHit: p.doublesHit + (action.correct && cell.isDouble ? 1 : 0),
        };
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
        awarded,
      };

      const questionsAnswered = state.questionsAnswered + 1;
      const allUsed = cells.every((c) => c.used);
      const reachedLimit = questionsAnswered >= state.totalQuestions;
      const isOver = allUsed || reachedLimit;

      return {
        ...state,
        players,
        cells,
        questionsAnswered,
        activeCellId: null,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
        phase: isOver ? 'final' : 'board',
        history: [...state.history, record],
      };
    }

    case 'PLAY_AGAIN': {
      const players = freshPlayers(state.players);
      const { columns, cells } = buildBoard();
      return {
        ...initialJeopardyState,
        players,
        columns,
        cells,
        phase: 'board',
        totalQuestions: computeTotalQuestions(players.length),
      };
    }

    default:
      return state;
  }
}
