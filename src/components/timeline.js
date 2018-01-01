import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { LinearProgress } from 'material-ui/Progress';
import microsub from '../modules/microsub-api';

import Card from './card';
import Gallery from './gallery';
import Checkins from './checkins';

import { addToTimeline, setTimelineAfter, setTimelineBefore, selectChannel } from '../actions';

const styles = theme => ({
  timeline: {
    width: '100%',
    maxWidth: 600,
    minWidth: 300,
  },
  noPosts: {
  },
  channelName: {
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
    this.renderTimelinePosts = this.renderTimelinePosts.bind(this);
  }

  componentWillUpdate(newProps) {
    if (newProps.selectedChannel && newProps.selectedChannel != this.props.selectedChannel) {
      this.setState({ loading: true });
      microsub('getTimeline', { params: [newProps.selectedChannel] })
        .then((res) => {
          this.setState({ loading: false });
          if (res.items) {
            res.items.forEach((item) => {
              this.props.addToTimeline(item);
            })
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
        .catch((err) => {
          this.setState({ loading: false });
          console.log(err);
        });
    }
  }

  handleLoadMore() {
    this.setState({ loading: true });
    microsub('getTimeline', { params: [this.props.selectedChannel, this.props.timelineAfter] })
      .then((res) => {
        if (res.items) {
          res.items.forEach((item) => {
            this.props.addToTimeline(item);
          })
        }
        if (res.paging && res.paging.after) {
          this.props.setTimelineAfter(res.paging.after);
        } else {
          this.props.setTimelineAfter('');
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.log(err);
      });
  }

  renderTimelinePosts() {
    let posts = this.props.items;
    if (this.props.postKind && this.props.postKind.filter) {
      posts = posts.filter(this.props.postKind.filter);
    }
    if (this.props.postKind && this.props.postKind.id && this.props.postKind.id === 'photo') {
      return (<Gallery posts={posts} />);
    } else if (this.props.postKind && this.props.postKind.id && this.props.postKind.id === 'checkins') {
      return (<Checkins posts={posts} />);
    } else {
      return (
        <div className={this.props.classes.timeline}>
          {posts.map((item, i) => (
            <Card post={item} key={'card-' + i} />
          ))}
          {this.props.timelineAfter ? <Button onClick={this.handleLoadMore}>Load More</Button> : null}
        </div>
      );
    }
  }

  renderNoPosts() {
    return (
      <div className={this.props.classes.noPosts}>
        <Typography type="display2" component="h2">🤷‍ Nothing to show</Typography>
        <Typography type="body1" component="p">Maybe you need to subscribe to a site or select a different channel</Typography>
      </div>
    );
  }

  render() {
    const selectedChannel = this.props.channels.find(channel => channel.uid === this.props.selectedChannel);
    return (
      <div>
        {this.state.loading && <LinearProgress className={this.props.classes.loading} />}
        {selectedChannel && <Typography type="display1" component="h2" className={this.props.classes.channelName}>{selectedChannel.name}</Typography>}
        {(this.props.items.length > 0 || this.state.loading) ? this.renderTimelinePosts() : this.renderNoPosts()}
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
  return bindActionCreators({
    addToTimeline: addToTimeline,
    setTimelineAfter: setTimelineAfter,
    setTimelineBefore: setTimelineBefore,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Timeline));
