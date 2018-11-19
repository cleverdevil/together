import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar'
import { removeNotification } from '../../actions'
import styles from './style'

class Notification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      message: null,
      type: 'normal',
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.notifications.length && !this.state.open) {
      this.setState({
        open: true,
        message: newProps.notifications[0].message,
        type: newProps.notifications[0].message,
      })
      setTimeout(() => {
        this.setState({
          open: false,
        })
      }, 2500)
      setTimeout(() => {
        this.props.removeNotification(0)
      }, 2800)
    }
  }

  render() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={this.state.open}
        ContentProps={{
          className: this.props.classes[this.state.type],
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{this.state.message}</span>}
      />
    )
  }
}

Notification.propTypes = {
  notifications: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  notifications: state.app.get('notifications'),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      removeNotification: removeNotification,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Notification))
