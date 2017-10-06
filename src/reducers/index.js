import { combineReducers } from 'redux';

import timeline from './timeline';

const rootReducer = combineReducers({
    timeline,
});

export default rootReducer;