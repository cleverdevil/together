import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import ReactList from 'react-list'
import Post from '../../Post'
import { updatePost, decrementChannelUnread } from '../../../actions'
import getChannelSetting from '../../../modules/get-channel-setting'
import { posts as postsService } from '../../../modules/feathers-services'
import styles from './style'

class Timeline extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.handleScroll = this.handleScroll.bind(this)
    this.fillScreen = this.fillScreen.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.renderLoadMore = this.renderLoadMore.bind(this)
  }

  componentDidMount() {
    // Wait a little bit to see if we should load more posts
    setTimeout(this.fillScreen, 3000)
  }

  handleScroll(markRead = true) {
    const {
      selectedChannel,
      channelSettings,
      channelsMenuOpen,
      posts,
      updatePost,
      decrementChannelUnread,
      loadMore,
    } = this.props
    if (this.infiniteScroll) {
      const infiniteScrollEnabled = getChannelSetting(
        selectedChannel,
        'infiniteScroll',
        channelSettings
      )
      const autoReadEnabled = getChannelSetting(
        selectedChannel,
        'autoRead',
        channelSettings
      )
      const [
        firstVisibleIndex,
        lastVisibleIndex,
      ] = this.infiniteScroll.getVisibleRange()

      if (autoReadEnabled && markRead) {
        for (let i = firstVisibleIndex; i < lastVisibleIndex; i++) {
          const post = posts[i]
          if (!post._is_read) {
            updatePost(post._id, '_is_read', true)
            postsService
              .update(post._id, {
                channel: selectedChannel,
                method: 'mark_read',
              })
              .then(res => decrementChannelUnread(selectedChannel))
              .catch(err => updatePost(post._id, '_is_read', false))
          }
        }
      }

      if (
        infiniteScrollEnabled &&
        !channelsMenuOpen &&
        lastVisibleIndex >= posts.length - 1
      ) {
        if (loadMore) {
          loadMore()
          return null
        }
        return true
      }
    }
    return null
  }

  fillScreen() {
    const filled = this.handleScroll(false)
    if (!filled) {
      setTimeout(this.fillScreen, 2000)
    }
  }

  renderItem(index, key) {
    return <Post key={key} post={this.props.posts[index]} />
  }

  renderLoadMore() {
    const { selectedChannel, channelSettings, loadMore, classes } = this.props
    const infiniteScrollEnabled = getChannelSetting(
      selectedChannel,
      'infiniteScroll',
      channelSettings
    )

    if (infiniteScrollEnabled) {
      return null
    } else if (loadMore) {
      return (
        <Button className={classes.loadMore} onClick={loadMore}>
          Load More
        </Button>
      )
    }
    return null
  }

  render() {
    const { classes, posts } = this.props
    return (
      <div className={classes.timeline} onScroll={this.handleScroll}>
        <ReactList
          itemRenderer={this.renderItem}
          length={posts.length}
          type="simple"
          useTranslate3d={true}
          minSize={3}
          ref={el => {
            this.infiniteScroll = el
          }}
        />
        {this.renderLoadMore()}
      </div>
    )
  }
}

Timeline.defaultProps = {
  items: [],
}

Timeline.propTypes = {
  items: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  selectedChannel: state.app.get('selectedChannel'),
  channelSettings: state.settings.get('channels'),
  channelsMenuOpen: state.app.get('channelsMenuOpen'),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updatePost: updatePost,
      decrementChannelUnread: decrementChannelUnread,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Timeline))
