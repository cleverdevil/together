import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TogetherCard from './card/index';
import Carousel from 'nuka-carousel';

const isPermanentDrawer = () =>
  document.documentElement.clientWidth > 800 ? true : false;

const styles = theme => ({
  loadMore: {
    width: '100%',
    marginTop: 16,
  },
  carousel: {
    // width: '100%',
    // height: '100%',
    // overflow: 'hidden',
    // background: theme.palette.primary.dark,
  },
  popup: {
    boxSizing: 'border-box',
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: theme.palette.primary.dark,
    paddingLeft: isPermanentDrawer() ? 300 : 0,
  },
  popupImage: {
    display: 'block',
    margin: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    boxShadow: '0 0 3em rgba(0,0,0,.5)',
  },
  popupClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: 'white',
    background: 'rgba(0,0,0,.5)',
    borderRadius: 0,
  },
  infoButton: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    color: 'white',
    background: 'none',
    borderRadius: 0,
  },
  drawer: {
    // padding: '1em',
    boxSizing: 'border-box',
    width: 300,
    maxWidth: '80%',
    maxHeight: '100%',
    overflow: 'auto',
    position: isPermanentDrawer() ? 'absolute' : 'fixed',
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: this.filterPhotos(props.posts),
      open: this.props.open,
      drawerOpen: false,
      selectedPost: false,
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.open != this.state.open) {
      this.setState({ open: newProps.open });
    }
    if (newProps.posts && newProps.posts.length != this.props.posts.length) {
      this.setState({ photos: this.filterPhotos(newProps.posts) });
    }
  }

  filterPhotos(posts) {
    const photoPosts = posts.filter(post => post.photo);
    const photos = [];
    photoPosts.forEach(post => {
      if (typeof post.photo === 'string') {
        post.photo = [post.photo];
      }
      post.photo.forEach(photo =>
        photos.push({
          photo: photo,
          post: post,
        }),
      );
    });
    return photos;
  }

  handleClose() {
    this.setState({ open: false });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    return (
      <Dialog
        fullScreen
        open={this.state.open}
        onClose={this.handleClose}
        transition={Transition}
      >
        <Carousel
          className={this.props.classes.carousel}
          slideIndex={this.props.startIndex}
          afterSlide={index => {
            if (
              index >= this.state.photos.length - 1 &&
              this.props.onLastPhoto
            ) {
              this.props.onLastPhoto();
            }
            if (this.props.onChange) {
              this.props.onChange(this.state.photos[index]);
            }
          }}
          renderBottomCenterControls={() => null}
        >
          {this.state.photos.map((photo, i) => {
            const post = photo.post;
            photo = photo.photo;
            return (
              <div className={this.props.classes.popup} key={`slide-${i}`}>
                <img
                  className={this.props.classes.popupImage}
                  src={photo}
                  alt=""
                />
                <IconButton
                  className={this.props.classes.infoButton}
                  onClick={() => this.setState({ drawerOpen: true })}
                >
                  <InfoIcon />
                </IconButton>
                <Drawer
                  open={
                    document.documentElement.clientWidth > 800
                      ? true
                      : this.state.drawerOpen
                  }
                  variant={
                    document.documentElement.clientWidth > 800
                      ? 'permanent'
                      : null
                  }
                  onClose={() => this.setState({ drawerOpen: false })}
                  classes={{
                    paperAnchorLeft: this.props.classes.drawer,
                  }}
                >
                  {post && (
                    <TogetherCard
                      post={post}
                      hideProperties={['photo']}
                      style={{ boxShadow: 'none' }}
                    />
                  )}
                </Drawer>
                <IconButton
                  className={this.props.classes.popupClose}
                  onClick={this.handleClose}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            );
          })}
        </Carousel>
      </Dialog>
    );
  }
}

Gallery.defaultProps = {
  posts: [],
};

Gallery.propTypes = {
  posts: PropTypes.array.isRequired,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  onLastPhoto: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  null,
  mapDispatchToProps,
)(withStyles(styles)(Gallery));
