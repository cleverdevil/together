import React, { Fragment } from 'react'
import { Typography } from '@material-ui/core'
import useCurrentChannel from '../../hooks/use-current-channel'
import Meta from '../Meta'

const AppBarTitle = ({ className }) => {
  const channel = useCurrentChannel()
  let title = 'Together'
  let metaTitle = ''
  if (channel.name) {
    metaTitle = channel.name
    if (channel.unread) {
      metaTitle += ` (${channel.unread})`
    }
  }
  if (metaTitle) {
    title = metaTitle
  }

  return (
    <Fragment>
      <Meta title={metaTitle} />

      <Typography
        component="h1"
        variant="h6"
        color="inherit"
        className={className}
      >
        {title}
      </Typography>
    </Fragment>
  )
}

export default AppBarTitle
