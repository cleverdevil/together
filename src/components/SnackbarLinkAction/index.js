import React from 'react'
import { IconButton } from '@material-ui/core'
import LinkIcon from '@material-ui/icons/Link'

const SnackbarLinkAction = ({ url }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: 'inherit' }}
    >
      <IconButton style={{ color: 'inherit' }}>
        <LinkIcon />
      </IconButton>
    </a>
  )
}

export default SnackbarLinkAction
