import { Map } from 'immutable';
import { getOption, setOption } from '../modules/micropub-api';

const defaultState = new Map({
  me: getOption('me') || '',
  token: getOption('token') || '',
  micropubEndpoint: getOption('micropubEndpoint') || '',
  mediaEndpoint: getOption('mediaEndpoint') || '',
  tokenEndpoint: getOption('tokenEndpoint') || '',
});

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'SET_USER_OPTION': {
      setOption(payload.key, payload.value);
      return state.set(payload.key, payload.value);
    }
    case 'LOGOUT': {
      return state.map((value, key) => {
        setOption(key, false);
        return '';
      });
    }  
    default: {
      return state;
    }
  }
};