export const addPost = post => {
  return {
    type: 'ADD_POST',
    post: post,
  };
};

export const addPosts = (posts, method = 'append') => {
  return {
    type: 'ADD_POSTS',
    posts,
    method,
  };
};

export const updatePost = (id, key, value) => {
  return {
    type: 'UPDATE_POST',
    id: id,
    key: key,
    value: value,
  };
};

export const setTimelineBefore = before => {
  return {
    type: 'SET_TIMELINE_BEFORE',
    before: before,
  };
};

export const setTimelineAfter = after => {
  return {
    type: 'SET_TIMELINE_AFTER',
    after: after,
  };
};
