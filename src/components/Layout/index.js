import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import AddFeed from '../AddFeed'
import Gallery from './Gallery'
import Map from './Map'
import Classic from './Classic'
import Timeline from './Timeline'
import layouts from '../../modules/layouts'
import { posts as postsService } from '../../modules/feathers-services'
import getChannelSetting from '../../modules/get-channel-setting'
import {
  addPosts,
  setTimelineAfter,
  setTimelineBefore,
  selectChannel,
  addNotification,
  focusComponent,
} from '../../actions'
import styles from './style'

class MainPosts extends Component {
  constructor(props) {
    super(props)

    // Get the layout for the selected channel

    this.state = {
      loading: false,
    }

    this.loadPosts = this.loadPosts.bind(this)
    this.checkForNewPosts = this.checkForNewPosts.bind(this)
    this.renderTimelinePosts = this.renderTimelinePosts.bind(this)
  }

  componentDidMount() {
    const {
      match,
      user,
      selectChannel,
      selectedChannel,
      focusComponent,
      posts,
    } = this.props
    if (user.me && match.params.channelSlug) {
      const channel = decodeURIComponent(match.params.channelSlug)
      if (channel !== selectedChannel) {
        selectChannel(channel)
        focusComponent(null)
        focusComponent('timeline')
      } else if (posts.length === 0) {
        this.loadPosts()
      }
    }
    this.checkForNewPostsInterval = setInterval(
      this.checkForNewPosts,
      1000 * 60
    )
  }

  componentDidUpdate(prevProps) {
    const { focusComponent, selectChannel, user, match } = this.props
    const hasUser = !!user.me
    const currentChannel = this.props.selectedChannel
    const previousChannel = prevProps.selectedChannel
    const channelParam = match.params.channelSlug
      ? decodeURIComponent(match.params.channelSlug)
      : null

    if (hasUser && channelParam && channelParam !== currentChannel) {
      // Changed channel url
      selectChannel(channelParam)
      focusComponent(null)
      focusComponent('timeline')
    } else if (hasUser && !channelParam && !currentChannel) {
      // No channel selected so select the first one
      const firstChannel = this.props.channels.find(
        channel => channel.uid !== 'notifications'
      )
      if (firstChannel && firstChannel.uid) {
        selectChannel(firstChannel.uid)
        focusComponent(null)
        focusComponent('timeline')
      }
    }

    if (hasUser && currentChannel && currentChannel !== previousChannel) {
      // Channel has changed so load posts
      this.loadPosts()
    }
  }

  componentWillUnmount() {
    clearInterval(this.checkForNewPostsInterval)
  }

  checkForNewPosts() {
    const { selectedChannel, timelineBefore } = this.props
    if (document.hasFocus && selectedChannel && timelineBefore) {
      this.loadPosts()
    }
  }

  getLayout = () =>
    layouts.find(
      layout =>
        layout.id ===
        getChannelSetting(
          this.props.selectedChannel,
          'layout',
          this.props.channelSettings
        )
    )

  async loadPosts() {
    const { loading } = this.state
    const {
      selectedChannel,
      timelineAfter,
      addPosts,
      setTimelineAfter,
    } = this.props
    if (!loading) {
      this.setState({ loading: true })
      let query = {
        channel: selectedChannel,
      }
      if (timelineAfter) {
        query.after = timelineAfter
      }
      try {
        const res = await postsService.find({
          query,
        })
        if (res.items) {
          addPosts(res.items)
        }
        if (res.paging && res.paging.after) {
          setTimelineAfter(res.paging.after)
        } else {
          setTimelineAfter('')
        }
        this.setState({ loading: false })
      } catch (err) {
        this.setState({ loading: false })
        console.log('Error loading posts', err)
      }
    }
  }

  renderTimelinePosts() {
    const { items, timelineAfter } = this.props
    const layout = this.getLayout()
    let posts = [...items]
    if (layout && layout.filter) {
      posts = posts.filter(layout.filter)
    }
    switch (layout.id) {
      case 'gallery':
        return (
          <Gallery
            posts={posts}
            loadMore={timelineAfter ? this.loadPosts : null}
          />
        )
      case 'map':
        return (
          <Map posts={posts} loadMore={timelineAfter ? this.loadPosts : null} />
        )
      case 'classic':
        return (
          <Classic
            posts={posts}
            loadMore={timelineAfter ? this.loadPosts : null}
          />
        )
      case 'timeline':
        return (
          <Timeline
            posts={posts}
            loadMore={timelineAfter ? this.loadPosts : null}
          />
        )
      default:
        return (
          <Timeline
            posts={posts}
            loadMore={timelineAfter ? this.loadPosts : null}
          />
        )
    }
  }

  renderNoPosts() {
    return (
      <div className={this.props.classes.noPosts}>
        <Typography variant="h5" component="h2">
          <span role="img" aria-label="">
            🤷‍
          </span>{' '}
          Nothing to show
        </Typography>
        <Typography component="p">
          Maybe you need to subscribe to a site or select a different channel
        </Typography>
      </div>
    )
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
    )
  }
}

MainPosts.defaultProps = {
  items: [],
}

MainPosts.propTypes = {
  items: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  timelineBefore: state.app.get('timelineBefore'),
  timelineAfter: state.app.get('timelineAfter'),
  selectedChannel: state.app.get('selectedChannel'),
  channels: state.channels.toJS(),
  items: state.posts.toJS(),
  user: state.user.toJS(),
  channelSettings: state.settings.get('channels') || {},
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addPosts,
      setTimelineAfter,
      setTimelineBefore,
      selectChannel,
      addNotification,
      focusComponent,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MainPosts))
