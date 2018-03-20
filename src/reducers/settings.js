import { Map } from 'immutable';
import { users } from '../modules/feathers-services';

let initialState = new Map({});

export default (state = initialState, payload) => {
  switch (payload.type) {
    case 'SET_SETTING': {
      const userId = state.get('userId');
      if (userId && payload.feathers) {
        users
          .update(userId, {
            $set: {
              [`settings.${payload.key}`]: payload.value,
            },
          })
          .then(res => () => {
            /* All good */
          })
          .catch(err => console.log(err));
      }
      return state.set(payload.key, payload.value);
    }
    case 'UPDATE_CHANNEL': {
      const microsubProperties = ['uid', 'name', 'unread'];
      if (microsubProperties.indexOf(payload.key) === -1) {
        const userId = state.get('userId');
        if (userId && payload.feathers) {
          users
            .update(userId, {
              $set: {
                [`settings.channels.${payload.uid}.${
                  payload.key
                }`]: payload.value,
              },
            })
            .then(res => () => {
              /* All good */
            })
            .catch(err => console.log(err));
        }
        let channels = Object.assign({}, state.get('channels') || {});
        if (!channels[payload.uid]) {
          channels[payload.uid] = {};
        }
        channels[payload.uid][payload.key] = payload.value;
        return state.set('channels', channels);
      } else {
        return state;
      }
    }
    case 'LOGOUT': {
      return initialState;
    }
    default: {
      return state;
    }
  }
};
