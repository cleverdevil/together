import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import 'intersection-observer'
import Observer from '@researchgate/react-intersection-observer'
import List from '@material-ui/core/List'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import AppBar from '@material-ui/core/AppBar'
import ReactList from 'react-list'
import Shortcuts from '../Shortcuts'
import Preview from './Preview'
import Post from '../../Post'
import { markPostRead } from '../../../actions'
import getChannelSetting from '../../../modules/get-channel-setting'
import styles from './style'

class ClassicView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedPostId: null,
    }
    this.articleRef = React.createRef()
    this.listRef = React.createRef()
    this.handleIntersection = this.handleIntersection.bind(this)
    this.handlePostSelect = this.handlePostSelect.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.renderLoadMore = this.renderLoadMore.bind(this)
  }

  handleIntersection(entry) {
    if (!entry || !entry.intersectionRatio) {
      return null
    }

    const target = entry.target
    const itemId = target.dataset.id

    const {
      selectedChannel,
      channelSettings,
      channelsMenuOpen,
      posts,
      loadMore,
    } = this.props

    const infiniteScrollEnabled = getChannelSetting(
      selectedChannel,
      'infiniteScroll',
      channelSettings
    )

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

  handlePostSelect(postId) {
    const { posts, markPostRead, selectedChannel } = this.props
    const index = posts.findIndex(post => post._id === postId)
    if (index > -1) {
      const post = posts[index]
      this.setState({
        selectedPostId: post._id,
      })
      if (this.articleRef.current) {
        this.articleRef.current.scrollTop = 0
      }
      // Mark the post as read
      if (!post._is_read) {
        markPostRead(selectedChannel, post._id)
      }
      // Load the next posts if reading the final post
      if (index === posts.length - 1 && this.props.loadMore) {
        this.props.loadMore()
      }
      // Scroll the selected post into view
      this.listRef.current.scrollAround(index)
    }
  }

  handleNextPost = () => {
    const { posts } = this.props
    const { selectedPostId } = this.state
    const postIndex = selectedPostId
      ? posts.findIndex(post => post._id === selectedPostId)
      : -1
    let nextPostId = posts[postIndex + 1] ? posts[postIndex + 1]._id : null
    if (!nextPostId && !selectedPostId) {
      nextPostId = posts[0]._id
    }
    if (nextPostId) {
      this.handlePostSelect(nextPostId)
    }
  }

  handlePreviousPost = () => {
    const { posts } = this.props
    const { selectedPostId } = this.state
    const postIndex = selectedPostId
      ? posts.findIndex(post => post._id === selectedPostId)
      : -1
    const previousPostId = postIndex > 0 ? posts[postIndex - 1]._id : null
    if (previousPostId) {
      this.handlePostSelect(previousPostId)
    }
  }

  renderItem(index, key) {
    const { posts } = this.props
    const { selectedPostId } = this.state
    const post = posts[index]
    return (
      <Observer
        key={key}
        root={'#classic-view-previews'}
        margin="0px"
        threshold={0}
        onChange={this.handleIntersection}
      >
        <Preview
          post={post}
          onClick={() => this.handlePostSelect(post._id)}
          highlighted={selectedPostId === post._id}
        />
      </Observer>
    )
  }

  renderLoadMore() {
    const infiniteScrollEnabled = getChannelSetting(
      this.props.selectedChannel,
      'infiniteScroll',
      this.props.channelSettings
    )

    if (infiniteScrollEnabled) {
      return null
    }
    if (this.props.loadMore) {
      return (
        <Button
          className={this.props.classes.loadMore}
          onClick={this.props.loadMore}
        >
          Load More
        </Button>
      )
    }
    return null
  }

  render() {
    const { classes, posts } = this.props
    const { selectedPostId } = this.state
    const postIndex = selectedPostId
      ? posts.findIndex(post => post._id === selectedPostId)
      : -1
    const post = postIndex > -1 && posts[postIndex] ? posts[postIndex] : null
    const nextPostId = posts[postIndex + 1] ? posts[postIndex + 1]._id : null
    const previousPostId =
      postIndex > 0 && posts[postIndex - 1] ? posts[postIndex - 1]._id : null
    return (
      <Shortcuts
        className={classes.wrapper}
        onNext={this.handleNextPost}
        onPrevious={this.handlePreviousPost}
        onMarkRead={() => {}}
      >
        <List className={classes.previewColumn} id="classic-view-previews">
          <ReactList
            itemRenderer={this.renderItem}
            length={posts.length}
            type="simple"
            minSize={3}
            ref={this.listRef}
          />
          {this.renderLoadMore()}
        </List>
        {selectedPostId && (
          <div ref={this.articleRef} className={classes.postColumn}>
            <Post
              focus
              post={post}
              expandableContent={false}
              style={{
                margin: 0,
                minHeight: 'calc(100% - 48px)',
                maxWidth: 700,
                boxShadow: 'none',
              }}
              shortcutOnNext={this.handleNextPost}
              scrollElement={this.articleRef.current}
            />
            <AppBar
              position="sticky"
              color="default"
              style={{ bottom: 0, maxWidth: 700, boxShadow: 'none' }}
            >
              <Toolbar variant="dense">
                <Button
                  onClick={this.handlePreviousPost}
                  disabled={previousPostId === null}
                >
                  Previous
                </Button>
                <Button
                  onClick={this.handleNextPost}
                  disabled={nextPostId === null}
                >
                  Next
                </Button>
                <Button
                  onClick={() =>
                    this.setState({
                      selectedPostId: null,
                    })
                  }
                >
                  Close
                </Button>
              </Toolbar>
            </AppBar>
          </div>
        )}
      </Shortcuts>
    )
  }
}

ClassicView.defaultProps = {
  posts: [],
}

ClassicView.propTypes = {
  posts: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  selectedChannel: state.app.get('selectedChannel'),
  channelSettings: state.settings.get('channels'),
  channelsMenuOpen: state.app.get('channelsMenuOpen'),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ markPostRead }, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ClassicView))
