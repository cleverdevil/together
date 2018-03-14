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

class ChannelsService {
  constructor() {}

  find(params) {
    return new Promise((resolve, reject) => {
      const url = new URL(params.query.microsubEndpoint);
      url.searchParams.append('action', 'channels');
      fetch(url.toString(), {
        method: 'GET',
        headers: new Headers({
          Authorization: 'Bearer ' + params.query.token,
        }),
      })
        .then(res => validateResponse(res))
        .then(channels => {
          resolve(channels.channels);
        })
        .catch(err => {
          reject(microsubError('Error getting channels', null, err));
        });
    });
  }

  get(id, params) {
    return new Promise((resolve, reject) => {
      const url = new URL(params.query.microsubEndpoint);
      url.searchParams.append('action', 'channels');
      fetch(url.toString(), {
        method: 'GET',
        headers: new Headers({
          Authorization: 'Bearer ' + params.query.token,
        }),
      })
        .then(res => validateResponse(res))
        .then(channels => {
          resolve(channels.channels.find(channel => channel.uid == id));
        })
        .catch(err => {
          reject(microsubError('Error getting channels', null, err));
        });
    });
  }

  create(params) {
    return new Promise((resolve, reject) => {
      const url = new URL(params.query.microsubEndpoint);
      url.searchParams.append('action', 'channels');
      url.searchParams.append('name', params.name);
      fetch(url.toString(), {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Bearer ' + params.query.token,
        }),
      })
        .then(res => res.json())
        .then(newChannel => {
          resolve(newChannel);
        })
        .catch(err => {
          reject(microsubError('Error creating channel', null, err));
        });
    });
  }

  update(id, params) {
    return new Promise((resolve, reject) => {
      const url = new URL(params.query.microsubEndpoint);
      url.searchParams.append('action', 'channels');
      url.searchParams.append('channel', id);
      url.searchParams.append('name', params.name);
      fetch(url.toString(), {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Bearer ' + params.query.token,
        }),
      })
        .then(res => res.json())
        .then(newChannel => {
          resolve(newChannel);
        })
        .catch(err => {
          reject(microsubError('Error updating channel', null, err));
        });
    });
  }

  remove(id, params) {
    console.log(id, params);
    return new Promise((resolve, reject) => {
      const url = new URL(params.query.microsubEndpoint);
      url.searchParams.append('action', 'channels');
      url.searchParams.append('method', 'delete');
      url.searchParams.append('channel', id);
      fetch(url.toString(), {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Bearer ' + params.query.token,
        }),
      })
        .then(res => {
          if (res.status == 200) {
            resolve();
          } else {
            console.log(res);
            return res.text();
          }
        })
        .then(data => {
          console.log(data);
          reject(microsubError('Error deleting channel'));
        })
        .catch(err => {
          reject(microsubError('Error deleting channel', null, err));
        });
    });
  }
}

module.exports = new ChannelsService();
