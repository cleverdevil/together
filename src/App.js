import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from './components/app-bar';
import MainPosts from './components/main-posts';
import ChannelMenu from './components/channel-menu';
import Settings from './components/settings';
import ChannelSettings from './components/channel-settings';
import Login from './components/login';
import Notification from './components/notification';
import MicropubEditor from './components/full-micropub-editor';
import ErrorBoundary from './components/error-boundary';

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
    [theme.breakpoints.down('sm')]: {
      width: 200,
      position: 'absolute',
      right: '100%',
      height: '100%',
      transition: 'transform .3s',
    },
  },
  channelMenuOpen: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translateX(200px)',
      overflow: 'visible',
    },
  },
  main: {
    background: theme.palette.background.default,
    overflow: 'hidden',
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
      <ErrorBoundary>
        <Router>
          <Grid container spacing={0} className={this.props.classes.appWrapper}>
            <AppBar />
            <Grid item container spacing={0} className={rootClasses.join(' ')}>
              <Grid item className={channelMenuClasses.join(' ')}>
                <ChannelMenu />
              </Grid>
              <Grid item className={this.props.classes.main}>
                <Route exact path="/" component={MainPosts} />
                <Route
                  exact
                  path="/channel/:channelSlug"
                  component={MainPosts}
                />
                <Route
                  exact
                  path="/channel/:channelSlug/edit"
                  component={ChannelSettings}
                />
                <Route exact path="/editor" component={MicropubEditor} />
                <Route exact path="/settings" component={Settings} />
              </Grid>
              <Login />
              <Notification />
            </Grid>
          </Grid>
        </Router>
      </ErrorBoundary>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    channelsMenuOpen: state.app.get('channelsMenuOpen'),
  };
}

export default connect(mapStateToProps)(withStyles(style)(App));
