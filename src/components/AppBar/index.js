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
import { version } from '../../../package.json'
import {
  toggleChannelsMenu,
  updateChannel,
  addNotification,
  updatePost,
  toggleTheme,
  logout,
} from '../../actions'
import {
  posts as postsService,
  micropub,
} from '../../modules/feathers-services'
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
    const {
      items,
      selectedChannel,
      updateChannel,
      addNotification,
    } = this.props
    if (items && items[0] && items[0]._id) {
      postsService
        .update(null, {
          method: 'mark_read',
          channel: selectedChannel,
          last_read_entry: items[0]._id,
        })
        .then(res => {
          if (res.channel && res.channel === selectedChannel) {
            items.forEach(post => {
              if (!post._is_read) {
                updatePost(post._id, '_is_read', true)
              }
            })
          }
          updateChannel(res.channel || selectedChannel, 'unread', 0)
          addNotification(`Marked ${res.updated} items as read`)
        })
        .catch(err => {
          console.log(err)
          addNotification('Error marking items as read', 'error')
        })
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
    if (selectedChannel) {
      title = selectedChannel.name
      if (selectedChannel.unread) {
        title += ` (${selectedChannel.unread})`
      }
    }
    return (
      <AppBar position="static">
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
  items: state.posts.toJS(),
  noteSyndication: state.settings.get('noteSyndication'),
  supportsMicropub: !!state.settings.get('micropubEndpoint'),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleChannelsMenu: toggleChannelsMenu,
      updateChannel: updateChannel,
      addNotification: addNotification,
      updatePost: updatePost,
      toggleTheme: toggleTheme,
      logout: logout,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TogetherAppBar))
