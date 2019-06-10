import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { GET_BLOCKED, UNBLOCK } from '../../queries'
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

const ChannelBlocked = ({ classes, channel }) => {
  const {
    data: { blocked },
    loading,
    error,
    refetch,
  } = useQuery(GET_BLOCKED, {
    variables: { channel },
  })

  useEffect(() => {
    if (!loading && refetch) {
      refetch()
    }
  }, [])

  const unblockMutation = useMutation(UNBLOCK)

  const unblock = url =>
    unblockMutation({
      variables: { channel, url },
      optimisticResponse: {
        __typename: 'Mutation',
        mute: true,
      },
      update: (proxy, _) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({
          query: GET_BLOCKED,
          variables: { channel },
        })
        // Find and remove posts with the given author url
        data.blocked = data.blocked.filter(item => item.url !== url)
        // Write our data back to the cache.
        proxy.writeQuery({ query: GET_BLOCKED, variables: { channel }, data })
      },
    })

  return (
    <div>
      <FormControl component="fieldset" className={classes.fieldset}>
        <FormLabel component="legend">Blocked</FormLabel>
        <FormGroup>
          {!!loading && <CircularProgress />}
          {!!blocked && (
            <List className={classes.blocked}>
              {blocked.map(item => (
                <ListItem key={`list-blocked-${item.url}`}>
                  <ListItemText
                    className={classes.blockedUrl}
                    primary={`${item.url} (${item.type})`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label={`Unblock ${item.url}`}
                      onClick={() => unblock(item.url)}
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

ChannelBlocked.propTypes = {
  channel: PropTypes.string,
}

export default withStyles(styles)(ChannelBlocked)
