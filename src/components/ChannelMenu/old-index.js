import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Link, withRouter } from 'react-router-dom'
import { TogetherConsumer } from '../../containers/context'
import { ApolloConsumer } from 'react-apollo'
import { Shortcuts } from 'react-shortcuts'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import NewChannelForm from './NewChannelForm'
import styles from './style'

class ChannelMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focusedChannel: props.selectedChannel ? props.selectedChannel : null,
    }
    this.handleShortcuts = this.handleShortcuts.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.ref = React.createRef()
  }

  componentWillReceiveProps(newProps) {
    const el = this.ref.current._domNode
    if (newProps.isFocused && el !== document.activeElement) {
      el.focus()
      this.setState({ focusedChannel: newProps.selectedChannel })
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

  render() {
    const { classes, selectedChannel, isFocused } = this.props
    const { focusedChannel } = this.state
    return (
      <Shortcuts
        name="CHANNEL_LIST"
        handler={this.handleShortcuts}
        className={classes.drawer}
        ref={this.ref}
      >
        <TogetherConsumer>
          {({ channels }) =>
            channels && channels.length ? (
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
                                      <ApolloConsumer>
                                        {client => (
                                          <Link
                                            to={`/channel/${channel._t_slug}`}
                                            style={{ textDecoration: 'none' }}
                                            className={textClassName}
                                            onClick={e =>
                                              client.writeData({
                                                data: {
                                                  channelsMenuOpen: false,
                                                },
                                              })
                                            }
                                          >
                                            <ListItem button>
                                              <ListItemText
                                                classes={{
                                                  root: classes.channelTextRoot,
                                                  primary:
                                                    classes.channelTextRoot,
                                                }}
                                                primary={
                                                  <Fragment>
                                                    {channel.name} {unreadCount}
                                                  </Fragment>
                                                }
                                              />
                                            </ListItem>
                                          </Link>
                                        )}
                                      </ApolloConsumer>
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
            ) : (
              <p>Loading...</p>
            )
          }
        </TogetherConsumer>

        <div style={{ flexGrow: 1 }} />
        <NewChannelForm classes={classes} />
      </Shortcuts>
    )
  }
}

export default withRouter(withStyles(styles)(ChannelMenu))
