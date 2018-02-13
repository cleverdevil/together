export const toggleChannelsMenu = () => {
  return {
    type: 'TOGGLE_CHANNELS_MENU',
  };
};

export const addNotification = (message, type = 'normal') => {
  return {
    notification: {
      message: message,
      type: type,
    },
    type: 'ADD_NOTIFICATION',
  };
};

export const removeNotification = (index = 0) => {
  return {
    notificationIndex: index,
    type: 'REMOVE_NOTIFICATION',
  };
};
