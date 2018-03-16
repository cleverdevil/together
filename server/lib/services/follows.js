const fetch = require('isomorphic-fetch');
const Micropub = require('micropub-helper');
const { URL } = require('url');

const microsubError = (message, status = null, error = null) => {
  return {
    message: message,
    status: status,
    error: error,
  };
};

const validateResponse = res => {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      resolve(res.json());
    } else {
      res
        .text()
        .then(text => {
          console.log(text);
          reject(microsubError('Error from microsub server', res.status));
        })
        .catch(() =>
          reject(microsubError('Error from microsub server', res.status)),
        );
    }
  });
};

class FollowsService {
  constructor() {}

  find(params) {
    return new Promise((resolve, reject) => {
      const url = new URL(params.user.rels.microsub);
      url.searchParams.append('action', 'follow');
      url.searchParams.append('channel', params.query.channel);
      fetch(url.toString(), {
        method: 'GET',
        headers: new Headers({
          Authorization: 'Bearer ' + params.user.accessToken,
        }),
      })
        .then(res => res.json())
        .then(results => {
          resolve(results);
        })
        .catch(err => {
          reject(microsubError('Error getting following', null, err));
        });
    });
  }

  // TODO: not sure if this should be .get or .find, but both work for now.
  get(id, params) {
    return new Promise((resolve, reject) => {
      const url = new URL(params.user.rels.microsub);
      url.searchParams.append('action', 'follow');
      url.searchParams.append('channel', id);
      fetch(url.toString(), {
        method: 'GET',
        headers: new Headers({
          Authorization: 'Bearer ' + params.user.accessToken,
        }),
      })
        .then(res => res.json())
        .then(results => {
          resolve(results);
        })
        .catch(err => {
          reject(microsubError('Error getting following', null, err));
        });
    });
  }

  create(params) {
    return new Promise((resolve, reject) => {
      const url = new URL(params.user.rels.microsub);
      url.searchParams.append('action', 'follow');
      url.searchParams.append('url', params.url);
      if (params.channel) {
        url.searchParams.append('channel', params.channel);
      } else {
        url.searchParams.append('channel', 'default');
      }
      fetch(url.toString(), {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Bearer ' + params.user.accessToken,
        }),
      })
        .then(res => res.json())
        .then(results => {
          resolve(results);
        })
        .catch(err => {
          reject(microsubError('Error following', null, err));
        });
    });
  }

  remove(id, params) {
    return new Promise((resolve, reject) => {
      const url = new URL(params.user.rels.microsub);
      url.searchParams.append('action', 'unfollow');
      url.searchParams.append('url', id);
      if (params.query.channel) {
        url.searchParams.append('channel', params.query.channel);
      }
      fetch(url.toString(), {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Bearer ' + params.user.accessToken,
        }),
      })
        .then(res => res.json())
        .then(results => {
          resolve(results);
        })
        .catch(err => {
          reject(microsubError('Error unfollowing', null, err));
        });
    });
  }
}

module.exports = new FollowsService();
