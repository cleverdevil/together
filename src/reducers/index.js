import { combineReducers } from 'redux';

import app from './app';
import posts from './posts';
import channels from './channels';
import user from './user';
import settings from './settings';

const rootReducer = combineReducers({
  app,
  posts,
  channels,
  user,
  settings,
});

export default rootReducer;
