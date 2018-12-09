import { addNotification } from './index'
import { posts as postsService } from '../modules/feathers-services'

export const getMicrosubNotifications = () => async dispatch => {
  try {
    const res = await postsService.find({
      query: { channel: 'notifications' },
    })
    return dispatch({
      ...res,
      type: 'SET_MICROSUB_NOTIFICATIONS',
    })
  } catch (err) {
    console.log('Error getting microsub notifications', err)
    dispatch(addNotification('Error getting microsub notifications', 'error'))
  }
}

export const getMoreMicrosubNotifications = after => async dispatch => {
  try {
    const res = await postsService.find({
      query: { channel: 'notifications', after },
    })
    return dispatch({
      ...res,
      type: 'ADD_MICROSUB_NOTIFICATIONS',
    })
  } catch (err) {
    console.log('Error getting microsub notifications', err)
    dispatch(addNotification('Error getting microsub notifications', 'error'))
  }
}
