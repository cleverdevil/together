import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Timeline from './components/timeline.js';
import PostKindMenu from './components/post-kind-menu.js';

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

const style = theme => ({
  root: {
    background: theme.palette.background.default,
  },
  drawer: {
    width: 50,
  },
  main: {
    paddingLeft: 49 + 12,
    paddingRight: 12,
    maxWidth: 600,
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className={this.props.classes.root}>
          <div className={this.props.classes.drawer}>
            <PostKindMenu />
          </div>
          <div className={this.props.classes.main}>
            <Timeline />
          </div>
        </div>  
      </MuiThemeProvider>
    );
  }
}

export default withStyles(style)(App);
