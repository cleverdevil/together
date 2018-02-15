import { List, Map } from 'immutable';

const defaultState = new List();

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'ADD_CHANNEL': {
      return state.push(
        new Map({
          name: payload.name,
          uid: payload.uid,
          unread: payload.unread,
          layout: payload.layout,
        }),
      );
    }
    case 'UPDATE_CHANNEL': {
      return state.update(
        state.findIndex(channel => channel.get('uid') === payload.uid),
        channel => channel.set(payload.key, payload.value),
      );
    }
    case 'REMOVE_CHANNEL': {
      return state.remove(
        state.findIndex(channel => channel.get('uid') === payload.uid),
      );
    }
    case 'DECREMENT_CHANNEL_UNREAD': {
      return state.update(
        state.findIndex(channel => channel.get('uid') === payload.uid),
        channel =>
          channel.update('unread', unread => (unread ? unread - 1 : 0)),
      );
    }
    case 'INCREMENT_CHANNEL_UNREAD': {
      return state.update(
        state.findIndex(channel => channel.get('uid') === payload.uid),
        channel => channel.update('unread', unread => unread + 1),
      );
    }
    default: {
      return state;
    }
  }
};
