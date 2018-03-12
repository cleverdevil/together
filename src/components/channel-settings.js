import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import { FormLabel, FormControl, FormGroup } from 'material-ui/Form';
import List, {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import SettingsModal from './settings-modal';
import microsubApi from '../modules/microsub-api';

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
    this.state = {
      uid: uid,
      name: name,
      following: [],
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
        this.setState({
          uid: selectedChannel.uid,
          name: selectedChannel.name,
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
    microsubApi('getFollowing', { params: [uid] })
      .then(res => {
        if (res.items) {
          this.setState({ following: res.items });
        }
      })
      .catch(err => console.log(err));
  }

  handleDelete() {
    console.log('deleting ' + this.state.uid);
    if (this.state.uid) {
      microsubApi('deleteChannel', { params: [this.state.uid] })
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

  handleNameChange(e) {
    this.setState({ name: e.target.value });
    // TODO: Only send this request when typing is finished.
    microsubApi('createChannel', { params: [e.target.value, this.state.uid] })
      .then(res => {
        if (!res.error) {
          // Should be renamed
          console.log(res);
        }
      })
      .catch(err => console.log(err));
  }

  handleUnsubscribe(url) {
    microsubApi('unfollow', { params: [url, this.state.uid] })
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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(ChannelSettings),
  ),
);
