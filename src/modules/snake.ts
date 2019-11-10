import {
  createStandardAction,
  ActionType,
  createReducer
} from 'typesafe-actions';


const MOVE_LEFT= 'snake/MOVE_LEFT';
const MOVE_RIGHT= 'snake/MOVE_RIGHT';
const MOVE_UP= 'snake/MOVE_UP';
const MOVE_DOWN= 'snake/MOVE_DOWN';
const START_GAME= 'snake/START_GAME';
const STOP_GAME= 'snake/STOP_GAME';

export const moveLeft = createStandardAction(MOVE_LEFT)();
export const moveRight = createStandardAction(MOVE_RIGHT)();
export const moveUp = createStandardAction(MOVE_UP)();
export const moveDown = createStandardAction(MOVE_DOWN)();
export const startGame = createStandardAction(START_GAME)();
export const stopGame = createStandardAction(STOP_GAME)();

const actions = { moveLeft, moveRight, moveUp, moveDown, startGame, stopGame };
export type SnakeAction = ActionType<typeof actions>;

type Snake2DPosition = {
  x: number,
  y: number
}


export type SnakeState = {
  direction: Snake2DPosition,
  position: Snake2DPosition,
  speed: number,
  inGame: boolean
}

const initialState: SnakeState = {
  direction: {
    x: 0,
    y: 0
  },
  position: {
    x: 0,
    y: 0
  },
  speed: 1,
  inGame: false
}

const snake = createReducer<SnakeState, SnakeAction>(initialState)
  .handleAction(MOVE_LEFT, state => ({...state, direction: { x: -1, y: 0 }}))
  .handleAction(MOVE_RIGHT, state => ({...state, direction: { x: 1, y: 0 }}))
  .handleAction(MOVE_UP, state => ({...state, direction: { x: 0, y: -1 }}))
  .handleAction(MOVE_DOWN, state => ({...state, direction: { x: 0, y: 1 }}))
  .handleAction(START_GAME, state => ({...state, inGame: true}))
  .handleAction(STOP_GAME, state => ({...state, inGame: false}))

export default snake;
