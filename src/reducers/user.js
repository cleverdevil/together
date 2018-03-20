import { Map } from 'immutable';
import { users, client } from '../modules/feathers-services';

const defaultState = new Map({
  me: '',
});

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'SET_USER_OPTION': {
      const userId = state.get('_id');
      if (userId && payload.feathers) {
        users
          .update(userId, {
            $set: {
              [`${payload.key}`]: payload.value,
            },
          })
          .then(res => () => {
            /* All good */
          })
          .catch(err => console.log(err));
      }
      return state.set(payload.key, payload.value);
    }
    case 'LOGOUT': {
      client.logout();
      return defaultState;
    }
    default: {
      return state;
    }
  }
};
