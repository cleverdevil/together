import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';
import HasNotificationsIcon from '@material-ui/icons/NotificationsActive';
import MarkAllReadIcon from '@material-ui/icons/ClearAll';
import TogetherCard from './card/index';
import {
  addMicrosubNotifications,
  replaceMicrosubNotifications,
  updatePost,
  updateChannel,
  addNotification,
} from '../actions';
import { posts as postsService } from '../modules/feathers-services';

const styles = theme => ({
  icon: { position: 'relative', display: 'inline-block' },
  loadingIcon: {
    opacity: 0.7,
  },
  iconSpinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    color: theme.palette.grey[100],
    opacity: 0.4,
  },
  popover: {
    paper: {
      width: '100%',
      maxHeight: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 400,
        minWidth: 400,
        maxWidth: '90%',
      },
    },
    [theme.breakpoints.up('sm')]: {
      maxHeight: '80%',
    },
  },
  container: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 400,
    },
  },
  loadMore: {},
  spinner: {
    position: 'sticky',
    top: 'calc(50% - 25px)',
    left: 'calc(50% - 25px)',
  },
});

class NotificationsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchor: null,
      loading: false,
      after: null,
      before: null,
    };
    this.loadNotifications = this.loadNotifications.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleMarkAllRead = this.handleMarkAllRead.bind(this);
  }

  loadNotifications() {
    this.setState({ loading: true, open: this.props.notifications.length > 0 });
    postsService
      .find({ query: { channel: 'notifications' } })
      .then(res => {
        let update = { open: true, loading: false, after: null, before: null };
        if (res.items) {
          this.props.replaceMicrosubNotifications(res.items);
        }
        if (res.paging) {
          if (res.paging.before) {
            update.before = res.paging.before;
          }
          if (res.paging.after) {
            update.after = res.paging.after;
          }
        }
        this.setState(update);
      })
      .catch(err => {
        this.setState({ loading: false });
        console.log('Error loading notifications', err);
      });
  }

  loadMore(e) {
    this.setState({ loading: true });
    postsService
      .find({ query: { channel: 'notifications', after: this.state.after } })
      .then(res => {
        let update = { open: true, loading: false, after: null, before: null };
        if (res.items) {
          this.props.addMicrosubNotifications(res.items);
        }
        if (res.paging) {
          if (res.paging.before) {
            update.before = res.paging.before;
          }
          if (res.paging.after) {
            update.after = res.paging.after;
          }
        }
        this.setState(update);
      })
      .catch(err => {
        this.setState({ loading: false });
        console.log('Error loading notifications', err);
      });
  }

  handleMarkAllRead(e) {
    const uid = 'notifications';
    const {
      notifications,
      updatePost,
      updateChannel,
      addNotification,
    } = this.props;

    postsService
      .update(null, {
        method: 'mark_read',
        channel: uid,
        last_read_entry: notifications[0]._id,
      })
      .then(res => {
        notifications.forEach(post => {
          if (!post._is_read) {
            updatePost(post._id, '_is_read', true);
          }
        });
        updateChannel(uid, 'unread', 0);
        addNotification('Marked all notifications as read');
      })
      .catch(err => {
        console.log('Error marking notifications as read', err);
        addNotification('Error marking notifications as read', 'error');
      });
  }

  render() {
    const { open, anchor, loading, after } = this.state;
    const {
      exists,
      classes,
      name,
      notifications,
      unread,
      buttonClass,
    } = this.props;

    if (!exists) {
      return null;
    }

    return (
      <React.Fragment>
        <Tooltip title={`${name} (${unread})`} placement="bottom">
          <span className={classes.icon}>
            <IconButton
              className={
                loading ? classes.loadingIcon + ' ' + buttonClass : buttonClass
              }
              aria-label={`Notifications (${unread})`}
              onClick={e => {
                if (!open) {
                  this.loadNotifications();
                  this.setState({ anchor: e.target });
                } else {
                  this.setState({ open: false });
                }
              }}
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
              <React.Fragment key={'notification-' + post._id}>
                <div style={{ opacity: post._is_read ? 0.5 : 1 }}>
                  <TogetherCard
                    style={{ boxShadow: 'none' }}
                    post={post}
                    channel="notifications"
                  />
                </div>
                <Divider />
              </React.Fragment>
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
                variant="subheading"
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
      </React.Fragment>
    );
  }
}

NotificationsList.defaultProps = {
  exists: false,
  name: 'Notifications',
  unread: 0,
  notifications: [],
  buttonClass: '',
};

NotificationsList.propTypes = {
  exists: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  unread: PropTypes.number.isRequired,
  notifications: PropTypes.array.isRequired,
  buttonClass: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  return {
    exists: state.notifications.get('uid') === 'notifications',
    name: state.notifications.get('name'),
    unread: state.notifications.get('unread'),
    notifications: state.notifications.get('notifications').toJS(),
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addMicrosubNotifications,
      replaceMicrosubNotifications,
      updatePost,
      updateChannel,
      addNotification,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(NotificationsList));
