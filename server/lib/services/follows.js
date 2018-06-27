const {
  microsubError,
  validateResponse,
  request,
} = require('../microsub-helpers');

class FollowsService {
  constructor() {}

  find(params) {
    return new Promise((resolve, reject) => {
      request({
        endpoint: params.user.settings.microsubEndpoint,
        token: params.user.accessToken,
        method: 'GET',
        params: {
          action: 'follow',
          channel: params.query.channel,
        },
      })
        .then(results => resolve(results))
        .catch(err => {
          console.log('Error getting following', err);
          reject(microsubError('Error getting following', null, err));
        });
    });
  }

  // TODO: not sure if this should be .get or .find, but both work for now.
  get(id, params) {
    return new Promise((resolve, reject) => {
      request({
        endpoint: params.user.settings.microsubEndpoint,
        token: params.user.accessToken,
        method: 'GET',
        params: {
          action: 'follow',
          channel: id,
        },
      })
        .then(results => resolve(results))
        .catch(err => {
          console.log('Error getting following', err);
          reject(microsubError('Error getting following', null, err));
        });
    });
  }

  create(data, params) {
    return new Promise((resolve, reject) => {
      let microsubParams = {
        action: 'follow',
        url: data.url,
      };
      if (data.channel) {
        microsubParams.channel = data.channel;
      } else {
        microsubParams.channel = 'default';
      }
      request({
        endpoint: params.user.settings.microsubEndpoint,
        token: params.user.accessToken,
        method: 'POST',
        params: microsubParams,
      })
        .then(results => resolve(results))
        .catch(err => {
          console.log('Error following', err);
          reject(microsubError('Error following', null, err));
        });
    });
  }

  remove(id, params) {
    return new Promise((resolve, reject) => {
      let microsubParams = {
        action: 'unfollow',
        url: id,
      };
      if (params.query.channel) {
        microsubParams.channel = params.query.channel;
      }
      request({
        endpoint: params.user.settings.microsubEndpoint,
        token: params.user.accessToken,
        method: 'POST',
        params: microsubParams,
      })
        .then(results => resolve(results))
        .catch(err => {
          console.log('Error unfollowing', err);
          reject(microsubError('Error unfollowing', null, err));
        });
    });
  }
}

module.exports = new FollowsService();
