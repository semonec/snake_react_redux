import { combineReducers } from 'redux';
import snake from './snake';

const rootReducer = combineReducers({
  snake,
});

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>;