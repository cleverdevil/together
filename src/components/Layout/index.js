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
import getChannelSetting from '../../modules/get-channel-setting'
import {
  getPosts,
  getMorePosts,
  getNewPosts,
  selectChannel,
  addNotification,
  focusComponent,
} from '../../actions'
import styles from './style'

class MainPosts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
    }

    this.loadPosts = this.loadPosts.bind(this)
    this.checkForNewPosts = this.checkForNewPosts.bind(this)
    this.renderTimelinePosts = this.renderTimelinePosts.bind(this)
  }

  async componentDidMount() {
    const {
      match,
      user,
      selectChannel,
      selectedChannel,
      focusComponent,
      getPosts,
      posts,
    } = this.props
    if (user.me && match.params.channelSlug) {
      const channel = decodeURIComponent(match.params.channelSlug)
      if (channel !== selectedChannel) {
        selectChannel(channel)
        focusComponent(null)
        focusComponent('timeline')
      } else if (posts.length === 0) {
        this.setState({ loading: true })
        await getPosts(channel)
        this.setState({ loading: false })
      }
    }
    this.checkForNewPostsInterval = setInterval(
      this.checkForNewPosts,
      1000 * 60
    )
  }

  async componentDidUpdate(prevProps) {
    const { focusComponent, selectChannel, user, match, getPosts } = this.props
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
      this.setState({ loading: true })
      await getPosts(currentChannel)
      this.setState({ loading: false })
    }
  }

  componentWillUnmount() {
    clearInterval(this.checkForNewPostsInterval)
  }

  checkForNewPosts() {
    const { selectedChannel, before, getNewPosts } = this.props
    if (document.hasFocus && selectedChannel && before) {
      getNewPosts(selectedChannel, before)
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
    const { selectedChannel, after, getMorePosts } = this.props
    if (!loading) {
      this.setState({ loading: true })
      await getMorePosts(selectedChannel, after)
      this.setState({ loading: false })
    }
  }

  renderTimelinePosts() {
    const { items, after } = this.props
    const layout = this.getLayout()
    let posts = [...items]
    if (layout && layout.filter) {
      posts = posts.filter(layout.filter)
    }
    switch (layout.id) {
      case 'gallery':
        return (
          <Gallery posts={posts} loadMore={after ? this.loadPosts : null} />
        )
      case 'map':
        return <Map posts={posts} loadMore={after ? this.loadPosts : null} />
      case 'classic':
        return (
          <Classic posts={posts} loadMore={after ? this.loadPosts : null} />
        )
      case 'timeline':
        return (
          <Timeline posts={posts} loadMore={after ? this.loadPosts : null} />
        )
      default:
        return (
          <Timeline posts={posts} loadMore={after ? this.loadPosts : null} />
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
  selectedChannel: state.app.get('selectedChannel'),
  channels: state.channels.toJS(),
  items: state.posts.get('posts').toJS(),
  after: state.posts.get('after'),
  before: state.posts.get('before'),
  user: state.user.toJS(),
  channelSettings: state.settings.get('channels') || {},
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getPosts,
      getNewPosts,
      getMorePosts,
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
