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
          unread: payload.unread,
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
    case 'SET_CHANNEL_UNREAD': {
      const channelIndex = state.findIndex(
        channel => channel.get('uid') === payload.uid,
      );
      if (channelIndex > -1) {
        const newChannel = state
          .get(channelIndex)
          .set('unread', payload.unread);
        state = state.set(channelIndex, newChannel);
      }
      return state;
    }
    case 'DECREMENT_CHANNEL_UNREAD': {
      const channelIndex = state.findIndex(
        channel => channel.get('uid') === payload.uid,
      );
      if (channelIndex > -1) {
        const newChannel = state.get(channelIndex).update('unread', unread => {
          return unread - 1;
        });
        state = state.set(channelIndex, newChannel);
      }
      return state;
    }
    case 'INCREMENT_CHANNEL_UNREAD': {
      const channelIndex = state.findIndex(
        channel => channel.get('uid') === payload.uid,
      );
      if (channelIndex > -1) {
        const newChannel = state
          .get(channelIndex)
          .update('unread', unread => unread + 1);
        state = state.set(channelIndex, newChannel);
      }
      return state;
    }
    default: {
      return state;
    }
  }
};
