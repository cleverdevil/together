import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo-hooks'
import useReactRouter from 'use-react-router'
import { useSnackbar } from 'notistack'
import { ListItem, ListItemText, TextField, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { ADD_CHANNEL, GET_CHANNELS } from '../../queries'

const NewChannelForm = ({ classes }) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const { history } = useReactRouter()
  const { enqueueSnackbar } = useSnackbar()

  const addChannel = useMutation(ADD_CHANNEL)

  const handleAddChannel = async e => {
    e.preventDefault()
    const {
      error,
      data: { addChannel: channel },
    } = await addChannel({
      variables: { name },
      update: (proxy, { data: { addChannel: channel } }) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({
          query: GET_CHANNELS,
        })
        // Add the new channel to the cache
        data.channels.unshift(channel)
        // Write our data back to the cache.
        proxy.writeQuery({ query: GET_CHANNELS, data })
      },
    })
    if (error) {
      console.error('[Error adding channel]', error)
      enqueueSnackbar('Error adding channel', { variant: 'error' })
    } else if (channel) {
      enqueueSnackbar(`Added channel ${channel.name}`, { variant: 'success' })
      setName('')
      history.push(`/channel/${channel._t_slug}`)
    }
    setOpen(false)
    return false
  }

  if (!open) {
    return (
      <ListItem onClick={() => setOpen(true)} button>
        <ListItemText
          title="Add New Channel"
          classes={{ primary: classes.addButton }}
          primary={<AddIcon />}
        />
      </ListItem>
    )
  }

  return (
    <form className={classes.addForm} onSubmit={handleAddChannel}>
      <TextField
        fullWidth={true}
        label="New Channel Name"
        required={true}
        autoFocus={true}
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Button
        style={{ width: '100%' }}
        type="submit"
        variant="text"
        color="secondary"
      >
        Add Channel
      </Button>
    </form>
  )
}

NewChannelForm.defaultProps = {}

NewChannelForm.propTypes = {
  classes: PropTypes.object,
}

export default NewChannelForm
