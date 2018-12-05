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
import Preview from './Preview'
import Post from '../../Post'
import { decrementChannelUnread, updatePost } from '../../../actions'
import { posts as postsService } from '../../../modules/feathers-services'
import getChannelSetting from '../../../modules/get-channel-setting'
import styles from './style'

class ClassicView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      post: null,
      previousPost: null,
      nextPost: null,
    }
    this.articleRef = React.createRef()
    this.handleIntersection = this.handleIntersection.bind(this)
    this.handlePostSelect = this.handlePostSelect.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.renderLoadMore = this.renderLoadMore.bind(this)
  }

  componentWillReceiveProps(newProps) {
    // TODO: Will need to figure out something for when new content is prepended to the top of the list
    if (
      newProps.posts.length > this.props.posts.length &&
      this.state.post &&
      this.state.nextPost === null
    ) {
      this.setState(state => ({ nextPost: state.nextPost + 1 }))
    }
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

  handlePostSelect(index) {
    const post = this.props.posts[index]
    const nextPost = index + 1
    const prevPost = index - 1
    const read = post._is_read
    post._is_read = true
    this.setState({
      post,
      previousPost: prevPost < 0 ? null : prevPost,
      nextPost: nextPost < this.props.posts.length ? nextPost : null,
    })
    if (this.articleRef.current) {
      this.articleRef.current.scrollTop = 0
    }
    // Mark the post as read
    if (!read) {
      postsService
        .update(post._id, {
          channel: this.props.selectedChannel,
          method: 'mark_read',
        })
        .then(res => {
          this.props.updatePost(post._id, '_is_read', true)
          this.props.decrementChannelUnread(this.props.selectedChannel)
        })
        .catch(err => {
          console.log('Error marking post read', err)
        })
    }
    // Load the next posts if reading the final post
    if (index === this.props.posts.length - 1 && this.props.loadMore) {
      this.props.loadMore()
    }
  }

  renderItem(index, key) {
    return (
      <Observer
        key={key}
        root={'#classic-view-previews'}
        margin="0px"
        threshold={0}
        onChange={this.handleIntersection}
      >
        <Preview
          post={this.props.posts[index]}
          onClick={() => this.handlePostSelect(index)}
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
    const { post, nextPost, previousPost } = this.state
    return (
      <div className={classes.wrapper}>
        <List className={classes.previewColumn} id="classic-view-previews">
          <ReactList
            itemRenderer={this.renderItem}
            length={posts.length}
            type="simple"
            minSize={3}
          />
          {this.renderLoadMore()}
        </List>
        {post && (
          <div ref={this.articleRef} className={classes.postColumn}>
            <Post
              post={post}
              expandableContent={false}
              style={{
                margin: 0,
                minHeight: 'calc(100% - 48px)',
                maxWidth: 700,
                boxShadow: 'none',
              }}
            />
            <AppBar
              position="sticky"
              color="default"
              style={{ bottom: 0, maxWidth: 700, boxShadow: 'none' }}
            >
              <Toolbar variant="dense">
                <Button
                  onClick={() => this.handlePostSelect(previousPost)}
                  disabled={previousPost === null}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => this.handlePostSelect(nextPost)}
                  disabled={nextPost === null}
                >
                  Next
                </Button>
                <Button
                  onClick={() =>
                    this.setState({
                      post: null,
                      nextPost: null,
                      previousPost: null,
                    })
                  }
                >
                  Close
                </Button>
              </Toolbar>
            </AppBar>
          </div>
        )}
      </div>
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
  bindActionCreators(
    {
      decrementChannelUnread: decrementChannelUnread,
      updatePost: updatePost,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ClassicView))
