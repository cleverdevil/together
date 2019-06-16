import { useMutation, useApolloClient } from 'react-apollo-hooks'
import {
  MARK_CHANNEL_READ,
  GET_CHANNELS,
  GET_TIMELINE,
  GET_NOTIFICATIONS,
} from '../queries'

export default function() {
  const client = useApolloClient()
  const markRead = useMutation(MARK_CHANNEL_READ)

  return channel => {
    // Get the most recent post id in the timeline or notifications
    let post = null
    if (channel === 'notifications') {
      const { notifications } = client.readQuery({
        query: GET_NOTIFICATIONS,
      })
      post = notifications.timeline.items[0]._id
    } else {
      const {
        timeline: { items },
      } = client.readQuery({
        query: GET_TIMELINE,
        variables: { channel },
      })
      post = items[0]._id
    }

    markRead({
      variables: { channel, post },
      optimisticResponse: {
        __typename: 'Mutation',
        markChannelRead: {
          uid: channel,
          unread: 0,
          __typename: 'Channel',
        },
      },
      update: (proxy, _) => {
        if (channel === 'notifications') {
          const data = proxy.readQuery({
            query: GET_NOTIFICATIONS,
          })
          // Decrement unread count on notifications channel
          data.notifications.channel.unread = 0
          data.notifications.timeline.items.map(item => {
            item._is_read = true
            return item
          })
          proxy.writeQuery({ query: GET_NOTIFICATIONS, data })
        } else {
          const timelineData = proxy.readQuery({
            query: GET_TIMELINE,
            variables: { channel },
          })
          // Update all cached posts to be marked read
          if (timelineData.timeline && timelineData.timeline.items) {
            timelineData.timeline.items = timelineData.timeline.items.map(
              item => {
                item._is_read = true
                return item
              }
            )
          }
          // Write our data back to the cache.
          proxy.writeQuery({
            query: GET_TIMELINE,
            variables: { channel },
            data: timelineData,
          })

          const channelData = proxy.readQuery({ query: GET_CHANNELS })
          channelData.channel.unread = 0
          proxy.writeQuery({ query: GET_CHANNELS, data: channelData })
        }
      },
    })
  }
}
