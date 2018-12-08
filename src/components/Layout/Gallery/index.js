import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import 'intersection-observer'
import Observer from '@researchgate/react-intersection-observer'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import Button from '@material-ui/core/Button'
import ReactList from 'react-list'
import Shortcuts from '../Shortcuts'
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
      medias: props.posts ? this.getMediasFromPosts(props.posts) : [],
      selectedMediaIndex: false,
    }
    this.markPostRead = this.markPostRead.bind(this)
    this.handleIntersection = this.handleIntersection.bind(this)
    this.handleGallerySliderChange = this.handleGallerySliderChange.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.renderLoadMore = this.renderLoadMore.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.posts && newProps.posts !== this.props.posts) {
      const medias = this.getMediasFromPosts(newProps.posts)

      if (medias.length !== this.state.medias.length) {
        this.setState({ medias: medias })
      }
    }
  }

  getMediasFromPosts(posts) {
    const medias = []
    posts.forEach(post => {
      if (
        post.photo &&
        post.video &&
        post.photo.length === 1 &&
        post.video.length === 1
      ) {
        // This is a video with a poster
        medias.push({
          postId: post._id,
          video: post.video[0],
          poster: post.photo[0],
        })
      } else {
        if (post.photo) {
          if (typeof post.photo === 'string') {
            post.photo = [post.photo]
          }
          post.photo.forEach(photo =>
            medias.push({
              postId: post._id,
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
              postId: post._id,
              photo: featured,
            })
          )
        }

        if (post.video) {
          if (typeof post.video === 'string') {
            post.video = [post.video]
          }
          post.video.forEach(video => medias.push({ postId: post._id, video }))
        }
      }
    })
    return medias
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

  handleGallerySliderChange(media) {
    const { selectedChannel, channelSettings, posts } = this.props
    const post = posts.find(post => post._id === media.postId)
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
    const { classes, posts } = this.props
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
          const post = posts.find(post => post._id === media.postId)
          const avatarData = authorToAvatarData(post.author)

          return (
            <Observer
              key={post._id + index}
              root={null}
              margin="0px"
              threshold={0}
              onChange={this.handleIntersection}
            >
              <GridListTile
                cols={1}
                onClick={e => {
                  this.setState({ selectedMediaIndex: index })
                  this.markPostRead(post._id)
                }}
                style={{ height: cellHeight, width: 100 / columnCount + '%' }}
                data-id={post._id}
                data-isread={post._is_read}
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
            </Observer>
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
      <Shortcuts
        onNext={() => {
          if (selectedMediaIndex === false) {
            this.setState({ selectedMediaIndex: 0 })
          } else {
            this.setState({ selectedMediaIndex: selectedMediaIndex + 1 })
          }
        }}
        onPrevious={() => {
          if (selectedMediaIndex > 0) {
            this.setState({ selectedMediaIndex: selectedMediaIndex - 1 })
          }
        }}
        onMarkRead={() => {}}
        className={classes.shortcuts}
      >
        <div className={classes.galleryWrapper}>
          <ReactList
            itemRenderer={this.renderRow}
            length={Math.ceil(medias.length / columnCount)}
            type="simple"
            minSize={3}
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
      </Shortcuts>
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
