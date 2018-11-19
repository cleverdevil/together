import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import styles from './style'

function Transition(props) {
  return <Slide direction="up" {...props} />
}

class SettingsModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: true,
    }
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose() {
    this.setState({ open: false })
    if (this.props.onClose) {
      this.props.onClose()
    } else {
      this.props.history.push('/')
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
              variant="h6"
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
    )
  }
}

SettingsModal.defaultProps = {}

SettingsModal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func,
}

export default withRouter(withStyles(styles)(SettingsModal))
