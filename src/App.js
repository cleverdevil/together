import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import AppBar from './components/app-bar';
import MainPosts from './components/main-posts';
import PostKindMenu from './components/post-kind-menu.js';
import ChannelMenu from './components/channel-menu.js';
import Settings from './components/settings';
import ChannelSettings from './components/channel-settings';
import Login from './components/login';
import Notification from './components/notification';

const theme = createMuiTheme({
  typography: {
    fontFamily:
      '"Inter UI", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", sans-serif',
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 900,
  },
  // palette: {
  //   type: 'light',
  // },
  palette: {
    primary: {
      light: '#819ca9',
      main: '#546e7a',
      dark: '#29434e',
      contrastText: '#fff',
    },
    secondary: {
      light: '#5e92f3',
      main: '#1565c0',
      dark: '#003c8f',
      contrastText: '#fff',
    },
  },
});

const style = theme => ({
  appWrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  root: {
    background: theme.palette.background.default,
    flexGrow: 1,
    flexShrink: 1,
    flexWrap: 'nowrap',
    position: 'relative',
    transition: 'transform .3s',
    overflow: 'hidden',
    width: '100%',
  },
  channelMenu: {
    width: 200,
    display: 'flex',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      width: 200,
      position: 'absolute',
      right: '100%',
      transition: 'transform .3s',
    },
  },
  channelMenuOpen: {
    transform: 'translateX(200px)',
    overflow: 'visible',
  },
  postKindMenu: {
    width: 48,
    display: 'flex',
  },
  main: {
    background: theme.palette.background.default,
    overflow: 'auto',
    flexGrow: 1,
    flexShrink: 1,
  },
});

class App extends Component {
  render() {
    let rootClasses = [this.props.classes.root];
    let channelMenuClasses = [this.props.classes.channelMenu];
    if (this.props.channelsMenuOpen) {
      rootClasses.push(this.props.classes.channelMenuOpen);
      channelMenuClasses.push(this.props.classes.channelMenuClasses);
    }
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <Grid container spacing={0} className={this.props.classes.appWrapper}>
            <AppBar />
            <Grid item container spacing={0} className={rootClasses.join(' ')}>
              <Grid item className={channelMenuClasses.join(' ')}>
                <ChannelMenu />
              </Grid>
              <Grid item className={this.props.classes.postKindMenu}>
                <PostKindMenu />
              </Grid>
              <Grid item className={this.props.classes.main}>
                <Route exact path="/" component={MainPosts} />
                <Route
                  exact
                  path="/channel/:channelUid"
                  component={MainPosts}
                />
                <Route
                  exact
                  path="/channel/:channelUid/edit"
                  component={ChannelSettings}
                />
                <Route exact path="/settings" component={Settings} />
              </Grid>
              <Login />
              <Notification />
            </Grid>
          </Grid>
        </MuiThemeProvider>
      </Router>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    channelsMenuOpen: state.app.get('channelsMenuOpen'),
  };
}

export default connect(mapStateToProps)(withStyles(style)(App));
