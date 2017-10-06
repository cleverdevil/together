import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import Timeline from './components/timeline.js';
import PostKindMenu from './components/post-kind-menu.js';

// Absolute filth but works for demo purposes
window.parseJsonp = function(data) {
  console.log(data);
  window.loadedItems = data.items;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      feedUrl: '',
      items: [],
    };
    this.loadFeed = this.loadFeed.bind(this);
  }

  loadFeed(e) {
    e.preventDefault();
    const jsonUrl = 'http://pin13.net/mf2/?url=' + encodeURIComponent(this.state.feedUrl);
    var script = document.createElement('script');
    script.src = jsonUrl + '&callback=parseJsonp';
    document.head.appendChild(script)
    setTimeout(() => this.setState({items: window.loadedItems}), 5000);
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
              <Timeline items={this.state.items.filter((item) => item.type === 'h-entry')} />
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

export default withStyles(style)(App);
