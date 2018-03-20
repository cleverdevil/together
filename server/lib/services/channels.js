const {
  microsubError,
  validateResponse,
  request,
} = require('../microsub-helpers');

class ChannelsService {
  constructor() {}

  find(params) {
    return new Promise((resolve, reject) => {
      request({
        endpoint: params.user.settings.microsubEndpoint,
        token: params.user.accessToken,
        method: 'GET',
        params: {
          action: 'channels',
        },
      })
        .then(channels =>
          resolve(
            channels.channels.map(channel => {
              channel.userId = params.user.userId;
              channel.layout = 'default';
              return channel;
            }),
          ),
        )
        .catch(err =>
          reject(microsubError('Error getting channels', null, err)),
        );
    });
  }

  get(id, params) {
    return new Promise((resolve, reject) => {
      request({
        endpoint: params.user.settings.microsubEndpoint,
        token: params.user.accessToken,
        method: 'GET',
        params: {
          action: 'channels',
        },
      })
        .then(channels =>
          resolve(channels.channels.find(channel => channel.uid == id)),
        )
        .catch(err =>
          reject(microsubError('Error getting channels', null, err)),
        );
    });
  }

  create(params) {
    return new Promise((resolve, reject) => {
      request({
        endpoint: params.user.settings.microsubEndpoint,
        token: params.user.accessToken,
        method: 'POST',
        params: {
          action: 'channels',
          name: params.name,
        },
      })
        .then(newChannel => {
          channel.userId = params.user.userId;
          channel.layout = 'default';
          resolve(newChannel);
        })
        .catch(err =>
          reject(microsubError('Error creating channel', null, err)),
        );
    });
  }

  update(id, data, params) {
    console.log('Update thing');
    return new Promise((resolve, reject) => {
      // console.log('updating');
      // console.log(params);
      if (data.name) {
        request({
          endpoint: params.user.settings.microsubEndpoint,
          token: params.user.accessToken,
          method: 'GET',
          params: {
            action: 'channels',
            channel: id,
            name: data.name,
          },
        })
          // Promise.resolve('')
          .then(updatedChannel => resolve(id))
          .catch(err =>
            reject(microsubError('Error updating channel', null, err)),
          );
      } else {
        resolve(id);
      }
    });
  }

  remove(id, params) {
    // console.log(id, params);
    return new Promise((resolve, reject) => {
      request({
        endpoint: params.user.settings.microsubEndpoint,
        token: params.user.accessToken,
        method: 'POST',
        params: {
          action: 'channels',
          method: 'delete',
          channel: id,
        },
      })
        .then(() => resolve(id))
        .catch(err =>
          reject(microsubError('Error deleting channel', null, err)),
        );
    });
  }
}

module.exports = new ChannelsService();
