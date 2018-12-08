import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Shortcuts } from 'react-shortcuts'
import { focusComponent } from '../../actions'

const styles = theme => {
  const color =
    theme.palette.type === 'dark'
      ? theme.palette.secondary.main
      : theme.palette.primary.main
  return {
    main: {
      display: 'block',
      outline: 'none',
    },
    focused: {
      boxShadow: `inset -2px -2px 0 ${color}, inset 2px 2px 0 ${color}`,
    },
  }
}

class PostShortcuts extends Component {
  constructor(props) {
    super(props)
    this.handleShortcuts = this.handleShortcuts.bind(this)
    this.ref = React.createRef()
  }

  componentDidUpdate() {
    const { focus, postsAreFocused } = this.props
    const el = this.ref.current._domNode
    if (focus && postsAreFocused && el !== document.activeElement) {
      el.focus()
    }
  }

  handleShortcuts(action) {
    const { onNext, focusComponent, scrollElement, post } = this.props

    switch (action) {
      case 'SCROLL_DOWN':
        if (scrollElement) {
          scrollElement.scrollBy(0, 50)
        }
        break
      case 'SCROLL_UP':
        if (scrollElement) {
          scrollElement.scrollBy(0, -50)
        }
        break
      case 'TO_TIMELINE':
        focusComponent('timeline')
        break
      case 'NEXT':
        onNext()
        break
      case 'OPEN':
        if (post.url) {
          window.open(post.url, '_blank')
        }
        break
      case 'TOGGLE_READ':
        console.log('Mark me as read please')
        break
      default:
        // Nothing to handle
        break
    }
  }

  render() {
    const { children, classes, focus, postsAreFocused, ...props } = this.props
    const classNames = [classes.main]
    if (postsAreFocused && focus) {
      classNames.push(classes.focused)
    }

    return (
      <Shortcuts
        {...props}
        name="POST"
        handler={this.handleShortcuts}
        ref={this.ref}
        className={classNames.join(' ')}
      >
        {children}
      </Shortcuts>
    )
  }
}

PostShortcuts.defaultProps = {
  focus: false,
  onNext: () => {},
}

PostShortcuts.propTypes = {
  post: PropTypes.object.isRequired,
  focus: PropTypes.bool.isRequired,
  postsAreFocused: PropTypes.bool.isRequired,
  onNext: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  postsAreFocused: state.app.get('focusedComponent') === 'post',
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
)(withStyles(styles)(PostShortcuts))
