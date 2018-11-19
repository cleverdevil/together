import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import Button from '@material-ui/core/Button'
import ReactList from 'react-list'
import AuthorAvatar from '../../AuthorAvatar'
import GallerySlider from '../../GallerySlider'
import { updatePost, decrementChannelUnread } from '../../../actions'
import authorToAvatarData from '../../../modules/author-to-avatar-data'
import getChannelSetting from '../../../modules/get-channel-setting'
import { posts as postsService } from '../../../modules/feathers-services'
import resizeImage from '../../../modules/get-image-proxy-url'
import styles from './style'

const contentWidth = document.getElementById('root').clientWidth - 49
const columnCount = Math.floor(contentWidth / 300)
const cellHeight = Math.floor(contentWidth / columnCount)

class Gallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      medias: [],
      selectedMediaIndex: false,
    }
    this.markPostRead = this.markPostRead.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.fillScreen = this.fillScreen.bind(this)
    this.handleGallerySliderChange = this.handleGallerySliderChange.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.renderLoadMore = this.renderLoadMore.bind(this)
  }

  componentDidMount() {
    // Wait a little bit to see if we should load more images
    setTimeout(this.fillScreen, 3000)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.posts && newProps.posts !== this.props.posts) {
      const medias = []
      newProps.posts.forEach(post => {
        if (
          post.photo &&
          post.video &&
          post.photo.length === 1 &&
          post.video.length === 1
        ) {
          // This is a video with a poster
          medias.push({ post, video: post.video[0], poster: post.photo[0] })
        } else {
          if (post.photo) {
            if (typeof post.photo === 'string') {
              post.photo = [post.photo]
            }
            post.photo.forEach(photo =>
              medias.push({
                post,
                photo,
              })
            )
          }

          if (post.featured) {
            if (typeof post.featured === 'string') {
              post.featured = [post.featured]
            }
            post.featured.forEach(featured =>
              medias.push({
                post,
                photo: featured,
              })
            )
          }

          if (post.video) {
            if (typeof post.video === 'string') {
              post.video = [post.video]
            }
            post.video.forEach(video => medias.push({ post, video }))
          }
        }
      })

      if (medias.length !== this.state.medias.length) {
        this.setState({ medias: medias })
      }
    }
  }

  markPostRead(postId) {
    const { updatePost, selectedChannel, decrementChannelUnread } = this.props
    updatePost(postId, '_is_read', true)
    postsService
      .update(postId, {
        channel: selectedChannel,
        method: 'mark_read',
      })
      .then(res => decrementChannelUnread(selectedChannel))
      .catch(err => updatePost(postId, '_is_read', false))
  }

  handleScroll(markRead = true) {
    const {
      selectedChannel,
      channelSettings,
      posts,
      channelsMenuOpen,
      loadMore,
    } = this.props
    if (this.infiniteScroll) {
      const autoReadEnabled = getChannelSetting(
        selectedChannel,
        'autoRead',
        channelSettings
      )
      const infiniteScrollEnabled = getChannelSetting(
        selectedChannel,
        'infiniteScroll',
        channelSettings
      )
      let [
        firstVisibleIndex,
        lastVisibleIndex,
      ] = this.infiniteScroll.getVisibleRange()
      firstVisibleIndex = firstVisibleIndex * columnCount
      lastVisibleIndex = lastVisibleIndex * columnCount + columnCount
      const scrollEl = this.infiniteScroll.scrollParent

      if (autoReadEnabled && markRead) {
        for (let i = firstVisibleIndex; i < lastVisibleIndex; i++) {
          const post = posts[i]
          if (post && !post._is_read) {
            this.markPostRead(post._id)
          }
        }
      }

      if (
        infiniteScrollEnabled &&
        !channelsMenuOpen &&
        scrollEl.scrollTop > scrollEl.scrollHeight - scrollEl.clientHeight - 5
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

  /**
   * When the first articles are loaded they might not be tall enough to fill the screen so it is impossible to scroll to load more
   */
  fillScreen() {
    // TODO: Should really make this more smart and wait for posts to load
    const filled = this.handleScroll(false)
    if (!filled) {
      setTimeout(this.fillScreen, 2000)
    }
  }

  handleGallerySliderChange(post) {
    const { selectedChannel, channelSettings } = this.props
    post = post.post
    const autoReadEnabled = getChannelSetting(
      selectedChannel,
      'autoRead',
      channelSettings
    )

    if (autoReadEnabled) {
      if (!post._is_read) {
        this.markPostRead(post._id)
      }
    }
  }

  renderRow(rowIndex, key) {
    const { classes } = this.props
    const startIndex = rowIndex * columnCount
    const medias = this.state.medias.slice(startIndex, startIndex + columnCount)
    return (
      <GridList
        key={key}
        spacing={0}
        cols={columnCount}
        cellHeight={cellHeight}
      >
        {medias.map((media, rowItemIndex) => {
          const index = startIndex + rowItemIndex
          const post = media.post
          const avatarData = authorToAvatarData(post.author)

          return (
            <GridListTile
              key={post._id + index}
              cols={1}
              onClick={e => {
                this.setState({ selectedMediaIndex: index })
                this.markPostRead(post._id)
              }}
              style={{ height: cellHeight, width: 100 / columnCount + '%' }}
            >
              {media.photo && (
                <img
                  src={resizeImage(media.photo, {
                    w: 300,
                    h: 300,
                    t: 'square',
                  })}
                  alt=""
                />
              )}
              {media.video && (
                <video
                  className={classes.video}
                  src={media.video}
                  poster={media.poster}
                  controls
                  loop
                />
              )}
              <GridListTileBar
                title={post.name || (post.content && post.content.text) || ''}
                subtitle={avatarData.alt}
                actionIcon={
                  <div style={{ marginRight: 14 }}>
                    <AuthorAvatar author={post.author} />
                  </div>
                }
              />
            </GridListTile>
          )
        })}
      </GridList>
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
    }
    if (loadMore) {
      return (
        <Button className={classes.loadMore} onClick={loadMore}>
          Load More
        </Button>
      )
    }
    return null
  }

  render() {
    const {
      classes,
      posts,
      selectedChannel,
      loadMore,
      channelSettings,
    } = this.props
    const { medias, selectedMediaIndex } = this.state
    return (
      <Fragment>
        <div className={classes.galleryWrapper} onScroll={this.handleScroll}>
          <ReactList
            itemRenderer={this.renderRow}
            length={Math.ceil(medias.length / columnCount)}
            type="simple"
            useTranslate3d={true}
            minSize={3}
            ref={el => {
              this.infiniteScroll = el
            }}
          />
          {this.renderLoadMore()}
        </div>

        {selectedMediaIndex !== false && (
          <GallerySlider
            posts={posts}
            medias={medias}
            startIndex={selectedMediaIndex}
            onChange={this.handleGallerySliderChange}
            onClose={() => this.setState({ selectedMediaIndex: false })}
            onLastPhoto={() => {
              const infiniteScrollEnabled = getChannelSetting(
                selectedChannel,
                'infiniteScroll',
                channelSettings
              )
              if (infiniteScrollEnabled) {
                loadMore()
              }
            }}
            open={true}
          />
        )}
      </Fragment>
    )
  }
}

Gallery.defaultProps = {
  posts: [],
}

Gallery.propTypes = {
  posts: PropTypes.array.isRequired,
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      decrementChannelUnread: decrementChannelUnread,
      updatePost: updatePost,
    },
    dispatch
  )

const mapStateToProps = state => ({
  selectedChannel: state.app.get('selectedChannel'),
  channelSettings: state.settings.get('channels'),
  channelsMenuOpen: state.app.get('channelsMenuOpen'),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Gallery))
