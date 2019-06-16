import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/core/styles'
import {
  Dialog,
  DialogContent,
  Slide,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import useReactRouter from 'use-react-router'
import styles from './style'

function Transition(props) {
  return <Slide direction="up" {...props} />
}

const SettingsModal = ({
  classes,
  children,
  singleColumn,
  onClose,
  title,
  ...dialogProps
}) => {
  const { history } = useReactRouter()
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    if (onClose) {
      onClose()
    } else {
      history.push('/')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
            {title}
          </Typography>
          <IconButton className={classes.popupClose} onClick={handleClose}>
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

SettingsModal.defaultProps = {
  singleColumn: false,
}

SettingsModal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  singleColumn: PropTypes.bool.isRequired,
}

export default withRouter(withStyles(styles)(SettingsModal))
