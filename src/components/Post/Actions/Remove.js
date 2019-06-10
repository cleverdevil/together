import React from 'react'
import RemoveIcon from '@material-ui/icons/Delete'
import BaseAction from './Base'
import { useSnackbar } from 'notistack'
import { useMutation } from 'react-apollo-hooks'
import { REMOVE_POST, GET_TIMELINE } from '../../../queries'

const ActionRemove = ({ _id, channel, menuItem }) => {
  const { enqueueSnackbar } = useSnackbar()

  const removePost = useMutation(REMOVE_POST, {
    variables: { channel, post: _id },
    optimisticResponse: {
      __typename: 'Mutation',
      removePost: {
        _id,
        __typename: 'Post',
      },
    },
    update: (proxy, _) => {
      // Read the data from our cache for this query.
      const data = proxy.readQuery({
        query: GET_TIMELINE,
        variables: { channel },
      })
      // Find and remove the post
      data.timeline.items = data.timeline.items.filter(post => post._id !== _id)
      // Write our data back to the cache.
      proxy.writeQuery({ query: GET_TIMELINE, variables: { channel }, data })
    },
  })

  const handleRemove = async e => {
    try {
      await removePost()
      enqueueSnackbar('Post removed', { variant: 'success' })
    } catch (err) {
      console.error('Error removing post', err)
      enqueueSnackbar('Error removing post', { variant: 'error' })
    }
  }

  return (
    <BaseAction
      title={'Remove from channel'}
      onClick={handleRemove}
      icon={<RemoveIcon />}
      menuItem={menuItem}
    />
  )
}

export default ActionRemove
