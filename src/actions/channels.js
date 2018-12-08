import { addNotification } from './app'
import { channels as channelsService } from '../modules/feathers-services'

export const addChannel = (name, uid, unread = 0, layout = 'timeline') => ({
  type: 'ADD_CHANNEL',
  name: name,
  uid: uid,
  unread: unread,
  layout: layout,
})

export const createChannel = name => async dispatch => {
  try {
    const newChannel = await channelsService.create({ name })
    dispatch(addChannel(newChannel.name, newChannel.uid))
  } catch (err) {
    console.log('Error creating channel', err)
    dispatch(addNotification('Error creating channel', 'error'))
  }
}

export const getChannels = () => async dispatch => {
  try {
    const channels = await channelsService.find({})
    for (const channel of channels) {
      dispatch(addChannel(channel.name, channel.uid, channel.unread))
    }
  } catch (err) {
    console.log('Error getting channels', err)
    dispatch(addNotification('Error getting channels', 'error'))
  }
}

export const selectChannel = uid => ({
  type: 'SET_SELECTED_CHANNEL',
  uid: uid,
})

export const updateChannel = (
  uid,
  key,
  value,
  feathers = true
) => async dispatch => {
  try {
    if (key === 'name') {
      const res = await channelsService.update(uid, {
        name: value,
      })
      if (res.error) {
        throw res.error
      }
    }
    return {
      type: 'UPDATE_CHANNEL',
      uid: uid,
      key: key,
      value: value,
      feathers: feathers,
    }
  } catch (err) {
    console.log('Error updating channel', err)
    dispatch(addNotification('Error updating channel', 'error'))
  }
}

export const incrementChannelUnread = uid => ({
  type: 'INCREMENT_CHANNEL_UNREAD',
  uid: uid,
})

export const decrementChannelUnread = uid => ({
  type: 'DECREMENT_CHANNEL_UNREAD',
  uid: uid,
})

export const removeChannel = uid => async dispatch => {
  try {
    const res = channelsService.remove(uid)
    if (res.error) {
      throw res.error
    }
    return {
      type: 'REMOVE_CHANNEL',
      uid: uid,
    }
  } catch (err) {
    console.log('Error removing channel', err)
    dispatch(addNotification('Error removing channel', 'error'))
  }
}

export const reorderChannels = uids => async dispatch => {
  dispatch({ uids, type: 'REORDER_CHANNELS' })
  try {
    await channelsService.patch(null, { order: uids })
    dispatch(addNotification('Channel order saved'))
  } catch (err) {
    console.log('Error saving channel order', err)
    dispatch(addNotification('Error saving channel order', 'error'))
  }
}
