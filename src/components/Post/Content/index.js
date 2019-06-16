import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import ExpandIcon from '@material-ui/icons/ExpandMore'
import CollapseIcon from '@material-ui/icons/ExpandLess'
import TruncatedContentLoader from './TruncatedContentLoader'
import style from './style'

const TogetherCardContent = ({ classes, post, expandable = false }) => {
  const [expanded, setExpanded] = useState(false)

  const isExpandable = () => {
    let contentLength = 0
    if (post.content && post.content.text) {
      contentLength = post.content.text.length
    } else if (post.content && post.content.html) {
      contentLength = post.content.html.length
    }
    if (contentLength > 300) {
      return expandable
    }
    return false
  }

  const getContent = () => {
    if (post.summary && !post.content) {
      return {
        component: 'p',
        content: post.summary,
      }
    }

    if (post.content && post.content.html) {
      return {
        component: 'div',
        content: post.content.html,
      }
    }

    if (post.content && post.content.text) {
      return {
        component: 'p',
        content: post.content.text,
      }
    }

    return null
  }

  const content = getContent()

  return (
    <CardContent>
      {!!post.name && (
        <Typography
          variant="h5"
          component="h2"
          dangerouslySetInnerHTML={{ __html: post.name }}
        />
      )}

      {!!content && (
        <Collapse
          in={!expandable || expanded}
          collapsedHeight={expandable ? '5em' : null}
        >
          <Typography
            className={classes.content}
            component={content.component}
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
          <TruncatedContentLoader post={post} />
        </Collapse>
      )}

      {isExpandable() && (
        <Fragment>
          <Divider className={classes.divider} />
          <Button
            size="small"
            variant="text"
            fullWidth={true}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Collapse' : 'Show Content'}
            {expanded ? <CollapseIcon /> : <ExpandIcon />}
          </Button>
        </Fragment>
      )}
    </CardContent>
  )
}
export default withStyles(style)(TogetherCardContent)
