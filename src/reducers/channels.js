import { List, Map } from 'immutable';

const defaultState = new List();

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'ADD_CHANNEL': {
      const channel = new Map({
        name: payload.name,
        uid: payload.uid,
        slug: encodeURIComponent(payload.uid),
        unread: payload.unread,
        layout: payload.layout,
      });
      const existingIndex = state.findIndex(
        channel => channel.get('uid') == payload.uid,
      );
      if (existingIndex > -1) {
        // Need to update
        return state.set(existingIndex, channel);
      } else {
        return state.push(channel);
      }
    }
    case 'UPDATE_CHANNEL': {
      const microsubProperties = ['uid', 'name', 'unread'];
      if (microsubProperties.indexOf(payload.key) > -1) {
        return state.update(
          state.findIndex(channel => channel.get('uid') === payload.uid),
          channel => channel.set(payload.key, payload.value),
        );
      } else {
        return state;
      }
    }
    case 'REORDER_CHANNELS': {
      const movedChannel = state.get(payload.source);
      return state
        .delete(payload.source)
        .insert(payload.destination, movedChannel);
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
    case 'LOGOUT': {
      return defaultState;
    }
    default: {
      return state;
    }
  }
};
