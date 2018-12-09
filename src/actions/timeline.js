import {
  addNotification,
  decrementChannelUnread,
  incrementChannelUnread,
} from './index'
import { posts as postsService } from '../modules/feathers-services'

export const updatePost = (id, key, value) => ({
  type: 'UPDATE_POST',
  id: id,
  key: key,
  value: value,
})

export const markPostRead = (channelUid, postId) => async dispatch => {
  dispatch(updatePost(postId, '_is_read', true))
  dispatch(decrementChannelUnread(channelUid))
  try {
    await postsService.update(postId, {
      method: 'mark_read',
      channel: channelUid,
    })
  } catch (err) {
    console.log('Error marking post as read', err)
    dispatch(addNotification('Error marking post as read', 'error'))
    dispatch(updatePost(postId, '_is_read', false))
    dispatch(incrementChannelUnread(channelUid))
  }
}

export const markPostUnread = (channelUid, postId) => async dispatch => {
  dispatch(updatePost(postId, '_is_read', false))
  dispatch(incrementChannelUnread(channelUid))
  try {
    await postsService.update(postId, {
      method: 'mark_unread',
      channel: channelUid,
    })
  } catch (err) {
    console.log('Error marking post as unread', err)
    dispatch(addNotification('Error marking post as unread', 'error'))
    dispatch(updatePost(postId, '_is_read', true))
    dispatch(decrementChannelUnread(channelUid))
  }
}

export const markAllRead = (channelUid, postId) => async dispatch => {
  try {
    const res = await postsService.update(null, {
      method: 'mark_read',
      channel: channelUid,
      last_read_entry: postId,
    })
    dispatch({
      type: 'MARK_ALL_READ',
      channel: channelUid,
    })
    dispatch(addNotification(`Marked ${res.updated} items as read`))
  } catch (err) {
    console.log('Error marking items as read', err)
    dispatch(addNotification('Error marking items as read', 'error'))
  }
}

export const removePost = (channel, id) => async dispatch => {
  try {
    await postsService.update(id, {
      channel: channel,
      method: 'remove',
    })
    dispatch(addNotification('Post removed'))
  } catch (err) {
    console.log('Error removing post', err)
    dispatch(addNotification('Error removing post', 'error'))
  }
  return {
    type: 'REMOVE_POST',
    id,
  }
}

export const getPosts = channel => async dispatch => {
  const res = await postsService.find({
    query: {
      channel,
    },
  })
  return dispatch({
    ...res,
    channel,
    type: 'REPLACE_TIMELINE',
  })
}

export const getNewPosts = (channel, before) => async dispatch => {
  const res = await postsService.find({
    query: {
      channel,
      before,
    },
  })
  if (res.items && res.items.length) {
    return dispatch({
      ...res,
      channel,
      type: 'PREPEND_TIMELINE',
    })
  }
  return null
}

export const getMorePosts = (channel, after) => async dispatch => {
  const res = await postsService.find({
    query: {
      channel,
      after,
    },
  })
  if (res.items && res.items.length) {
    return dispatch({
      ...res,
      channel,
      type: 'APPEND_TIMELINE',
    })
  }
  return null
}
