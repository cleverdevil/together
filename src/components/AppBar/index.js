import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, IconButton, Tooltip } from '@material-ui/core'
import ChannelsIcon from '@material-ui/icons/Menu'
import useLocalState from '../../hooks/use-local-state'
import MicrosubNotifications from '../MicrosubNotifications'
import QuickNote from './QuickNote'
import AppBarTitle from './Title'
import SettingsMenu from './SettingsMenu'
import MarkChannelRead from './MarkChannelRead'
import styles from './style'

const TogetherAppBar = ({ classes }) => {
  const [localState, setLocalState] = useLocalState()
  const toggleChannelsMenu = e =>
    setLocalState({ channelsMenuOpen: !localState.channelsMenuOpen })

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Tooltip title="Channels" placement="bottom">
          <IconButton
            className={classes.menuButton}
            onClick={toggleChannelsMenu}
            color="inherit"
            aria-label="Menu"
          >
            <ChannelsIcon />
          </IconButton>
        </Tooltip>

        <AppBarTitle className={classes.title} />

        <div>
          <MarkChannelRead classes={classes} />
          <QuickNote />

          <MicrosubNotifications buttonClass={classes.menuAction} />

          <SettingsMenu classes={classes} />
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default withStyles(styles)(TogetherAppBar)
