import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import NotificationsIcon from '@material-ui/icons/Notifications'
import HasNotificationsIcon from '@material-ui/icons/NotificationsActive'
import MarkAllReadIcon from '@material-ui/icons/ClearAll'
import Post from '../Post'
import {
  getMicrosubNotifications,
  getMoreMicrosubNotifications,
  markAllRead,
} from '../../actions'
import styles from './style'

class NotificationsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      anchor: null,
      loading: false,
    }
    this.handleOpen = this.handleOpen.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this.handleMarkAllRead = this.handleMarkAllRead.bind(this)
  }

  async handleOpen(e) {
    const { getMicrosubNotifications, notifications } = this.props
    this.setState({
      loading: true,
      anchor: e.target,
      open: notifications.length > 0,
    })
    await getMicrosubNotifications()
    this.setState({ loading: false, open: true })
  }

  async loadMore(e) {
    const { getMoreMicrosubNotifications, after } = this.props
    this.setState({ loading: true })
    await getMoreMicrosubNotifications(after)
    this.setState({ loading: false })
  }

  handleMarkAllRead(e) {
    const { notifications, markAllRead } = this.props
    markAllRead('notifications', notifications[0]._id)
  }

  render() {
    const { open, anchor, loading, after } = this.state
    const {
      exists,
      classes,
      name,
      notifications,
      unread,
      buttonClass,
    } = this.props

    if (!exists) {
      return null
    }

    return (
      <Fragment>
        <Tooltip title={`${name} (${unread})`} placement="bottom">
          <span className={classes.icon}>
            <IconButton
              className={
                loading ? classes.loadingIcon + ' ' + buttonClass : buttonClass
              }
              aria-label={`Notifications (${unread})`}
              onClick={this.handleOpen}
            >
              {unread > 0 ? <HasNotificationsIcon /> : <NotificationsIcon />}
            </IconButton>
            {loading && !open && (
              <CircularProgress className={classes.iconSpinner} size={48} />
            )}
          </span>
        </Tooltip>
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
          onClose={() => this.setState({ open: false })}
          onBackdropClick={() => this.setState({ open: false })}
          className={classes.popover}
        >
          {loading && (
            <CircularProgress className={classes.spinner} size={50} />
          )}
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
                onClick={this.loadMore}
                className={classes.loadMore}
              >
                Load More
              </Button>
            )}
          </div>
          <AppBar position="sticky" color="default" style={{ bottom: 0 }}>
            <Toolbar variant="dense">
              <Typography
                variant="subtitle1"
                color="inherit"
                style={{ flexGrow: 1 }}
              >
                {name}
              </Typography>
              {unread > 0 && (
                <Tooltip title={`Mark all read`} placement="top">
                  <IconButton
                    aria-label={`Mark all notifications as read`}
                    onClick={this.handleMarkAllRead}
                  >
                    <MarkAllReadIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Toolbar>
          </AppBar>
        </Popover>
      </Fragment>
    )
  }
}

NotificationsList.defaultProps = {
  exists: false,
  name: 'Notifications',
  unread: 0,
  notifications: [],
  buttonClass: '',
}

NotificationsList.propTypes = {
  exists: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  unread: PropTypes.number.isRequired,
  notifications: PropTypes.array.isRequired,
  buttonClass: PropTypes.string.isRequired,
}

const mapStateToProps = state => {
  return {
    exists: state.notifications.get('uid') === 'notifications',
    name: state.notifications.get('name'),
    unread: state.notifications.get('unread'),
    before: state.notifications.get('before'),
    after: state.notifications.get('after'),
    notifications: state.notifications.get('notifications').toJS(),
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getMicrosubNotifications,
      getMoreMicrosubNotifications,
      markAllRead,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(NotificationsList))
