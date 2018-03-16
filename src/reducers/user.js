import { Map } from 'immutable';

const defaultState = new Map({
  me: '',
  token: '',
  micropubEndpoint: '',
  microsubEndpoint: '',
  mediaEndpoint: '',
  tokenEndpoint: '',
});

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'SET_USER_OPTION': {
      return state.set(payload.key, payload.value);
    }
    case 'LOGOUT': {
      // Logout from feathers too
      return state.map((value, key) => {
        return '';
      });
    }
    default: {
      return state;
    }
  }
};
