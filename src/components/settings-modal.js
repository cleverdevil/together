import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  dialogPaper: {
    display: 'block',
  },
  wrapper: {
    position: 'relative',
    width: '50em',
    maxWidth: '100%',
    paddingTop: 50,
  },
  appBar: {
    display: 'block',
    top: 0,
    left: 0,
    right: 0,
    position: 'fixed',
  },
  title: {
    flex: 1,
    fontWeight: 'normal',
  },
  content: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-between',
      '& > *': {
        width: '48%',
      },
    },
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SettingsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ open: false });
    if (this.props.onClose) {
      this.props.onClose();
    } else {
      this.props.history.push('/');
    }
  }

  render() {
    return (
      <Dialog
        // fullScreen
        open={this.state.open}
        onClose={this.handleClose}
        transition={Transition}
        classes={{
          root: this.props.classes.dialogRoot,
          paper: this.props.classes.dialogPaper,
        }}
      >
        <AppBar color="secondary" className={this.props.classes.appBar}>
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={this.props.classes.title}
            >
              {this.props.title}
            </Typography>
            <IconButton
              className={this.props.classes.popupClose}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={this.props.classes.wrapper}>
          <DialogContent className={this.props.classes.content}>
            {this.props.children}
          </DialogContent>
        </div>
      </Dialog>
    );
  }
}

SettingsModal.defaultProps = {};

SettingsModal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default withRouter(
  connect(null, mapDispatchToProps)(withStyles(styles)(SettingsModal)),
);
