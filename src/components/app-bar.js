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
import Menu, { MenuItem } from 'material-ui/Menu';
import SettingsIcon from 'material-ui-icons/Settings';
import ChannelsIcon from 'material-ui-icons/Menu';
import EditIcon from 'material-ui-icons/Edit';
import ReadIcon from 'material-ui-icons/DoneAll';
import LayoutSwitcher from './layout-switcher';
import { version } from '../../package.json';
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
    };
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMarkRead = this.handleMarkRead.bind(this);
    this.renderMenuContent = this.renderMenuContent.bind(this);
  }

  handleMenuClose(e) {
    this.setState({ anchorEl: null });
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

  renderMenuContent(selectedChannel) {
    console.log(process.env);
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
            {selectedChannel && selectedChannel.unread ? (
              <IconButton
                aria-label="Mark all as Read"
                className={this.props.classes.editButton}
                onClick={this.handleMarkRead}
              >
                <ReadIcon />
              </IconButton>
            ) : null}
            <IconButton
              onClick={e => this.setState({ anchorEl: e.currentTarget })}
            >
              <SettingsIcon />
            </IconButton>
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
