import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import { useSnackbar } from 'notistack'
import RepostIcon from '@material-ui/icons/Repeat'
import useUser from '../../../hooks/use-user'
import BaseAction from './Base'
import SnackbarLinkAction from '../../SnackbarLinkAction'
import { MICROPUB_CREATE } from '../../../queries'

const ActionRepost = ({ url, menuItem }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useUser()
  let mf2 = {
    type: ['h-entry'],
    properties: {
      'repost-of': [url],
    },
  }
  if (user && user.settings.repostSyndication.length) {
    mf2.properties['mp-syndicate-to'] = user.settings.repostSyndication
  }
  const createRepost = useMutation(MICROPUB_CREATE, {
    variables: {
      json: JSON.stringify(mf2),
    },
  })

  const onClick = async e => {
    try {
      const {
        data: { micropubCreate: postUrl },
      } = await createRepost()
      enqueueSnackbar('Successfully reposted', {
        variant: 'success',
        action: [<SnackbarLinkAction url={postUrl} />],
      })
    } catch (err) {
      console.error('Error reposting', err)
      enqueueSnackbar('Error reposting', { variant: 'errpr' })
    }
  }
  return (
    <BaseAction
      title="Repost"
      onClick={onClick}
      icon={<RepostIcon />}
      menuItem={menuItem}
    />
  )
}

export default ActionRepost
