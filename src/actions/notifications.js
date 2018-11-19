export const addMicrosubNotification = post => ({
  type: 'ADD_MICROSUB_NOTIFICATION',
  post: post,
})

export const addMicrosubNotifications = posts => ({
  type: 'ADD_MICROSUB_NOTIFICATIONS',
  posts: posts,
})

export const replaceMicrosubNotifications = posts => ({
  type: 'REPLACE_MICROSUB_NOTIFICATIONS',
  posts: posts,
})
