import React from 'react'
import MuteIcon from '@material-ui/icons/VolumeOff'
import BaseAction from './Base'
import { useMutation } from 'react-apollo-hooks'
import { useSnackbar } from 'notistack'
import { MUTE, GET_TIMELINE } from '../../../queries'

const ActionMute = ({ url, channel, menuItem }) => {
  const { enqueueSnackbar } = useSnackbar()

  const mute = useMutation(MUTE, {
    variables: { channel, url },
    optimisticResponse: {
      __typename: 'Mutation',
      mute: true,
    },
    update: (proxy, _) => {
      // Read the data from our cache for this query.
      const data = proxy.readQuery({
        query: GET_TIMELINE,
        variables: { channel },
      })
      // Find and remove posts with the given author url
      data.timeline.items = data.timeline.items.filter(
        post => post.author.url !== url
      )
      // Write our data back to the cache.
      proxy.writeQuery({ query: GET_TIMELINE, variables: { channel }, data })
    },
  })

  const handleMute = async e => {
    try {
      await mute()
      enqueueSnackbar('User muted', { variant: 'success' })
    } catch (err) {
      console.error('Error muting user', err)
      enqueueSnackbar('Error muting user', { variant: 'error' })
    }
  }

  return (
    <BaseAction
      title={'Mute user'}
      onClick={handleMute}
      icon={<MuteIcon />}
      menuItem={menuItem}
    />
  )
}

export default ActionMute
