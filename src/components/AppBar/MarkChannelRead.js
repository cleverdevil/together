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

  const { data } = useQuery(GET_DATA, { variables: { channel } })
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
