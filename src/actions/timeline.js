export const addToTimeline = post => {
  return {
    type: 'ADD_TO_TIMELINE',
    post: post,
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
