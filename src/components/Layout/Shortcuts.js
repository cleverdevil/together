import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Shortcuts } from 'react-shortcuts'
import { focusComponent } from '../../actions'

class LayoutShortcuts extends Component {
  constructor(props) {
    super(props)
    this.handleShortcuts = this.handleShortcuts.bind(this)
    this.ref = React.createRef()
  }

  componentWillReceiveProps(newProps) {
    const el = this.ref.current._domNode
    if (newProps.isFocused && el !== document.activeElement) {
      console.log('Focusing layout on change')
      el.focus()
    }
  }

  handleShortcuts(action) {
    const {
      focusComponent,
      onNext,
      onPrevious,
      onMarkRead,
      onSelectPost,
    } = this.props

    switch (action) {
      case 'NEXT':
        onNext()
        break
      case 'PREVIOUS':
        onPrevious()
        break
      case 'SELECT_POST':
        onSelectPost()
        break
      case 'FOCUS_CHANNEL_LIST':
        focusComponent('channels')
        break
      case 'MARK_READ':
        onMarkRead()
        break
      default:
        // Nothing to handle
        break
    }
  }

  render() {
    const { children, ...props } = this.props
    return (
      <Shortcuts
        {...props}
        name="TIMELINE"
        handler={this.handleShortcuts}
        ref={this.ref}
      >
        {children}
      </Shortcuts>
    )
  }
}

LayoutShortcuts.defaultProps = {
  onNext: () => {},
  onPrevious: () => {},
  onSelectPost: () => {},
  onMarkRead: () => {},
}

LayoutShortcuts.propTypes = {
  isFocused: PropTypes.bool.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onSelectPost: PropTypes.func.isRequired,
  onMarkRead: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  isFocused: state.app.get('focusedComponent') === 'timeline',
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      focusComponent,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutShortcuts)
