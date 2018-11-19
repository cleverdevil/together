import React, { Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import LikeIcon from '@material-ui/icons/ThumbUp'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import ReplyIcon from '@material-ui/icons/Reply'
import RepostIcon from '@material-ui/icons/Repeat'
import QuoteIcon from '@material-ui/icons/FormatQuote'
import Post from '../index'
import style from './style'

const TogetherCardReplyContext = ({ type, url, reference, classes }) => {
  let icon = null
  switch (type) {
    case 'reply':
      icon = <ReplyIcon className={classes.icon} />
      break
    case 'like':
      icon = <LikeIcon className={classes.icon} />
      break
    case 'repost':
      icon = <RepostIcon className={classes.icon} />
      break
    case 'bookmark':
      icon = <BookmarkIcon className={classes.icon} />
      break
    case 'quotation':
      icon = <QuoteIcon className={classes.icon} />
      break
    default:
      icon = null
      break
  }
  return (
    <Fragment>
      <CardContent className={classes.replyContext}>
        <Typography component="p">
          {icon}
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </Typography>
      </CardContent>
      {reference && (
        <CardContent>
          <Post
            post={reference}
            shownActions={['view', 'reply', 'repost', 'like', 'consoleLog']}
          />
        </CardContent>
      )}
    </Fragment>
  )
}
export default withStyles(style)(TogetherCardReplyContext)
