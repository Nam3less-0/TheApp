export type QuestionType = 'players' | 'items';

export type LocalPhase =
  | 'setup'
  | 'lobby'
  | 'compose'
  | 'ranker-rank'
  | 'guessing'
  | 'guess-submitted'
  | 'score-self';

export interface RankOption {
  id: string;
  label: string;
}

export interface RoundDraft {
  type: QuestionType;
  prompt: string;
  options: RankOption[];
}

export type LocalAction =
  | { type: 'SET_SYNC_ERROR'; message: string | null }
  | { type: 'SET_CONNECTING'; value: boolean }
  | { type: 'ENTER_LOBBY'; playerId: string; playerName: string; roomCode: string; score?: number }
  | { type: 'BEGIN_COMPOSE' }
  | { type: 'ENTER_RANKER_RANK'; draft: RoundDraft }
  | { type: 'ENTER_GUESSING' }
  | { type: 'SUBMIT_GUESS'; guessOrder: string[] }
  | { type: 'ENTER_SCORE_SELF' }
  | { type: 'ADD_SCORE'; points: 0 | 1 | 3 }
  | { type: 'RETURN_TO_LOBBY' }
  | { type: 'RESET' };

export interface LocalState {
  localPhase: LocalPhase;
  playerId: string;
  playerName: string;
  roomCode: string | null;
  score: number;
  roundDraft: RoundDraft | null;
  lastGuessOrder: string[];
  syncError: string | null;
  isConnecting: boolean;
}

export const initialLocalState: LocalState = {
  localPhase: 'setup',
  playerId: '',
  playerName: '',
  roomCode: null,
  score: 0,
  roundDraft: null,
  lastGuessOrder: [],
  syncError: null,
  isConnecting: false,
};

export function localReducer(state: LocalState, action: LocalAction): LocalState {
  switch (action.type) {
    case 'SET_SYNC_ERROR':
      return { ...state, syncError: action.message, isConnecting: false };
    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.value, syncError: action.value ? null : state.syncError };
    case 'ENTER_LOBBY':
      return {
        ...state,
        localPhase: 'lobby',
        playerId: action.playerId,
        playerName: action.playerName,
        roomCode: action.roomCode,
        score: action.score ?? 0,
        roundDraft: null,
        lastGuessOrder: [],
        syncError: null,
        isConnecting: false,
      };
    case 'BEGIN_COMPOSE':
      return { ...state, localPhase: 'compose', roundDraft: null };
    case 'ENTER_RANKER_RANK':
      return { ...state, localPhase: 'ranker-rank', roundDraft: action.draft };
    case 'ENTER_GUESSING':
      return { ...state, localPhase: 'guessing' };
    case 'SUBMIT_GUESS':
      return {
        ...state,
        localPhase: 'guess-submitted',
        lastGuessOrder: action.guessOrder,
      };
    case 'ENTER_SCORE_SELF':
      return {
        ...state,
        localPhase: 'score-self',
      };
    case 'ADD_SCORE':
      return {
        ...state,
        localPhase: 'lobby',
        score: state.score + action.points,
        lastGuessOrder: [],
      };
    case 'RETURN_TO_LOBBY':
      return {
        ...state,
        localPhase: 'lobby',
        roundDraft: null,
        lastGuessOrder: [],
      };
    case 'RESET':
      return { ...initialLocalState };
    default:
      return state;
  }
}
