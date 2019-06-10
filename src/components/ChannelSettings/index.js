import React, { useState } from 'react'
import PropTypes from 'prop-types'
import useReactRouter from 'use-react-router'
import { useSnackbar } from 'notistack'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { GET_CHANNELS, UPDATE_CHANNEL, REMOVE_CHANNEL } from '../../queries'
import { withStyles } from '@material-ui/core/styles'
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  CircularProgress,
} from '@material-ui/core'
import SettingsModal from '../SettingsModal'
import Following from './Following'
import Blocked from './Blocked'
import Muted from './Muted'
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
      variables: {
        uid: channelUid,
        [key]: value,
      },
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
      title={loading ? 'Loading...' : `${channel.name} Settings`}
      onClose={handleClose}
    >
      {loading ? (
        <CircularProgress style={{ margin: '1rem auto' }} />
      ) : (
        <div>
          <FormControl component="fieldset" className={classes.fieldset}>
            <FormGroup>
              <TextField
                label="Name"
                value={channel.name}
                onChange={e => handleUpdate('name', e.target.value)}
                margin="normal"
                type="text"
              />

              <FormControlLabel
                label="Infinite Scroll"
                control={
                  <Switch
                    checked={channel._t_infiniteScroll}
                    value="infiniteScrollChecked"
                    onChange={e =>
                      handleUpdate(
                        '_t_infiniteScroll',
                        !channel._t_infiniteScroll
                      )
                    }
                  />
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={channel._t_autoRead}
                    value="autoReadChecked"
                    onChange={e =>
                      handleUpdate('_t_autoRead', !channel._t_autoRead)
                    }
                  />
                }
                label="Auto Mark As Read"
              />

              <Button onClick={handleDelete}>Delete Channel</Button>
            </FormGroup>
          </FormControl>
        </div>
      )}
      <Following channel={channelUid} />
      <Blocked channel={channelUid} />
      <Muted channel={channelUid} />
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
