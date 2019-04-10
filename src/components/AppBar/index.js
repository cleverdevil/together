import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import SettingsIcon from '@material-ui/icons/Settings'
import ChannelsIcon from '@material-ui/icons/Menu'
import Tooltip from '@material-ui/core/Tooltip'
import NoteAddIcon from '@material-ui/icons/Edit'
import ReadIcon from '@material-ui/icons/DoneAll'
import MicrosubNotifications from '../MicrosubNotifications'
import MicropubForm from '../MicropubForm'
import LayoutSwitcher from '../LayoutSwitcher'
import Meta from '../Meta'
import { version } from '../../../package.json'
import {
  toggleChannelsMenu,
  addNotification,
  markAllRead,
  updatePost,
  toggleTheme,
  logout,
} from '../../actions'
import { micropub } from '../../modules/feathers-services'
import styles from './style'

class TogetherAppBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null,
      popoverOpen: false,
      popoverAnchor: null,
    }
    this.handleMenuClose = this.handleMenuClose.bind(this)
    this.handleMarkRead = this.handleMarkRead.bind(this)
    this.handleCompose = this.handleCompose.bind(this)
    this.handleComposeSend = this.handleComposeSend.bind(this)
    this.renderMenuContent = this.renderMenuContent.bind(this)
  }

  handleMenuClose(e) {
    this.setState({ anchorEl: null })
  }

  handleMarkRead() {
    const { items, selectedChannel, markAllRead } = this.props
    if (items && items[0] && items[0]._id) {
      markAllRead(selectedChannel, items[0]._id)
    }
  }

  handleCompose(e) {
    this.setState({
      popoverOpen: true,
      popoverAnchor: e.target,
    })
  }

  handleComposeSend(mf2) {
    const { noteSyndication, addNotification } = this.props
    if (Array.isArray(noteSyndication) && noteSyndication.length) {
      mf2.properties['mp-syndicate-to'] = noteSyndication
    }
    micropub
      .create({
        post: mf2,
      })
      .then(url => {
        this.setState({ popoverOpen: false })
        addNotification(`Successfully posted note to ${url}`)
      })
      .catch(err => addNotification(`Error posting note`, 'error'))
  }

  renderMenuContent(selectedChannel) {
    const { classes, theme, toggleTheme, logout } = this.props
    return (
      <Fragment>
        {selectedChannel && (
          <Link
            to={`/channel/${selectedChannel.uid}/edit`}
            className={classes.menuItem}
          >
            <MenuItem>Channel Settings</MenuItem>
          </Link>
        )}
        <Link to="/settings" className={classes.menuItem}>
          <MenuItem>App Settings</MenuItem>
        </Link>
        <MenuItem onClick={toggleTheme}>
          {theme === 'light' ? 'Dark' : 'Light'} Mode
        </MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
        <MenuItem>Version {version}</MenuItem>
        <LayoutSwitcher className={classes.layoutSwitcher} />
      </Fragment>
    )
  }

  render() {
    const {
      channels,
      classes,
      toggleChannelsMenu,
      supportsMicropub,
    } = this.props
    const menuOpen = Boolean(this.state.anchorEl)
    const selectedChannel = channels.find(
      channel => channel.uid === this.props.selectedChannel
    )
    let title = 'Together'
    let metaTitle = ''
    if (selectedChannel) {
      metaTitle = selectedChannel.name
      if (selectedChannel.unread) {
        metaTitle += ` (${selectedChannel.unread})`
      }
    }
    if (metaTitle) {
      title = metaTitle
    }

    return (
      <AppBar position="static">
        <Meta title={metaTitle} />
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

          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            className={classes.title}
          >
            {title}
          </Typography>

          <div>
            {selectedChannel && selectedChannel.unread ? (
              <Tooltip title="Mark all as read" placement="bottom">
                <IconButton
                  aria-label="Mark all as read"
                  onClick={this.handleMarkRead}
                  className={classes.menuAction}
                >
                  <ReadIcon />
                </IconButton>
              </Tooltip>
            ) : null}

            {supportsMicropub && (
              <Tooltip title="New post" placement="bottom">
                <IconButton
                  aria-label="New post"
                  onClick={this.handleCompose}
                  className={classes.menuAction}
                >
                  <NoteAddIcon />
                </IconButton>
              </Tooltip>
            )}

            <MicrosubNotifications buttonClass={classes.menuAction} />

            <Tooltip title="Settings" placement="bottom">
              <IconButton
                onClick={e => this.setState({ anchorEl: e.currentTarget })}
                className={classes.menuAction}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={this.state.anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={menuOpen}
              onClose={this.handleMenuClose}
            >
              {this.renderMenuContent(selectedChannel)}
            </Menu>

            {supportsMicropub && (
              <Popover
                open={this.state.popoverOpen}
                anchorEl={this.state.popoverAnchor}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                onClose={() => this.setState({ popoverOpen: false })}
                onBackdropClick={() => this.setState({ popoverOpen: false })}
              >
                <div
                  style={{
                    padding: 10,
                  }}
                >
                  <MicropubForm onSubmit={this.handleComposeSend} />
                </div>
              </Popover>
            )}
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}

const mapStateToProps = state => ({
  selectedChannel: state.app.get('selectedChannel'),
  theme: state.app.get('theme'),
  channels: state.channels.toJS(),
  items: state.posts.get('posts').toJS(),
  noteSyndication: state.settings.get('noteSyndication'),
  supportsMicropub: !!state.settings.get('micropubEndpoint'),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleChannelsMenu,
      addNotification,
      updatePost,
      toggleTheme,
      logout,
      markAllRead,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TogetherAppBar))
