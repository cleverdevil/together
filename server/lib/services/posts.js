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

class PostsService {
  constructor() {}

  find(params) {
    return new Promise((resolve, reject) => {
      const url = new URL(params.query.microsubEndpoint);
      url.searchParams.append('action', 'timeline');
      if (params.query.channel) {
        url.searchParams.append('channel', params.query.channel);
      }
      if (params.query.limit) {
        url.searchParams.append('limit', params.query.limit);
      }
      if (params.query.after) {
        url.searchParams.append('after', params.query.after);
      }
      if (params.query.before) {
        url.searchParams.append('before', params.query.before);
      }
      fetch(url.toString(), {
        method: 'GET',
        headers: new Headers({
          Authorization: 'Bearer ' + params.query.token,
        }),
      })
        .then(res => res.json())
        .then(results => {
          resolve(results);
        })
        .catch(err => {
          reject(microsubError('Error getting timeline', null, err));
        });
    });
  }

  update(id, params) {
    return new Promise((resolve, reject) => {
      const url = new URL(params.query.microsubEndpoint);
      url.searchParams.append('action', 'timeline');
      url.searchParams.append('channel', params.channel);
      if (params.method) {
        url.searchParams.append('method', params.method);
      }
      if (id) {
        url.searchParams.append('entry', id);
      } else if (id == null) {
        if (params.last_read_entry) {
          url.searchParams.append('last_read_entry', params.last_read_entry);
        }
        if (params.entries) {
          url.searchParams.append('entry', params.entries);
        }
      }
      fetch(url.toString(), {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Bearer ' + params.query.token,
        }),
      })
        .then(res => res.json())
        .then(results => {
          resolve(results);
        })
        .catch(err => {
          console.log(err);
          reject(microsubError('Error updating', null, err));
        });
    });
  }

  remove(id, params) {
    return new Promise((resolve, reject) => {
      const url = new URL(params.query.microsubEndpoint);
      url.searchParams.append('action', 'timeline');
      url.searchParams.append('method', 'remove');
      url.searchParams.append('channel', params.channel);
      if (id) {
        url.searchParams.append('entry', id);
      } else if (id == null && params.entries) {
        url.searchParams.append('entry', params.entries);
      }
      fetch(url.toString(), {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Bearer ' + params.query.token,
        }),
      })
        .then(res => res.json())
        .then(results => {
          resolve(results);
        })
        .catch(err => {
          console.log(err);
          reject(microsubError('Error updating', null, err));
        });
    });
  }
}

module.exports = new PostsService();
