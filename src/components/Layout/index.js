import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, LinearProgress } from '@material-ui/core'
import useReactRouter from 'use-react-router'
import { useQuery } from 'react-apollo-hooks'
import { GET_TIMELINE, GET_CHANNELS } from '../../queries'
import AddFeed from '../AddFeed'
import Gallery from './Gallery'
import Map from './Map'
import Classic from './Classic'
import Timeline from './Timeline'
import layouts from '../../modules/layouts'
import styles from './style'

const Layout = ({ classes }) => {
  // Get a bunch of data - posts and channel
  const { match } = useReactRouter()
  const selectedChannel = decodeURIComponent(match.params.channelSlug)
  const { data, networkStatus, fetchMore, loading } = useQuery(GET_TIMELINE, {
    variables: { channel: selectedChannel },
    pollInterval: 60 * 1000,
    notifyOnNetworkStatusChange: true,
  })
  const channelQuery = useQuery(GET_CHANNELS)
  const channel = (channelQuery.data.channels || []).find(
    c => c.uid === selectedChannel
  )

  const loadMore = () =>
    fetchMore({
      query: GET_TIMELINE,
      variables: { channel: selectedChannel, after: data.timeline.after },
      updateQuery: (previousResult, { fetchMoreResult }) => ({
        timeline: {
          channel: fetchMoreResult.timeline.channel,
          after: fetchMoreResult.timeline.after,
          before: previousResult.timeline.before,
          items: [
            ...previousResult.timeline.items,
            ...fetchMoreResult.timeline.items,
          ],
          __typename: previousResult.timeline.__typename,
        },
      }),
    })

  // Use the correct component for the channel view
  const layout = channel && channel._t_layout ? channel._t_layout : 'timeline'
  const viewFilter = layouts.find(l => l.id === layout).filter
  let View = () => null
  switch (layout) {
    case 'gallery':
      View = Gallery
      break
    case 'classic':
      View = Classic
      break
    case 'map':
      View = Map
      break
    default:
      View = Timeline
      break
  }

  const isEmpty = !(
    data &&
    data.timeline &&
    data.timeline.items &&
    data.timeline.items.length
  )

  return (
    <div style={{ height: '100%' }}>
      {networkStatus && networkStatus < 7 && (
        <LinearProgress className={classes.loading} />
      )}

      {isEmpty ? (
        <div className={classes.noPosts}>
          <Typography variant="h5" component="h2">
            <span role="img" aria-label="">
              🤷‍
            </span>{' '}
            Nothing to show
          </Typography>
          <Typography component="p">
            Maybe you need to subscribe to a site or select a different channel
          </Typography>
        </div>
      ) : (
        <View
          posts={data.timeline.items.filter(viewFilter)}
          channel={channel}
          loadMore={loadMore}
        />
      )}

      <AddFeed />
    </div>
  )
}

export default withStyles(styles)(Layout)
