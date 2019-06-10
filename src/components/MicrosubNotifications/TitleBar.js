import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  Tooltip,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { ClearAll as MarkAllReadIcon } from '@material-ui/icons'
import styles from './style'

const NotificationsTitleBar = ({ classes, unread, title }) => {
  const handleMarkAllRead = e => {
    const { notifications, markAllRead } = this.props
    markAllRead('notifications', notifications[0]._id)
  }

  return (
    <AppBar position="sticky" color="default" style={{ bottom: 0 }}>
      <Toolbar variant="dense">
        <Typography variant="subtitle1" color="inherit" style={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {unread > 0 && (
          <Tooltip title={`Mark all read`} placement="top">
            <IconButton
              aria-label={`Mark all notifications as read`}
              onClick={handleMarkAllRead}
            >
              <MarkAllReadIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default withStyles(styles)(NotificationsTitleBar)
