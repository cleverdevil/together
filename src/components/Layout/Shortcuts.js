import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Shortcuts } from 'react-shortcuts'
import useLocalState from '../../hooks/use-local-state'
import styles from './style'

const LayoutShortcuts = ({
  focusComponent,
  onNext,
  onPrevious,
  onMarkRead,
  onSelectPost,
  children,
  className,
  classes,
  ...props
}) => {
  const ref = useRef()
  const [localState, setLocalState] = useLocalState()

  // Focus the timeline when the focused component is set
  useEffect(() => {
    const el = ref.current._domNode
    if (
      localState.focusedComponent === 'timeline' &&
      el !== document.activeElement
    ) {
      el.focus()
    }
  }, [localState.focusedComponent])

  // Handle keypresses
  const handleShortcuts = action => {
    switch (action) {
      case 'NEXT':
        onNext()
        break
      case 'PREVIOUS':
        onPrevious()
        break
      case 'SELECT_POST':
        setLocalState({ focusedComponent: 'post' })
        onSelectPost()
        break
      case 'FOCUS_CHANNEL_LIST':
        setLocalState({ focusedComponent: 'channels' })
        break
      case 'MARK_READ':
        onMarkRead()
        break
      default:
        // Nothing to handle
        break
    }
  }

  // Add class names and is-focused
  let shortcutsClassName = classes.shortcuts
  if (className) {
    shortcutsClassName += ' ' + className
  }
  if (localState.focusedComponent === 'timeline') {
    shortcutsClassName += ' is-focused'
  }

  return (
    <Shortcuts
      {...props}
      name="TIMELINE"
      handler={handleShortcuts}
      ref={ref}
      className={shortcutsClassName}
    >
      {children}
    </Shortcuts>
  )
}

LayoutShortcuts.defaultProps = {
  onNext: () => {},
  onPrevious: () => {},
  onSelectPost: () => {},
  onMarkRead: () => {},
}

LayoutShortcuts.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onSelectPost: PropTypes.func.isRequired,
  onMarkRead: PropTypes.func.isRequired,
}

export default withStyles(styles)(LayoutShortcuts)
