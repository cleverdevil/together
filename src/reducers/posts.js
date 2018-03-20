import { Map, List } from 'immutable';

const defaultState = new List([]);

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'ADD_POST': {
      return state.push(new Map(payload.post));
    }
    case 'ADD_POSTS': {
      payload.posts.forEach(post => (state = state.push(new Map(post))));
      return state;
    }
    case 'UPDATE_POST': {
      return state.update(
        state.findIndex(post => post.get('_id') === payload.id),
        post => post.set(payload.key, payload.value),
      );
    }
    case 'SET_SELECTED_CHANNEL': {
      return state.clear();
    }
    case 'LOGOUT': {
      return defaultState;
    }
    default: {
      return state;
    }
  }
};
