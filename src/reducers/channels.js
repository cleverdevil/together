import { List, Map } from 'immutable'

const defaultState = new List()

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'ADD_CHANNEL': {
      if (payload.uid === 'notifications') {
        // Don't add notifications to channel list
        return state
      }
      const existingChannelIndex = state.findIndex(
        channel => channel.get('uid') === payload.uid
      )
      const existingChannel =
        existingChannelIndex > -1 ? state.get(existingChannelIndex) : null
      const newChannel = new Map({
        name: payload.name,
        uid: payload.uid,
        slug: encodeURIComponent(payload.uid),
        unread: payload.unread,
        layout: payload.layout,
      })
      if (
        existingChannel &&
        (payload.unread !== existingChannel.get('unread') ||
          payload.name !== existingChannel.get('name'))
      ) {
        return state.set(existingChannelIndex, newChannel)
      } else if (!existingChannel) {
        return state.push(newChannel)
      }
      return state
    }
    case 'UPDATE_CHANNEL': {
      const microsubProperties = ['uid', 'name', 'unread']
      if (microsubProperties.indexOf(payload.key) > -1) {
        return state.update(
          state.findIndex(channel => channel.get('uid') === payload.uid),
          channel => channel.set(payload.key, payload.value)
        )
      } else {
        return state
      }
    }
    case 'MARK_ALL_READ': {
      const channelIndex = state.findIndex(
        channel => channel.get('uid') === payload.channel
      )
      return state.update(channelIndex, channel => channel.set('unread', 0))
    }
    case 'REORDER_CHANNELS': {
      const { uids } = payload
      return state.sort(
        (channelA, channelB) =>
          uids.indexOf(channelA.get('uid')) - uids.indexOf(channelB.get('uid'))
      )
    }
    case 'REMOVE_CHANNEL': {
      return state.remove(
        state.findIndex(channel => channel.get('uid') === payload.uid)
      )
    }
    case 'DECREMENT_CHANNEL_UNREAD': {
      return state.update(
        state.findIndex(channel => channel.get('uid') === payload.uid),
        channel => channel.update('unread', unread => (unread ? unread - 1 : 0))
      )
    }
    case 'INCREMENT_CHANNEL_UNREAD': {
      return state.update(
        state.findIndex(channel => channel.get('uid') === payload.uid),
        channel => channel.update('unread', unread => unread + 1)
      )
    }
    case 'LOGOUT': {
      return defaultState
    }
    default: {
      return state
    }
  }
}
