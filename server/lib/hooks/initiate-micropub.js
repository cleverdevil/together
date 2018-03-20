const Micropub = require('micropub-helper');
const config = require('../config');

module.exports = hook =>
  new Promise((resolve, reject) => {
    const micropub = new Micropub({
      clientId: config.get('url'),
      me: hook.params.user.me,
      token: hook.params.user.accessToken,
      authEndpoint: hook.params.user.settings.authEndpoint,
      micropubEndpoint: hook.params.user.settings.micropubEndpoint,
      tokenEndpoint: hook.params.user.settings.tokenEndpoint,
      // scope: ''
      // state:
    });
    hook.params.micropub = micropub;
    resolve(hook);
  });
