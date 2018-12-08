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
    const { open } = this.state
    const { classes, children, singleColumn, ...dialogProps } = this.props
    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        TransitionComponent={Transition}
        classes={{
          root: classes.dialogRoot,
          paper: classes.dialogPaper,
        }}
        {...dialogProps}
      >
        <AppBar color="secondary" position="sticky">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.title}>
              {this.props.title}
            </Typography>
            <IconButton
              className={classes.popupClose}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.wrapper}>
          <DialogContent
            className={singleColumn ? classes.singleColumn : classes.twoColumns}
          >
            {children}
          </DialogContent>
        </div>
      </Dialog>
    )
  }
}

SettingsModal.defaultProps = {
  singleColumn: false,
}

SettingsModal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  singleColumn: PropTypes.bool.isRequired,
}

export default withRouter(withStyles(styles)(SettingsModal))
