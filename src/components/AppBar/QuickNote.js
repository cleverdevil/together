import React, { useState, Fragment } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { useSnackbar } from 'notistack'
import { withStyles } from '@material-ui/core/styles'
import { Popover, IconButton, Tooltip } from '@material-ui/core'
import NoteIcon from '@material-ui/icons/Edit'
import useUser from '../../hooks/use-user'
import MicropubForm from '../MicropubForm'
import styles from './style'
import SnackbarLinkAction from '../SnackbarLinkAction'
import { MICROPUB_CREATE } from '../../queries'

const QuickNote = ({ classes }) => {
  const { user } = useUser()
  const [popoverAnchor, setPopoverAnchor] = useState(null)
  const { enqueueSnackbar } = useSnackbar()
  const createNote = useMutation(MICROPUB_CREATE)

  const supportsMicropub = user && user.hasMicropub
  if (!supportsMicropub) {
    return null
  }

  const handleSubmit = async mf2 => {
    try {
      const {
        data: { micropubCreate: postUrl },
      } = await createNote({
        variables: {
          json: JSON.stringify(mf2),
        },
      })
      enqueueSnackbar('Posted note', {
        variant: 'success',
        action: [<SnackbarLinkAction url={postUrl} />],
      })
    } catch (err) {
      console.error('Error posting note', err)
      enqueueSnackbar('Error posting note', { variant: 'error' })
    }
    setPopoverAnchor(null)
  }

  let defaultProperties = {}
  if (user && user.settings.noteSyndication.length) {
    defaultProperties['mp-syndicate-to'] = user.settings.noteSyndication
  }

  return (
    <Fragment>
      <Tooltip title="New post" placement="bottom">
        <IconButton
          aria-label="New post"
          onClick={e => setPopoverAnchor(e.target)}
          className={classes.menuAction}
        >
          <NoteIcon />
        </IconButton>
      </Tooltip>
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
            properties={defaultProperties}
            onSubmit={handleSubmit}
            onClose={() => setPopoverAnchor(null)}
          />
        </div>
      </Popover>
    </Fragment>
  )
}

export default withStyles(styles)(QuickNote)
