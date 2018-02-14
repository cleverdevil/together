import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from 'material-ui/Form';
import List, {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import microsubApi from '../modules/microsub-api';

const styles = theme => ({
  page: {
    padding: theme.spacing.unit * 2,
  },
  fieldset: {
    width: '100%',
    maxWidth: 500,
  },
  divider: {
    marginTop: 24,
    marginBottom: 24,
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    '&:hover button': {
      color: theme.palette.primary['900'],
    },
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
      <FormControl component="fieldset" className={this.props.classes.fieldset}>
        <FormLabel component="legend">Following</FormLabel>
        <FormGroup>
          <List>
            {this.state.following.map(item => (
              <ListItem key={`list-following-${item.url}`}>
                <ListItemText primary={`${item.url} (${item.type})`} />
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
    );
  }

  render() {
    return (
      <div className={this.props.classes.page}>
        <Typography variant="headline" component="h2" paragraph={true}>
          {this.state.name} Settings
        </Typography>
        <Link to="/" className={this.props.classes.close}>
          <IconButton>
            <CloseIcon />
          </IconButton>
        </Link>
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
        {this.renderFollowing()}
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(ChannelSettings),
);
