import { Map, List } from 'immutable'

const defaultState = new Map({
  posts: new List([]),
  before: null,
  after: null,
})

export default (state = defaultState, payload) => {
  switch (payload.type) {
    case 'UPDATE_POST': {
      const index = state
        .get('posts')
        .findIndex(post => post.get('_id') === payload.id)
      if (index > -1) {
        return state.update('posts', posts =>
          posts.update(index, post => post.set(payload.key, payload.value))
        )
      } else {
        return state
      }
    }
    case 'REPLACE_TIMELINE': {
      let update = defaultState
      const { items, paging } = payload
      if (items) {
        const newPosts = new List(items.map(post => new Map(post)))
        update = update.set('posts', newPosts)
      }
      if (paging.after) {
        update = update.set('after', paging.after)
      }
      if (paging.before) {
        update = update.set('before', paging.before)
      }
      return update
    }
    case 'PREPEND_TIMELINE': {
      let update = state
      const { items, paging } = payload
      if (items) {
        const newPosts = new List(items.map(post => new Map(post)))
        update = update.update('posts', posts => newPosts.concat(posts))
      }
      update = update.set('before', paging.before)
      return update
    }
    case 'APPEND_TIMELINE': {
      let update = state
      const { items, paging } = payload
      if (items) {
        const newPosts = new List(items.map(post => new Map(post)))
        update = update.update('posts', posts => posts.concat(newPosts))
      }
      update = update.set('after', paging.after)
      return update
    }
    case 'MARK_ALL_READ': {
      return state.update('posts', posts =>
        posts.map(post => post.set('_is_read', true))
      )
    }
    case 'REMOVE_POST': {
      return state.update('posts', posts =>
        posts.filter(post => post.get('_id') !== payload.id)
      )
    }
    case 'SET_SELECTED_CHANNEL': {
      return defaultState
    }
    case 'LOGOUT': {
      return defaultState
    }
    default: {
      return state
    }
  }
}
