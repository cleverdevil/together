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
import NotificationsIcon from '@material-ui/icons/Notifications';
import HasNotificationsIcon from '@material-ui/icons/NotificationsActive';
import TogetherCard from './card/index';
import {
  addMicrosubNotifications,
  replaceMicrosubNotifications,
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
    top: '48%',
    left: '46%',
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

  render() {
    const { open, anchor, loading, after } = this.state;
    const { classes, notifications, notificationCount: count } = this.props;
    return (
      <React.Fragment>
        <Tooltip title={`Notifications (${count})`} placement="bottom">
          <span className={classes.icon}>
            <IconButton
              className={loading ? classes.loadingIcon : ''}
              aria-label={`Notifications (${count})`}
              onClick={e => {
                if (!open) {
                  this.loadNotifications();
                  this.setState({ anchor: e.target });
                } else {
                  this.setState({ open: false });
                }
              }}
            >
              {count > 0 ? <HasNotificationsIcon /> : <NotificationsIcon />}
            </IconButton>
            {loading &&
              !open && (
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
                <TogetherCard
                  style={{ boxShadow: 'none' }}
                  post={post}
                  channel="notifications"
                />
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
        </Popover>
      </React.Fragment>
    );
  }
}

NotificationsList.defaultProps = {
  notifications: [],
};

NotificationsList.propTypes = {
  notifications: PropTypes.array.isRequired,
  notificationCount: PropTypes.number.isRequired,
};

const mapStateToProps = state => {
  let count = 0;
  if (state.channels && state.channels.find) {
    const notificationsChannel = state.channels
      .toJS()
      .find(channel => channel.uid == 'notifications');
    if (notificationsChannel && notificationsChannel.unread) {
      count = notificationsChannel.unread;
    }
  }

  return {
    notificationCount: count,
    notifications: state.notifications.toJS(),
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addMicrosubNotifications,
      replaceMicrosubNotifications,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(NotificationsList));
