import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddFeed from './add-feed';
import { posts as postsService } from '../modules/feathers-services';

import Gallery from './gallery';
import Checkins from './checkins';
import ClassicView from './classic-view';
import Timeline from './timeline';
import layouts from '../modules/layouts';
import getChannelSetting from '../modules/get-channel-setting';

import {
  addPosts,
  setTimelineAfter,
  setTimelineBefore,
  selectChannel,
} from '../actions';

const styles = theme => ({
  noPosts: {
    padding: theme.spacing.unit * 2,
  },
  loading: {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 9999,
  },
});

class MainPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      layout: layouts[0],
    };

    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.renderTimelinePosts = this.renderTimelinePosts.bind(this);
  }

  componentDidMount() {
    if (
      this.props.user.me &&
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.channelSlug
    ) {
      const channel = decodeURIComponent(this.props.match.params.channelSlug);
      this.props.selectChannel(channel);
    }
  }

  componentWillReceiveProps(newProps) {
    let newState = {};
    if (
      newProps.user.me &&
      newProps.match &&
      newProps.match.params &&
      newProps.match.params.channelSlug &&
      newProps.match.params.channelSlug != newProps.selectedChannel
    ) {
      const channel = decodeURIComponent(newProps.match.params.channelSlug);
      newProps.selectChannel(channel);
    } else if (
      newProps.match &&
      newProps.match.params &&
      !newProps.match.params.channelSlug &&
      !newProps.selectedChannel &&
      newProps.channels.length &&
      newProps.user.me
    ) {
      const firstChannel = newProps.channels.find(
        channel => channel.uid != 'notifications',
      );
      if (firstChannel && firstChannel.uid) {
        newProps.selectChannel(firstChannel.uid);
      }
    }
    if (
      newProps.selectedChannel &&
      newProps.user.me &&
      newProps.selectedChannel != this.props.selectedChannel
    ) {
      newState.loading = true;
      newState.layout = layouts[0];
      postsService
        .find({ query: { channel: newProps.selectedChannel } })
        .then(res => {
          this.setState({ loading: false });
          if (res.items) {
            this.props.addPosts(res.items);
          }
          if (res.paging) {
            if (res.paging.before) {
              this.props.setTimelineBefore(res.paging.before);
            }
            if (res.paging.after) {
              this.props.setTimelineAfter(res.paging.after);
            }
          }
        })
        .catch(err => {
          this.setState({ loading: false });
          console.log(err);
        });
    }
    const foundLayout = layouts.find(
      layout =>
        layout.id ==
        getChannelSetting(
          newProps.selectedChannel,
          'layout',
          newProps.channelSettings,
        ),
    );
    if (foundLayout) {
      newState.layout = foundLayout;
    }
    this.setState(newState);
  }

  handleLoadMore() {
    if (!this.state.loading) {
      this.setState({ loading: true });
      postsService
        .find({
          query: {
            channel: this.props.selectedChannel,
            after: this.props.timelineAfter,
          },
        })
        .then(res => {
          if (res.items) {
            this.props.addPosts(res.items);
          }
          if (res.paging && res.paging.after) {
            this.props.setTimelineAfter(res.paging.after);
          } else {
            this.props.setTimelineAfter('');
          }
          this.setState({ loading: false });
        })
        .catch(err => {
          this.setState({ loading: false });
          console.log(err);
        });
    }
  }

  renderTimelinePosts() {
    let posts = this.props.items;
    if (this.state.layout && this.state.layout.filter) {
      posts = posts.filter(this.state.layout.filter);
    }
    switch (this.state.layout.id) {
      case 'gallery':
        return (
          <Gallery
            posts={posts}
            loadMore={this.props.timelineAfter ? this.handleLoadMore : null}
          />
        );
        break;
      case 'map':
        return (
          <Checkins
            posts={posts}
            loadMore={this.props.timelineAfter ? this.handleLoadMore : null}
          />
        );
        break;
      case 'classic':
        return (
          <ClassicView
            posts={posts}
            loadMore={this.props.timelineAfter ? this.handleLoadMore : null}
          />
        );
        break;
      case 'timeline':
        return (
          <Timeline
            posts={posts}
            loadMore={this.props.timelineAfter ? this.handleLoadMore : null}
          />
        );
        break;
      default:
        return (
          <Timeline
            posts={posts}
            loadMore={this.props.timelineAfter ? this.handleLoadMore : null}
          />
        );
        break;
    }
  }

  renderNoPosts() {
    return (
      <div className={this.props.classes.noPosts}>
        <Typography variant="display2" component="h2">
          🤷‍ Nothing to show
        </Typography>
        <Typography variant="body1" component="p">
          Maybe you need to subscribe to a site or select a different channel
        </Typography>
      </div>
    );
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        {this.state.loading && (
          <LinearProgress className={this.props.classes.loading} />
        )}
        {this.props.items.length > 0 || this.state.loading
          ? this.renderTimelinePosts()
          : this.renderNoPosts()}
        <AddFeed />
      </div>
    );
  }
}

MainPosts.defaultProps = {
  items: [],
};

MainPosts.propTypes = {
  items: PropTypes.array.isRequired,
};

function mapStateToProps(state, props) {
  return {
    timelineBefore: state.app.get('timelineBefore'),
    timelineAfter: state.app.get('timelineAfter'),
    selectedChannel: state.app.get('selectedChannel'),
    channels: state.channels.toJS(),
    items: state.posts.toJS(),
    user: state.user.toJS(),
    channelSettings: state.settings.get('channels') || {},
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addPosts: addPosts,
      setTimelineAfter: setTimelineAfter,
      setTimelineBefore: setTimelineBefore,
      selectChannel: selectChannel,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(MainPosts));
