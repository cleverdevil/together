import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { CardActions, IconButton, Menu } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import useUser from '../../../hooks/use-user'
import useCurrentChannel from '../../../hooks/use-current-channel'
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

const TogetherCardActions = ({
  post,
  shownActions,
  classes,
  channel = null,
}) => {
  const { user } = useUser()
  const [anchorEl, setAnchorEl] = useState(null)
  const currentChannel = useCurrentChannel()
  const hasMicropub = user && user.hasMicropub
  const channelUid = channel || currentChannel.uid

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
            channel={channelUid}
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
            <ActionRemove _id={post._id} channel={channelUid} menuItem />
          )}
          {post.author && post.author.url && (
            <ActionMute url={post.author.url} channel={channelUid} menuItem />
          )}
          {post.author && post.author.url && (
            <ActionBlock url={post.author.url} channel={channelUid} menuItem />
          )}
        </Menu>
      </CardActions>
    </Fragment>
  )
}

export default withStyles(style)(TogetherCardActions)
