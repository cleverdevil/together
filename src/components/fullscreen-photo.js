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

const styles = theme => ({
  popup: {
    display: 'flex',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    background: theme.palette.primary.dark,
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

class FullscreenPhoto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.photo && newProps.post && !this.state.open) {
      this.setState({ open: true });
    } else if (!newProps.photo && !newProps.post && this.state.open) {
      this.setState({ open: false });
    }
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <Dialog
        fullScreen
        open={this.state.open}
        onClose={this.handleClose}
        transition={Transition}
      >
        <div className={this.props.classes.popup}>
          <IconButton
            className={this.props.classes.popupClose}
            onClick={() => this.setState({ open: false })}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            className={this.props.classes.infoButton}
            onClick={() => this.setState({ showInfo: true })}
          >
            <InfoIcon />
          </IconButton>
          <img
            className={this.props.classes.popupImage}
            src={this.props.photo}
            alt=""
          />
        </div>
        <Drawer
          open={this.state.showInfo}
          onClose={() => this.setState({ showInfo: false })}
          classes={{
            paperAnchorLeft: this.props.classes.drawer,
          }}
        >
          <TogetherCard
            post={this.props.post}
            style={{ boxShadow: 'none' }}
            hidePropertie={['photo', 'featured']}
          />
        </Drawer>
      </Dialog>
    );
  }
}

FullscreenPhoto.defaultProps = {};

FullscreenPhoto.propTypes = {};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  null,
  mapDispatchToProps,
)(withStyles(styles)(FullscreenPhoto));
