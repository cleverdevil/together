import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SettingsIcon from '@material-ui/icons/Settings';
import ChannelsIcon from '@material-ui/icons/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import NoteAddIcon from '@material-ui/icons/Edit';
import ReadIcon from '@material-ui/icons/DoneAll';
import NotificationsList from './notifications-list';
import MicropubForm from './micropub-form';
import LayoutSwitcher from './layout-switcher';
import { version } from '../../package.json';
import {
  toggleChannelsMenu,
  updateChannel,
  addNotification,
  updatePost,
  toggleTheme,
  logout,
} from '../actions';
import { posts as postsService, micropub } from '../modules/feathers-services';

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
  menuItem: {
    display: 'block',
    outline: 'none',
    textDecoration: 'none',
  },
  layoutSwitcher: {
    flexDirection: 'row',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.dark,
    marginBottom: -8,
    marginTop: 8,
  },
});

class TogetherAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      popoverOpen: false,
      popoverAnchor: null,
    };
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMarkRead = this.handleMarkRead.bind(this);
    this.handleCompose = this.handleCompose.bind(this);
    this.handleComposeSend = this.handleComposeSend.bind(this);
    this.renderMenuContent = this.renderMenuContent.bind(this);
  }

  handleMenuClose(e) {
    this.setState({ anchorEl: null });
  }

  handleMarkRead() {
    if (this.props.items && this.props.items[0] && this.props.items[0]._id) {
      postsService
        .update(null, {
          method: 'mark_read',
          channel: this.props.selectedChannel,
          last_read_entry: this.props.items[0]._id,
        })
        .then(res => {
          if (res.channel && res.channel == this.props.selectedChannel) {
            this.props.items.forEach(post => {
              if (!post._is_read) {
                this.props.updatePost(post._id, '_is_read', true);
              }
            });
          }
          this.props.updateChannel(
            res.channel || this.props.selectedChannel,
            'unread',
            0,
          );
          this.props.addNotification(`Marked ${res.updated} items as read`);
        })
        .catch(err => {
          console.log(err);
          this.props.addNotification('Error marking items as read', 'error');
        });
    }
  }

  handleCompose(e) {
    this.setState({
      popoverOpen: true,
      popoverAnchor: e.target,
    });
  }

  handleComposeSend(mf2) {
    if (
      Array.isArray(this.props.noteSyndication) &&
      this.props.noteSyndication.length
    ) {
      mf2.properties['mp-syndicate-to'] = this.props.noteSyndication;
    }
    micropub
      .create({
        post: mf2,
      })
      .then(url => {
        this.setState({ popoverOpen: false });
        this.props.addNotification(`Successfully posted note to ${url}`);
      })
      .catch(err => this.props.addNotification(`Error posting note`, 'error'));
  }

  renderMenuContent(selectedChannel) {
    return (
      <React.Fragment>
        {selectedChannel && (
          <Link
            to={`/channel/${selectedChannel.uid}/edit`}
            className={this.props.classes.menuItem}
          >
            <MenuItem>Channel Settings</MenuItem>
          </Link>
        )}
        <Link to="/settings" className={this.props.classes.menuItem}>
          <MenuItem>App Settings</MenuItem>
        </Link>
        <MenuItem onClick={this.props.toggleTheme}>
          {this.props.theme == 'light' ? 'Dark' : 'Light'} Mode
        </MenuItem>
        <MenuItem onClick={this.props.logout}>Logout</MenuItem>
        <MenuItem>Version {version}</MenuItem>
        <LayoutSwitcher className={this.props.classes.layoutSwitcher} />
      </React.Fragment>
    );
  }

  render() {
    const menuOpen = Boolean(this.state.anchorEl);
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
          <Tooltip title="Channels" placement="bottom">
            <IconButton
              className={this.props.classes.menuButton}
              onClick={this.props.toggleChannelsMenu}
              color="inherit"
              aria-label="Menu"
            >
              <ChannelsIcon />
            </IconButton>
          </Tooltip>

          <Typography
            variant="title"
            color="inherit"
            className={this.props.classes.title}
          >
            {title}
          </Typography>

          <div>
            {selectedChannel && selectedChannel.unread ? (
              <Tooltip title="Mark all as read" placement="bottom">
                <IconButton
                  aria-label="Mark all as read"
                  onClick={this.handleMarkRead}
                >
                  <ReadIcon />
                </IconButton>
              </Tooltip>
            ) : null}

            <Tooltip title="New post" placement="bottom">
              <IconButton aria-label="New post" onClick={this.handleCompose}>
                <NoteAddIcon />
              </IconButton>
            </Tooltip>

            <NotificationsList />

            <Tooltip title="Settings" placement="bottom">
              <IconButton
                onClick={e => this.setState({ anchorEl: e.currentTarget })}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={this.state.anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={menuOpen}
              onClose={this.handleMenuClose}
            >
              {this.renderMenuContent(selectedChannel)}
            </Menu>
            <Popover
              open={this.state.popoverOpen}
              anchorEl={this.state.popoverAnchor}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              onClose={() => this.setState({ popoverOpen: false })}
              onBackdropClick={() => this.setState({ popoverOpen: false })}
            >
              <div
                style={{
                  padding: 10,
                }}
              >
                <MicropubForm onSubmit={this.handleComposeSend} />
              </div>
            </Popover>
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
    theme: state.app.get('theme'),
    channels: state.channels.toJS(),
    items: state.posts.toJS(),
    noteSyndication: state.settings.get('noteSyndication'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      toggleChannelsMenu: toggleChannelsMenu,
      updateChannel: updateChannel,
      addNotification: addNotification,
      updatePost: updatePost,
      toggleTheme: toggleTheme,
      logout: logout,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(TogetherAppBar));
