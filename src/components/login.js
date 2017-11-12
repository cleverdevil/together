import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { LinearProgress } from 'material-ui/Progress';
import micropubApi, {getOption} from '../modules/micropub-api';
import { setUserOption } from '../actions';


const styles = theme => ({
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      me: '',
      open: true,
    };
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.user && newProps.user.token && newProps.user.me) {
      this.setState({ open: false });
    }
  }

  componentDidMount() {
    if (this.props.user && this.props.user.token && this.props.user.me) {
      this.setState({ open: false });
    } else {
      const params = new URLSearchParams(window.location.search);
      const me = params.get('me');
      const code = params.get('code');
      const state = params.get('state');
      if (me && code && state && state == getOption('state')) {
        this.setState({ loading: true });
        micropubApi('getToken', {
          param: code,
          me: me,
          state: state,
          redirectUri: window.location.origin,
        })
          .then((res) => {
            this.props.setUserOption('token', res);
            this.props.setUserOption('me', me);
            this.setState({ open: false });
          })
          .catch(err => console.log(err));
      }
    }
  }

  handleLogin(e) {
    e.preventDefault();
    this.setState({ loading: true });
    micropubApi('getAuthUrl', {
      me: this.state.me,
      state: 'together' + Date.now(),
      redirectUri: window.location.origin,
    })
      .then((res) => {
        window.location.href = res;
      })
      .catch(err => console.log(err));
    return false;
  }

  render() {
    return (
      <Dialog open={this.state.open} onRequestClose={() => { }}>
        {this.state.loading ? <LinearProgress /> : null}
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hey! Welcome to Together. Get started by logging in with your website.
          </DialogContentText>
          <form onSubmit={this.handleLogin}>
            <TextField
              autoFocus
              id="me"
              label="Your Website URL"
              type="url"
              name="me"
              style={{margin: '1em 0'}}
              onChange={(e) => this.setState({ me: e.target.value })}
              fullWidth
            />
            <Button type="submit" color="primary" raised style={{ width: '100%', paddingTop: 15, paddingBottom: 15 }}>
              Login
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

Login.defaultProps = {
};

Login.propTypes = {
};

function mapStateToProps(state, props) {
  return {
    user: state.user.toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setUserOption: setUserOption,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));
