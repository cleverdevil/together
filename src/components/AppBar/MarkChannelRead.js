import React from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import ReadIcon from '@material-ui/icons/DoneAll'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo-hooks'
import useReactRouter from 'use-react-router'

const GET_DATA = gql`
  query TimelineQuery($channel: String!) {
    timeline(channel: $channel) {
      items {
        _id
        _is_read
      }
    }
    channels {
      uid
      unread
    }
  }
`

const MARK_CHANNEL_READ = gql`
  mutation MarkChannelRead($channel: String!, $post: String!) {
    markChannelRead(channel: $channel, post: $post) {
      uid
      unread
    }
  }
`

const MarkChannelRead = ({ classes }) => {
  let post = null
  let unread = null
  const { match } = useReactRouter()
  const channel = decodeURIComponent(match.params.channelSlug)

  const { data } = useQuery(GET_DATA, {
    variables: { channel },
  })
  if (
    data &&
    data.timeline &&
    data.timeline.items[0] &&
    data.timeline.items[0]._id
  ) {
    post = data.timeline.items[0]._id
    const foundChannel = (data.channels || []).find(c => c.uid === channel)
    if (foundChannel) {
      unread = foundChannel.unread
    }
  }

  const markRead = useMutation(MARK_CHANNEL_READ, {
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
      // Read the data from our cache for this query.
      const data = proxy.readQuery({
        query: GET_DATA,
        variables: { channel },
      })

      // Update all cached posts to be marked read
      if (data.timeline && data.timeline.items) {
        data.timeline.items = data.timeline.items.map(item => {
          item._is_read = true
          return item
        })
      }

      // Write our data back to the cache.
      proxy.writeQuery({ query: GET_DATA, variables: { channel }, data })
    },
  })

  if (!unread) {
    return null
  }

  return (
    <Tooltip title="Mark all as read" placement="bottom">
      <IconButton
        aria-label="Mark all as read"
        onClick={markRead}
        className={classes.menuAction}
      >
        <ReadIcon />
      </IconButton>
    </Tooltip>
  )
}

export default MarkChannelRead
