const jwt = require('jsonwebtoken')
const auth = require('./indieauth')
module.exports = {
  generate: userUrl => {
    const token = jwt.sign(
      {
        auth: auth.generateRandomString(),
        url: userUrl,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '30d' }
    )
    return token
  },

  decode: token => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      if (decoded && decoded.auth && decoded.url) {
        // We have the valid user url!
        return decoded.url
      }
    } catch (err) {
      // Not a valid token
      return false
    }
  },
}
