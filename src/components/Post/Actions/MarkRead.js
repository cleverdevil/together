import React from 'react'
import { useSnackbar } from 'notistack'
import useMarkRead from '../../../hooks/use-mark-read'
import useMarkUnread from '../../../hooks/use-mark-unread'
import ReadIcon from '@material-ui/icons/PanoramaFishEye'
import UnreadIcon from '@material-ui/icons/Lens'
import BaseAction from './Base'

const ActionMarkRead = ({ _id, isRead, channel, menuItem }) => {
  const { enqueueSnackbar } = useSnackbar()

  const markRead = useMarkRead()
  const markUnread = useMarkUnread()

  const handleClick = async e => {
    const actionName = isRead ? 'unread' : 'read'
    try {
      if (isRead) {
        await markUnread(channel, _id)
      } else {
        await markRead(channel, _id)
      }
      enqueueSnackbar(`Post marked ${actionName}`, { variant: 'success' })
    } catch (err) {
      console.error(`Error marking post ${actionName}`, err)
      enqueueSnackbar(`Error marking post ${actionName}`, { variant: 'error' })
    }
  }

  return (
    <BaseAction
      title={'Mark as ' + (isRead ? 'Unread' : 'Read')}
      onClick={handleClick}
      icon={isRead ? <ReadIcon /> : <UnreadIcon />}
      menuItem={menuItem}
    />
  )
}

export default ActionMarkRead
