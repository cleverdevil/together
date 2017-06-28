import React, { Component } from 'react';
import './App.css';

import Timeline from './components/timeline';
import PostKindMenu from './components/post-kind-menu';

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
      <div className="app">
        <PostKindMenu />
        <Timeline items={this.state.items.filter((item) => item.type == 'h-entry')} />
        <form onSubmit={this.loadFeed}>
          <input
            type="url" 
            placeholder="Url to parse" 
            value={this.state.feedUrl}
            onChange={e => {this.setState({feedUrl: e.target.value})}}
            required={true}
          />
          <button type="submit">Go!</button>
        </form>
      </div>
    );
  }
}

export default App;
