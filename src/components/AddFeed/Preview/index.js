import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { useQuery, useMutation } from 'react-apollo-hooks'
import useReactRouter from 'use-react-router'
import {
  Button,
  ListItem,
  ListItemText,
  Avatar,
  CircularProgress,
} from '@material-ui/core'
import Post from '../../Post'
import { PREVIEW, FOLLOW } from '../../../queries'
import styles from '../style'

const Preview = ({ classes, url, setActions, handleClose }) => {
  const [hasSetActions, setHasSetActions] = useState(false)

  const {
    match: {
      params: { channelSlug },
    },
  } = useReactRouter()

  const {
    data: { preview: items },
    loading,
    error,
  } = useQuery(PREVIEW, { variables: { url } })

  const channel = channelSlug ? decodeURIComponent(channelSlug) : null
  const follow = useMutation(FOLLOW, {
    variables: {
      channel,
      url,
    },
  })

  const handleFollow = async () => {
    try {
      const res = await follow()
      handleClose()
      setActions(null)
    } catch (err) {
      console.log('[Error following]', err)
    }
  }

  if (loading) {
    return (
      <ListItem>
        <ListItemText primary="Loading preview..." />
        <CircularProgress />
      </ListItem>
    )
  }

  if (!hasSetActions && setActions) {
    setHasSetActions(true)
    setActions([
      <Button size="small" color="secondary" onClick={handleFollow}>
        Follow
      </Button>,
      <Button
        size="small"
        onClick={e => {
          setActions(null)
          handleClose()
        }}
      >
        Close Preview
      </Button>,
    ])
  }

  if (!items || !items.length) {
    return (
      <ListItem>
        <ListItemText
          primary="Not found"
          secondary="No preview items were returned"
        />
      </ListItem>
    )
  }

  return (
    <ListItem className={classes.preview}>
      {Array.isArray(items) &&
        items.map((item, i) => (
          <Post
            post={item}
            style={{ boxShadow: 'none' }}
            key={`search-preview-${i}`}
          />
        ))}
    </ListItem>
  )
}

Preview.propTypes = {
  url: PropTypes.string.isRequired,
}

export default withStyles(styles)(Preview)
