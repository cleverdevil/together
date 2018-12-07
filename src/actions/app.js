export const toggleChannelsMenu = () => ({
  type: 'TOGGLE_CHANNELS_MENU',
})

export const addNotification = (message, type = 'normal') => ({
  notification: {
    message: message,
    type: type,
  },
  type: 'ADD_NOTIFICATION',
})

export const removeNotification = (index = 0) => ({
  notificationIndex: index,
  type: 'REMOVE_NOTIFICATION',
})

export const toggleTheme = () => ({
  type: 'TOGGLE_THEME',
})

export const focusComponent = component => ({
  type: 'SET_FOCUSED_COMPONENT',
  component,
})
