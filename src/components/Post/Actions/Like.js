import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import { useSnackbar } from 'notistack'
import LikeIcon from '@material-ui/icons/ThumbUp'
import useUser from '../../../hooks/use-user'
import BaseAction from './Base'
import SnackbarLinkAction from '../../SnackbarLinkAction'
import { MICROPUB_CREATE } from '../../../queries'

const ActionLike = ({ url, menuItem }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useUser()
  let mf2 = {
    type: ['h-entry'],
    properties: {
      'like-of': [url],
    },
  }
  if (user && user.settings.likeSyndication.length) {
    mf2.properties['mp-syndicate-to'] = user.settings.likeSyndication
  }
  const createLike = useMutation(MICROPUB_CREATE, {
    variables: {
      json: JSON.stringify(mf2),
    },
  })

  const onClick = async e => {
    try {
      const {
        data: { micropubCreate: postUrl },
      } = await createLike()
      enqueueSnackbar('Posted Like', {
        variant: 'success',
        action: [<SnackbarLinkAction url={postUrl} />],
      })
    } catch (err) {
      console.error('Error posting like', err)
      enqueueSnackbar('Error posting like', { variant: 'error' })
    }
  }

  return (
    <BaseAction
      title="Like"
      icon={<LikeIcon />}
      onClick={onClick}
      menuItem={menuItem}
    />
  )
}

export default ActionLike
