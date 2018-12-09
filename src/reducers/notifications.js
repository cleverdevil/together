import { Map, List } from 'immutable'

const defaultState = new Map({
  name: '',
  uid: '',
  unread: 0,
  before: '',
  after: '',
  notifications: new List([]),
})

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'SET_MICROSUB_NOTIFICATIONS': {
      const { items, paging } = payload
      let update = state
      if (items) {
        update = update.set(
          'notifications',
          new List(items.map(item => new Map(item)))
        )
      }
      if (paging && paging.before) {
        update = update.set('before', paging.before)
      }
      if (paging && paging.after) {
        update = update.set('after', paging.after)
      }
      return update
    }
    case 'ADD_MICROSUB_NOTIFICATIONS': {
      const { items, paging } = payload
      let update = state
      if (items) {
        update = update.update('notifications', notifications =>
          notifications.concat(new List(items.map(item => new Map(item))))
        )
      }
      if (paging && paging.after) {
        update = update.set('after', paging.after)
      }
      return update
    }
    case 'UPDATE_POST': {
      const index = state
        .get('notifications')
        .findIndex(post => post.get('_id') === payload.id)
      if (index > -1) {
        return state.update('notifications', notifications =>
          notifications.update(index, post =>
            post.set(payload.key, payload.value)
          )
        )
      }
      return state
    }
    case 'ADD_CHANNEL': {
      if (payload.uid === 'notifications') {
        return state
          .set('uid', payload.uid)
          .set('name', payload.name)
          .set('unread', payload.unread)
      }
      return state
    }
    case 'UPDATE_CHANNEL': {
      if (payload.uid === 'notifications' && payload.key === 'unread') {
        return state.set('unread', payload.value)
      }
      return state
    }
    case 'DECREMENT_CHANNEL_UNREAD': {
      if (payload.uid === 'notifications') {
        return state.update('unread', unread => (unread ? unread - 1 : 0))
      }
      return state
    }
    case 'INCREMENT_CHANNEL_UNREAD': {
      if (payload.uid === 'notifications') {
        return state.update('unread', unread => unread + 1)
      }
      return state
    }
    case 'LOGOUT': {
      return defaultState
    }
    default: {
      return state
    }
  }
}
