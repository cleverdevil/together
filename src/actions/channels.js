export const selectChannel = uid => {
  return {
    type: 'SET_SELECTED_CHANNEL',
    uid: uid,
  };
};

export const addChannel = (name, uid, unread = 0) => {
  return {
    type: 'ADD_CHANNEL',
    name: name,
    uid: uid,
    unread: unread,
  };
};

export const setChannelUnread = (uid, unread) => {
  return {
    type: 'SET_CHANNEL_UNREAD',
    uid: uid,
    unread: unread,
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
