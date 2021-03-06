import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Link, withRouter } from 'react-router-dom'
import { Shortcuts } from 'react-shortcuts'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import AddIcon from '@material-ui/icons/Add'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  toggleChannelsMenu,
  addChannel,
  createChannel,
  getChannels,
  updateChannel,
  reorderChannels,
  addNotification,
  selectChannel,
} from '../../actions'

import styles from './style'

const refreshTimeout = 1000 * 60

class ChannelMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newChannelName: '',
      newChannel: false,
      focusedChannel: props.selectedChannel ? props.selectedChannel : null,
    }
    this.handleShortcuts = this.handleShortcuts.bind(this)
    this.handleAddChannel = this.handleAddChannel.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.renderChannelForm = this.renderChannelForm.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.ref = React.createRef()
  }

  componentDidMount() {
    if (this.props.userId) {
      this.props.getChannels()
      this.refreshInterval = setInterval(() => {
        if (document.hasFocus) {
          this.props.getChannels()
        }
      }, refreshTimeout)
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.userId && this.props.userId !== newProps.userId) {
      this.props.getChannels()
      if (!this.refreshInterval) {
        this.refreshInterval = setInterval(() => {
          if (document.hasFocus) {
            this.props.getChannels()
          }
        }, refreshTimeout)
      }
    }

    const el = this.ref.current._domNode
    if (newProps.isFocused && el !== document.activeElement) {
      el.focus()
      this.setState({ focusedChannel: newProps.selectedChannel })
    }
  }

  componentWillUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
    }
  }

  handleShortcuts(action) {
    const { history, channels, selectChannel } = this.props
    const { focusedChannel } = this.state
    const channelIndex = channels.findIndex(
      channel => channel.uid === focusedChannel
    )

    switch (action) {
      case 'NEXT':
        if (channels[channelIndex + 1]) {
          this.setState({ focusedChannel: channels[channelIndex + 1].uid })
        }
        break
      case 'PREVIOUS':
        if (channelIndex > 0 && channels[channelIndex - 1]) {
          this.setState({ focusedChannel: channels[channelIndex - 1].uid })
        }
        break
      case 'SELECT_CHANNEL':
        history.push(`/channel/${focusedChannel}`)
        selectChannel(focusedChannel)
        break
      default:
        break
    }
  }

  handleClose() {
    if (this.props.open) {
      this.props.toggleChannelsMenu()
    }
    return true
  }

  handleAddChannel(e) {
    e.preventDefault()
    const { newChannelName } = this.state
    const { createChannel } = this.props
    createChannel(newChannelName)
    this.setState({
      newChannelName: '',
      newChannel: false,
    })
    return false
  }

  onDragEnd({ source, destination }) {
    if (!destination) {
      return null
    }
    const { reorderChannels, channels } = this.props
    let uids = channels.map(channel => channel.uid)
    const uidToMove = uids[source.index]
    uids.splice(source.index, 1)
    uids.splice(destination.index, 0, uidToMove)
    reorderChannels(uids)
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
      )
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
    )
  }

  render() {
    const { classes, channels, selectedChannel, isFocused } = this.props
    const { focusedChannel } = this.state
    return (
      <Shortcuts
        name="CHANNEL_LIST"
        handler={this.handleShortcuts}
        className={classes.drawer}
        ref={this.ref}
      >
        <List>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {provided => (
                <div ref={provided.innerRef}>
                  {channels
                    .filter(channel => channel.uid !== 'notifications')
                    .map((channel, index) => {
                      let textClassName = classes.button
                      if (channel.uid === selectedChannel) {
                        textClassName = classes.highlightedButton
                      }
                      if (isFocused && channel.uid === focusedChannel) {
                        textClassName += ' ' + classes.focused
                      }
                      let unreadCount = null
                      if (channel.unread) {
                        unreadCount = (
                          <span className={classes.unread}>
                            {channel.unread}
                          </span>
                        )
                      }
                      return (
                        <Draggable
                          key={channel.uid}
                          draggableId={channel.uid}
                          index={index}
                        >
                          {provided => (
                            <div>
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Link
                                  to={`/channel/${channel.slug}`}
                                  style={{ textDecoration: 'none' }}
                                  className={textClassName}
                                  onClick={this.handleClose}
                                >
                                  <ListItem button>
                                    <ListItemText
                                      classes={{
                                        root: classes.channelTextRoot,
                                        primary: classes.channelTextRoot,
                                      }}
                                      primary={
                                        <Fragment>
                                          {channel.name} {unreadCount}
                                        </Fragment>
                                      }
                                    />
                                  </ListItem>
                                </Link>
                              </div>
                              {provided.placeholder}
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </List>

        <div style={{ flexGrow: 1 }} />
        {this.renderChannelForm()}
      </Shortcuts>
    )
  }
}

ChannelMenu.defaultProps = {
  open: false,
}

ChannelMenu.propTypes = {
  channels: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  userId: state.user.get('_id'),
  selectedChannel: state.app.get('selectedChannel'),
  channels: state.channels.toJS(),
  open: state.app.get('channelsMenuOpen'),
  isFocused: state.app.get('focusedComponent') === 'channels',
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleChannelsMenu,
      addChannel,
      createChannel,
      getChannels,
      updateChannel,
      selectChannel,
      reorderChannels,
      addNotification,
    },
    dispatch
  )

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(ChannelMenu))
)
