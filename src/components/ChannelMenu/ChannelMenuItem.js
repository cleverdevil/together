import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { ListItem, ListItemText } from '@material-ui/core'
import { SortableElement } from 'react-sortable-hoc'
import useLocalState from '../../hooks/use-local-state'
import styles from './style'

const ChannelMenuItem = ({ classes, channel, isFocused, current }) => {
  const [localState, setLocalState] = useLocalState()

  let textClassName = classes.button
  if (current) {
    textClassName = classes.highlightedButton
  }
  if (isFocused) {
    textClassName += ' ' + classes.focused
  }
  let unreadCount = null
  if (channel.unread) {
    unreadCount = (
      <span className={classes.unread}>
        {typeof channel.unread === 'number' ? channel.unread : ''}
      </span>
    )
  }

  return (
    <Link
      to={`/channel/${channel._t_slug}`}
      className={textClassName}
      onClick={e => {
        setLocalState({ channelsMenuOpen: false })
        return true
      }}
    >
      <ListItem>
        <ListItemText
          classes={{
            root: classes.channelTextRoot,
            primary: classes.channelTextRoot,
          }}
          primary={
            <>
              {channel.name} {unreadCount}
            </>
          }
        />
      </ListItem>
    </Link>
  )
}

export default SortableElement(withStyles(styles)(ChannelMenuItem))
