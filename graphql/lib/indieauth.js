const IndieAuth = require('indieauth-helper')

const auth = new IndieAuth({
  clientId: process.env.URL,
  redirectUri: process.env.URL + '/auth',
  secret: process.env.AUTH_SECRET,
})

module.exports = auth
