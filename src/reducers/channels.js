import { fromJS, Map } from 'immutable';

const defaultState = fromJS([
  // {
  //   name: 'Home',
  //   uid: 'default',
  // },
  // {
  //   name: 'Notifications',
  //   uid: 'notifications',
  // },
]);

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'ADD_CHANNEL': {
      return state.push(
        new Map({
          name: payload.name,
          uid: payload.uid,
        }),
      );
    }
    case 'REMOVE_CHANNEL': {
      const channelIndex = state.findIndex(
        channel => channel.get('uid') === payload.uid,
      );
      if (channelIndex > -1) {
        state = state.splice(channelIndex, 1);
      }
      return state;
    }
    default: {
      return state;
    }
  }
};
