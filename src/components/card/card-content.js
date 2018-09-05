import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import CollapseIcon from '@material-ui/icons/ExpandLess';

const style = theme => ({
  content: {
    '& img': {
      maxWidth: '100%',
      height: 'auto',
    },
    '& blockquote': {
      borderLeft: '4px solid ' + theme.palette.primary.main,
      paddingLeft: theme.spacing.unit * 2,
      marginLeft: theme.spacing.unit * 2,
      '& blockquote': {
        marginLeft: theme.spacing.unit,
      },
    },
    // Emoji images'
    '& img[src^="https://s.w.org/images/core/emoji"]': {
      width: '1em',
    },
  },
  divider: {
    marginBottom: theme.spacing.unit,
  },
});

class TogetherCardContent extends React.Component {
  constructor(props) {
    super(props);
    const { post, expandable } = props;
    let contentLength = 0;
    if (post.content && post.content.text) {
      contentLength = post.content.text.length;
    } else if (post.content && post.content.html) {
      contentLength = post.content.html.length;
    }

    this.state = {
      expandable:
        typeof props.expandable !== 'undefined'
          ? props.expandable && contentLength > 300
          : contentLength > 300,
      expanded: false,
    };

    this.toggleExpand = this.toggleExpand.bind(this);
  }

  toggleExpand() {
    this.setState(state => ({ expanded: !state.expanded }));
  }

  render() {
    const { post, classes } = this.props;
    const { expandable, expanded } = this.state;

    return (
      <CardContent>
        {post.name && (
          <Typography
            variant="headline"
            component="h2"
            dangerouslySetInnerHTML={{ __html: post.name }}
          />
        )}

        {post.summary &&
          !post.content && (
            <Typography
              component="p"
              dangerouslySetInnerHTML={{ __html: post.summary }}
            />
          )}

        <Collapse
          in={!expandable || expanded}
          collapsedHeight={expandable ? '5em' : null}
        >
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
        </Collapse>

        {expandable && (
          <React.Fragment>
            <Divider className={classes.divider} />
            <Button
              size="small"
              variant="text"
              fullWidth={true}
              onClick={this.toggleExpand}
            >
              {expanded ? 'Collapse' : 'Show Content'}
              {expanded ? <CollapseIcon /> : <ExpandIcon />}
            </Button>
          </React.Fragment>
        )}
      </CardContent>
    );
  }
}
export default withStyles(style)(TogetherCardContent);
