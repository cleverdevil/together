import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Shortcuts } from 'react-shortcuts'
import { List } from '@material-ui/core'
import { SortableContainer } from 'react-sortable-hoc'
import useReactRouter from 'use-react-router'
import ChannelMenuItem from './ChannelMenuItem'
import NewChannelForm from './NewChannelForm'
import styles from './style'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { GET_CHANNELS, REORDER_CHANNELS } from '../../queries'

// constructor(props) {
//   this.state = {
//     focusedChannel: props.selectedChannel ? props.selectedChannel : null,
//   }
//   this.handleShortcuts = this.handleShortcuts.bind(this)
//   this.onDragEnd = this.onDragEnd.bind(this)
// }

// componentWillReceiveProps(newProps) {
//   const el = this.ref.current._domNode
//   if (newProps.isFocused && el !== document.activeElement) {
//     el.focus()
//     this.setState({ focusedChannel: newProps.selectedChannel })
//   }
// }

const SortableList = SortableContainer(({ children }) => (
  <List>{children}</List>
))

const ChannelMenu = ({ classes, isFocused }) => {
  const { match, history } = useReactRouter()
  const selectedChannel = match.params.channelSlug
    ? decodeURIComponent(match.params.channelSlug)
    : null
  const [focusedChannel, setFocusedChannel] = useState(selectedChannel)
  const { data, loading, error } = useQuery(GET_CHANNELS)
  const channels = data.channels ? data.channels : []
  const reorderChannels = useMutation(REORDER_CHANNELS)

  // TODO: Figure out focussing element for keyboard shortcuts

  const handleShortcuts = action => {
    const channelIndex = channels.findIndex(
      channel => channel.uid === focusedChannel
    )

    switch (action) {
      case 'NEXT':
        if (channels[channelIndex + 1]) {
          setFocusedChannel(channels[channelIndex + 1].uid)
        }
        break
      case 'PREVIOUS':
        if (channelIndex > 0 && channels[channelIndex - 1]) {
          setFocusedChannel(channels[channelIndex - 1].uid)
        }
        break
      case 'SELECT_CHANNEL':
        history.push(`/channel/${focusedChannel}`)
        // setFocusedChannel(focusedChannel)
        break
      default:
        break
    }
  }

  const moveArray = (items, from, to) => {
    let array = [...items]
    const toMove = array[from]
    array.splice(from, 1)
    array.splice(to, 0, toMove)
    return array
  }

  const handleSort = ({ oldIndex, newIndex }) => {
    let uids = channels.map(channel => channel.uid)
    uids = moveArray(uids, oldIndex, newIndex)
    reorderChannels({
      variables: { channels: uids },
      optimisticResponse: {
        __typename: 'Mutation',
        reorderChannels: true,
      },
      update: (proxy, _) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({
          query: GET_CHANNELS,
        })
        // Reorder the channels
        data.channels = moveArray(data.channels, oldIndex, newIndex)
        // Write our data back to the cache.
        proxy.writeQuery({ query: GET_CHANNELS, data })
      },
    })
  }

  if (error) {
    return <p>Error loading channels 😢</p>
  }

  if (loading) {
    return <p>Loading channels...</p>
  }

  return (
    <div className={classes.drawer}>
      {/*  <Shortcuts
       name="CHANNEL_LIST"
       handler={handleShortcuts}
       className={classes.drawer}
     > */}
      <SortableList lockAxis="y" distance={2} onSortEnd={handleSort}>
        {channels.map((channel, index) => (
          <ChannelMenuItem
            key={`channel-menu-item-${index}`}
            index={index}
            channel={channel}
            isFocused={isFocused}
          />
        ))}
      </SortableList>

      <div style={{ flexGrow: 1 }} />
      <NewChannelForm classes={classes} />
      {/* </Shortcuts> */}
    </div>
  )
}

export default withStyles(styles)(ChannelMenu)
