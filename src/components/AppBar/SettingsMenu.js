import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApolloClient } from 'react-apollo-hooks'
import { IconButton, Menu, MenuItem, Tooltip } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import useCurrentChannel from '../../hooks/use-current-channel'
import useLocalState from '../../hooks/use-local-state'
import LayoutSwitcher from '../LayoutSwitcher'
import { version } from '../../../package.json'

const SettingsMenu = ({ classes }) => {
  const client = useApolloClient()
  const [anchorEl, setAnchorEl] = useState(null)
  const [localState, setLocalState] = useLocalState()
  const channel = useCurrentChannel()

  const logout = e => {
    window.localStorage.removeItem('token')
    client.resetStore()
    window.location.href = '/'
  }

  return (
    <Fragment>
      <Tooltip title="Settings" placement="bottom">
        <IconButton
          onClick={e => setAnchorEl(e.currentTarget)}
          className={classes.menuAction}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={!!anchorEl}
        onClose={e => setAnchorEl(null)}
      >
        <Fragment>
          {!!channel._t_slug && (
            <Link
              to={`/channel/${channel._t_slug}/edit`}
              className={classes.menuItem}
            >
              <MenuItem>Channel Settings</MenuItem>
            </Link>
          )}
          <Link to="/settings" className={classes.menuItem}>
            <MenuItem>App Settings</MenuItem>
          </Link>
          <MenuItem
            onClick={() =>
              setLocalState({
                theme: localState.theme === 'light' ? 'dark' : 'light',
              })
            }
          >
            {localState.theme === 'light' ? 'Dark' : 'Light'} Mode
          </MenuItem>
          <MenuItem onClick={logout}>Logout</MenuItem>
          <MenuItem>Version {version}</MenuItem>
          <LayoutSwitcher className={classes.layoutSwitcher} />
        </Fragment>
      </Menu>
    </Fragment>
  )
}

export default SettingsMenu
