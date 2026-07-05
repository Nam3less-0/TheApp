/**
 * Question repository for the Jeopardy game.
 *
 * Topics live in ./jeopardy/topics/ — each has 20 questions per difficulty
 * level (1–5), each with 3 lifeline choices. At setup the game picks 6 topics, then draws one random question
 * from each difficulty of each topic to fill the 6×5 board.
 *
 * Difficulty maps to point value: 1 → 200 … 5 → 1000.
 */

export { JEOPARDY_TOPICS } from './jeopardy/index';
export type { Difficulty, RawQuestion, TopicData } from './jeopardy/index';
