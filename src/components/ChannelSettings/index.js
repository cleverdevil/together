import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import SettingsModal from '../SettingsModal'
import { updateChannel, removeChannel } from '../../actions'
import { follows as followsService } from '../../modules/feathers-services'
import { getAll as getChannelSettings } from '../../modules/get-channel-setting'
import styles from './style'

class ChannelSettings extends Component {
  constructor(props) {
    super(props)
    let uid = null
    let name = 'Channel'
    if (
      props.channels.length &&
      props.match &&
      props.match.params &&
      props.match.params.channelSlug
    ) {
      let selectedChannel = props.channels.find(
        channel => channel.slug === props.match.params.channelSlug
      )
      if (selectedChannel) {
        uid = selectedChannel.uid
        name = selectedChannel.name
        this.getFollowing(selectedChannel.uid)
      }
    }
    const settings = getChannelSettings(uid, props.channelSettings)
    this.state = {
      uid: uid,
      name: name,
      following: [],
      ...settings,
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleUnsubscribe = this.handleUnsubscribe.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.getFollowing = this.getFollowing.bind(this)
    this.renderFollowing = this.renderFollowing.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (
      !this.state.uid &&
      newProps.channels.length &&
      newProps.match &&
      newProps.match.params &&
      newProps.match.params.channelSlug
    ) {
      let selectedChannel = newProps.channels.find(
        channel => channel.slug === newProps.match.params.channelSlug
      )
      if (selectedChannel) {
        const settings = getChannelSettings(
          selectedChannel.uid,
          newProps.channelSettings
        )
        this.setState({
          uid: selectedChannel.uid,
          name: selectedChannel.name,
          ...settings,
        })
        this.getFollowing(selectedChannel.uid)
      }
    }
  }

  handleClose() {
    if (this.props.history) {
      this.props.history.push('/channel/' + this.state.uid)
    }
  }

  getFollowing(uid = this.state.uid) {
    followsService
      .get(uid)
      .then(res => {
        if (res.items) {
          this.setState({ following: res.items })
        }
      })
      .catch(err => console.log(err))
  }

  handleDelete() {
    const { uid } = this.state
    const { history, removeChannel } = this.props
    if (
      uid &&
      window.confirm('Are you sure you want to delete this channel?')
    ) {
      removeChannel(uid)
      this.setState({ uid: null })
      history.push('/')
    }
  }

  handleLocalChange = name => event => {
    this.setState({ [name]: event.target.checked })
    this.props.updateChannel(this.state.uid, name, event.target.checked)
  }

  handleNameChange(e) {
    const name = e.target.value
    const { uid } = this.state
    const { updateChannel } = this.props
    this.setState({ name })
    // TODO: Only send this request when typing is finished.
    updateChannel(uid, 'name', name)
  }

  handleUnsubscribe(url) {
    followsService
      .remove(url, {
        query: { channel: this.state.uid },
      })
      .then(unfollowed => {
        this.setState(state => ({
          following: state.following.filter(
            item =>
              !(item.type === unfollowed.type && item.url === unfollowed.url)
          ),
        }))
      })
      .catch(err => console.log(err))
  }

  renderFollowing() {
    if (!this.state.following.length) {
      return null
    }
    return (
      <div>
        <FormControl
          component="fieldset"
          className={this.props.classes.fieldset}
        >
          <FormLabel component="legend">Following</FormLabel>
          <FormGroup>
            <List className={this.props.classes.following}>
              {this.state.following.map(item => (
                <ListItem key={`list-following-${item.url}`}>
                  <ListItemText
                    className={this.props.classes.followingUrl}
                    primary={`${item.url} (${item.type})`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label={`Unfollow ${item.url}`}
                      onClick={() => this.handleUnsubscribe(item.url)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </FormGroup>
        </FormControl>
      </div>
    )
  }

  render() {
    return (
      <SettingsModal
        title={`${this.state.name} Settings`}
        onClose={this.handleClose}
      >
        <div>
          <FormControl
            component="fieldset"
            className={this.props.classes.fieldset}
          >
            <FormGroup>
              <TextField
                label="Name"
                value={this.state.name}
                onChange={this.handleNameChange}
                margin="normal"
                type="text"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.infiniteScroll}
                    value="infiniteScrollChecked"
                    onChange={this.handleLocalChange('infiniteScroll')}
                  />
                }
                label="Infinite Scroll"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.autoRead}
                    value="autoReadChecked"
                    onChange={this.handleLocalChange('autoRead')}
                  />
                }
                label="Auto Mark As Read"
              />
              <Button onClick={this.handleDelete}>Delete Channel</Button>
            </FormGroup>
          </FormControl>
        </div>
        {this.renderFollowing()}
      </SettingsModal>
    )
  }
}

ChannelSettings.defaultProps = {
  channels: [],
}

ChannelSettings.propTypes = {
  channels: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  channels: state.channels.toJS(),
  channelSettings: state.settings.get('channels'),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { updateChannel: updateChannel, removeChannel: removeChannel },
    dispatch
  )

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(ChannelSettings))
)
