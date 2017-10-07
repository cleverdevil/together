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


const styles = theme => ({
  page: {
    padding: 12,
    paddingLeft: 49+12,
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
      me: '',
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
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
        <FormControl component="fieldset">
          <FormLabel component="legend">Just a mockup at the moment</FormLabel>
          <FormGroup>
            <TextField
              id="me"
              label="Me"
              value={this.state.me}
              onChange={this.handleChange('me')}
              margin="normal"
              type="url"
            />
          </FormGroup>
          {/* <FormHelperText>Be careful</FormHelperText> */}
        </FormControl>
        <Divider className={this.props.classes.divider} />
        <Button raised>Sign Out</Button>
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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Settings));
  