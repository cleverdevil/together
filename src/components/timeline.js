import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui-icons/Edit';
import ReadIcon from 'material-ui-icons/DoneAll';
import Typography from 'material-ui/Typography';
import { LinearProgress } from 'material-ui/Progress';
import AddFeed from './add-feed';
import microsub from '../modules/microsub-api';

import Card from './card';
import Gallery from './gallery';
import Checkins from './checkins';

import {
  addToTimeline,
  setTimelineAfter,
  setTimelineBefore,
  selectChannel,
  setChannelUnread,
  addNotification,
} from '../actions';

const styles = theme => ({
  timeline: {
    width: '100%',
    maxWidth: 600,
    minWidth: 300,
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
  },
  noPosts: {
    padding: theme.spacing.unit * 2,
  },
  channelName: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  editButton: {
    opacity: 0.3,
    transition: 'opacity .2s',
    '&:hover': {
      opacity: 1,
    },
  },
  loading: {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
  },
});

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };

    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleMarkRead = this.handleMarkRead.bind(this);
    this.renderTimelinePosts = this.renderTimelinePosts.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
  }

  componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.channelUid
    ) {
      const channel = this.props.match.params.channelUid;
      this.props.selectChannel(channel);
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.match &&
      newProps.match.params &&
      newProps.match.params.channelUid &&
      newProps.match.params.channelUid != newProps.selectedChannel
    ) {
      const channel = newProps.match.params.channelUid;
      newProps.selectChannel(channel);
    } else if (
      newProps.match &&
      newProps.match.params &&
      !newProps.match.params.channelUid &&
      !newProps.selectedChannel &&
      newProps.channels.length
    ) {
      newProps.selectChannel(newProps.channels[0].uid);
    }
    if (
      newProps.selectedChannel &&
      newProps.selectedChannel != this.props.selectedChannel
    ) {
      this.setState({ loading: true });
      microsub('getTimeline', { params: [newProps.selectedChannel] })
        .then(res => {
          this.setState({ loading: false });
          if (res.items) {
            res.items.forEach(item => {
              this.props.addToTimeline(item);
            });
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
  }

  handleLoadMore() {
    this.setState({ loading: true });
    microsub('getTimeline', {
      params: [this.props.selectedChannel, this.props.timelineAfter],
    })
      .then(res => {
        if (res.items) {
          res.items.forEach(item => {
            this.props.addToTimeline(item);
          });
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

  handleMarkRead() {
    if (this.props.items && this.props.items[0] && this.props.items[0]._id) {
      microsub('markRead', {
        params: [this.props.selectedChannel, '', this.props.items[0]._id],
      })
        .then(res => {
          this.props.addNotification(`Marked ${res.updated} items as read`);
          this.props.setChannelUnread(this.props.selectedChannel, 0);
        })
        .catch(err => {
          console.log(err);
          this.props.addNotification('Error marking items as read', 'error');
        });
    }
  }

  renderTimelinePosts() {
    let posts = this.props.items;
    if (this.props.postKind && this.props.postKind.filter) {
      posts = posts.filter(this.props.postKind.filter);
    }
    if (
      this.props.postKind &&
      this.props.postKind.id &&
      this.props.postKind.id === 'photo'
    ) {
      return <Gallery posts={posts} />;
    } else if (
      this.props.postKind &&
      this.props.postKind.id &&
      this.props.postKind.id === 'checkins'
    ) {
      return <Checkins posts={posts} />;
    } else {
      return (
        <div className={this.props.classes.timeline}>
          {posts.map((item, i) => <Card post={item} key={'card-' + i} />)}
          {this.props.timelineAfter ? (
            <Button onClick={this.handleLoadMore}>Load More</Button>
          ) : null}
        </div>
      );
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

  renderTitle() {
    const selectedChannel = this.props.channels.find(
      channel => channel.uid === this.props.selectedChannel,
    );
    if (!selectedChannel) {
      return null;
    }
    return (
      <Typography
        variant="display1"
        component="h2"
        className={this.props.classes.channelName}
      >
        {selectedChannel.name}
        <Link to={`/channel/${selectedChannel.uid}/edit`}>
          <IconButton
            aria-label="Edit Channel"
            className={this.props.classes.editButton}
          >
            <EditIcon />
          </IconButton>
        </Link>
        <IconButton
          aria-label="Mark all as Read"
          className={this.props.classes.editButton}
          onClick={this.handleMarkRead}
        >
          <ReadIcon />
        </IconButton>
      </Typography>
    );
  }

  render() {
    return (
      <div>
        {this.state.loading && (
          <LinearProgress className={this.props.classes.loading} />
        )}
        {this.renderTitle()}
        {this.props.items.length > 0 || this.state.loading
          ? this.renderTimelinePosts()
          : this.renderNoPosts()}
        <AddFeed />
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
    timelineBefore: state.app.get('timelineBefore'),
    timelineAfter: state.app.get('timelineAfter'),
    selectedChannel: state.app.get('selectedChannel'),
    channels: state.channels.toJS(),
    items: state.timeline.toJS(),
    postKind: state.postKinds.find(postKind => postKind.get('selected')).toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addToTimeline: addToTimeline,
      setTimelineAfter: setTimelineAfter,
      setTimelineBefore: setTimelineBefore,
      selectChannel: selectChannel,
      setChannelUnread: setChannelUnread,
      addNotification: addNotification,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Timeline),
);
