export const selectChannel = uid => ({
  type: 'SET_SELECTED_CHANNEL',
  uid: uid,
})

export const addChannel = (name, uid, unread = 0, layout = 'timeline') => ({
  type: 'ADD_CHANNEL',
  name: name,
  uid: uid,
  unread: unread,
  layout: layout,
})

export const updateChannel = (uid, key, value, feathers = true) => ({
  type: 'UPDATE_CHANNEL',
  uid: uid,
  key: key,
  value: value,
  feathers: feathers,
})

export const incrementChannelUnread = uid => ({
  type: 'INCREMENT_CHANNEL_UNREAD',
  uid: uid,
})

export const decrementChannelUnread = uid => ({
  type: 'DECREMENT_CHANNEL_UNREAD',
  uid: uid,
})

export const removeChannel = uid => ({
  type: 'REMOVE_CHANNEL',
  uid: uid,
})

export const reorderChannels = (source, destination) => ({
  type: 'REORDER_CHANNELS',
  source: source,
  destination: destination,
})
