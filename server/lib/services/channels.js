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
          resolve({
            total: channels.channels.length,
            limit: 0,
            skip: 0,
            data: channels.channels.map(channel => {
              channel.userId = params.user.userId;
              channel.layout = 'default';
              channel.slug = encodeURIComponent(channel.uid);
              return channel;
            }),
          }),
        )
        .catch(err => {
          console.log('Error getting channels', err);
          reject(microsubError('Error getting channels', null, err));
        });
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
        .catch(err => {
          console.log('Error getting channels');
          reject(microsubError('Error getting channels', null, err));
        });
    });
  }

  create(data, params) {
    return new Promise((resolve, reject) => {
      request({
        endpoint: params.user.settings.microsubEndpoint,
        token: params.user.accessToken,
        method: 'POST',
        params: {
          action: 'channels',
          name: data.name,
        },
      })
        .then(newChannel => {
          newChannel.userId = params.user.userId;
          newChannel.layout = 'default';
          resolve(newChannel);
        })
        .catch(err => {
          console.log('Error creating channel', err);
          reject(microsubError('Error creating channel', null, err));
        });
    });
  }

  update(id, data, params) {
    return new Promise((resolve, reject) => {
      if (data.name) {
        request({
          endpoint: params.user.settings.microsubEndpoint,
          token: params.user.accessToken,
          method: 'POST',
          params: {
            action: 'channels',
            channel: id,
            name: data.name,
          },
        })
          .then(updatedChannel => resolve(id))
          .catch(err => {
            console.log('Error updating channel', err);
            reject(microsubError('Error updating channel', null, err));
          });
      } else {
        resolve(id);
      }
    });
  }

  patch(id, data, params) {
    return new Promise((resolve, reject) => {
      if (!data.order || !Array.isArray(data.order)) {
        reject(microsubError('Operation not supported'));
      } else {
        request({
          endpoint: params.user.settings.microsubEndpoint,
          token: params.user.accessToken,
          method: 'POST',
          params: {
            action: 'channels',
            method: 'order',
            channels: data.order,
          },
        })
          .then(res => {
            if (res.channels) {
              resolve(res.channels);
            } else {
              reject(
                microsubError(
                  'Did not receive new channel order from server',
                  null,
                  err,
                ),
              );
            }
          })
          .catch(err => {
            console.log('Error ordering channels', err);
            reject(microsubError('Error ordering channels', null, err));
          });
      }
    });
  }

  remove(id, params) {
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
        .catch(err => {
          console.log('Error deleting channel', err);
          reject(microsubError('Error deleting channel', null, err));
        });
    });
  }
}

module.exports = new ChannelsService();
