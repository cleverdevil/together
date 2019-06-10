import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { GET_MUTED, UNMUTE } from '../../queries'
import { withStyles } from '@material-ui/core/styles'
import {
  ListSubheader,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@material-ui/core'
import ChannelSettingUrl from './ChannelSettingUrl'
import styles from './style'

const ChannelMuted = ({ classes, channel }) => {
  const {
    data: { muted },
    loading,
    error,
    refetch,
  } = useQuery(GET_MUTED, {
    variables: { channel },
  })

  useEffect(() => {
    if (!loading && refetch) {
      refetch()
    }
  }, [])

  const unmuteMutation = useMutation(UNMUTE)

  const unmute = url =>
    unmuteMutation({
      variables: { channel, url },
      optimisticResponse: {
        __typename: 'Mutation',
        mute: true,
      },
      update: (proxy, _) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({
          query: GET_MUTED,
          variables: { channel },
        })
        // Find and remove posts with the given author url
        data.muted = data.muted.filter(item => item.url !== url)
        // Write our data back to the cache.
        proxy.writeQuery({ query: GET_MUTED, variables: { channel }, data })
      },
    })

  return (
    <>
      <ListSubheader>Muted</ListSubheader>

      {!!loading && (
        <ListItem>
          <LinearProgress style={{ width: '100%' }} />
        </ListItem>
      )}

      {!!muted &&
        muted.map(item => (
          <ChannelSettingUrl
            {...item}
            key={`list-muted-${item.url}`}
            onRemove={() => unmute(item.url)}
            onRemoveLabel={`Unmute ${item.url}`}
          />
        ))}

      {!loading && (!muted || muted.length === 0) && (
        <ListItem>
          <ListItemText>No muted urls in this channel</ListItemText>
        </ListItem>
      )}
    </>
  )
}

ChannelMuted.propTypes = {
  channel: PropTypes.string,
}

export default withStyles(styles)(ChannelMuted)
