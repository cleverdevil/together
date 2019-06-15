import { useMutation } from 'react-apollo-hooks'
import { MARK_POST_UNREAD, GET_CHANNELS, GET_NOTIFICATIONS } from '../queries'

export default function() {
  const markRead = useMutation(MARK_POST_UNREAD)
  return (channel, post) =>
    markRead({
      variables: { channel, post },
      optimisticResponse: {
        __typename: 'Mutation',
        markPostUnread: {
          _id: post,
          _is_read: false,
          __typename: 'Post',
        },
      },
      update: (proxy, _) => {
        if (channel === 'notifications') {
          const data = proxy.readQuery({
            query: GET_NOTIFICATIONS,
          })
          // Increment unread count on notifications channel
          data.notifications.channel.unread++
          proxy.writeQuery({ query: GET_NOTIFICATIONS, data })
        } else {
          // Read the data from our cache for this query.
          const data = proxy.readQuery({
            query: GET_CHANNELS,
          })
          // Increment channel unread count
          data.channels = data.channels.map(c => {
            if (c.uid === channel && Number.isInteger(c.unread)) {
              c.unread++
            }
            return c
          })
          // Write our data back to the cache.
          proxy.writeQuery({ query: GET_CHANNELS, data })
        }
      },
    })
}
