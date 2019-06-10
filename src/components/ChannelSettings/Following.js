import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { GET_FOLLOWING, UNFOLLOW } from '../../queries'
import { withStyles } from '@material-ui/core/styles'
import {
  FormLabel,
  FormControl,
  FormGroup,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  CircularProgress,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
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
    <div>
      <FormControl component="fieldset" className={classes.fieldset}>
        <FormLabel component="legend">Following</FormLabel>
        <FormGroup>
          {!!loading && <CircularProgress />}
          {!!following && (
            <List className={classes.following}>
              {following.map(item => (
                <ListItem key={`list-following-${item.url}`}>
                  <ListItemText
                    className={classes.followingUrl}
                    primary={`${item.url} (${item.type})`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label={`Unfollow ${item.url}`}
                      onClick={() => unfollow(item.url)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </FormGroup>
      </FormControl>
    </div>
  )
}

ChannelFollowing.propTypes = {
  channel: PropTypes.string,
}

export default withStyles(styles)(ChannelFollowing)
