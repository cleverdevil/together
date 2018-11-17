import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ReactList from 'react-list';

import Card from './card';

import { updatePost, decrementChannelUnread } from '../actions';
import getChannelSetting from '../modules/get-channel-setting';
import { posts as postsService } from '../modules/feathers-services';

const styles = theme => ({
  timeline: {
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
    overflow: 'auto',
    overscrollBehaviorY: 'contain',
    '& > div': {
      maxWidth: 600,
    },
  },
  loadMore: {
    display: 'block',
    width: '100%',
    marginTop: 40,
  },
});

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleScroll = this.handleScroll.bind(this);
    this.fillScreen = this.fillScreen.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderLoadMore = this.renderLoadMore.bind(this);
  }

  componentDidMount() {
    // Wait a little bit to see if we should load more posts
    setTimeout(this.fillScreen, 3000);
  }

  handleScroll(markRead = true) {
    if (this.infiniteScroll) {
      const infiniteScrollEnabled = getChannelSetting(
        this.props.selectedChannel,
        'infiniteScroll',
        this.props.channelSettings,
      );
      const autoReadEnabled = getChannelSetting(
        this.props.selectedChannel,
        'autoRead',
        this.props.channelSettings,
      );
      const [
        firstVisibleIndex,
        lastVisibleIndex,
      ] = this.infiniteScroll.getVisibleRange();

      if (autoReadEnabled && markRead) {
        for (let i = firstVisibleIndex; i < lastVisibleIndex; i++) {
          const post = this.props.posts[i];
          if (!post._is_read) {
            this.props.updatePost(post._id, '_is_read', true);
            postsService
              .update(post._id, {
                channel: this.props.selectedChannel,
                method: 'mark_read',
              })
              .then(res =>
                this.props.decrementChannelUnread(this.props.selectedChannel),
              )
              .catch(err => this.props.updatePost(post._id, '_is_read', false));
          }
        }
      }

      if (
        infiniteScrollEnabled &&
        lastVisibleIndex >= this.props.posts.length - 1
      ) {
        if (this.props.loadMore) {
          this.props.loadMore();
          return null;
        }
        return true;
      }
    }
    return null;
  }

  fillScreen() {
    const filled = this.handleScroll(false);
    if (!filled) {
      setTimeout(this.fillScreen, 2000);
    }
  }

  renderItem(index, key) {
    return <Card key={key} post={this.props.posts[index]} />;
  }

  renderLoadMore() {
    const infiniteScrollEnabled = getChannelSetting(
      this.props.selectedChannel,
      'infiniteScroll',
      this.props.channelSettings,
    );

    if (infiniteScrollEnabled) {
      return null;
    } else if (this.props.loadMore) {
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
      <div className={this.props.classes.timeline} onScroll={this.handleScroll}>
        <ReactList
          itemRenderer={this.renderItem}
          length={this.props.posts.length}
          type="simple"
          useTranslate3d={true}
          minSize={3}
          ref={el => {
            this.infiniteScroll = el;
          }}
        />
        {this.renderLoadMore()}
      </div>
    );
  }
}

Timeline.defaultProps = {
  items: [],
};

Timeline.propTypes = {
  items: PropTypes.array.isRequired,
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
      updatePost: updatePost,
      decrementChannelUnread: decrementChannelUnread,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Timeline));
