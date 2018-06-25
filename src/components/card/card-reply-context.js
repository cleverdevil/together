import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LikeIcon from '@material-ui/icons/ThumbUp';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import ReplyIcon from '@material-ui/icons/Reply';
import RepostIcon from '@material-ui/icons/Repeat';
import TogetherCard from './index';

const style = theme => ({
  replyContext: {
    background: theme.palette.action.disabledBackground,
  },
  icon: {
    marginRight: 10,
    marginBottom: -5,
    width: 18,
    height: 18,
  },
});

const TogetherCardReplyContext = ({ type, url, reference, classes }) => {
  let icon = null;
  switch (type) {
    case 'reply':
      icon = <ReplyIcon className={classes.icon} />;
      break;
    case 'like':
      icon = <LikeIcon className={classes.icon} />;
      break;
    case 'repost':
      icon = <RepostIcon className={classes.icon} />;
      break;
    case 'bookmark':
      icon = <BookmarkIcon className={classes.icon} />;
      break;
  }
  return (
    <React.Fragment>
      <CardContent className={classes.replyContext}>
        <Typography component="p">
          {icon}
          <a href={url} target="_blank">
            {url}
          </a>
        </Typography>
      </CardContent>
      {reference && (
        <CardContent>
          <TogetherCard
            post={reference}
            shownActions={['view', 'reply', 'repost', 'like', 'consoleLog']}
          />
        </CardContent>
      )}
    </React.Fragment>
  );
};
export default withStyles(style)(TogetherCardReplyContext);
