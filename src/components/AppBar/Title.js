import React, { Fragment } from 'react'
import { Typography } from '@material-ui/core'
import Meta from '../Meta'

const AppBarTitle = ({ className }) => {
  let title = 'Together'
  let metaTitle = ''
  // if (currentChannel) {
  //   metaTitle = currentChannel.name
  //   if (currentChannel.unread) {
  //     metaTitle += ` (${currentChannel.unread})`
  //   }
  // }
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
