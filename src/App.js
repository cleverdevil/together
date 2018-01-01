import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Timeline from './components/timeline.js';
import PostKindMenu from './components/post-kind-menu.js';
import ChannelMenu from './components/channel-menu.js';
import Settings from './components/settings';
import Login from './components/login';
import AddFeed from './components/add-feed';

const theme = createMuiTheme({
  typography: {
    fontFamily: '"Inter UI", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", sans-serif',
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 900,
  },
  palette: {
    type: 'light',
  },
});

const style = theme => ({
  root: {
    background: theme.palette.background.default,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    transition: 'transform .3s',
  },
  channelMenu: {
    width: 200,
    display: 'flex',
    height: '100%',
    [theme.breakpoints.down('md')]: {
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
    padding: 12,
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
          <Grid
            container
            spacing={0}
            alignItems="stretch"
            direction="row"
            justify="flex-start"
            wrap="nowrap"
            className={rootClasses.join(' ')}
          >
            <Grid item className={channelMenuClasses.join(' ')}>
              <ChannelMenu />
            </Grid>
            <Grid item className={this.props.classes.postKindMenu}>
              <PostKindMenu />
            </Grid>
            <Grid item className={this.props.classes.main}>
              <Route exact path="/" render={() => (
                <div>
                  <Timeline className={this.props.classes.timeline} />
                  <AddFeed />
                </div>
              )} />
              <Route path="/settings" component={Settings} />
            </Grid>
            <Login />
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
