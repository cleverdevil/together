const Micropub = require('micropub-helper')

const micropub = new Micropub({
  clientId: process.env.URL,
  redirectUri: process.env.URL,
  scope: 'post create delete update read follow mute block channels',
})

module.exports = micropub
