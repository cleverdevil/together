import { fromJS, Map, List } from 'immutable';
import sampleData from '../sampledata';

// const defaultState = new List([]);
const defaultState = fromJS(sampleData);

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'ADD_TO_TIMELINE': {
      return state.push(new Map(payload.post));
    }
    default: {
      return state;
    }
  }
};