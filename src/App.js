import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Timeline from './components/timeline.js';
import PostKindMenu from './components/post-kind-menu.js';
import ChannelMenu from './components/channel-menu.js';
import Settings from './components/settings';

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

const style = theme => ({
  root: {
    background: theme.palette.background.default,
    height: '100%',
  },
  drawer: {
    width: 50,
  },
  main: {
    paddingLeft: 49,
  },
});

class App extends Component {
  render() {
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <div className={this.props.classes.root}>
            <ChannelMenu />
            <div className={this.props.classes.drawer}>
              <PostKindMenu />
            </div>
            <Route exact path="/" render={() => (
              <div className={this.props.classes.main}>
                <Timeline className={this.props.classes.timeline} />
              </div>
            )} />
            <Route path="/settings" component={Settings} />
          </div>  
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default withStyles(style)(App);
