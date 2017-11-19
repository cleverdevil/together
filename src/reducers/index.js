import { combineReducers } from 'redux';

import app from './app';
import timeline from './timeline';
import postKinds from './post-kinds';
import channels from './channels';
import user from './user';
import settings from './settings';

const rootReducer = combineReducers({
  app,
  timeline,
  postKinds,
  channels,
  user,
  settings,
});

export default rootReducer;