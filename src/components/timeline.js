import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import ReactList from 'react-list';

import Card from './card';

import {} from '../actions';
import { selectChannel } from '../actions/channels';

const styles = theme => ({
  timeline: {
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
    overflow: 'auto',
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
    this.renderItem = this.renderItem.bind(this);
    this.renderLoadMore = this.renderLoadMore.bind(this);
  }

  handleScroll() {
    const selectedChannel = this.props.channels.find(
      channel => channel.uid == this.props.selectedChannel,
    );
    const [
      firstVisibleIndex,
      lastVisibleIndex,
    ] = this.infiniteScroll.getVisibleRange();
    if (lastVisibleIndex >= this.props.posts.length - 1) {
      if (selectedChannel && selectedChannel.infiniteScroll) {
        this.props.loadMore();
      }
    }

    for (let i = firstVisibleIndex; i < lastVisibleIndex; i++) {
      const post = this.props.posts[i];
      if (!post._is_read) {
        if (selectedChannel && selectedChannel.autoRead) {
          console.log(post);
          // TODO: Mark this post as read if the setting is enabled
        }
      }
    }
  }

  renderItem(index, key) {
    return <Card key={key} post={this.props.posts[index]} />;
  }

  renderLoadMore() {
    const selectedChannel = this.props.channels.find(
      channel => channel.uid == this.props.selectedChannel,
    );
    if (selectedChannel && selectedChannel.infiniteScroll) {
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
      <div className={this.props.classes.timeline} onScroll={this.handleScroll}>
        <ReactList
          itemRenderer={this.renderItem}
          length={this.props.posts.length}
          type="variable"
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
    channels: state.channels.toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Timeline),
);
