import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import 'intersection-observer'
import Observer from '@researchgate/react-intersection-observer'
import Button from '@material-ui/core/Button'
import ReactList from 'react-list'
import Shortcuts from '../Shortcuts'
import Post from '../../Post'
import { updatePost, decrementChannelUnread } from '../../../actions'
import getChannelSetting from '../../../modules/get-channel-setting'
import { posts as postsService } from '../../../modules/feathers-services'
import styles from './style'

class Timeline extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.ref = React.createRef()
    this.handleIntersection = this.handleIntersection.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.renderLoadMore = this.renderLoadMore.bind(this)
  }

  handleIntersection(entry) {
    if (!entry || !entry.intersectionRatio) {
      return null
    }

    const target = entry.target
    const itemId = target.dataset.id
    const itemIsRead = target.dataset.isread === 'true'

    const {
      selectedChannel,
      channelSettings,
      channelsMenuOpen,
      posts,
      updatePost,
      decrementChannelUnread,
      loadMore,
    } = this.props

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

    if (autoReadEnabled && !itemIsRead) {
      updatePost(itemId, '_is_read', true)
      postsService
        .update(itemId, {
          channel: selectedChannel,
          method: 'mark_read',
        })
        .then(res => decrementChannelUnread(selectedChannel))
        .catch(err => updatePost(itemId, '_is_read', false))
    }

    const isSecondLastItem = itemId === posts[posts.length - 2]._id

    if (infiniteScrollEnabled && !channelsMenuOpen && isSecondLastItem) {
      if (loadMore) {
        loadMore()
        return null
      }
      return true
    }

    return null
  }

  renderItem(index, key) {
    return (
      <Observer
        key={key}
        root={null}
        margin="0px"
        threshold={0}
        onChange={this.handleIntersection}
      >
        <Post post={this.props.posts[index]} />
      </Observer>
    )
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
      <Shortcuts
        onNext={() => this.ref.current.scrollBy(0, 50)}
        onPrevious={() => this.ref.current.scrollBy(0, -50)}
        onMarkRead={() => {}}
        className={classes.shortcuts}
      >
        <div className={classes.timeline} ref={this.ref}>
          <ReactList
            itemRenderer={this.renderItem}
            length={posts.length}
            type="simple"
            minSize={3}
          />
          {this.renderLoadMore()}
        </div>
      </Shortcuts>
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
