export const addMicrosubNotification = post => {
  return {
    type: 'ADD_MICROSUB_NOTIFICATION',
    post: post,
  };
};

export const addMicrosubNotifications = posts => {
  return {
    type: 'ADD_MICROSUB_NOTIFICATIONS',
    posts: posts,
  };
};

export const replaceMicrosubNotifications = posts => {
  return {
    type: 'REPLACE_MICROSUB_NOTIFICATIONS',
    posts: posts,
  };
};
