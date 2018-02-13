import { Map, List } from 'immutable';

const defaultState = new List([]);

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'ADD_TO_TIMELINE': {
      return state.push(new Map(payload.post));
    }
    case 'SET_SELECTED_CHANNEL': {
      return state.clear();
    }
    default: {
      return state;
    }
  }
};
