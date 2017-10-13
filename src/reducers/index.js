import { combineReducers } from 'redux';

import app from './app';
import timeline from './timeline';
import postKinds from './post-kinds';
import channels from './channels';

const rootReducer = combineReducers({
  app,
  timeline,
  postKinds,
  channels,
});

export default rootReducer;