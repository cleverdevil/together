import { combineReducers } from 'redux';

import timeline from './timeline';
import postKinds from './post-kinds';

const rootReducer = combineReducers({
  timeline,
  postKinds,
});

export default rootReducer;