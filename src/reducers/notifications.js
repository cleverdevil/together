import { Map, List } from 'immutable';

const defaultState = new List([]);

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'ADD_MICROSUB_NOTIFICATION': {
      return state.push(new Map(payload.post));
    }
    case 'ADD_MICROSUB_NOTIFICATIONS': {
      payload.posts.forEach(post => (state = state.push(new Map(post))));
      return state;
    }
    case 'REPLACE_MICROSUB_NOTIFICATIONS': {
      state = defaultState;
      payload.posts.forEach(post => (state = state.push(new Map(post))));
      return state;
    }
    case 'UPDATE_POST': {
      const index = state.findIndex(post => post.get('_id') === payload.id);
      if (index > -1) {
        return state.update(index, post =>
          post.set(payload.key, payload.value),
        );
      }
    }
    case 'LOGOUT': {
      return defaultState;
    }
    default: {
      return state;
    }
  }
};
