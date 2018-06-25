import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';

const style = theme => ({
  content: {
    '& img': {
      maxWidth: '100%',
      height: 'auto',
    },
    '& blockquote': {
      'border-left': '4px solid ' + theme.palette.divider,
      'padding-left': '1em',
    },
  },
});

const TogetherCardContent = ({ post, expanded, classes }) => (
  <CardContent>
    {post.name && (
      <Typography
        variant="headline"
        component="h2"
        dangerouslySetInnerHTML={{ __html: post.name }}
      />
    )}
    {/* <Collapse in={expanded} timeout="auto" unmountOnExit> */}
    {post.summary &&
      !post.content && (
        <Typography
          component="p"
          dangerouslySetInnerHTML={{ __html: post.summary }}
        />
      )}
    {post.content && post.content.html ? (
      <Typography
        component="div"
        className={classes.content}
        dangerouslySetInnerHTML={{ __html: post.content.html }}
      />
    ) : post.content && post.content.text ? (
      <Typography
        component="p"
        dangerouslySetInnerHTML={{ __html: post.content.text }}
      />
    ) : null}
    {/* </Collapse> */}
  </CardContent>
);
export default withStyles(style)(TogetherCardContent);
