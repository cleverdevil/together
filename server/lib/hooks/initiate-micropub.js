const Micropub = require('micropub-helper')

module.exports = hook =>
  new Promise((resolve, reject) => {
    const micropub = new Micropub({
      clientId: process.env.URL,
      me: hook.params.user.me,
      token: hook.params.user.accessToken,
      authEndpoint: hook.params.user.settings.authEndpoint,
      micropubEndpoint: hook.params.user.settings.micropubEndpoint,
      tokenEndpoint: hook.params.user.settings.tokenEndpoint,
      // scope: ''
      // state:
    })
    hook.params.micropub = micropub
    resolve(hook)
  })
