import React, { Fragment, useState } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { useSnackbar } from 'notistack'
import ReplyIcon from '@material-ui/icons/Reply'
import Popover from '@material-ui/core/Popover'
import useUser from '../../../hooks/use-user'
import BaseAction from './Base'
import SnackbarLinkAction from '../../SnackbarLinkAction'
import MicropubForm from '../../MicropubForm'
import { MICROPUB_CREATE } from '../../../queries'

// TODO: Get reply syndication options and test
const ActionReply = ({ url, syndication, menuItem }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useUser()
  const [popoverAnchor, setPopoverAnchor] = useState(null)

  const createRepost = useMutation(MICROPUB_CREATE)

  const handleSubmit = async mf2 => {
    try {
      const {
        data: { micropubCreate: postUrl },
      } = await createRepost({
        variables: {
          json: JSON.stringify(mf2),
        },
      })
      enqueueSnackbar('Posted reply', {
        variant: 'success',
        action: [<SnackbarLinkAction url={postUrl} />],
      })
    } catch (err) {
      console.error('Error posting like', err)
      enqueueSnackbar('Error posting like', { variant: 'error' })
    }
    setPopoverAnchor(null)
  }

  let defaultProperties = { 'in-reply-to': url }
  if (user && user.settings.noteSyndication.length) {
    defaultProperties['mp-syndicate-to'] = user.settings.noteSyndication
  }

  return (
    <Fragment>
      <BaseAction
        title="Reply"
        icon={<ReplyIcon />}
        onClick={e => setPopoverAnchor(e.target)}
        menuItem={menuItem}
      />
      <Popover
        open={!!popoverAnchor}
        anchorEl={popoverAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => setPopoverAnchor(null)}
        onBackdropClick={() => setPopoverAnchor(null)}
      >
        <div
          style={{
            padding: 10,
          }}
        >
          <MicropubForm
            onSubmit={handleSubmit}
            properties={defaultProperties}
          />
        </div>
      </Popover>
    </Fragment>
  )
}

export default ActionReply
