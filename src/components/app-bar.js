import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui-icons/Settings';
import ChannelsIcon from 'material-ui-icons/Menu';
import EditIcon from 'material-ui-icons/Edit';
import ReadIcon from 'material-ui-icons/DoneAll';
import {
  toggleChannelsMenu,
  updateChannel,
  addNotification,
  updatePost,
} from '../actions';
import microsub from '../modules/microsub-api';

const styles = theme => ({
  root: {
    width: '100%',
  },
  title: {
    flex: 1,
    fontWeight: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  menuButton: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      marginLeft: -16,
      marginRight: 0,
    },
  },
});

class TogetherAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleMarkRead = this.handleMarkRead.bind(this);
  }

  handleMarkRead() {
    if (this.props.items && this.props.items[0] && this.props.items[0]._id) {
      microsub('markRead', {
        params: [this.props.selectedChannel, '', this.props.items[0]._id],
      })
        .then(res => {
          this.props.items.forEach(post => {
            if (!post._is_read) {
              this.props.updatePost(post._id, '_is_read', true);
            }
          });
          this.props.updateChannel(this.props.selectedChannel, 'unread', 0);
          this.props.addNotification(`Marked ${res.updated} items as read`);
        })
        .catch(err => {
          console.log(err);
          this.props.addNotification('Error marking items as read', 'error');
        });
    }
  }

  render() {
    const selectedChannel = this.props.channels.find(
      channel => channel.uid === this.props.selectedChannel,
    );
    let title = 'Together';
    if (selectedChannel) {
      title = selectedChannel.name;
      if (selectedChannel.unread) {
        title += ` (${selectedChannel.unread})`;
      }
    }
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={this.props.classes.menuButton}
            onClick={this.props.toggleChannelsMenu}
            color="inherit"
            aria-label="Menu"
          >
            <ChannelsIcon />
          </IconButton>

          <Typography
            variant="title"
            color="inherit"
            className={this.props.classes.title}
          >
            {title}
          </Typography>

          <div>
            {selectedChannel && (
              <React.Fragment>
                <Link to={`/channel/${selectedChannel.uid}/edit`}>
                  <IconButton
                    aria-label="Edit Channel"
                    className={this.props.classes.editButton}
                  >
                    <EditIcon />
                  </IconButton>
                </Link>
                {selectedChannel.unread ? (
                  <IconButton
                    aria-label="Mark all as Read"
                    className={this.props.classes.editButton}
                    onClick={this.handleMarkRead}
                  >
                    <ReadIcon />
                  </IconButton>
                ) : null}
              </React.Fragment>
            )}
            <Link to="/settings">
              <IconButton>
                <SettingsIcon />
              </IconButton>
            </Link>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

TogetherAppBar.propTypes = {};

function mapStateToProps(state, props) {
  return {
    selectedChannel: state.app.get('selectedChannel'),
    channels: state.channels.toJS(),
    items: state.posts.toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      toggleChannelsMenu: toggleChannelsMenu,
      updateChannel: updateChannel,
      addNotification: addNotification,
      updatePost: updatePost,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(TogetherAppBar),
);
