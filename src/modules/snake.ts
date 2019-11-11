import {
  createStandardAction,
  ActionType,
  createReducer
} from 'typesafe-actions';


const TURN_LEFT= 'snake/TURN_LEFT';
const TURN_RIGHT= 'snake/TURN_RIGHT';
const TURN_UP= 'snake/TURN_UP';
const TURN_DOWN= 'snake/TURN_DOWN';
const START_GAME= 'snake/START_GAME';
const STOP_GAME= 'snake/STOP_GAME';
const MOVE_SNAKE = 'snake/MOVE_SNAKE';

export const turnLeft = createStandardAction(TURN_LEFT)();
export const turnRight = createStandardAction(TURN_RIGHT)();
export const turnUp = createStandardAction(TURN_UP)();
export const turnDown = createStandardAction(TURN_DOWN)();
export const startGame = createStandardAction(START_GAME)();
export const stopGame = createStandardAction(STOP_GAME)();
export const moveSnake = createStandardAction(MOVE_SNAKE)<Snake2DPosition>();

const actions = { turnLeft, turnRight, turnUp, turnDown, startGame, stopGame, moveSnake };
export type SnakeAction = ActionType<typeof actions>;

type Snake2DPosition = {
  x: number,
  y: number
}


export type SnakeState = {
  direction: Snake2DPosition,
  position: Snake2DPosition,
  speed: number,
  inGame: boolean,
  size: number
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
  inGame: false,
  size: 10,
}

const snake = createReducer<SnakeState, SnakeAction>(initialState)
  .handleAction(TURN_LEFT, state => ({...state, direction: { x: -1, y: 0 }}))
  .handleAction(TURN_RIGHT, state => ({...state, direction: { x: 1, y: 0 }}))
  .handleAction(TURN_UP, state => ({...state, direction: { x: 0, y: -1 }}))
  .handleAction(TURN_DOWN, state => ({...state, direction: { x: 0, y: 1 }}))
  .handleAction(START_GAME, state => ({...state, inGame: true}))
  .handleAction(STOP_GAME, state => (initialState))
  .handleAction(MOVE_SNAKE, (state, action) => ({...state, position: action.payload }))

export default snake;
