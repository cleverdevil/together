import React from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import ReadIcon from '@material-ui/icons/DoneAll'
import useCurrentChannel from '../../hooks/use-current-channel'
import useMarkChannelRead from '../../hooks/use-mark-channel-read'

const MarkChannelRead = ({ classes }) => {
  const channel = useCurrentChannel()
  const markChannelRead = useMarkChannelRead()

  if (!channel.unread) {
    return null
  }

  return (
    <Tooltip title="Mark all as read" placement="bottom">
      <IconButton
        aria-label="Mark all as read"
        onClick={() => markChannelRead(channel.uid)}
        className={classes.menuAction}
      >
        <ReadIcon />
      </IconButton>
    </Tooltip>
  )
}

export default MarkChannelRead
