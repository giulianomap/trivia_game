import { combineReducers } from 'redux';
import fetchApis from './fetchApis';
import dataPlayerReducer from './dataPlayer';
import answeredReducer from './answeredReducer';
import timeReducer from './timeReducer';

const rootReducer = combineReducers({
  fetchApis,
  dataPlayerReducer,
  answeredReducer,
  timeReducer,
});

export default rootReducer;
