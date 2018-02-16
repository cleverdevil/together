import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import List, { ListItem } from 'material-ui/List';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import CompressedPost from './compressed-post';
import TogetherCard from './card';
import { decrementChannelUnread, updatePost } from '../actions';
import microsub from '../modules/microsub-api';

const styles = theme => ({
  wrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  previewColumn: {
    overflow: 'auto',
    borderRight: '1px solid ' + theme.palette.divider,
    [theme.breakpoints.up('sm')]: {
      maxWidth: 250,
    },
  },
  postColumn: {
    flexGrow: 1,
    overflow: 'auto',
    position: 'absolute',
    width: '100%',
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      position: 'relative',
    },
  },
  loadMore: {
    width: '100%',
  },
  closePost: {
    display: 'block',
    position: 'fixed',
    top: 60,
    right: 10,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
});

class ClassicView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
    };
    this.handlePostSelect = this.handlePostSelect.bind(this);
  }

  handlePostSelect(post) {
    const read = post._is_read;
    post._is_read = true;
    this.setState({ post: post });
    // Mark the post as read
    if (!read) {
      microsub('markRead', {
        params: [this.props.selectedChannel, post._id],
      })
        .then(res => {
          this.props.updatePost(post._id, '_is_read', true);
          this.props.decrementChannelUnread(this.props.selectedChannel);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  render() {
    return (
      <div className={this.props.classes.wrapper}>
        <List className={this.props.classes.previewColumn}>
          {this.props.posts.map((post, i) => (
            <CompressedPost
              key={'preview-' + i}
              post={post}
              onClick={() => this.handlePostSelect(post)}
            />
          ))}
          {this.props.timelineAfter ? (
            <ListItem>
              <Button
                onClick={this.props.loadMore}
                className={this.props.classes.loadMore}
              >
                Load More
              </Button>
            </ListItem>
          ) : null}
        </List>
        {this.state.post && (
          <div className={this.props.classes.postColumn}>
            <TogetherCard post={this.state.post} embedMode="classic" />
            <IconButton
              aria-label="Close Post"
              className={this.props.classes.closePost}
              onClick={() => this.setState({ post: null })}
            >
              <CloseIcon />
            </IconButton>
          </div>
        )}
      </div>
    );
  }
}

ClassicView.defaultProps = {
  posts: [],
};

ClassicView.propTypes = {
  posts: PropTypes.array.isRequired,
};

function mapStateToProps(state, props) {
  return {
    selectedChannel: state.app.get('selectedChannel'),
    timelineBefore: state.app.get('timelineBefore'),
    timelineAfter: state.app.get('timelineAfter'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      decrementChannelUnread: decrementChannelUnread,
      updatePost: updatePost,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(ClassicView),
);
