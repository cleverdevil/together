import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { LinearProgress } from 'material-ui/Progress';
import micropubApi, { getOption } from '../modules/micropub-api';
import { setOption as setMicrosubOption } from '../modules/microsub-api';
import { setUserOption, addNotification } from '../actions';
import { client } from '../modules/feathers-services';

const styles = theme => ({});

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
    if (
      newProps.user &&
      newProps.user.token &&
      newProps.user.me &&
      newProps.user.micropubEndpoint &&
      newProps.user.microsubEndpoint
    ) {
      this.setState({ open: false });
    }
  }

  componentDidMount() {
    client
      .authenticate()
      .then(user => {
        client.passport
          .verifyJWT(user.accessToken)
          .then(user => {
            if (user.me && user.userId) {
              this.setState({ open: false });
              this.props.setUserOption('me', user.me);
            }
          })
          .catch(err => console.log(err));
      })
      .catch(() => {
        console.log('user not logged in');
        // Not logged in yet so check for the parameters in the url
        const params = new URLSearchParams(window.location.search);
        const me = getOption('me');
        const code = params.get('code');
        const state = params.get('state');
        if (me && code && state && state == getOption('state')) {
          this.setState({ loading: true });
          client
            .authenticate({
              me: me,
              code: code,
              state: state,
              redirectUri: window.location.origin,
              strategy: 'custom',
              // strategy: 'jwt',
            })
            .then(response => {
              console.log('Logged in');
              console.log(response);
              this.props.setUserOption('token', response.accessToken);
              this.props.setUserOption('me', me);
              this.setState({ open: false });
              setMicrosubOption('microsubEndpoint', 'fakeendpoint');
              this.props.setUserOption('microsubEndpoint', 'fakeendpoint');
            })
            .catch(err => {
              console.log(err);
              this.props.addNotification('Could not log in', 'error');
            });
          window.history.pushState({}, document.title, '/');
        }
      });
  }

  handleLogin(e) {
    e.preventDefault();
    this.setState({ loading: true });
    setMicrosubOption('me', this.state.me);
    // TODO: Not sure what I want to do with this. Maybe extend / use the feathers authenticate method
    micropubApi('getAuthUrl', {
      me: this.state.me,
      state: 'together' + Date.now(),
      redirectUri: window.location.origin,
    })
      .then(res => {
        window.location.href = res;
      })
      .catch(err => console.log(err));
    return false;
  }

  render() {
    if (!this.state.open) {
      return null;
    }
    return (
      <Dialog open={this.state.open} onClose={() => {}}>
        {this.state.loading ? <LinearProgress /> : null}
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hey! Welcome to Together. Get started by logging in with your
            website.
          </DialogContentText>
          <form onSubmit={this.handleLogin}>
            <TextField
              autoFocus
              id="me"
              label="Your Website URL"
              type="url"
              name="me"
              style={{ margin: '1em 0' }}
              onChange={e => this.setState({ me: e.target.value })}
              fullWidth
            />
            <Button
              type="submit"
              color="primary"
              variant="raised"
              style={{ width: '100%', paddingTop: 15, paddingBottom: 15 }}
            >
              Login
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

Login.defaultProps = {};

Login.propTypes = {};

function mapStateToProps(state, props) {
  return {
    user: state.user.toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUserOption: setUserOption,
      addNotification: addNotification,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Login),
);
