import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import NextIcon from '@material-ui/icons/NavigateNext'
import PrevIcon from '@material-ui/icons/NavigateBefore'
import Slide from '@material-ui/core/Slide'
import Post from '../Post'
import Carousel from 'nuka-carousel'
import styles from './style'

function Transition(props) {
  return <Slide direction="up" {...props} />
}

const alwaysOpenWidth = 800

class Gallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: this.props.open,
      drawerOpen: false,
      selectedPost: props.startIndex,
      width: document.documentElement.clientWidth,
    }
    this.handleResize = this.handleResize.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.open !== this.state.open) {
      this.setState({ open: newProps.open, selectedPost: null })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize() {
    this.setState({ width: document.documentElement.clientWidth })
  }

  handleClose() {
    this.setState({ open: false })
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    const { width, open } = this.state
    const {
      classes,
      startIndex,
      medias,
      onLastPhoto,
      onChange,
      posts,
    } = this.props
    const isPermanentDrawer =
      medias.find(media => media.postId) && width > alwaysOpenWidth
    return (
      <Dialog
        disableAutoFocus
        fullScreen
        open={open}
        onClose={this.handleClose}
        TransitionComponent={Transition}
      >
        <Carousel
          className={classes.carousel}
          slideIndex={startIndex}
          afterSlide={index => {
            this.setState({ selectedPost: index })
            if (index >= medias.length - 1 && onLastPhoto) {
              onLastPhoto()
            }
            if (onChange) {
              onChange(medias[index])
            }
          }}
          renderCenterLeftControls={({ previousSlide }) => (
            <IconButton
              aria-label="Previous Slide"
              className={classes.button}
              style={{ marginLeft: isPermanentDrawer ? 300 : 0 }}
              onClick={previousSlide}
            >
              <PrevIcon />
            </IconButton>
          )}
          renderCenterRightControls={({ nextSlide }) => (
            <IconButton
              className={classes.button}
              onClick={nextSlide}
              aria-label="Next Slide"
            >
              <NextIcon />
            </IconButton>
          )}
          renderBottomLeftControls={({ currentSlide }) => {
            if (
              !medias ||
              typeof currentSlide === 'undefined' ||
              !medias[currentSlide] ||
              !medias[currentSlide].postId ||
              isPermanentDrawer
            ) {
              return null
            }
            return (
              <IconButton
                className={classes.button}
                onClick={() => this.setState({ drawerOpen: true })}
                aria-label="Show Post"
              >
                <InfoIcon />
              </IconButton>
            )
          }}
          renderTopRightControls={() => (
            <IconButton
              aria-label="Close Slides"
              className={classes.button}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          )}
          renderBottomCenterControls={() => null}
          renderTopLeftControls={({ currentSlide }) => {
            if (
              !medias ||
              typeof currentSlide === 'undefined' ||
              !medias[currentSlide] ||
              !medias[currentSlide].postId
            ) {
              return null
            }
            const post = posts.find(
              post => post._id === medias[currentSlide].postId
            )
            return (
              <Drawer
                open={isPermanentDrawer ? true : this.state.drawerOpen}
                variant={isPermanentDrawer ? 'permanent' : null}
                onClose={() => this.setState({ drawerOpen: false })}
                classes={{
                  paperAnchorLeft: classes.drawer,
                }}
              >
                {post && (
                  <Post
                    post={post}
                    hideProperties={['photo', 'video', 'featured']}
                    style={{ boxShadow: 'none' }}
                  />
                )}
              </Drawer>
            )
          }}
        >
          {medias.map(({ photo, video, poster }, i) => (
            <div
              className={classes.popup}
              key={`slide-${i}`}
              style={{ paddingLeft: isPermanentDrawer ? 300 : 0 }}
            >
              {photo && (
                <img className={classes.popupImage} src={photo} alt="" />
              )}
              {video && (
                <video
                  className={classes.popupImage}
                  src={video}
                  poster={poster}
                  controls
                  loop
                />
              )}
            </div>
          ))}
        </Carousel>
      </Dialog>
    )
  }
}

Gallery.defaultProps = {
  medias: [],
  startIndex: null,
}

Gallery.propTypes = {
  medias: PropTypes.array.isRequired,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  onLastPhoto: PropTypes.func,
}

export default withStyles(styles)(Gallery)
