import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import Timeline from './components/timeline.js';
import PostKindMenu from './components/post-kind-menu.js';
import { addToTimeline } from './actions';

// Absolute filth but works for demo purposes
window.parseJsonp = function(data) {
  window.loadedItems = data.items;
}

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
    marginLeft: 50 + 12,
  }
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      feedUrl: '',
    };
    this.loadFeed = this.loadFeed.bind(this);
  }

  loadFeed(e) {
    e.preventDefault();
    const jsonUrl = 'http://pin13.net/mf2/?url=' + encodeURIComponent(this.state.feedUrl);
    var script = document.createElement('script');
    script.src = jsonUrl + '&callback=parseJsonp';
    document.head.appendChild(script)
    setTimeout(() => {
      if (window.loadedItems) {
        window.loadedItems
          .filter((item) => item.type == 'h-entry') // Uses == instead of === so that it matches arrays
          .forEach(item => this.props.addToTimeline(item));
      } else {
        alert('Didnt load fast enough');
      }
    }, 5000);
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className={this.props.classes.root}>
          <div className={this.props.classes.drawer}>
            <PostKindMenu />
          </div>
          <Grid container spacing={24} className={this.props.classes.main}>
            <Grid item xs={8}>
              <Timeline />
            </Grid>
            <Card style={{position: 'fixed', bottom: 0, right: 0, zIndex: 20}}>
              <form onSubmit={this.loadFeed}>
                <Input
                  type="url" 
                  placeholder="Url to parse" 
                  value={this.state.feedUrl}
                  onChange={e => {this.setState({feedUrl: e.target.value})}}
                  required={true}
                />
                <Button raised type="submit">Go!</Button>
              </form>
            </Card>
          </Grid>
        </div>  
      </MuiThemeProvider>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addToTimeline: addToTimeline,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(withStyles(style)(App));
