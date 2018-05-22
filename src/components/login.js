import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { setUserOption, addNotification, setSetting } from '../actions';
import { client, users } from '../modules/feathers-services';
import loadUser from '../modules/load-user';

const styles = theme => ({});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      me: '',
      open: true,
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleVerifyJWT = this.handleVerifyJWT.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.user &&
      newProps.user.accessToken &&
      newProps.user.me &&
      this.state.open
    ) {
      this.setState({ open: false });
    } else if (!newProps.user.me && !this.state.open) {
      this.setState({ open: true });
    }
  }

  componentDidMount() {
    client
      .authenticate()
      .then(user => {
        this.handleVerifyJWT(user.accessToken);
      })
      .catch(() => {
        // Not logged in yet so check for the parameters in the url
        const params = new URLSearchParams(window.location.search);
        const me = localStorage.getItem('together-login-me');
        const code = params.get('code');
        const state = params.get('state');
        if (
          me &&
          code &&
          state &&
          state == localStorage.getItem('together-login-state')
        ) {
          this.setState({ loading: true });
          client
            .authenticate({
              me: me,
              code: code,
              state: state,
              redirectUri: window.location.origin,
              strategy: 'custom',
            })
            .then(response => {
              localStorage.removeItem('together-login-me');
              localStorage.removeItem('together-login-state');
              this.handleVerifyJWT(response.accessToken)
                .then(() => {
                  window.history.pushState({}, document.title, '/');
                })
                .catch(err => console.log(err));
            })
            .catch(err => {
              console.log(err);
              let notification = 'Could not log in';
              if (err.message) {
                notification += ': ' + err.message;
              }
              this.props.addNotification(notification, 'error');
              this.setState({ loading: false });
            });
        }
      });
  }

  handleVerifyJWT(token) {
    return new Promise((resolve, reject) => {
      client.passport
        .verifyJWT(token)
        .then(user => {
          if (user.userId) {
            loadUser(
              user.userId,
              this.props.setSetting,
              this.props.setUserOption,
            )
              .then(() => {
                this.setState({ open: false, loading: false });
                this.props.addNotification(
                  'Successfully logged in as ' + user.me,
                );
                resolve();
              })
              .catch(err => {
                this.setState({ loading: false });
                this.props.addNotification('Error logging in', 'error');
                reject(err);
              });
          } else {
            this.setState({ loading: false });
            this.props.addNotification('Error logging in', 'error');
            reject('Could not get user id from JWT');
          }
        })
        .catch(err => {
          this.setState({ loading: false });
          this.props.addNotification('Error logging in', 'error');
          reject(err);
        });
    });
  }

  handleLogin(e) {
    e.preventDefault();
    this.setState({ loading: true });
    const state = 'together' + Date.now();
    localStorage.setItem('together-login-me', this.state.me);
    localStorage.setItem('together-login-state', state);
    fetch(process.env.REACT_APP_API_SERVER + '/api/getAuthUrl', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        me: this.state.me,
        state: state,
        redirectUri: window.location.origin,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          this.props.addNotification('Error getting auth url', 'error');
          this.setState({ loading: false });
        }
      })
      .catch(err => {
        this.props.addNotification('Error getting auth url', 'error');
        this.setState({ loading: false });
        console.log(err);
      });
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
      setSetting: setSetting,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Login),
);
