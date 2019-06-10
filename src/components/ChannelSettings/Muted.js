import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { GET_MUTED, UNMUTE } from '../../queries'
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
    <div>
      <FormControl component="fieldset" className={classes.fieldset}>
        <FormLabel component="legend">Muted</FormLabel>
        <FormGroup>
          {!!loading && <CircularProgress />}
          {!!muted && (
            <List className={classes.muted}>
              {muted.map(item => (
                <ListItem key={`list-muted-${item.url}`}>
                  <ListItemText
                    className={classes.mutedUrl}
                    primary={`${item.url} (${item.type})`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label={`Unmute ${item.url}`}
                      onClick={() => unmute(item.url)}
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

ChannelMuted.propTypes = {
  channel: PropTypes.string,
}

export default withStyles(styles)(ChannelMuted)
