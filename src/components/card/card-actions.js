import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classnames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ActionLike from './card-actions/like';
import ActionRepost from './card-actions/repost';
import ActionReply from './card-actions/reply';
import ActionConsoleLog from './card-actions/console-log';
import ActionView from './card-actions/view';
import ActionMarkRead from './card-actions/mark-read';

const style = theme => ({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});

const TogetherCardActions = ({ post, channel, shownActions, classes }) => {
  return (
    <React.Fragment>
      <CardActions>
        {post.url &&
          shownActions.includes('like') && <ActionLike url={post.url} />}
        {post.url &&
          shownActions.includes('repost') && <ActionRepost url={post.url} />}
        {post.url &&
          shownActions.includes('reply') && <ActionReply url={post.url} />}
        {shownActions.includes('markRead') && (
          <ActionMarkRead
            _id={post._id}
            channel={channel}
            isRead={post._is_read}
          />
        )}
        {post.url &&
          shownActions.includes('view') && <ActionView url={post.url} />}
        {shownActions.includes('consoleLog') && (
          <ActionConsoleLog post={post} />
        )}
        {/* <Tooltip title="Collapse" placement="top">
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: .state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Tooltip> */}
      </CardActions>
    </React.Fragment>
  );
};

export default withStyles(style)(TogetherCardActions);
