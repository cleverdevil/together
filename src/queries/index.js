import gql from 'graphql-tag'

export const FRAGMENT_AUTHOR = gql`
  fragment AuthorFragment on PostAuthor {
    name
    url
    photo
  }
`

export const FRAGMENT_CHANNEL = gql`
  fragment ChannelFragment on Channel {
    uid
    name
    unread
    _t_slug
    _t_layout
    _t_autoRead
    _t_infiniteScroll
  }
`

export const FRAGMENT_SEARCH_RESULT = gql`
  fragment SearchResultFragment on SearchResult {
    type
    url
    name
    photo
    description
    author {
      ...AuthorFragment
    }
  }

  ${FRAGMENT_AUTHOR}
`

export const GET_USER = gql`
  query getUser {
    user {
      url
      name
      photo
      hasMicropub
      hasMicrosub
      settings {
        likeSyndication
        repostSyndication
        noteSyndication
      }
    }
  }
`

export const SET_USER_OPTION = gql`
  mutation SetUserOption($key: String!, $value: String!) {
    setUserSetting(key: $key, value: $value)
  }
`

export const GET_CHANNELS = gql`
  query GetChannels {
    channels {
      ...ChannelFragment
    }
  }

  ${FRAGMENT_CHANNEL}
`

export const FRAGMENT_POST_PROPERTIES = gql`
  fragment PostProperties on Post {
    _id
    _is_read
    type
    url
    published
    postType
    name
    likeOf
    repostOf
    quotationOf
    bookmarkOf
    photo
    video
    audio
    checkin {
      type
      name
      latitude
      longitude
      url
    }
    location {
      type
      name
      latitude
      longitude
      url
    }
    content {
      text
      html
    }
    author {
      ...AuthorFragment
    }
  }

  ${FRAGMENT_AUTHOR}
`

export const FRAGMENT_POST = gql`
  fragment PostFragment on Post {
    ...PostProperties
    refs {
      ...PostProperties
      refs {
        ...PostProperties
      }
    }
  }

  ${FRAGMENT_POST_PROPERTIES}
`

export const GET_TIMELINE = gql`
  query TimelineQuery(
    $channel: String!
    $after: String
    $before: String
    $limit: Int
  ) {
    timeline(channel: $channel, after: $after, before: $before, limit: $limit) {
      after
      before
      items {
        ...PostFragment
        refs {
          ...PostFragment
        }
      }
    }
  }

  ${FRAGMENT_POST}
`

export const SEARCH = gql`
  query SearchQuery($query: String!) {
    search(query: $query) {
      ...SearchResultFragment
    }
  }

  ${FRAGMENT_SEARCH_RESULT}
`

export const PREVIEW = gql`
  query PreviewQuery($url: String!) {
    preview(url: $url) {
      ...PostFragment
    }
  }

  ${FRAGMENT_POST}
`

export const MICROPUB_QUERY = gql`
  query MicropubQuery($query: String!) {
    micropubQuery(query: $query)
  }
`

export const GET_FOLLOWING = gql`
  query FollowingQuery($channel: String!) {
    following(channel: $channel) {
      ...SearchResultFragment
    }
  }

  ${FRAGMENT_SEARCH_RESULT}
`

export const GET_BLOCKED = gql`
  query BlockedQuery($channel: String!) {
    blocked(channel: $channel) {
      ...SearchResultFragment
    }
  }

  ${FRAGMENT_SEARCH_RESULT}
`

export const GET_MUTED = gql`
  query MutedQuery($channel: String!) {
    muted(channel: $channel) {
      ...SearchResultFragment
    }
  }

  ${FRAGMENT_SEARCH_RESULT}
`

export const GET_NOTIFICATIONS = gql`
  query Notifications {
    notifications {
      channel {
        ...ChannelFragment
      }
      timeline {
        after
        before
        items {
          ...PostFragment
          refs {
            ...PostFragment
          }
        }
      }
    }
  }

  ${FRAGMENT_CHANNEL}
  ${FRAGMENT_POST}
`
export const ADD_CHANNEL = gql`
  mutation addChannel($name: String!) {
    addChannel(name: $name) {
      ...ChannelFragment
    }
  }
  ${FRAGMENT_CHANNEL}
`

export const REMOVE_CHANNEL = gql`
  mutation removeChannel($channel: String!) {
    removeChannel(channel: $channel)
  }
`

export const REORDER_CHANNELS = gql`
  mutation reorderChannels($channels: [String!]!) {
    reorderChannels(channels: $channels)
  }
`

export const UPDATE_CHANNEL = gql`
  mutation updateChannel(
    $uid: String!
    $name: String
    $unread: Int
    $_t_slug: String
    $_t_layout: String
    $_t_autoRead: Boolean
    $_t_infiniteScroll: Boolean
  ) {
    updateChannel(
      uid: $uid
      name: $name
      unread: $unread
      _t_slug: $_t_slug
      _t_layout: $_t_layout
      _t_autoRead: $_t_autoRead
      _t_infiniteScroll: $_t_infiniteScroll
    ) {
      ...ChannelFragment
    }
  }
  ${FRAGMENT_CHANNEL}
`

export const MARK_POST_READ = gql`
  mutation MarkPostRead($channel: String!, $post: String!) {
    markPostRead(channel: $channel, post: $post) {
      _id
      _is_read
    }
  }
`

export const MARK_POST_UNREAD = gql`
  mutation MarkPostUnread($channel: String!, $post: String!) {
    markPostUnread(channel: $channel, post: $post) {
      _id
      _is_read
    }
  }
`

export const REMOVE_POST = gql`
  mutation RemovePost($channel: String!, $post: String!) {
    removePost(channel: $channel, post: $post) {
      _id
    }
  }
`

export const REFETCH_POST = gql`
  mutation RefetchPost($post: String!, $url: String!) {
    refetchPost(post: $post, url: $url) {
      _id
      featured
      name
      content {
        html
      }
    }
  }
`

export const MUTE = gql`
  mutation Mute($channel: String!, $url: String!) {
    mute(channel: $channel, url: $url)
  }
`

export const UNMUTE = gql`
  mutation Unmute($channel: String!, $url: String!) {
    unmute(channel: $channel, url: $url)
  }
`

export const BLOCK = gql`
  mutation Block($channel: String!, $url: String!) {
    block(channel: $channel, url: $url)
  }
`

export const UNBLOCK = gql`
  mutation Unblock($channel: String!, $url: String!) {
    unblock(channel: $channel, url: $url)
  }
`

export const FOLLOW = gql`
  mutation Follow($channel: String!, $url: String!) {
    follow(channel: $channel, url: $url)
  }
`

export const UNFOLLOW = gql`
  mutation Unfollow($channel: String!, $url: String!) {
    unfollow(channel: $channel, url: $url)
  }
`

export const MICROPUB_CREATE = gql`
  mutation MicropubCreate($json: String!) {
    micropubCreate(json: $json)
  }
`
