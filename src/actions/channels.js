import { users } from '../modules/feathers-services';

export const selectChannel = uid => {
  return {
    type: 'SET_SELECTED_CHANNEL',
    uid: uid,
  };
};

export const addChannel = (name, uid, unread = 0, layout = 'timeline') => {
  return {
    type: 'ADD_CHANNEL',
    name: name,
    uid: uid,
    unread: unread,
    layout: layout,
  };
};

export const updateChannel = (uid, key, value, feathers = true) => {
  return {
    type: 'UPDATE_CHANNEL',
    uid: uid,
    key: key,
    value: value,
    feathers: feathers,
  };
};

export const incrementChannelUnread = uid => {
  return {
    type: 'INCREMENT_CHANNEL_UNREAD',
    uid: uid,
  };
};

export const decrementChannelUnread = uid => {
  return {
    type: 'DECREMENT_CHANNEL_UNREAD',
    uid: uid,
  };
};

export const removeChannel = uid => {
  return {
    type: 'REMOVE_CHANNEL',
    uid: uid,
  };
};
