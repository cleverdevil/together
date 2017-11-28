const fetch = require('isomorphic-fetch');
const Micropub = require('micropub-helper');
const { URL } = require('url');

const defaultSettings = {
  me: '',
  scope: 'post create delete update',
  token: '',
  authEndpoint: '',
  tokenEndpoint: '',
  microsubEndpoint: '',
};

class Microsub extends Micropub {
  constructor(userSettings = {}) {
    super();
    this.options = Object.assign(defaultSettings, userSettings);

    // Bind all the things
    this.getChannels = this.getChannels.bind(this);
    this.search = this.search.bind(this);
    this.createChannel = this.createChannel.bind(this);
    this.follow = this.follow.bind(this);
    this.unfollow = this.unfollow.bind(this);
    this.preview = this.preview.bind(this);
    this.getFollowing = this.getFollowing.bind(this);
    this.getTimeline = this.getTimeline.bind(this);
  }

  getChannels() {
    return new Promise((resolve, reject) => {
      const url = new URL(this.options.microsubEndpoint);
      url.searchParams.append('action', 'channels');
      fetch(url.toString(), {
        method: 'GET',
        headers: new Headers({
          'Authorization': 'Bearer ' + this.options.token,
        }),
      })
        .then((res) => res.json())
        .then((channels) => {
          resolve(channels.channels);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  createChannel(channelName) {
    return new Promise((resolve, reject) => {
      const url = new URL(this.options.microsubEndpoint);
      url.searchParams.append('action', 'channels');
      url.searchParams.append('name', channelName);
      fetch(url.toString(), {
        method: 'POST',
        headers: new Headers({
          'Authorization': 'Bearer ' + this.options.token,
        }),
      })
        .then((res) => res.json())
        .then((newChannel) => {
          resolve(newChannel);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  search(text) {
    return new Promise((resolve, reject) => {
      const url = new URL(this.options.microsubEndpoint);
      url.searchParams.append('action', 'search');
      url.searchParams.append('query', text);
      fetch(url.toString(), {
        method: 'POST',
        headers: new Headers({
          'Authorization': 'Bearer ' + this.options.token,
        }),
      })
        .then((res) => res.json())
        .then((results) => {
          resolve(results.results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  follow(feed, channel = 'default') {
    return new Promise((resolve, reject) => {
      const url = new URL(this.options.microsubEndpoint);
      url.searchParams.append('action', 'follow');
      url.searchParams.append('url', feed);
      if (channel) {
        url.searchParams.append('channel', channel);
      }
      fetch(url.toString(), {
        method: 'POST',
        headers: new Headers({
          'Authorization': 'Bearer ' + this.options.token,
        }),
      })
        .then((res) => res.json())
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  unfollow(feed, channel = false) {
    return new Promise((resolve, reject) => {
      const url = new URL(this.options.microsubEndpoint);
      url.searchParams.append('action', 'unfollow');
      url.searchParams.append('url', feed);
      if (channel) {
        url.searchParams.append('channel', channel);
      }
      fetch(url.toString(), {
        method: 'POST',
        headers: new Headers({
          'Authorization': 'Bearer ' + this.options.token,
        }),
      })
        .then((res) => res.json())
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  preview(feed) {
    return new Promise((resolve, reject) => {
      const url = new URL(this.options.microsubEndpoint);
      url.searchParams.append('action', 'preview');
      url.searchParams.append('url', feed);
      fetch(url.toString(), {
        method: 'GET',
        headers: new Headers({
          'Authorization': 'Bearer ' + this.options.token,
        }),
      })
        .then((res) => res.json())
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getFollowing(channel) {
    return new Promise((resolve, reject) => {
      const url = new URL(this.options.microsubEndpoint);
      url.searchParams.append('action', 'follow');
      url.searchParams.append('channel', channel);
      fetch(url.toString(), {
        method: 'GET',
        headers: new Headers({
          'Authorization': 'Bearer ' + this.options.token,
        }),
      })
        .then((res) => res.json())
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getTimeline(channel = 'default', after = false, before = false, limit = 20) {
    return new Promise((resolve, reject) => {
      const url = new URL(this.options.microsubEndpoint);
      url.searchParams.append('action', 'timeline');
      if (channel) {
        url.searchParams.append('channel', channel);
      }
      if (limit) {
        url.searchParams.append('limit', limit);
      }
      if (after) {
        url.searchParams.append('after', after);
      }
      if (before) {
        url.searchParams.append('before', before);
      }
      fetch(url.toString(), {
        method: 'GET',
        headers: new Headers({
          'Authorization': 'Bearer ' + this.options.token,
        }),
      })
        .then((res) => res.json())
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = Microsub;