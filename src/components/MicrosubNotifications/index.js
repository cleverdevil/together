import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo-hooks'
import { withStyles } from '@material-ui/core/styles'
import { Popover, Divider, Button, CircularProgress } from '@material-ui/core'
import OpenButton from './OpenButton'
import TitleBar from './TitleBar'
import Post from '../Post'
import styles from './style'
import { GET_NOTIFICATIONS } from '../../queries'

// TODO: Mark notification unread not working
// TODO: Check fetch more works

const NotificationsList = ({ classes, buttonClass }) => {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState(null)

  const { data, loading, error, fetchMore } = useQuery(GET_NOTIFICATIONS, {
    pollInterval: 60 * 1000,
  })

  if (error) {
    console.warn('Error loading notifications', error)
    return null
  }

  if (Object.keys(data).length === 0) {
    return null
  }

  const {
    notifications: {
      channel: { name, unread },
      timeline: { after, items: notifications },
    },
  } = data

  return (
    <Fragment>
      <OpenButton
        open={open}
        loading={loading}
        unread={unread}
        handleOpen={e => {
          setAnchor(e.target)
          setOpen(true)
        }}
        buttonClass={buttonClass}
        name={name}
      />
      <Popover
        open={open}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={() => setOpen(false)}
        onBackdropClick={() => setOpen(false)}
        className={classes.popover}
      >
        {loading && <CircularProgress className={classes.spinner} size={50} />}
        <div className={classes.container}>
          {notifications.map(post => (
            <Fragment key={'notification-' + post._id}>
              <div style={{ opacity: post._is_read ? 0.5 : 1 }}>
                <Post
                  style={{ boxShadow: 'none' }}
                  post={post}
                  channel="notifications"
                />
              </div>
              <Divider />
            </Fragment>
          ))}
          {after && (
            <Button
              size="large"
              fullWidth={true}
              onClick={fetchMore}
              className={classes.loadMore}
            >
              Load More
            </Button>
          )}
        </div>
        <TitleBar title={name} />
      </Popover>
    </Fragment>
  )
}

NotificationsList.defaultProps = {
  buttonClass: '',
}

NotificationsList.propTypes = {
  buttonClass: PropTypes.string.isRequired,
}

export default withStyles(styles)(NotificationsList)
