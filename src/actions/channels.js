export const selectChannel = (uid) => {
  return {
    type: 'SET_SELECTED_CHANNEL',
    uid: uid,
  };
}

export const addChannel = (name, uid) => {
  return {
    type: 'ADD_CHANNEL',
    name: name,
    uid: uid,
  };
}

export const removeChannel = (uid) => {
  return {
    type: 'REMOVE_CHANNEL',
    uid: uid,
  };
}