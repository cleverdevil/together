import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MoreVertIcon from '@material-ui/icons/MoreVert'
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

class TogetherCardActions extends Component {
  state = {
    anchorEl: null,
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const { anchorEl } = this.state
    const {
      post,
      channel,
      shownActions,
      micropubEndpoint,
      classes,
    } = this.props
    return (
      <Fragment>
        <CardActions className={classes.actions}>
          {micropubEndpoint && post.url && shownActions.includes('like') && (
            <ActionLike url={post.url} />
          )}
          {micropubEndpoint && post.url && shownActions.includes('repost') && (
            <ActionRepost url={post.url} />
          )}
          {micropubEndpoint && post.url && shownActions.includes('reply') && (
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
            onClick={this.handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            {shownActions.includes('consoleLog') && (
              <ActionConsoleLog post={post} menuItem />
            )}
            {post._id && shownActions.includes('remove') && (
              <ActionRemove _id={post._id} channel={channel} menuItem />
            )}
            {post.author && post.author.url && (
              <ActionMute
                _id={post._id}
                url={post.author.url}
                channel={channel}
                menuItem
              />
            )}
            {post.author && post.author.url && (
              <ActionBlock
                _id={post._id}
                url={post.author.url}
                channel={channel}
                menuItem
              />
            )}
          </Menu>
        </CardActions>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  micropubEndpoint: state.settings.get('micropubEndpoint'),
})

export default connect(mapStateToProps)(withStyles(style)(TogetherCardActions))
