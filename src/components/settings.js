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
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import { setUserOption, logout } from '../actions';


const styles = theme => ({
  page: {
    padding: 12,
    paddingLeft: 49+12,
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
    '&:hover button': {
      color: theme.palette.primary['900'],
    },
  },
});

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleUserOptionChange = this.handleUserOptionChange.bind(this);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  handleUserOptionChange = name => event => {
    this.props.setUserOption(name, event.target.value);
  }

  render() {
    return (
      <div className={this.props.classes.page}>
        <Typography type="headline" component="h2" paragraph={true}>Settings</Typography>
        <Link to="/" className={this.props.classes.close}>
          <IconButton>
            <CloseIcon />
          </IconButton>
        </Link>
        <FormControl component="fieldset" className={this.props.classes.fieldset}>
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
            <Button onClick={this.props.logout} raised>Sign Out</Button>
          </FormGroup>
        </FormControl>
        <Divider className={this.props.classes.divider} />
      </div>
    );
  }
}
  
Settings.defaultProps = {
};

Settings.propTypes = {
};

function mapStateToProps(state, props) {
  return {
    user: state.user.toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setUserOption: setUserOption,
    logout: logout,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Settings));
  