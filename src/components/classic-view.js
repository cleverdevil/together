import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ReactList from 'react-list';
import CompressedPost from './compressed-post';
import TogetherCard from './card';
import { decrementChannelUnread, updatePost } from '../actions';
import { posts as postsService } from '../modules/feathers-services';
import getChannelSetting from '../modules/get-channel-setting';
import channelSettings from './channel-settings';

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
    width: '100%',
    overflow: 'auto',
    borderRight: '1px solid ' + theme.palette.divider,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      width: 250,
    },
    [theme.breakpoints.up('md')]: {
      width: 300,
    },
    [theme.breakpoints.up('lg')]: {
      width: 400,
    },
  },
  postColumn: {
    flexGrow: 1,
    // overflow: 'auto',
    position: 'absolute',
    width: '100%',
    height: '100%',
    // iOS hack thing
    overflowY: 'scroll',
    '-webkit-overflow-scrolling': 'touch',
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
    this.handleScroll = this.handleScroll.bind(this);
    this.handlePostSelect = this.handlePostSelect.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderLoadMore = this.renderLoadMore.bind(this);
  }

  handleScroll() {
    const infiniteScrollEnabled = getChannelSetting(
      this.props.selectedChannel,
      'infiniteScroll',
      this.props.channelSettings,
    );
    if (infiniteScrollEnabled) {
      const [
        firstVisibleIndex,
        lastVisibleIndex,
      ] = this.infiniteScroll.getVisibleRange();
      if (lastVisibleIndex >= this.props.posts.length - 1) {
        this.props.loadMore();
      }
    }
  }

  handlePostSelect(post) {
    const read = post._is_read;
    post._is_read = true;
    this.setState({ post: post });
    // Mark the post as read
    if (!read) {
      postsService
        .update(post._id, {
          channel: this.props.selectedChannel,
          method: 'mark_read',
        })
        .then(res => {
          this.props.updatePost(post._id, '_is_read', true);
          this.props.decrementChannelUnread(this.props.selectedChannel);
        })
        .catch(err => {
          console.log('Error marking post read', err);
        });
    }
  }

  renderItem(index, key) {
    return (
      <CompressedPost
        key={key}
        post={this.props.posts[index]}
        onClick={() => this.handlePostSelect(this.props.posts[index])}
      />
    );
  }

  renderLoadMore() {
    const infiniteScrollEnabled = getChannelSetting(
      this.props.selectedChannel,
      'infiniteScroll',
      this.props.channelSettings,
    );

    if (infiniteScrollEnabled) {
      return null;
    }
    if (this.props.loadMore) {
      return (
        <Button
          className={this.props.classes.loadMore}
          onClick={this.props.loadMore}
        >
          Load More
        </Button>
      );
    }
    return null;
  }

  render() {
    return (
      <div className={this.props.classes.wrapper}>
        <List
          className={this.props.classes.previewColumn}
          onScroll={this.handleScroll}
        >
          <ReactList
            itemRenderer={this.renderItem}
            length={this.props.posts.length}
            type="variable"
            ref={el => {
              this.infiniteScroll = el;
            }}
          />
          {this.renderLoadMore()}
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
    channelSettings: state.settings.get('channels'),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(ClassicView));
