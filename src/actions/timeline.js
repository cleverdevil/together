export const addToTimeline = (post) => {
  return {
    type: 'ADD_TO_TIMELINE',
    post: post,
  };
}