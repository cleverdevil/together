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
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: '#111',
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
    width: 300,
    maxWidth: '80%',
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open,
      selectedPost: false,
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.open != this.state.open) {
      this.setState({ open: newProps.open });
    }
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
              index >= this.props.medias.length - 1 &&
              this.props.onLastPhoto
            ) {
              this.props.onLastPhoto();
            }
            if (this.props.onChange) {
              this.props.onChange(this.props.medias[index]);
            }
          }}
          renderBottomCenterControls={() => null}
        >
          {this.props.medias.map((media, i) => {
            const { post, photo, video, poster } = media;
            return (
              <div className={this.props.classes.popup} key={`slide-${i}`}>
                {photo && (
                  <img
                    className={this.props.classes.popupImage}
                    src={photo}
                    alt=""
                  />
                )}
                {video && (
                  <video
                    className={this.props.classes.popupImage}
                    src={video}
                    poster={poster}
                    controls
                    loop
                  />
                )}
                <IconButton
                  className={this.props.classes.infoButton}
                  onClick={() => this.setState({ selectedPost: post })}
                >
                  <InfoIcon />
                </IconButton>
              </div>
            );
          })}
        </Carousel>
        <Drawer
          open={this.state.selectedPost}
          onClose={() => this.setState({ selectedPost: false })}
          classes={{
            paperAnchorLeft: this.props.classes.drawer,
          }}
        >
          {this.state.selectedPost && (
            <TogetherCard
              post={this.state.selectedPost}
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
      </Dialog>
    );
  }
}

Gallery.defaultProps = {
  medias: [],
};

Gallery.propTypes = {
  medias: PropTypes.array.isRequired,
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
