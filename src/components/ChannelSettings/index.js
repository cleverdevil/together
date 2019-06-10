import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import useReactRouter from 'use-react-router'
import { useSnackbar } from 'notistack'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { GET_CHANNELS, UPDATE_CHANNEL, REMOVE_CHANNEL } from '../../queries'
import { withStyles } from '@material-ui/core/styles'
import {
  Switch,
  TextField,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction,
  Select,
  MenuItem,
} from '@material-ui/core'
import SettingsModal from '../SettingsModal'
import Following from './Following'
import Blocked from './Blocked'
import Muted from './Muted'
import layouts from '../../modules/layouts'
import styles from './style'

const ChannelSettings = ({ classes }) => {
  const { enqueueSnackbar } = useSnackbar()
  const {
    history,
    match: {
      params: { channelSlug },
    },
  } = useReactRouter()
  const {
    data: { channels },
    loading,
    error,
  } = useQuery(GET_CHANNELS)
  const channelUid = decodeURIComponent(channelSlug)
  const [channel, setChannel] = useState(
    channels ? channels.find(c => c.uid === channelUid) : {}
  )

  useEffect(() => {
    setChannel(channels ? channels.find(c => c.uid === channelUid) : {})
  }, [channels])

  const updateChannel = useMutation(UPDATE_CHANNEL)
  const removeChannel = useMutation(REMOVE_CHANNEL, {
    variables: { channel: channel.uid },
    update: (proxy, _) => {
      const data = proxy.readQuery({
        query: GET_CHANNELS,
      })
      // Update our channel in the channels array
      data.channels = data.channels.filter(
        channel => channel.uid !== channelUid
      )
      // Write our data back to the cache.
      proxy.writeQuery({ query: GET_CHANNELS, data })
    },
  })

  const handleClose = () => {
    if (history) {
      history.push('/channel/' + channelSlug)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this channel?')) {
      const { error } = await removeChannel()
      if (error) {
        console.error('[Error deleting channel]', error)
        enqueueSnackbar('Error deleting channel', { variant: 'error' })
      } else {
        enqueueSnackbar('Channel deleted', { variant: 'success' })
        history.push('/')
      }
    }
  }

  const handleUpdate = (key, value) => {
    const optimisticChannel = Object.assign({}, channel, { [key]: value })
    setChannel(optimisticChannel)
    updateChannel({
      variables: Object.assign({}, channel, {
        [key]: value,
      }),
      optimisticResponse: {
        __typename: 'Mutation',
        updateChannel: {
          ...optimisticChannel,
          __typename: 'Channel',
        },
      },
      update: (proxy, _) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({
          query: GET_CHANNELS,
        })
        // Update our channel in the channels array
        data.channels = data.channels.map(channel =>
          channel.uid === channelUid ? optimisticChannel : channel
        )
        // Write our data back to the cache.
        proxy.writeQuery({ query: GET_CHANNELS, data })
      },
    })
  }

  return (
    <SettingsModal
      singleColumn
      title={loading ? 'Loading...' : `${channel.name} Settings`}
      onClose={handleClose}
    >
      <List className={classes.list}>
        <ListSubheader>Channel Options</ListSubheader>
        {loading ? (
          <ListItem>
            <LinearProgress style={{ width: '100%' }} />
          </ListItem>
        ) : (
          <>
            <ListItem>
              <ListItemText>Name</ListItemText>
              <TextField
                value={channel.name}
                onChange={e => handleUpdate('name', e.target.value)}
                margin="none"
                type="text"
              />
            </ListItem>

            <ListItem>
              <ListItemText>Layout</ListItemText>
              <Select
                value={channel._t_layout}
                onChange={e => handleUpdate('_t_layout', e.target.value)}
                margin="none"
              >
                {layouts.map(layout => (
                  <MenuItem value={layout.id}>{layout.name}</MenuItem>
                ))}
              </Select>
            </ListItem>

            <ListItem
              button
              onClick={e =>
                handleUpdate('_t_infiniteScroll', !channel._t_infiniteScroll)
              }
            >
              <ListItemText>Infinite Scroll</ListItemText>
              <ListItemSecondaryAction>
                <Switch
                  checked={!!channel._t_infiniteScroll}
                  value="infiniteScrollChecked"
                  onChange={e =>
                    handleUpdate(
                      '_t_infiniteScroll',
                      !channel._t_infiniteScroll
                    )
                  }
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem
              button
              onClick={e => handleUpdate('_t_autoRead', !!!channel._t_autoRead)}
            >
              <ListItemText>Auto Mark as Read</ListItemText>
              <ListItemSecondaryAction>
                <Switch
                  checked={!!channel._t_autoRead}
                  value="autoReadChecked"
                  onChange={e =>
                    handleUpdate('_t_autoRead', !!!channel._t_autoRead)
                  }
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={handleDelete}
                  className={classes.delete}
                >
                  Delete Channel
                </Button>
              </ListItemText>
            </ListItem>
          </>
        )}
        <Following channel={channelUid} />
        <Blocked channel={channelUid} />
        <Muted channel={channelUid} />
      </List>
    </SettingsModal>
  )
}

ChannelSettings.defaultProps = {
  channels: [],
}

ChannelSettings.propTypes = {
  channels: PropTypes.array.isRequired,
}

export default withStyles(styles)(ChannelSettings)
