import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  selectChannel,
  toggleChannelsMenu,
  addChannel,
  updateChannel,
  reorderChannels,
  addNotification,
} from '../actions';
import { channels as channelsService } from '../modules/feathers-services';

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
    this.onDragEnd = this.onDragEnd.bind(this);
    this.renderChannelForm = this.renderChannelForm.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    if (this.props.userId) {
      channelsService
        .find({})
        .then(channels => {
          channels.forEach(channel => {
            this.props.addChannel(channel.name, channel.uid, channel.unread);
          });
        })
        .catch(err => {
          console.log('Error getting channels');
          console.log(err);
        });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.userId && this.props.userId !== newProps.userId) {
      channelsService
        .find({})
        .then(channels => {
          channels.forEach(channel => {
            this.props.addChannel(channel.name, channel.uid, channel.unread);
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
      .create({ name: this.state.newChannelName })
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

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    this.props.reorderChannels(result.source.index, result.destination.index);
    channelsService
      .patch(null, { order: this.props.channels.map(channel => channel.uid) })
      .then(channels => this.props.addNotification('Channel order saved'))
      .catch(err => {
        console.log(err);
        this.props.addNotification('Error saving channel order', 'error');
      });
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
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div ref={provided.innerRef}>
                  {this.props.channels
                    .filter(channel => channel.uid != 'notifications')
                    .map((channel, index) => {
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
                        <Draggable
                          key={channel.uid}
                          draggableId={channel.uid}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div>
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                // style={getItemStyle(
                                //   snapshot.isDragging,
                                //   provided.draggableProps.style,
                                // )}
                              >
                                <Link
                                  to={`/channel/${channel.slug}`}
                                  key={`channel-${channel.uid}`}
                                  style={{ textDecoration: 'none' }}
                                  onClick={this.handleClose}
                                >
                                  <ListItem button>
                                    <ListItemText
                                      classes={{
                                        primary: textClassName,
                                        root: this.props.classes
                                          .channelTextRoot,
                                      }}
                                      primary={
                                        <React.Fragment>
                                          {channel.name} {unreadCount}
                                        </React.Fragment>
                                      }
                                    />
                                  </ListItem>
                                </Link>
                              </div>
                              {provided.placeholder}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
    userId: state.user.get('_id'),
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
      reorderChannels: reorderChannels,
      addNotification: addNotification,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(ChannelMenu));
