import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { GET_FOLLOWING, UNFOLLOW } from '../../queries'
import { withStyles } from '@material-ui/core/styles'
import {
  ListSubheader,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@material-ui/core'
import ChannelSettingUrl from './ChannelSettingUrl'
import styles from './style'

const ChannelFollowing = ({ classes, channel }) => {
  const {
    data: { following },
    loading,
    error,
    refetch,
  } = useQuery(GET_FOLLOWING, {
    variables: { channel },
  })

  useEffect(() => {
    if (!loading && refetch) {
      refetch()
    }
  }, [])

  const unfollowMutation = useMutation(UNFOLLOW)

  const unfollow = url =>
    unfollowMutation({
      variables: { channel, url },
      optimisticResponse: {
        __typename: 'Mutation',
        mute: true,
      },
      update: (proxy, _) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({
          query: GET_FOLLOWING,
          variables: { channel },
        })
        // Find and remove posts with the given author url
        data.following = data.following.filter(item => item.url !== url)
        // Write our data back to the cache.
        proxy.writeQuery({ query: GET_FOLLOWING, variables: { channel }, data })
      },
    })

  return (
    <>
      <ListSubheader>Following</ListSubheader>

      {!!loading && (
        <ListItem>
          <LinearProgress style={{ width: '100%' }} />
        </ListItem>
      )}

      {!!following &&
        following.map(item => (
          <ChannelSettingUrl
            {...item}
            key={`list-following-${item.url}`}
            onRemove={() => unfollow(item.url)}
            onRemoveLabel={`Unfollow ${item.url}`}
          />
        ))}

      {!loading && (!following || following.length === 0) && (
        <ListItem>
          <ListItemText>
            You are not following anything at the moment
          </ListItemText>
        </ListItem>
      )}
    </>
  )
}

ChannelFollowing.propTypes = {
  channel: PropTypes.string,
}

export default withStyles(styles)(ChannelFollowing)
