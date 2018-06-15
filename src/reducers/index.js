import { combineReducers } from 'redux';

import app from './app';
import notifications from './notifications';
import posts from './posts';
import channels from './channels';
import user from './user';
import settings from './settings';

const rootReducer = combineReducers({
  app,
  notifications,
  posts,
  channels,
  user,
  settings,
});

export default rootReducer;
