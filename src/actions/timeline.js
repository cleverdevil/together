export const addPost = post => ({
  type: 'ADD_POST',
  post: post,
})

export const addPosts = (posts, method = 'append') => ({
  type: 'ADD_POSTS',
  posts,
  method,
})

export const updatePost = (id, key, value) => ({
  type: 'UPDATE_POST',
  id: id,
  key: key,
  value: value,
})

export const removePost = id => ({
  type: 'REMOVE_POST',
  id,
})

export const setTimelineBefore = before => ({
  type: 'SET_TIMELINE_BEFORE',
  before: before,
})

export const setTimelineAfter = after => ({
  type: 'SET_TIMELINE_AFTER',
  after: after,
})
