import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router-dom';
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import SettingsModal from './settings-modal';
import { setUserOption, setSetting, logout, addNotification } from '../actions';
import micropubApi from '../modules/micropub-api';
import { ViewColumn } from 'material-ui-icons';

const styles = theme => ({
  fieldset: {
    width: '100%',
    maxWidth: '24em',
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

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleUserOptionChange = this.handleUserOptionChange.bind(this);
    this.getSyndicationProviders = this.getSyndicationProviders.bind(this);
    this.handleLikeSyndicationChange = this.handleLikeSyndicationChange.bind(
      this,
    );
    this.handleRepostSyndicationChange = this.handleRepostSyndicationChange.bind(
      this,
    );
    this.handleNoteSyndicationChange = this.handleNoteSyndicationChange.bind(
      this,
    );
  }

  componentDidMount() {
    if (this.props.settings.syndicationProviders.length < 1) {
      this.getSyndicationProviders();
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleUserOptionChange = name => event => {
    this.props.setUserOption(name, event.target.value);
  };

  handleLikeSyndicationChange(event, checked) {
    const provider = event.target.value;
    let options = this.props.settings.likeSyndication;
    const index = options.indexOf(provider);
    if (index > -1) {
      options.splice(index, 1);
    } else {
      options.push(provider);
    }
    this.props.setSetting('likeSyndication', options);
    // Have to force an update for some reason
    this.setState({ force: 'update' });
  }

  handleRepostSyndicationChange(event, checked) {
    const provider = event.target.value;
    let options = this.props.settings.repostSyndication;
    const index = options.indexOf(provider);
    if (index > -1) {
      options.splice(index, 1);
    } else {
      options.push(provider);
    }
    this.props.setSetting('repostSyndication', options);
    // Have to force an update for some reason
    this.setState({ force: 'update' });
  }

  handleNoteSyndicationChange(event, checked) {
    const provider = event.target.value;
    let options = this.props.settings.noteSyndication;
    const index = options.indexOf(provider);
    if (index > -1) {
      options.splice(index, 1);
    } else {
      options.push(provider);
    }
    this.props.setSetting('noteSyndication', options);
    // Have to force an update for some reason
    this.setState({ force: 'update' });
  }

  getSyndicationProviders() {
    micropubApi('query', {
      param: 'syndicate-to',
    })
      .then(syndicationProviders => {
        if (syndicationProviders['syndicate-to']) {
          this.props.setSetting(
            'syndicationProviders',
            syndicationProviders['syndicate-to'],
          );
        } else {
          this.props.addNotification(
            'Error getting your syndication options',
            'error',
          );
        }
      })
      .catch(err => {
        console.log(err);
        this.props.addNotification(
          'Error getting your syndication options',
          'error',
        );
      });
  }

  render() {
    return (
      <SettingsModal title="Settings">
        <div>
          <FormControl
            component="fieldset"
            className={this.props.classes.fieldset}
          >
            <FormLabel component="legend">User options</FormLabel>
            <FormGroup>
              <TextField
                id="me"
                label="Me"
                value={this.props.user.me}
                onChange={this.handleUserOptionChange('me')}
                margin="normal"
                type="url"
              />
              <TextField
                id="token"
                label="Token"
                value={this.props.user.token}
                onChange={this.handleUserOptionChange('token')}
                margin="normal"
                type="text"
              />
              <TextField
                id="microsub-endpoint"
                label="Microsub Endpoint"
                value={this.props.user.microsubEndpoint}
                onChange={this.handleUserOptionChange('microsubEndpoint')}
                margin="normal"
                type="url"
              />
              <TextField
                id="micropub-endpoint"
                label="Micropub Endpoint"
                value={this.props.user.micropubEndpoint}
                onChange={this.handleUserOptionChange('micropubEndpoint')}
                margin="normal"
                type="url"
              />
              <TextField
                id="media-endpoint"
                label="Media Endpoint"
                value={this.props.user.mediaEndpoint}
                onChange={this.handleUserOptionChange('mediaEndpoint')}
                margin="normal"
                type="url"
              />
              <TextField
                id="token-endpoint"
                label="Token Endpoint"
                value={this.props.user.tokenEndpoint}
                onChange={this.handleUserOptionChange('tokenEndpoint')}
                margin="normal"
                type="url"
              />
              <Button onClick={this.props.logout} variant="raised">
                Sign Out
              </Button>
            </FormGroup>
          </FormControl>
        </div>
        <div>
          <FormControl
            component="fieldset"
            className={this.props.classes.fieldset}
          >
            <FormLabel component="legend">Together options</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.settings.reactions}
                    onChange={() => {}}
                  />
                }
                label="Emoji Reaction Support"
              />

              <FormControl component="div">
                <FormLabel component="span">Like Syndication</FormLabel>
                <FormGroup>
                  {this.props.settings.syndicationProviders.map(provider => (
                    <FormControlLabel
                      key={`like-syndication-setting-${provider.uid}`}
                      control={
                        <Checkbox
                          checked={
                            this.props.settings.likeSyndication.indexOf(
                              provider.uid,
                            ) > -1
                          }
                          value={provider.uid}
                          onChange={this.handleLikeSyndicationChange}
                        />
                      }
                      label={provider.name}
                    />
                  ))}
                </FormGroup>
              </FormControl>

              <FormControl component="div">
                <FormLabel component="span">Repost Syndication</FormLabel>
                <FormGroup>
                  {this.props.settings.syndicationProviders.map(provider => (
                    <FormControlLabel
                      key={`repost-syndication-setting-${provider.uid}`}
                      control={
                        <Checkbox
                          checked={
                            this.props.settings.repostSyndication.indexOf(
                              provider.uid,
                            ) > -1
                          }
                          value={provider.uid}
                          onChange={this.handleRepostSyndicationChange}
                        />
                      }
                      label={provider.name}
                    />
                  ))}
                </FormGroup>
              </FormControl>

              <FormControl component="div">
                <FormLabel component="span">Note Syndication</FormLabel>
                <FormGroup>
                  {this.props.settings.syndicationProviders.map(provider => (
                    <FormControlLabel
                      key={`note-syndication-setting-${provider.uid}`}
                      control={
                        <Checkbox
                          checked={
                            this.props.settings.noteSyndication.indexOf(
                              provider.uid,
                            ) > -1
                          }
                          value={provider.uid}
                          onChange={this.handleNoteSyndicationChange}
                        />
                      }
                      label={provider.name}
                    />
                  ))}
                </FormGroup>
              </FormControl>

              <Button onClick={this.getSyndicationProviders} variant="raised">
                Update Syndication Providers
              </Button>
            </FormGroup>
          </FormControl>
        </div>
      </SettingsModal>
    );
  }
}

Settings.defaultProps = {};

Settings.propTypes = {};

function mapStateToProps(state, props) {
  return {
    user: state.user.toJS(),
    settings: state.settings.toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUserOption: setUserOption,
      setSetting: setSetting,
      logout: logout,
      addNotification: addNotification,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Settings),
);
