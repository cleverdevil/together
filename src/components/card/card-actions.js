import React, { Fragment, Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ActionLike from './card-actions/like';
import ActionRepost from './card-actions/repost';
import ActionReply from './card-actions/reply';
import ActionConsoleLog from './card-actions/console-log';
import ActionView from './card-actions/view';
import ActionMarkRead from './card-actions/mark-read';
import ActionRemove from './card-actions/remove';
import ActionMute from './card-actions/mute';
import ActionBlock from './card-actions/block';

const style = theme => ({
  actions: {
    display: 'flex',
  },
  moreButton: {
    marginLeft: 'auto',
  },
});

class TogetherCardActions extends Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { post, channel, shownActions, classes } = this.props;
    return (
      <Fragment>
        <CardActions className={classes.actions}>
          {post.url && shownActions.includes('like') && (
            <ActionLike url={post.url} />
          )}
          {post.url && shownActions.includes('repost') && (
            <ActionRepost url={post.url} />
          )}
          {post.url && shownActions.includes('reply') && (
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
    );
  }
}

export default withStyles(style)(TogetherCardActions);
