import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router-dom';
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'material-ui/List';
import AddIcon from 'material-ui-icons/Add';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import {
  selectChannel,
  toggleChannelsMenu,
  addChannel,
  updateChannel,
  addNotification,
} from '../actions';
import { channels as channelsService } from '../modules/feathers-services';
import { getOptions } from '../modules/microsub-api';

const styles = theme => ({
  drawer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    background: theme.palette.primary.dark,
    borderRight: '1px solid ' + theme.palette.divider,
  },
  channelTextRoot: {
    position: 'realtive',
    padding: 0,
  },
  button: {
    textAlign: 'left',
    color: theme.palette.primary.light,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  highlightedButton: {
    textAlign: 'left',
    color: theme.palette.primary.contrastText,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  addButton: {
    textAlign: 'center',
    color: theme.palette.primary.main,
  },
  addForm: {
    background: theme.palette.background.default,
  },
  unread: {
    position: 'absolute',
    top: '50%',
    right: 8,
    marginTop: '-1em',
    minWidth: '1em',
    background:
      theme.palette.type === 'dark'
        ? theme.palette.secondary.dark
        : theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    fontWeight: 'bold',
    fontSize: '0.6em',
    textAlign: 'center',
    lineHeight: 1,
    padding: '.5em',
    borderRadius: '1em',
  },
});

class ChannelMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newChannelName: '',
      newChannel: false,
    };
    this.handleAddChannel = this.handleAddChannel.bind(this);
    this.renderChannelForm = this.renderChannelForm.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    if (this.props.microsubEndpoint) {
      channelsService
        .find({ query: getOptions() })
        .then(channels => {
          channels.forEach(channel => {
            this.props.addChannel(
              channel.name,
              channel.uid,
              channel.unread,
              localStorage.getItem(`channel-${channel.uid}-layout`),
            );
            this.props.updateChannel(
              channel.uid,
              'infiniteScroll',
              localStorage.getItem(
                `together-channel-${channel.uid}-infiniteScroll`,
              ),
            );
            this.props.updateChannel(
              channel.uid,
              'autoRead',
              localStorage.getItem(`together-channel-${channel.uid}-autoRead`),
            );
          });
        })
        .catch(err => {
          console.log('Error getting channels');
          console.log(err);
        });
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.microsubEndpoint &&
      this.props.microsubEndpoint !== newProps.microsubEndpoint
    ) {
      channelsService
        .find({ query: getOptions() })
        .then(channels => {
          channels.forEach(channel => {
            this.props.addChannel(channel.name, channel.uid, channel.uread);
          });
        })
        .catch(err => {
          console.log('Error getting channels');
          console.log(err);
        });
    }
  }

  handleClose() {
    if (this.props.open) {
      this.props.toggleChannelsMenu();
    }
  }

  handleAddChannel(e) {
    e.preventDefault();
    channelsService
      .create({ name: this.state.newChannelName, query: getOptions() })
      .then(newChannel => {
        this.setState({
          newChannelName: '',
          newChannel: false,
        });
        this.props.addChannel(newChannel.name, newChannel.uid);
      })
      .catch(err => {
        this.props.addNotification('Error creating channel', 'error');
      });
    return false;
  }

  renderChannelForm() {
    if (!this.state.newChannel) {
      return (
        <ListItem onClick={() => this.setState({ newChannel: true })} button>
          <ListItemText
            title="Add New Channel"
            classes={{ primary: this.props.classes.addButton }}
            primary={<AddIcon />}
          />
        </ListItem>
      );
    }
    return (
      <form
        className={this.props.classes.addForm}
        onSubmit={this.handleAddChannel}
      >
        <TextField
          fullWidth={true}
          label="New Channel Name"
          required={true}
          autoFocus={true}
          value={this.state.newChannelName}
          onChange={e => this.setState({ newChannelName: e.target.value })}
        />
        <Button style={{ width: '100%' }} type="submit">
          Add Channel
        </Button>
      </form>
    );
  }

  render() {
    return (
      <div className={this.props.classes.drawer}>
        <List>
          {this.props.channels.map(channel => {
            let textClassName = this.props.classes.button;
            if (channel.uid === this.props.selectedChannel) {
              textClassName = this.props.classes.highlightedButton;
            }
            let unreadCount = null;
            if (channel.unread) {
              unreadCount = (
                <span className={this.props.classes.unread}>
                  {channel.unread}
                </span>
              );
            }
            return (
              <Link
                to={`/channel/${channel.uid}`}
                key={`channel-${channel.uid}`}
                style={{ textDecoration: 'none' }}
                onClick={this.handleClose}
              >
                <ListItem button>
                  <ListItemText
                    classes={{
                      primary: textClassName,
                      root: this.props.classes.channelTextRoot,
                    }}
                    primary={
                      <React.Fragment>
                        {channel.name} {unreadCount}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </Link>
            );
          })}
        </List>
        <div style={{ flexGrow: 1 }} />
        {this.renderChannelForm()}
      </div>
    );
  }
}

ChannelMenu.defaultProps = {
  open: false,
};

ChannelMenu.propTypes = {
  channels: PropTypes.array.isRequired,
};

function mapStateToProps(state, props) {
  return {
    microsubEndpoint: state.user.get('microsubEndpoint'),
    selectedChannel: state.app.get('selectedChannel'),
    channels: state.channels.toJS(),
    open: state.app.get('channelsMenuOpen'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectChannel: selectChannel,
      toggleChannelsMenu: toggleChannelsMenu,
      addChannel: addChannel,
      updateChannel: updateChannel,
      addNotification: addNotification,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(ChannelMenu),
);
