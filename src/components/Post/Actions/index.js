import React, { Fragment, useState } from 'react'
import useReactRouter from 'use-react-router'
import { withStyles } from '@material-ui/core/styles'
import { CardActions, IconButton, Menu } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import useUser from '../../../hooks/use-user'
import ActionLike from './Like'
import ActionRepost from './Repost'
import ActionReply from './Reply'
import ActionConsoleLog from './ConsoleLog'
import ActionView from './View'
import ActionMarkRead from './MarkRead'
import ActionRemove from './Remove'
import ActionMute from './Mute'
import ActionBlock from './Block'
import style from './style'

const TogetherCardActions = ({ post, shownActions, classes }) => {
  const { user } = useUser()
  const [anchorEl, setAnchorEl] = useState(null)
  const { match } = useReactRouter()
  const channel = decodeURIComponent(match.params.channelSlug)
  const hasMicropub = user && user.hasMicropub

  return (
    <Fragment>
      <CardActions className={classes.actions}>
        {hasMicropub && post.url && shownActions.includes('like') && (
          <ActionLike url={post.url} />
        )}
        {hasMicropub && post.url && shownActions.includes('repost') && (
          <ActionRepost url={post.url} />
        )}
        {hasMicropub && post.url && shownActions.includes('reply') && (
          <ActionReply url={post.url} />
        )}
        {shownActions.includes('markRead') && (
          <ActionMarkRead
            _id={post._id}
            channel={channel}
            isRead={post._is_read}
          />
        )}
        {post.url && shownActions.includes('view') && (
          <ActionView url={post.url} />
        )}

        <IconButton
          className={classes.moreButton}
          aria-label="More Actions"
          aria-haspopup="true"
          onClick={e => setAnchorEl(e.currentTarget)}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={e => setAnchorEl(null)}
        >
          {shownActions.includes('consoleLog') && (
            <ActionConsoleLog post={post} menuItem />
          )}
          {post._id && shownActions.includes('remove') && (
            <ActionRemove _id={post._id} channel={channel} menuItem />
          )}
          {post.author && post.author.url && (
            <ActionMute url={post.author.url} channel={channel} menuItem />
          )}
          {post.author && post.author.url && (
            <ActionBlock url={post.author.url} channel={channel} menuItem />
          )}
        </Menu>
      </CardActions>
    </Fragment>
  )
}

export default withStyles(style)(TogetherCardActions)
