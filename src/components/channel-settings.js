import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
} from 'material-ui/Form';
import List, {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Switch from 'material-ui/Switch';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import SettingsModal from './settings-modal';
import { updateChannel } from '../actions';
import {
  follows as followsService,
  channels as channelsService,
} from '../modules/feathers-services';
import { getAll as getChannelSettings } from '../modules/get-channel-setting';

const styles = theme => ({
  fieldset: {
    display: 'block',
    maxWidth: '100%',
  },
  following: {
    display: 'block',
    width: '100%',
  },
  followingUrl: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

class ChannelSettings extends React.Component {
  constructor(props) {
    super(props);
    let uid = null;
    let name = 'Channel';
    if (
      props.channels.length &&
      props.match &&
      props.match.params &&
      props.match.params.channelUid
    ) {
      let selectedChannel = props.channels.find(
        channel => channel.uid == props.match.params.channelUid,
      );
      if (selectedChannel) {
        uid = selectedChannel.uid;
        name = selectedChannel.name;
        this.getFollowing(selectedChannel.uid);
      }
    }
    const settings = getChannelSettings(uid, props.channelSettings);
    this.state = {
      uid: uid,
      name: name,
      following: [],
      ...settings,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleUnsubscribe = this.handleUnsubscribe.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.getFollowing = this.getFollowing.bind(this);
    this.renderFollowing = this.renderFollowing.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (
      !this.state.uid &&
      newProps.channels.length &&
      newProps.match &&
      newProps.match.params &&
      newProps.match.params.channelUid
    ) {
      let selectedChannel = newProps.channels.find(
        channel => channel.uid == newProps.match.params.channelUid,
      );
      if (selectedChannel) {
        const settings = getChannelSettings(
          selectedChannel.uid,
          newProps.channelSettings,
        );
        this.setState({
          uid: selectedChannel.uid,
          name: selectedChannel.name,
          ...settings,
        });
        this.getFollowing(selectedChannel.uid);
      }
    }
  }

  handleClose() {
    if (this.props.history) {
      this.props.history.push('/channel/' + this.state.uid);
    }
  }

  getFollowing(uid = this.state.uid) {
    followsService
      .get(uid)
      .then(res => {
        if (res.items) {
          this.setState({ following: res.items });
        }
      })
      .catch(err => console.log(err));
  }

  handleDelete() {
    if (
      this.state.uid &&
      window.confirm('Are you sure you want to delete this channel?')
    ) {
      console.log('deleting ' + this.state.uid);
      channelsService
        .remove(this.state.uid)
        .then(res => {
          console.log(res);
          if (!res.error) {
            // Should be deleted
            this.setState({ uid: null });
          }
        })
        .catch(err => console.log(err));
    }
  }

  handleLocalChange = name => event => {
    this.setState({ [name]: event.target.checked });
    this.props.updateChannel(this.state.uid, name, event.target.checked);
  };

  handleNameChange(e) {
    this.setState({ name: e.target.value });
    // TODO: Only send this request when typing is finished.

    channelsService
      .update(this.state.uid, {
        name: e.target.value,
      })
      .then(res => {
        if (!res.error) {
          // Should be renamed
          console.log(res);
        }
      })
      .catch(err => console.log(err));
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
              !(item.type == unfollowed.type && item.url == unfollowed.url),
          ),
        }));
      })
      .catch(err => console.log(err));
  }

  renderFollowing() {
    if (!this.state.following.length) {
      return null;
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
    );
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
    );
  }
}

ChannelSettings.defaultProps = {
  channels: [],
};

ChannelSettings.propTypes = {
  channels: PropTypes.array.isRequired,
};

function mapStateToProps(state, props) {
  return {
    channels: state.channels.toJS(),
    channelSettings: state.settings.get('settings'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateChannel: updateChannel }, dispatch);
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(ChannelSettings),
  ),
);
