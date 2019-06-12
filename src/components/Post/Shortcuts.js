import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Shortcuts } from 'react-shortcuts'
import useLocalState from '../../hooks/use-local-state'
import useMarkRead from '../../hooks/use-mark-read'
import useMarkUnread from '../../hooks/use-mark-unread'
import useCurrentChannel from '../../hooks/use-current-channel'

const styles = theme => {
  const color =
    theme.palette.type === 'dark'
      ? theme.palette.secondary.main
      : theme.palette.primary.main
  return {
    main: {
      display: 'block',
      outline: 'none',
      '&:focus, &.is-focused': {
        boxShadow: `inset 0 0 4px ${color}`,
      },
    },
  }
}

const PostShortcuts = ({
  children,
  classes,
  focus,
  onNext,
  scrollElement,
  post,
  ...props
}) => {
  const ref = useRef()
  const [localState, setLocalState] = useLocalState()
  const markRead = useMarkRead()
  const markUnread = useMarkUnread()
  const channel = useCurrentChannel()

  useEffect(() => {
    const el = ref.current._domNode
    if (
      focus &&
      localState.focusedComponent === 'post' &&
      el !== document.activeElement
    ) {
      el.focus()
    }
  }, [focus, localState.focusedComponent])

  const handleShortcuts = action => {
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
        setLocalState({ focusedComponent: 'timeline' })
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
        if (channel && channel.uid) {
          if (post._is_read) {
            markUnread(channel.uid, post._id)
          } else {
            markRead(channel.uid, post._id)
          }
        }
        break
      default:
        // Nothing to handle
        break
    }
  }

  const classNames = [classes.main]
  if (localState.focusedComponent === 'post' && focus) {
    classNames.push('is-focused')
  }

  return (
    <Shortcuts
      {...props}
      name="POST"
      handler={handleShortcuts}
      ref={ref}
      className={classNames.join(' ')}
    >
      {children}
    </Shortcuts>
  )
}

PostShortcuts.defaultProps = {
  focus: false,
  onNext: () => {},
}

PostShortcuts.propTypes = {
  post: PropTypes.object.isRequired,
  focus: PropTypes.bool.isRequired,
  onNext: PropTypes.func.isRequired,
}

export default withStyles(styles)(PostShortcuts)
