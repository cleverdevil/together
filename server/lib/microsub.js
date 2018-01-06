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

const microsubError = (message, status = null, error = null) => {
  return {
    message: message,
    status: status,
    error: error,
  };
};

const validateResponse = (res) => {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      resolve(res.json());
    } else {
      reject(microsubError('Error from microsub server', res.status));
    }
  });
};

class Microsub {
  constructor(userSettings = {}) {
    this.options = Object.assign({}, defaultSettings, userSettings);

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
        .then(res => validateResponse(res))
        .then((channels) => {
          resolve(channels.channels);
        })
        .catch((err) => {;
          reject(microsubError('Error getting channels', null, err));
        });
    });
  }

  createChannel(channelName, uid = '') {
    return new Promise((resolve, reject) => {
      const url = new URL(this.options.microsubEndpoint);
      url.searchParams.append('action', 'channels');
      url.searchParams.append('name', channelName);
      if (uid) {
        // Will update the channel name instead of creating it.
        url.searchParams.append('channel', uid);
      }
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
          reject(microsubError('Error creating channel', null, err));
        });
    });
  }

  deleteChannel(uid) {
    return new Promise((resolve, reject) => {
      const url = new URL(this.options.microsubEndpoint);
      url.searchParams.append('action', 'channels');
      url.searchParams.append('method', 'delete');
      url.searchParams.append('channel', uid);
      fetch(url.toString(), {
        method: 'POST',
        headers: new Headers({
          'Authorization': 'Bearer ' + this.options.token,
        }),
      })
        .then((res) => {
          if (res.status == 200) {
            resolve();
          } else {
            console.log(res);
            return res.text();
          }
        })
        .then((data) => {
          console.log(data);
          reject(microsubError('Error deleting channel'));
        })
        .catch((err) => {
          reject(microsubError('Error deleting channel', null, err));
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
          reject(microsubError('Error searching', null, err));
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
          reject(microsubError('Error following', null, err));
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
          reject(microsubError('Error unfollowing', null, err));
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
          reject(microsubError('Error getting preview', null, err));
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
          reject(microsubError('Error getting following', null, err));
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
          reject(microsubError('Error getting timeline', null, err));
        });
    });
  }
}

module.exports = Microsub;